import {StatusCodes} from 'http-status-codes';
import {directoryExists} from '@form8ion/core';

import {AfterAll, Before, BeforeAll, Given, Then} from '@cucumber/cucumber';
import {http, HttpResponse} from 'msw';
import {setupServer} from 'msw/node';
import any from '@travi/any';
import assert from 'node:assert';

const server = setupServer();
const githubToken = any.word();
const sshUrl = any.url();
const htmlUrl = any.url();
const userAccount = any.word();
const organizationAccount = any.word();

export function authorizationHeaderIncludesToken(request) {
  return request.headers.get('authorization') === `token ${githubToken}`;
}

Before(function () {
  this.server = server;
  this.userAccount = userAccount;
  this.organizationAccount = organizationAccount;
  this.githubToken = githubToken;
});

BeforeAll(function () {
  server.listen();
});

AfterAll(() => {
  server.close();
});

Given('no repository exists for the {string} on GitHub', async function (accountType) {
  if ('user' === accountType) {
    server.use(
      http.get(
        `https://api.github.com/repos/${userAccount}/${this.projectName}`,
        () => new HttpResponse(null, {status: StatusCodes.NOT_FOUND})
      )
    );

    server.use(
      http.post('https://api.github.com/user/repos', async ({request}) => {
        if (authorizationHeaderIncludesToken(request)) {
          this.createdRepositoryDetails = await request.clone().json();

          return HttpResponse.json({
            ssh_url: sshUrl,
            html_url: htmlUrl
          });
        }

        return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
      })
    );
  }

  if ('organization' === accountType) {
    server.use(
      http.get(
        `https://api.github.com/repos/${organizationAccount}/${this.projectName}`,
        () => new HttpResponse(null, {status: StatusCodes.NOT_FOUND})
      )
    );

    server.use(
      http.post(`https://api.github.com/orgs/${organizationAccount}/repos`, async ({request}) => {
        if (authorizationHeaderIncludesToken(request)) {
          this.createdRepositoryDetails = await request.clone().json();

          return HttpResponse.json({
            ssh_url: sshUrl,
            html_url: htmlUrl
          });
        }

        return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
      })
    );
  }
});

Given('a repository already exists for the {string} on GitHub', async function (accountType) {
  if ('user' === accountType) {
    server.use(
      http.get(`https://api.github.com/repos/${userAccount}/${this.projectName}`, ({request}) => {
        if (authorizationHeaderIncludesToken(request)) {
          return HttpResponse.json({
            ssh_url: sshUrl,
            html_url: htmlUrl
          });
        }

        return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
      })
    );
  }

  if ('organization' === accountType) {
    server.use(
      http.get(`https://api.github.com/repos/${organizationAccount}/${this.projectName}`, ({request}) => {
        if (authorizationHeaderIncludesToken(request)) {
          return HttpResponse.json({
            ssh_url: sshUrl,
            html_url: htmlUrl
          });
        }

        return new HttpResponse(null, {status: StatusCodes.UNAUTHORIZED});
      })
    );
  }
});

Given('the project is versioned on GitHub', async function () {
  this.github = true;
});

Given('the project is not versioned on GitHub', async function () {
  this.github = false;
});

Then('repository details are returned', async function () {
  assert.equal(this.result.sshUrl, sshUrl);
  assert.equal(this.result.htmlUrl, htmlUrl);
});

Then('no repository details are returned', async function () {
  assert.equal(this.result.sshUrl, undefined);
  assert.equal(this.result.htmlUrl, undefined);
});

Then('no repository is created on GitHub', async function () {
  return undefined;
});

Then('a repository is created on GitHub', async function () {
  assert.equal(this.createdRepositoryDetails.name, this.projectName);
  assert.equal(this.createdRepositoryDetails.private, 'Public' !== this.projectVisibility);
});

Then('the .github directory was created', async function () {
  assert.equal(await directoryExists(`${this.projectRoot}/.github/`), true, 'the `.github/` directory is missing');
});
