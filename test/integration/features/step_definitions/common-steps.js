import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';

const __dirname = dirname(fileURLToPath(import.meta.url));          // eslint-disable-line no-underscore-dangle
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

let scaffold;

Before(async function () {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({scaffold} = await import('@form8ion/github'));

  this.projectName = any.word();
});

After(function () {
  stubbedFs.restore();
});

When('the project is scaffolded', async function () {
  stubbedFs({
    ...this.netrcContent && {[`${process.env.HOME}/.netrc`]: this.netrcContent},
    // [`${process.env.HOME}/.gitconfig`]: `[github]\n\tuser = ${this.githubUser}`,
    node_modules: stubbedNodeModules
  });

  this.result = await scaffold({
    projectRoot: process.cwd(),
    name: this.projectName,
    owner: this.githubUser
  });
});
