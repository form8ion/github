import {StatusCodes} from 'http-status-codes';

import {beforeEach, describe, expect, it, vi} from 'vitest';
import any from '@travi/any';
import {when} from 'vitest-when';

import scaffoldRepository from './scaffolder.js';

describe('creation', () => {
  let octokitRequest, client;
  const sshUrl = any.url();
  const htmlUrl = any.url();
  const repoDetailsResponse = {data: {ssh_url: sshUrl, html_url: htmlUrl}};
  const name = any.word();
  const fetchFailureError = new Error('fetching the repo failed');
  const repoNotFoundError = new Error('Repo not found in test');
  const logger = {
    info: () => undefined,
    success: () => undefined,
    warn: () => undefined,
    error: () => undefined
  };

  repoNotFoundError.status = StatusCodes.NOT_FOUND;

  describe('for user', () => {
    const account = {
      type: 'user',
      name: any.word()
    };

    beforeEach(() => {
      octokitRequest = vi.fn();
      client = {request: octokitRequest};
    });

    it('should create the repository for the provided user account', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account.name, repo: name})
        .thenThrow(repoNotFoundError);
      when(octokitRequest)
        .calledWith('POST /user/repos', {name, private: false})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Public', account}, {octokit: client, logger}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account.name}});
    });

    it('should not create the repository when it already exists', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account.name, repo: name})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Public', account}, {octokit: client, logger}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account.name}});
      expect(octokitRequest).not.toHaveBeenCalledWith('POST /user/repos', {name, private: false});
    });

    it('should create the repository as private when visibility is `Private`', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account.name, repo: name})
        .thenThrow(repoNotFoundError);
      when(octokitRequest)
        .calledWith('POST /user/repos', {name, private: true})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Private', account}, {octokit: client, logger}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account.name}});
    });

    it('should rethrow other errors', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account.name, repo: name})
        .thenThrow(fetchFailureError);

      await expect(scaffoldRepository({name, visibility: 'Private', account}, {octokit: client, logger}))
        .rejects.toThrowError(fetchFailureError);
    });
  });

  describe('for organization', () => {
    const account = {
      type: 'organization',
      name: any.word()
    };

    beforeEach(() => {
      octokitRequest = vi.fn();
      client = {request: octokitRequest};
    });

    it('should create the repository for the provided organization account', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account.name, repo: name})
        .thenThrow(repoNotFoundError);
      when(octokitRequest)
        .calledWith('POST /orgs/{org}/repos', {org: account.name, name, private: false})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Public', account}, {octokit: client, logger}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account.name}});
    });

    it('should not create the repository when it already exists', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account.name, repo: name})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Public', account}, {octokit: client, logger}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account.name}});
      expect(octokitRequest).not.toHaveBeenCalledWith('POST /orgs/{org}/repos', {org: account, name, private: false});
    });

    it('should create the repository as private when visibility is `Private`', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account.name, repo: name})
        .thenThrow(repoNotFoundError);
      when(octokitRequest)
        .calledWith('POST /orgs/{org}/repos', {org: account.name, name, private: true})
        .thenResolve(repoDetailsResponse);

      expect(await scaffoldRepository({name, visibility: 'Private', account}, {octokit: client, logger}))
        .toEqual({vcs: {sshUrl, htmlUrl, name, host: 'github', owner: account.name}});
    });

    it('should rethrow other errors', async () => {
      when(octokitRequest)
        .calledWith('GET /repos/{owner}/{repo}', {owner: account.name, repo: name})
        .thenThrow(fetchFailureError);

      await expect(scaffoldRepository({name, visibility: 'Private', account}, {octokit: client, logger}))
        .rejects.toThrowError(fetchFailureError);
    });
  });
});
