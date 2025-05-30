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

export default async function scaffoldRepository(
  {name, visibility, account: {type: accountType, name: accountName}},
  {octokit, logger}
) {
  logger.info(`Creating repository on GitHub for account '${accountName}'`, {level: 'secondary'});

  if ('user' === accountType) {
    return {
      vcs: {
        ...await createForUser({octokit, logger, owner: accountName, name, visibility}),
        name,
        owner: accountName,
        host: 'github'
      }
    };
  }

  return {
    vcs: {
      ...await createForOrganization({octokit, logger, owner: accountName, name, visibility}),
      name,
      owner: accountName,
      host: 'github'
    }
  };
}
