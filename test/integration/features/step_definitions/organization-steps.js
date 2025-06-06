import {StatusCodes} from 'http-status-codes';

import {Given, Then} from '@cucumber/cucumber';
import {http, HttpResponse} from 'msw';
import assert from 'node:assert';
import any from '@travi/any';

import {authorizationHeaderIncludesToken} from './repository-steps.js';

Given('the user is a member of an organization', async function () {
  const anyOrganization = () => ({login: any.word(), id: any.integer(), ...any.simpleObject()});
  this.githubUser = this.organizationAccount;

  this.server.use(
    http.get('https://api.github.com/user/orgs', () => HttpResponse.json([
      ...any.listOf(anyOrganization),
      {login: this.organizationAccount, id: this.organizationId, ...any.simpleObject()},
      ...any.listOf(anyOrganization)
    ])),
    http.get('https://api.github.com/user/orgs', ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json([{login: this.organizationAccount}]);
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    })
  );
});

Given('the user is not a member of the organization', async function () {
  this.skipMenuToSetOrganization = true;
  this.githubUser = this.organizationAccount;
  this.accountType = 'organization';

  this.server.use(
    http.get('https://api.github.com/user/orgs', ({request}) => {
      if (authorizationHeaderIncludesToken(request)) {
        return HttpResponse.json([]);
      }

      return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
    })
  );
});

Then('and an authorization error is thrown', async function () {
  assert.equal(
    this.resultError.message,
    `User ${this.userAccount} does not have access to create a repository in the ${this.organizationId} account`
  );
});
