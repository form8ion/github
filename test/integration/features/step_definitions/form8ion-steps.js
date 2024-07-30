import {validateOptions, optionsSchemas} from '@form8ion/core';

import {Then, When} from '@cucumber/cucumber';
import assert from 'node:assert';

// eslint-disable-next-line import/no-extraneous-dependencies,import/no-unresolved
import * as plugin from '@form8ion/github';

When('the github plugin is compared to form8ion plugin conventions', async function () {
  await plugin.scaffold({projectRoot: this.projectRoot});
});

Then('the public interface is compatible with the plugin schema', async function () {
  validateOptions(optionsSchemas.form8ionPlugin, plugin);
});

Then('the output produced by the scaffolder is detectable by the predicate', async function () {
  assert.equal(await plugin.test({projectRoot: this.projectRoot}), true);
});
