import {beforeEach, describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';
import zip from 'lodash.zip';

import {constants} from '../prompt/index.js';
import {accountTypeIsOrganization} from './prompt-conditionals.js';
import promptForRepositoryOwner from './prompt.js';

describe('GitHub details prompt', () => {
  let octokit;
  const prompt = vi.fn();
  const organizationName = any.word();
  const organizationNames = [...any.listOf(any.word), organizationName, ...any.listOf(any.word)];
  const organizationIds = organizationNames.map(() => any.integer());
  const organizations = zip(organizationNames, organizationIds).map(([name, id]) => ({
    login: name,
    id,
    ...any.simpleObject()
  }));
  const organization = organizations.find(({login}) => login === organizationName);
  const authenticatedUser = any.word();
  const promptId = constants.ids.GITHUB_DETAILS;
  const accountTypeQuestionName = constants.questionNames[promptId].ACCOUNT_TYPE;
  const organizationQuestionName = constants.questionNames[promptId].ORGANIZATION;
  const userAccountType = 'user';
  const questions = [
    {
      name: accountTypeQuestionName,
      type: 'select',
      message: 'Which type of GitHub account should be used to host the repository?',
      choices: [
        {name: `User (${authenticatedUser})`, value: userAccountType, short: 'user'},
        {name: 'Organization', value: 'organization', short: 'org'}
      ]
    },
    {
      name: organizationQuestionName,
      type: 'select',
      message: 'Which of your GitHub organizations should the repository be hosted within?',
      when: accountTypeIsOrganization,
      choices: zip(organizationNames, organizationIds).map(([name, id]) => ({name, short: name, value: id}))
    }
  ];

  beforeEach(() => {
    const octokitRequest = vi.fn();

    octokit = {request: octokitRequest};

    when(octokitRequest).calledWith('GET /user').thenResolve({data: {login: authenticatedUser}});
    when(octokitRequest).calledWith('GET /user/orgs').thenResolve({data: organizations});
  });

  it('should prompt for the GitHub account to host the repository', async () => {
    const chosenAccountType = any.word();
    when(prompt)
      .calledWith({id: promptId, questions})
      .thenResolve({
        [accountTypeQuestionName]: chosenAccountType,
        [organizationQuestionName]: organization.id
      });

    expect(await promptForRepositoryOwner({prompt, octokit})).toEqual({
      type: chosenAccountType,
      name: organizationName
    });
  });

  it('should use the user account name when user account type is chosen', async () => {
    when(prompt)
      .calledWith({id: promptId, questions})
      .thenResolve({[accountTypeQuestionName]: userAccountType});

    expect(await promptForRepositoryOwner({prompt, octokit})).toEqual({type: userAccountType, name: authenticatedUser});
  });

  it('should throw an error if an organization is chosen that the authenticated user is not a member of', async () => {
    const organizationId = any.integer();
    when(prompt)
      .calledWith({id: promptId, questions})
      .thenResolve({
        [accountTypeQuestionName]: 'organization',
        [organizationQuestionName]: organizationId
      });

    await expect(() => promptForRepositoryOwner({prompt, octokit})).rejects.toThrowError(
      `User ${authenticatedUser} does not have access to create a repository in the ${organizationId} account`
    );
  });
});
