import {scaffold as scaffoldSettings} from '@form8ion/repository-settings';

import {describe, it, vi, expect} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import adminSettingsPrompt from './prompt.js';
import scaffoldAdminSettings from './scaffolder.js';

vi.mock('@form8ion/repository-settings');
vi.mock('./prompt.js');

describe('repository-settings scaffolder', () => {
  const projectRoot = any.string();
  const projectName = any.word();
  const visibility = any.word();
  const description = any.sentence();
  const logger = any.simpleObject();
  const prompt = any.simpleObject();

  it('should configure the repository-settings app if settings will be managed as code', async () => {
    when(adminSettingsPrompt).calledWith(prompt).thenResolve(true);

    await scaffoldAdminSettings({projectRoot, projectName, visibility, description}, {logger, prompt});

    expect(scaffoldSettings).toHaveBeenCalledWith({projectRoot, projectName, visibility, description}, {logger});
  });

  it('should configure the repository-settings app if settings will be managed as code', async () => {
    when(adminSettingsPrompt).calledWith(prompt).thenResolve(false);

    await scaffoldAdminSettings({projectRoot, projectName, visibility, description}, {logger, prompt});

    expect(scaffoldSettings).not.toHaveBeenCalled();
  });
});
