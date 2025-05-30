import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

import {After, Before, Then, When} from '@cucumber/cucumber';
import stubbedFs from 'mock-fs';
import any from '@travi/any';
import debugTest from 'debug';
import yaml from 'js-yaml';

const debug = debugTest('test');
const __dirname = dirname(fileURLToPath(import.meta.url));          // eslint-disable-line no-underscore-dangle
const stubbedNodeModules = stubbedFs.load(resolve(__dirname, '..', '..', '..', '..', 'node_modules'));

let scaffold, test, lift, promptConstants;
const logger = {
  info: () => undefined,
  success: () => undefined,
  warn: () => undefined,
  error: () => undefined
};

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
  stubbedFs({node_modules: stubbedNodeModules});

  try {
    this.result = await scaffold(
      {
        projectRoot: this.projectRoot,
        projectName: this.projectName,
        visibility: this.projectVisibility,
        description: this.projectDescription
      },
      {
        prompt: ({id, questions}) => {
          const {questionNames, ids} = promptConstants;
          const githubDetailsPromptId = ids.GITHUB_DETAILS;
          const repositorySettingsPromptId = ids.ADMIN_SETTINGS;

          switch (id) {
            case githubDetailsPromptId:
              return {
                [questionNames[githubDetailsPromptId].ACCOUNT_TYPE]: this.accountType,
                ...'organization' === this.accountType && {
                  [questionNames[githubDetailsPromptId].ORGANIZATION]: this.skipMenuToSetOrganization
                    ? this.organizationId
                    : questions
                      .find(({name}) => name === questionNames[githubDetailsPromptId].ORGANIZATION).choices
                      .find(({name}) => name === this.organizationAccount).value
                }
              };
            case repositorySettingsPromptId:
              return {[questionNames[repositorySettingsPromptId].SETTINGS_MANAGED_AS_CODE]: this.useSettingsApp};
            default:
              throw new Error(`Unknown prompt with ID: ${id}`);
          }
        },
        octokit: this.octokit,
        logger
      }
    );
  } catch (err) {
    debug(err);
    this.resultError = err;
  }
});

When('the scaffolder results are processed', async function () {
  this.tags = any.listOf(any.word);
  this.existingSettingsContent = {...any.simpleObject(), repository: any.simpleObject()};

  stubbedFs({
    ...this.github && {
      '.github': {
        ...this.settingsApp && {'settings.yml': yaml.dump(this.existingSettingsContent)}
      }
    },
    node_modules: stubbedNodeModules
  });

  if (await test({projectRoot: this.projectRoot})) {
    this.result = await lift(
      {
        projectRoot: this.projectRoot,
        vcs: {name: this.projectName, owner: this.githubUser},
        results: {
          projectDetails: this.projectDetails,
          tags: this.tags,
          ...this.nextSteps && {nextSteps: [...this.nextSteps, ...structuredClone(this.nextSteps)]}
        }
      },
      {
        octokit: this.octokit,
        logger,
        prompt: ({id, questions}) => ({
          [promptConstants.questionNames[id].CHECK_BYPASS_TEAM]: questions
            .find(question => question.name === promptConstants.questionNames[id].CHECK_BYPASS_TEAM).choices
            .find(choice => choice.name === this.maintenanceTeamName).value
        })
      }
    );
  }
});

Then('no error is thrown', async function () {
  if (this.resultError) {
    throw this.resultError;
  }
});
