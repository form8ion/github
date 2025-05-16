import {StatusCodes} from 'http-status-codes';
import zip from 'lodash.zip';
import kebab from 'lodash.kebabcase';

import assert from 'node:assert';
import {Given, Then} from '@cucumber/cucumber';
import {http, HttpResponse} from 'msw';
import deepEqual from 'deep-equal';
import any from '@travi/any';

import {authorizationHeaderIncludesToken} from './repository-steps.js';

let nextStepsIssueUrls;

Given('next steps are provided', async function () {
  const summaries = any.listOf(any.sentence, {min: 1});
  const descriptions = summaries.map(() => (any.boolean() ? any.sentence() : undefined));
  this.nextSteps = zip(summaries, descriptions)
    .map(([summary, description]) => ({...any.simpleObject(), summary, description}));
  nextStepsIssueUrls = this.nextSteps.map(() => any.url());

  if (this.netrcContent) {
    this.server.use(
      http.get('https://api.github.com/search/issues', ({request}) => {
        if (authorizationHeaderIncludesToken(request)) {
          return HttpResponse.json({items: []});
        }

        return undefined;
      }),
      http.post(
        `https://api.github.com/repos/${this.githubUser}/${this.projectName}/issues`,
        async ({request}) => {
          if (authorizationHeaderIncludesToken(request)) {
            const body = await request.json();

            const [, url] = zip(this.nextSteps, nextStepsIssueUrls).find(([task]) => deepEqual(
              body,
              {
                ...task.description
                  ? {
                    body: `${task.description}

<!-- octokit-unique-issue id="${kebab(task.summary)}" -->`
                  }
                  : {body: `<!-- octokit-unique-issue id="${kebab(task.summary)}" -->`},
                title: task.summary
              }
            ));

            return HttpResponse.json({url});
          }

          return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
        }
      )
    );
  }
});

Then('issues are created for next-steps', async function () {
  assert.deepEqual(
    this.result.nextSteps,
    zip(nextStepsIssueUrls, this.nextSteps).map(([url, step]) => ({...step, url}))
  );
});

Then('no issues are created for next-steps', async function () {
  assert.deepEqual(this.result.nextSteps, []);
});
