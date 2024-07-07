// #### Import
// remark-usage-ignore-next 2
import {resolve} from 'path';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import {scaffold, test, lift} from './lib/index.js';

// remark-usage-ignore-next
stubbedFs({node_modules: stubbedFs.load(resolve('node_modules'))});

// #### Execute

const projectRoot = process.cwd();

await scaffold({
  projectRoot,
  name: 'foo',
  owner: 'travi',
  visibility: any.fromList(['Public', 'Private']),
  description: any.sentence()
});

if (await test({projectRoot})) {
  await lift({
    projectRoot,
    results: {
      projectDetails: {homepage: any.url()},
      tags: any.listOf(any.word)
    }
  });
}
