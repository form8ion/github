// #### Import
// remark-usage-ignore-next 2
import {resolve} from 'node:path';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import {octokit} from '@form8ion/github-core';
import {lift, promptConstants, scaffold, test} from './lib/index.js';

// remark-usage-ignore-next
stubbedFs({node_modules: stubbedFs.load(resolve('node_modules'))});

// #### Execute

// remark-usage-ignore-next
/* eslint-disable no-console */
const projectRoot = process.cwd();
const octokitInstance = octokit.getNetrcAuthenticatedInstance();
const logger = {
  info: message => console.error(message),
  success: message => console.error(message),
  warn: message => console.error(message),
  error: message => console.error(message)
};

await scaffold(
  {
    projectRoot,
    projectName: 'foo',
    visibility: any.fromList(['Public', 'Private']),
    description: any.sentence()
  },
  {
    prompt: async ({id}) => {
      const {questionNames, ids} = promptConstants;
      const expectedPromptId = ids.GITHUB_DETAILS;

      if (expectedPromptId === id) {
        return {[questionNames[expectedPromptId].GITHUB_ACCOUNT]: any.word()};
      }

      throw new Error(`Unknown prompt with ID: ${id}`);
    },
    octokit: octokitInstance,
    logger
  }
);

if (await test({projectRoot})) {
  await lift({
    projectRoot,
    vcs: {owner: 'account-name', name: 'repository-name'},
    results: {
      projectDetails: {homepage: any.url()},
      tags: any.listOf(any.word),
      nextSteps: any.listOf(() => ({summary: any.sentence(), description: any.sentence()}))
    }
  }, {octokit: octokitInstance, logger});
}

// remark-usage-ignore-next
/* eslint-enable no-console */
