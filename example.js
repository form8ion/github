// #### Import
// remark-usage-ignore-next 2
import {resolve} from 'path';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import {scaffold} from './lib/index.js';

// remark-usage-ignore-next
stubbedFs({node_modules: stubbedFs.load(resolve('node_modules'))});

// #### Execute

await scaffold({
  projectRoot: process.cwd(),
  name: 'foo',
  owner: 'travi',
  visibility: any.fromList(['Public', 'Private'])
});
