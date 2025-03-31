import {promises as fs} from 'node:fs';
import yaml from 'js-yaml';
import {fileExists} from '@form8ion/core';

import assert from 'node:assert';
import {Given, Then} from '@cucumber/cucumber';

Given('the repository settings are managed by the settings app', async function () {
  this.settingsApp = true;
});

Given('the repository settings are not managed by the settings app', async function () {
  this.settingsApp = false;
});

Then('repository settings are configured', async function () {
  const settings = yaml.load(await fs.readFile(`${process.cwd()}/.github/settings.yml`));

  assert.deepEqual(
    settings,
    {
      _extends: '.github',
      repository: {
        name: this.projectName,
        description: this.projectDescription,
        private: 'Public' !== this.projectVisibility
      }
    }
  );
});

Then('no repository settings are configured', async function () {
  assert.equal(await fileExists(`${this.projectRoot}/.github/settings.yml`), false);
});

Then('properties are updated in the settings file', async function () {
  assert.deepEqual(
    yaml.load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`, 'utf-8')),
    {
      ...this.existingSettingsContent,
      repository: {
        ...this.existingSettingsContent.repository,
        ...this.homepage && {homepage: this.homepage},
        topics: this.tags.join(', ')
      },
      branches: [{name: 'master', protection: null}],
      rulesets: [
        {
          conditions: {ref_name: {exclude: [], include: ['~DEFAULT_BRANCH']}},
          enforcement: 'active',
          name: 'prevent destruction of the default branch',
          rules: [{type: 'deletion'}, {type: 'non_fast_forward'}],
          target: 'branch'
        },
        {
          name: 'verification must pass',
          target: 'branch',
          enforcement: 'active',
          conditions: {ref_name: {include: ['~DEFAULT_BRANCH'], exclude: []}},
          rules: [{
            type: 'required_status_checks',
            parameters: {
              strict_required_status_checks_policy: false,
              required_status_checks: [{context: 'workflow-result', integration_id: 15368}]
            }
          }],
          bypass_actors: [{actor_id: 3208999, actor_type: 'Team', bypass_mode: 'always'}]
        }
      ]
    }
  );
});

Then('no settings file exists', async function () {
  assert.equal(await fileExists(`${this.projectRoot}/.github/settings.yml`), false);
});
