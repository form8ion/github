import promptForRepositoryOwner from './prompt.js';

async function authenticatedUserIsMemberOfRequestedOrganization(account, octokit) {
  const {data: organizations} = await octokit.request('GET /user/orgs');

  return organizations.reduce((acc, organization) => acc || account === organization.login, false);
}

async function fetchDetailsForExistingRepository(owner, name, octokit) {
  const {data: {ssh_url: sshUrl, html_url: htmlUrl}} = await octokit.request(
    'GET /repos/{owner}/{repo}',
    {owner, repo: name}
  );

  return {sshUrl, htmlUrl};
}

async function createForUser({octokit, logger, owner, name, visibility}) {
  try {
    const repositoryDetails = await fetchDetailsForExistingRepository(owner, name, octokit);

    logger.warn(`The repository named ${owner}/${name} already exists on GitHub`);

    return repositoryDetails;
  } catch (e) {
    if (404 === e.status) {
      const {data: {ssh_url: sshUrl, html_url: htmlUrl}} = await octokit.request(
        'POST /user/repos',
        {name, private: 'Private' === visibility}
      );

      logger.success(`Repository ${name} created for user ${owner} at ${htmlUrl}`);

      return {sshUrl, htmlUrl};
    }

    throw e;
  }
}

async function createForOrganization({octokit, logger, owner, name, visibility}) {
  try {
    const repositoryDetails = await fetchDetailsForExistingRepository(owner, name, octokit);

    logger.warn(`The repository named ${owner}/${name} already exists on GitHub`);

    return repositoryDetails;
  } catch (e) {
    if (404 === e.status) {
      const {data: {ssh_url: sshUrl, html_url: htmlUrl}} = await octokit.request('POST /orgs/{org}/repos', {
        org: owner,
        name,
        private: 'Private' === visibility
      });

      logger.success(`Repository ${name} created for organization ${owner} at ${htmlUrl}`);

      return {sshUrl, htmlUrl};
    }

    throw e;
  }
}

export default async function scaffoldRepository({name, visibility}, {octokit, logger, prompt}) {
  if (!octokit) {
    logger.error('Repository cannot be created without a proper GitHub Personal Access Token!');

    return {};
  }

  const owner = await promptForRepositoryOwner(prompt);

  logger.info(`Creating repository on GitHub for account '${owner}'`, {level: 'secondary'});

  const {data: {login: authenticatedUser}} = await octokit.request('GET /user');

  if (owner === authenticatedUser) {
    return {vcs: {...await createForUser({octokit, logger, owner, name, visibility}), name, owner, host: 'github'}};
  }

  if (await authenticatedUserIsMemberOfRequestedOrganization(owner, octokit)) {
    return {
      vcs: {...await createForOrganization({octokit, logger, owner, name, visibility}), name, owner, host: 'github'}
    };
  }

  throw new Error(`User ${authenticatedUser} does not have access to create a repository in the ${owner} account`);
}
