import {constants} from '../prompt/index.js';

export default async function promptForAdminSettingsHandling(prompt) {
  const promptId = constants.ids.ADMIN_SETTINGS;
  const settingsAsCodeQuestionName = constants.questionNames[promptId].SETTINGS_MANAGED_AS_CODE;

  const {[settingsAsCodeQuestionName]: manageSettingsAsCode} = await prompt({
    id: promptId,
    questions: [{
      name: settingsAsCodeQuestionName,
      message: 'Should the admin settings of the repository be managed as code?',
      type: 'confirm',
      default: true
    }]
  });

  return manageSettingsAsCode;
}
