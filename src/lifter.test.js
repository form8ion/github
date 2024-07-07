import {lift as liftSettings, test as repositoryMaintainedWithRepositorySettings} from '@form8ion/repository-settings';

import any from '@travi/any';
import {when} from 'jest-when';
import {describe, expect, it, vi} from 'vitest';

import lift from './lifter.js';

vi.mock('@form8ion/repository-settings');

describe('lifter', () => {
  const projectRoot = any.string();
  const results = any.simpleObject();

  it('should apply the settings lifter if the project is managed with the settings app', async () => {
    const settingsResult = any.simpleObject();
    when(repositoryMaintainedWithRepositorySettings).calledWith({projectRoot}).mockResolvedValue(true);
    when(liftSettings).calledWith({projectRoot, results}).mockResolvedValue(settingsResult);

    expect(await lift({projectRoot, results})).toEqual(settingsResult);
  });

  it('should apply not the settings lifter if the project is not managed with the settings app', async () => {
    when(repositoryMaintainedWithRepositorySettings).calledWith({projectRoot}).mockResolvedValue(false);

    expect(await lift({projectRoot, results})).toEqual({});
  });
});
