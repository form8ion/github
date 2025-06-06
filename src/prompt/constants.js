import {promptConstants as repositorySettingsPromptConstants} from '@form8ion/repository-settings';

export const ids = {
  GITHUB_DETAILS: 'GITHUB_DETAILS',
  ADMIN_SETTINGS: 'ADMIN_SETTINGS',
  ...repositorySettingsPromptConstants.ids
};

export const questionNames = {
  [ids.GITHUB_DETAILS]: {
    ACCOUNT_TYPE: 'ACCOUNT_TYPE',
    ORGANIZATION: 'ORGANIZATION'
  },
  [ids.ADMIN_SETTINGS]: {SETTINGS_MANAGED_AS_CODE: 'SETTINGS_MANAGED_AS_CODE'},
  ...repositorySettingsPromptConstants.questionNames
};
