import {constants} from '../prompt/index.js';

export function accountTypeIsOrganization({
  [constants.questionNames[constants.ids.GITHUB_DETAILS].ACCOUNT_TYPE]: accountType
}) {
  return 'organization' === accountType;
}
