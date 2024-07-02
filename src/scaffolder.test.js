import {promises as fs} from 'node:fs';
import {scaffold as scaffoldSettings} from '@form8ion/repository-settings';

import {when} from 'jest-when';
import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';

import {factory as octokitFactory} from './octokit/factory.js';
import {scaffold as scaffoldRepository} from './repository/index.js';
import scaffold from './scaffolder.js';

vi.mock('node:fs');
vi.mock('@form8ion/repository-settings');
vi.mock('./octokit/factory.js');
vi.mock('./repository/index.js');

describe('scaffolder', () => {
  it('should create the github repository', async () => {
    const projectRoot = any.string();
    const octokitClient = any.simpleObject();
    const repositoryResult = any.simpleObject();
    const name = any.word();
    const owner = any.word();
    const visibility = any.word();
    octokitFactory.mockReturnValue(octokitClient);
    when(scaffoldRepository)
      .calledWith({octokit: octokitClient, name, owner, visibility})
      .mockResolvedValue(repositoryResult);

    expect(await scaffold({name, owner, visibility, projectRoot})).toEqual({...repositoryResult});
    expect(fs.mkdir).toHaveBeenCalledWith(`${projectRoot}/.github`, {recursive: true});
    expect(scaffoldSettings).toHaveBeenCalledWith({projectRoot, projectName: name, visibility});
  });
});
