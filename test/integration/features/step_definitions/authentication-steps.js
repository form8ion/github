import {StatusCodes} from 'http-status-codes';

import {Given} from '@cucumber/cucumber';
import {http, HttpResponse} from 'msw';

import {authorizationHeaderIncludesToken} from './repository-steps.js';

Given('no authentication is provided', async function () {
  return undefined;
});

Given('netrc contains no GitHub token', async function () {
  this.netrcContent = '';
});

Given('netrc contains a GitHub token', async function () {
  this.githubUser = this.userAccount;
  this.netrcContent = `machine api.github.com\n  login ${this.githubToken}`;

  this.server.use(
    http.get('https://api.github.com/user', ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json({login: this.userAccount});
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    })
  );
});
