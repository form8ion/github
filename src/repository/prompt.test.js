import {describe, expect, it, vi} from 'vitest';
import {when} from 'vitest-when';
import any from '@travi/any';

import {constants} from '../prompt/index.js';
import promptForRepositoryOwner from './prompt.js';

describe('GitHub details prompt', () => {
  const promptId = constants.ids.GITHUB_DETAILS;
  const githubAccountQuestionName = constants.questionNames[promptId].GITHUB_ACCOUNT;

  it('should prompt for the GitHub account to host the repository', async () => {
    const prompt = vi.fn();
    const githubAccount = any.word();
    when(prompt)
      .calledWith({
        id: promptId,
        questions: [{
          name: githubAccountQuestionName,
          message: 'Which GitHub account should the repository be hosted within?'
        }]
      })
      .thenResolve({[githubAccountQuestionName]: githubAccount});

    expect(await promptForRepositoryOwner(prompt)).toEqual(githubAccount);
  });
});
