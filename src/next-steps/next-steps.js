import zip from 'lodash.zip';
import uniqBy from 'lodash.uniqby';
import kebab from 'lodash.kebabcase';
import {composeCreateOrUpdateUniqueIssue} from 'octokit-plugin-unique-issue';

export default async function addIssuesForNextSteps({results: {nextSteps}, vcs: {name: repoName, owner}}, {octokit}) {
  if (octokit && nextSteps) {
    const deduplicatedNextSteps = uniqBy(nextSteps, 'summary');
    const issues = await Promise.all(
      deduplicatedNextSteps.map(({summary, description}) => composeCreateOrUpdateUniqueIssue(octokit, {
        title: summary,
        body: description,
        identifier: kebab(summary),
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
