import {promises as fs} from 'node:fs';
import yaml from 'js-yaml';

import assert from 'node:assert';
import {Then} from '@cucumber/cucumber';

Then('repository settings are configured', async function () {
  const settings = yaml.load(await fs.readFile(`${process.cwd()}/.github/settings.yml`));

  assert.deepEqual(
    settings,
    {
      _extends: '.github',
      repository: {
        name: this.projectName,
        // description: this.projectDescription,
        // homepage: this.projectHomepage,
        private: 'Public' !== this.projectVisibility
        // topics: this.topics.join(', ')
      }
    }
  );
});
