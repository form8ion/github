import {promises as fs} from 'node:fs';

import {when} from 'vitest-when';
import any from '@travi/any';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {scaffold as scaffoldSettings} from './settings/index.js';
import {scaffold as scaffoldRepository} from './repository/index.js';
import scaffold from './scaffolder.js';

vi.mock('node:fs');
vi.mock('./settings/index.js');
vi.mock('./repository/index.js');

describe('scaffolder', () => {
  let prompt;
  const projectRoot = any.string();
  const name = any.word();
  const visibility = any.word();
  const description = any.sentence();
  const octokitClient = any.simpleObject();
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };

  beforeEach(() => {
    prompt = vi.fn();
  });

  it('should create the github repository', async () => {
    const repositoryResult = any.simpleObject();
    when(scaffoldRepository)
      .calledWith({name, visibility}, {octokit: octokitClient, logger, prompt})
      .thenResolve(repositoryResult);

    expect(await scaffold(
      {projectName: name, visibility, projectRoot, description},
      {prompt, octokit: octokitClient, logger}
    )).toEqual(repositoryResult);
    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.github`, {recursive: true});
    expect(scaffoldSettings).toHaveBeenCalledWith(
      {projectRoot, projectName: name, visibility, description},
      {logger, prompt}
    );
  });

  it('should not scaffold settings when an error occurs scaffolding the repository', async () => {
    const error = new Error(any.sentence());
    when(scaffoldRepository)
      .calledWith({name, visibility}, {octokit: octokitClient, logger, prompt})
      .thenReject(error);

    await expect(scaffold(
      {projectName: name, visibility, projectRoot, description},
      {prompt, octokit: octokitClient, logger}
    )).rejects.toThrowError(error);
  });

  it('should not attempt to scaffold if no octokit instance is available', async () => {
    expect(await scaffold({projectName: name, visibility, projectRoot, description}, {prompt, logger})).toEqual({});
  });
});
