import {lift as liftSettings, test as repositoryMaintainedWithRepositorySettings} from '@form8ion/repository-settings';

import any from '@travi/any';
import {when} from 'vitest-when';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import nextSteps from './next-steps/next-steps.js';
import lift from './lifter.js';

vi.mock('@form8ion/repository-settings');
vi.mock('./next-steps/next-steps.js');

describe('lifter', () => {
  const projectRoot = any.string();
  const results = any.simpleObject();
  const vcs = any.simpleObject();
  const nextStepsResult = any.simpleObject();

  beforeEach(() => {
    when(nextSteps).calledWith({results, vcs}).thenResolve(nextStepsResult);
  });

  it('should apply the settings lifter if the project is managed with the settings app', async () => {
    when(repositoryMaintainedWithRepositorySettings).calledWith({projectRoot}).thenResolve(true);

    expect(await lift({projectRoot, results, vcs})).toEqual(nextStepsResult);
    expect(liftSettings).toHaveBeenCalledWith({projectRoot, results});
  });

  it('should apply not the settings lifter if the project is not managed with the settings app', async () => {
    when(repositoryMaintainedWithRepositorySettings).calledWith({projectRoot}).thenResolve(false);

    expect(await lift({projectRoot, results, vcs})).toEqual(nextStepsResult);
    expect(liftSettings).not.toHaveBeenCalledWith({projectRoot, results});
  });
});
