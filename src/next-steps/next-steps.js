import zip from 'lodash.zip';
import uniqBy from 'lodash.uniqby';

import {factory as getAuthenticatedOctokit} from '../octokit/factory.js';

export default async function ({results: {nextSteps}, vcs: {name: repoName, owner}}) {
  const octokit = getAuthenticatedOctokit();

  if (octokit && nextSteps) {
    const deduplicatedNextSteps = uniqBy(nextSteps, 'summary');
    const issues = await Promise.all(
      deduplicatedNextSteps.map(({summary, description}) => octokit.issues.create({
        title: summary,
        body: description,
        owner,
        repo: repoName
      }))
    );

    return {
      nextSteps: zip(issues, deduplicatedNextSteps).map(([{data: issue}, step]) => ({...step, url: issue.url}))
    };
  }

  return {nextSteps: []};
}
