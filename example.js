// #### Import
// remark-usage-ignore-next 2
import {resolve} from 'path';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import {lift, promptConstants, scaffold, test} from './lib/index.js';

// remark-usage-ignore-next
stubbedFs({node_modules: stubbedFs.load(resolve('node_modules'))});

// #### Execute

const projectRoot = process.cwd();

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
    }
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
  });
}
