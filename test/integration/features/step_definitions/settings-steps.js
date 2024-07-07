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

Then('properties are updated in the settings file', async function () {
  assert.deepEqual(
    yaml.load(await fs.readFile(`${this.projectRoot}/.github/settings.yml`, 'utf-8')),
    {
      ...this.existingSettingsContent,
      repository: {
        ...this.existingSettingsContent.repository,
        ...this.homepage && {homepage: this.homepage},
        topics: this.tags.join(', ')
      }
    }
  );
});

Then('no settings file exists', async function () {
  assert.equal(await fileExists(`${this.projectRoot}/.github/settings.yml`), false);
});
