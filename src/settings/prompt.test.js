import {describe, vi, it, expect} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {constants} from '../prompt/index.js';
import promptForAdminSettingsHandling from './prompt.js';

describe('admin settings prompt', () => {
  const promptId = constants.ids.ADMIN_SETTINGS;
  const settingsAsCodeQuestionName = constants.questionNames[promptId].SETTINGS_MANAGED_AS_CODE;

  it('should prompt for input about how to manage the admin settings of the repository', async () => {
    const prompt = vi.fn();
    const manageSettingsAsCode = any.boolean();
    when(prompt)
      .calledWith({
        id: promptId,
        questions: [{
          name: settingsAsCodeQuestionName,
          message: 'Should the admin settings of the repository be managed as code?',
          type: 'confirm',
          default: true
        }]
      })
      .thenResolve({[settingsAsCodeQuestionName]: manageSettingsAsCode});

    expect(await promptForAdminSettingsHandling(prompt)).toEqual(manageSettingsAsCode);
  });
});
