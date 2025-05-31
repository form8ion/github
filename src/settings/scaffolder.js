import {scaffold as scaffoldSettings} from '@form8ion/repository-settings';

import adminSettingsPrompt from './prompt.js';

export default async function scaffoldAdminSettings(
  {projectRoot, projectName, visibility, description},
  {logger, prompt}
) {
  if (await adminSettingsPrompt(prompt)) {
    await scaffoldSettings({projectRoot, projectName, visibility, description}, {logger});
  }
}
