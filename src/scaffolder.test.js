import {promises as fs} from 'node:fs';
import {scaffold as scaffoldSettings} from '@form8ion/repository-settings';

import {when} from 'jest-when';
import any from '@travi/any';
import {beforeEach, describe, expect, it, vi} from 'vitest';

import {factory as octokitFactory} from './octokit/factory.js';
import {scaffold as scaffoldRepository} from './repository/index.js';
import scaffold from './scaffolder.js';

vi.mock('node:fs');
vi.mock('@form8ion/repository-settings');
vi.mock('./octokit/factory.js');
vi.mock('./repository/index.js');

describe('scaffolder', () => {
  const projectRoot = any.string();
  const name = any.word();
  const owner = any.word();
  const visibility = any.word();
  const description = any.sentence();
  const octokitClient = any.simpleObject();

  beforeEach(() => {
    octokitFactory.mockReturnValue(octokitClient);
  });

  it('should create the github repository', async () => {
    const repositoryResult = any.simpleObject();
    when(scaffoldRepository)
      .calledWith({octokit: octokitClient, name, owner, visibility})
      .mockResolvedValue(repositoryResult);

    expect(await scaffold({projectName: name, owner, visibility, projectRoot, description}))
      .toEqual(repositoryResult);
    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.github`, {recursive: true});
    expect(scaffoldSettings).toHaveBeenCalledWith({projectRoot, projectName: name, visibility, description});
  });

  it('should not scaffold settings when an error occurs scaffolding the repository', async () => {
    const error = new Error(any.sentence());
    when(scaffoldRepository)
      .calledWith({octokit: octokitClient, name, owner, visibility})
      .mockRejectedValue(error);

    await expect(scaffold({projectName: name, owner, visibility, projectRoot, description}))
      .rejects.toThrowError(error);
  });
});
