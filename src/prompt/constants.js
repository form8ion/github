import {promptConstants as repositorySettingsPromptConstants} from '@form8ion/repository-settings';

export const ids = {GITHUB_DETAILS: 'GITHUB_DETAILS', ...repositorySettingsPromptConstants.ids};

export const questionNames = {
  [ids.GITHUB_DETAILS]: {GITHUB_ACCOUNT: 'GITHUB_ACCOUNT'},
  ...repositorySettingsPromptConstants.questionNames
};
