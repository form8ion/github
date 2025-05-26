import {StatusCodes} from 'http-status-codes';

import {beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import promptForRepositoryOwner from './prompt.js';
import scaffoldRepository from './scaffolder.js';

vi.mock('./prompt.js');

describe('creation', () => {
  let octokitRequest, client;
  const sshUrl = any.url();
  const htmlUrl = any.url();
  const repoDetailsResponse = {data: {ssh_url: sshUrl, html_url: htmlUrl}};
  const account = any.word();
  const name = any.word();
  const fetchFailureError = new Error('fetching the repo failed');
  const repoNotFoundError = new Error('Repo not found in test');
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };
  const prompt = () => undefined;

  repoNotFoundError.status = StatusCodes.NOT_FOUND;

  beforeEach(() => {
    when(promptForRepositoryOwner).calledWith(prompt).thenResolve(account);
  });

  describe('for user', () => {
    beforeEach(() => {
      octokitRequest = vi.fn();
      client = {request: octokitRequest};

      when(octokitRequest).calledWith('GET /user').thenResolve({data: {login: account}});
    });

    it('should create the repository for the provided user account', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account, repo: name})
        .thenThrow(repoNotFoundError);
      when(octokitRequest)
        .calledWith('POST /user/repos', {name, private: false})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Public'}, {octokit: client, logger, prompt}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account}});
    });

    it('should not create the repository when it already exists', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account, repo: name})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Public'}, {octokit: client, logger, prompt}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account}});
      expect(octokitRequest).not.toHaveBeenCalledWith('POST /user/repos', {name, private: false});
    });

    it('should create the repository as private when visibility is `Private`', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account, repo: name})
        .thenThrow(repoNotFoundError);
      when(octokitRequest)
        .calledWith('POST /user/repos', {name, private: true})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Private'}, {octokit: client, logger, prompt}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account}});
    });

    it('should rethrow other errors', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account, repo: name})
        .thenThrow(fetchFailureError);

      await expect(scaffoldRepository({name, visibility: 'Private'}, {octokit: client, logger, prompt}))
        .rejects.toThrowError(fetchFailureError);
    });
  });

  describe('for organization', () => {
    beforeEach(() => {
      octokitRequest = vi.fn();
      client = {request: octokitRequest};

      when(octokitRequest).calledWith('GET /user').thenResolve({data: {login: any.word()}});

      when(octokitRequest).calledWith('GET /user/orgs').thenResolve({
        data: [
          ...any.listOf(() => ({...any.simpleObject(), login: any.word})),
          {...any.simpleObject(), login: account}
        ]
      });
    });

    it('should create the repository for the provided organization account', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account, repo: name})
        .thenThrow(repoNotFoundError);
      when(octokitRequest)
        .calledWith('POST /orgs/{org}/repos', {org: account, name, private: false})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Public'}, {octokit: client, logger, prompt}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account}});
    });

    it('should not create the repository when it already exists', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account, repo: name})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Public'}, {octokit: client, logger, prompt}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account}});
      expect(octokitRequest).not.toHaveBeenCalledWith('POST /orgs/{org}/repos', {org: account, name, private: false});
    });

    it('should create the repository as private when visibility is `Private`', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account, repo: name})
        .thenThrow(repoNotFoundError);
      when(octokitRequest)
        .calledWith('POST /orgs/{org}/repos', {org: account, name, private: true})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Private'}, {octokit: client, logger, prompt}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account}});
    });

    it('should rethrow other errors', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account, repo: name})
        .thenThrow(fetchFailureError);

      await expect(scaffoldRepository({name, visibility: 'Private'}, {octokit: client, logger, prompt}))
        .rejects.toThrowError(fetchFailureError);
    });
  });

  describe('unauthorized account', () => {
    it('should throw an error if the authenticated user does not have access to the requested account', async () => {
      const authenticatedUser = any.word();
      when(octokitRequest).calledWith('GET /user').thenResolve({data: {login: authenticatedUser}});
      when(octokitRequest)
        .calledWith('GET /user/orgs')
        .thenResolve({data: any.listOf(() => ({...any.simpleObject(), login: any.word}))});

      await expect(scaffoldRepository({name, visibility: any.word()}, {octokit: client, logger, prompt}))
        .rejects.toThrowError(
          `User ${authenticatedUser} does not have access to create a repository in the ${account} account`
        );
    });
  });
});
