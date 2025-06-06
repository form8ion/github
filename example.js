// #### Import
// remark-usage-ignore-next 4
import {resolve} from 'node:path';
import stubbedFs from 'mock-fs';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import any from '@travi/any';
import {Octokit} from '@octokit/core';
import {lift, promptConstants, scaffold, test} from './lib/index.js';

// remark-usage-ignore-next 17
stubbedFs({node_modules: stubbedFs.load(resolve('node_modules'))});
const server = setupServer();
const organizationName = 'organization-name';
const projectName = 'project-name';
server.use(
  http.get('https://api.github.com/user', () => HttpResponse.json({login: any.word()})),
  http.get('https://api.github.com/user/orgs', () => HttpResponse.json([
    {login: organizationName, id: any.integer()}
  ])),
  http.post('https://api.github.com/orgs/organization-name/repos', () => HttpResponse.json({})),
  http.get('https://api.github.com/search/issues', () => HttpResponse.json({items: []})),
  http.post(`https://api.github.com/repos/${organizationName}/${projectName}/issues`, () => HttpResponse.json({})),
  http.get(`https://api.github.com/orgs/${organizationName}/teams`, () => HttpResponse.json([
    {slug: 'maintainers', name: 'maintainers', id: any.integer()}
  ]))
);
server.listen();

// #### Execute

// remark-usage-ignore-next
/* eslint-disable no-console */
const projectRoot = process.cwd();
const octokitInstance = new Octokit();
const logger = {
  info: message => console.error(message),
  success: message => console.error(message),
  warn: message => console.error(message),
  error: message => console.error(message)
};

await scaffold(
  {
    projectRoot,
    projectName: 'project-name',
    visibility: any.fromList(['Public', 'Private']),
    description: any.sentence()
  },
  {
    prompt: async ({id, questions}) => {
      const {questionNames, ids} = promptConstants;
      const {
        GITHUB_DETAILS: githubDetailsPromptId,
        ADMIN_SETTINGS: repositorySettingsPromptId
      } = ids;

      switch (id) {
        case githubDetailsPromptId: {
          const {
            ORGANIZATION: organizationQuestionName,
            ACCOUNT_TYPE: accountTypeQuestionName
          } = questionNames[githubDetailsPromptId];

          return {
            [accountTypeQuestionName]: 'organization',
            [organizationQuestionName]: questions
              .find(({name}) => name === organizationQuestionName)
              .choices
              .find(({short}) => 'organization-name' === short).value

          };
        }
        case repositorySettingsPromptId:
          return {[questionNames[repositorySettingsPromptId].SETTINGS_MANAGED_AS_CODE]: any.boolean()};
        default:
          throw new Error(`Unknown prompt with ID: ${id}`);
      }
    },
    octokit: octokitInstance,
    logger
  }
);

if (await test({projectRoot})) {
  await lift(
    {
      projectRoot,
      vcs: {owner: 'organization-name', name: 'project-name'},
      results: {
        projectDetails: {homepage: any.url()},
        tags: any.listOf(any.word),
        nextSteps: any.listOf(() => ({summary: any.sentence(), description: any.sentence()}))
      }
    },
    {
      octokit: octokitInstance,
      logger,
      prompt: async ({id, questions}) => {
        const {questionNames, ids} = promptConstants;
        const expectedPromptId = ids.REQUIRED_CHECK_BYPASS;

        if (expectedPromptId === id) {
          const {CHECK_BYPASS_TEAM: checkBypassTeamQuestionName} = questionNames[expectedPromptId];

          return {
            [checkBypassTeamQuestionName]: questions
              .find(({name}) => name === checkBypassTeamQuestionName)
              .choices
              .find(({short}) => 'maintainers' === short).value
          };
        }

        throw new Error(`Unknown prompt with ID: ${id}`);
      }
    }
  );
}

// remark-usage-ignore-next
/* eslint-enable no-console */
