import {describe, expect, it} from 'vitest';
import any from '@travi/any';

import {constants} from '../prompt/index.js';
import {accountTypeIsOrganization} from './prompt-conditionals.js';

describe('prompt conditionals', () => {
  it('should return `true` when the chosen account type is `organization`', async () => {
    expect(
      accountTypeIsOrganization({[constants.questionNames[constants.ids.GITHUB_DETAILS].ACCOUNT_TYPE]: 'organization'})
    ).toBe(true);
  });

  it('should return `false` when the chosen account type is not `organization`', async () => {
    expect(
      accountTypeIsOrganization({[constants.questionNames[constants.ids.GITHUB_DETAILS].ACCOUNT_TYPE]: any.word()})
    ).toBe(false);
  });
});
