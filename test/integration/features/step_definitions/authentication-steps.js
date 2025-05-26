import {Octokit} from '@octokit/core';
import {StatusCodes} from 'http-status-codes';

import {Given} from '@cucumber/cucumber';
import {http, HttpResponse} from 'msw';

import {authorizationHeaderIncludesToken} from './repository-steps.js';

Given('no octokit instance is provided', async function () {
  this.octokit = null;
});

Given('an Octokit instance is provided', async function () {
  this.githubUser = this.userAccount;
  this.octokit = new Octokit({auth: this.githubToken});

  this.server.use(
    http.get('https://api.github.com/user', ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json({login: this.userAccount});
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    })
  );
});
