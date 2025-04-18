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
  const octokit = any.simpleObject();
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };

  beforeEach(() => {
    when(nextSteps).calledWith({results, vcs}, {octokit}).thenResolve(nextStepsResult);
  });

  it('should apply the settings lifter if the project is managed with the settings app', async () => {
    const prompt = () => undefined;
    when(repositoryMaintainedWithRepositorySettings).calledWith({projectRoot}).thenResolve(true);

    expect(await lift({projectRoot, results, vcs}, {octokit, logger, prompt})).toEqual(nextStepsResult);
    expect(liftSettings).toHaveBeenCalledWith({projectRoot, results, vcs}, {logger, prompt});
  });

  it('should apply not the settings lifter if the project is not managed with the settings app', async () => {
    when(repositoryMaintainedWithRepositorySettings).calledWith({projectRoot}).thenResolve(false);

    expect(await lift({projectRoot, results, vcs}, {octokit, logger})).toEqual(nextStepsResult);
    expect(liftSettings).not.toHaveBeenCalledWith({projectRoot, results}, {logger});
  });
});
