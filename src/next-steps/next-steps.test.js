import zip from 'lodash.zip';

import {describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'jest-when';

import {factory as octokitFactory} from '../octokit/factory.js';
import nextSteps from './next-steps.js';

vi.mock('../octokit/factory.js');

describe('next-steps', () => {
  it('should return an empty list when no octokit client is available', async () => {
    octokitFactory.mockReturnValue(undefined);

    expect(await nextSteps({results: {nextSteps: any.listOf(any.simpleObject)}, vcs: {}})).toEqual({nextSteps: []});
  });

  it('should return an empty list when no next-steps are provided', async () => {
    octokitFactory.mockReturnValue(any.simpleObject);

    expect(await nextSteps({results: {nextSteps: undefined}, vcs: {}})).toEqual({nextSteps: []});
  });

  it('should return the URLs of the created issues', async () => {
    const issueUrls = any.listOf(any.url);
    const summaries = issueUrls.map(() => any.sentence());
    const descriptions = issueUrls.map(() => any.sentence());
    const create = vi.fn();
    const steps = issueUrls.map((url, index) => ({
      ...any.simpleObject(),
      summary: summaries[index],
      description: descriptions[index]
    }));
    const octokit = {...any.simpleObject(), issues: {create}};
    const repoName = any.word();
    const owner = any.word();
    octokitFactory.mockReturnValue(octokit);
    issueUrls.forEach((url, index) => {
      when(create)
        .calledWith({title: summaries[index], body: descriptions[index], owner, repo: repoName})
        .mockResolvedValue({data: {url}});
    });

    expect(await nextSteps({results: {nextSteps: [...steps, ...structuredClone(steps)]}, vcs: {owner, name: repoName}}))
      .toEqual({nextSteps: zip(issueUrls, steps).map(([url, step]) => ({...step, url}))});
  });
});
