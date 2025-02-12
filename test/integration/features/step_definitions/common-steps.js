import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import debugTest from 'debug';
import yaml from 'js-yaml';

const debug = debugTest('test');
const __dirname = dirname(fileURLToPath(import.meta.url));          // eslint-disable-line no-underscore-dangle
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

let scaffold, test, lift, promptConstants;

Before(async function () {
  // eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
  ({scaffold, test, lift, promptConstants} = await import('@form8ion/github'));

  this.projectName = any.word();
  this.projectDescription = any.sentence();
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
    this.result = await scaffold(
      {
        projectRoot: this.projectRoot,
        projectName: this.projectName,
        visibility: this.projectVisibility,
        description: this.projectDescription
      },
      {
        prompt: ({id}) => ({[promptConstants.questionNames[id].GITHUB_ACCOUNT]: this.githubUser})
      }
    );
  } catch (err) {
    debug(err);
    this.scaffoldError = err;
  }
});

When('the scaffolder results are processed', async function () {
  this.tags = any.listOf(any.word);
  this.existingSettingsContent = {...any.simpleObject(), repository: any.simpleObject()};

  stubbedFs({
    ...this.netrcContent && {[`${process.env.HOME}/.netrc`]: this.netrcContent},
    ...this.github && {
      '.github': {
        ...this.settingsApp && {'settings.yml': yaml.dump(this.existingSettingsContent)}
      }
    },
    node_modules: stubbedNodeModules
  });

  if (await test({projectRoot: this.projectRoot})) {
    this.result = await lift({
      projectRoot: this.projectRoot,
      vcs: {name: this.projectName, owner: this.githubUser},
      results: {
        projectDetails: this.projectDetails,
        tags: this.tags,
        ...this.nextSteps && {nextSteps: [...this.nextSteps, ...this.nextSteps]}
      }
    });
  }
});
