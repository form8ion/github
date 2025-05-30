import {constants} from '../prompt/index.js';
import {accountTypeIsOrganization} from './prompt-conditionals.js';

function determineAccountName(accountType, authenticatedUser, organizations, organizationId) {
  if ('user' === accountType) {
    return authenticatedUser;
  }

  const organization = organizations.find(({id}) => id === organizationId);

  if (organization) {
    return organization.login;
  }

  throw new Error(
    `User ${authenticatedUser} does not have access to create a repository in the ${organizationId} account`
  );
}

export default async function promptForRepositoryOwner({prompt, octokit}) {
  const promptId = constants.ids.GITHUB_DETAILS;
  const {
    ACCOUNT_TYPE: accountTypeQuestionName,
    ORGANIZATION: organizationQuestionName
  } = constants.questionNames[promptId];

  const [{data: {login: authenticatedUser}}, {data: organizations}] = await Promise.all([
    octokit.request('GET /user'),
    octokit.request('GET /user/orgs')
  ]);

  const {
    [accountTypeQuestionName]: accountType,
    [organizationQuestionName]: organizationId
  } = await prompt({
    id: promptId,
    questions: [
      {
        name: accountTypeQuestionName,
        type: 'select',
        message: 'Which type of GitHub account should be used to host the repository?',
        choices: [
          {name: `User (${authenticatedUser})`, value: 'user', short: 'user'},
          {name: 'Organization', value: 'organization', short: 'org'}
        ]
      },
      {
        name: organizationQuestionName,
        type: 'select',
        message: 'Which of your GitHub organizations should the repository be hosted within?',
        when: accountTypeIsOrganization,
        choices: organizations.map(({id, login}) => ({name: login, short: login, value: id}))
      }
    ]
  });

  return {
    type: accountType,
    name: determineAccountName(accountType, authenticatedUser, organizations, organizationId)
  };
}
