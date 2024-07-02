import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import debugTest from 'debug';

const debug = debugTest('test');
const __dirname = dirname(fileURLToPath(import.meta.url));          // eslint-disable-line no-underscore-dangle
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

let scaffold;

Before(async function () {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({scaffold} = await import('@form8ion/github'));

  this.projectName = any.word();
  this.projectRoot = process.cwd();
});

After(function () {
  stubbedFs.restore();
});

When('the project is scaffolded', async function () {
  stubbedFs({
    ...this.netrcContent && {[`${process.env.HOME}/.netrc`]: this.netrcContent},
    node_modules: stubbedNodeModules
  });

  try {
    this.result = await scaffold({
      projectRoot: this.projectRoot,
      name: this.projectName,
      owner: this.githubUser,
      visibility: this.projectVisibility
    });
  } catch (err) {
    debug(err);
    this.scaffoldError = err;
  }
});
