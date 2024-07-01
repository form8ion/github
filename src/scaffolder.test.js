import {when} from 'jest-when';
import any from '@travi/any';
import {describe, expect, it, vi} from 'vitest';

import {factory as octokitFactory} from './octokit/factory.js';
import {scaffold as scaffoldRepository} from './repository/index.js';
import scaffold from './scaffolder.js';

vi.mock('./octokit/factory.js');
vi.mock('./repository/index.js');

describe('scaffolder', () => {
  it('should create the github repository', async () => {
    const octokitClient = any.simpleObject();
    const repositoryResult = any.simpleObject();
    const name = any.word();
    const owner = any.word();
    octokitFactory.mockReturnValue(octokitClient);
    when(scaffoldRepository).calledWith({octokit: octokitClient, name, owner}).mockResolvedValue(repositoryResult);

    expect(await scaffold({name, owner})).toEqual({...repositoryResult});
  });
});
