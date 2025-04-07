# github

form8ion plugin for projects using [GitHub](https://github.com) as host for
their git repository

<!--status-badges start -->

[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]
[![Codecov][coverage-badge]][coverage-link]
![SLSA Level 2][slsa-badge]

<!--status-badges end -->

## Table of Contents

* [Features](#features)
  * [Creation of GitHub repository](#creation-of-github-repository)
  * [Configuration of GitHub Repository Settings](#configuration-of-github-repository-settings)
* [Usage](#usage)
  * [Installation](#installation)
  * [Enabling actions against the GitHub API](#enabling-actions-against-the-github-api)
  * [Enabling repository configuration with `repository-settings/app`](#enabling-repository-configuration-with-repository-settingsapp)
    * [Account-level settings](#account-level-settings)
  * [Example](#example)
    * [Import](#import)
    * [Execute](#execute)
* [Contributing](#contributing)
  * [Dependencies](#dependencies)
  * [Verification](#verification)

## Features

### Creation of GitHub repository

When [authentication is provided](#enabling-actions-against-the-github-api),
a repository will be created on GitHub, assuming one does not already exist.

### Configuration of GitHub Repository Settings

This plugin configures repository settings by generating the settings file for
use by [repository-settings/app](https://github.com/respository-settings/app).
The settings in the file will be applied, along with those in the [account-level file](#account-level-settings),
once the generated file is pushed to GitHub in the default branch, assuming you
have the [repository-settings app installed](#enabling-repository-configuration-with-repository-settingsapp)
for your account.

## Usage

<!--consumer-badges start -->

[![MIT license][license-badge]][license-link]
[![npm][npm-badge]][npm-link]
[![Try @form8ion/github on RunKit][runkit-badge]][runkit-link]
![node][node-badge]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @form8ion/github --save-prod
```

### Enabling actions against the GitHub API

Provide an authenticated octokit instance as the `octokit` property in the
options

### Enabling repository configuration with `repository-settings/app`

* Be sure to [install](https://github.com/apps/settings) for the user or
  organization account that you are scaffolding the new project for.
* Enable the settings app for all repositories in the account

#### Account-level settings

The settings file generated by this tool assumes that it is extending an
[account level config](https://github.com/probot/probot-config#recipes)

* Ensure that you have created a `.github` repository in your account
* Create an [account-level settings file](https://github.com/probot/settings#inheritance)
  in the `.github` repository at the location `.github/settings.yml` within the
  repository
  * for an organization account, [this is a good example](https://github.com/form8ion/.github/blob/master/.github/settings.yml)
  * for a user account, [this is a good example](https://github.com/travi/.github/blob/master/.github/settings.yml)

### Example

#### Import

```javascript
import any from '@travi/any';
import {octokit} from '@form8ion/github-core';
import {lift, promptConstants, scaffold, test} from '@form8ion/github';
```

#### Execute

```javascript
const projectRoot = process.cwd();

await scaffold(
  {
    projectRoot,
    projectName: 'foo',
    visibility: any.fromList(['Public', 'Private']),
    description: any.sentence()
  },
  {
    prompt: async ({id}) => {
      const {questionNames, ids} = promptConstants;
      const expectedPromptId = ids.GITHUB_DETAILS;

      if (expectedPromptId === id) {
        return {[questionNames[expectedPromptId].GITHUB_ACCOUNT]: any.word()};
      }

      throw new Error(`Unknown prompt with ID: ${id}`);
    },
    octokit: octokit.getNetrcAuthenticatedInstance(),
    logger: {
      info: message => console.error(message),
      success: message => console.error(message),
      warn: message => console.error(message),
      error: message => console.error(message)
    }
  }
);

if (await test({projectRoot})) {
  await lift({
    projectRoot,
    vcs: {owner: 'account-name', name: 'repository-name'},
    results: {
      projectDetails: {homepage: any.url()},
      tags: any.listOf(any.word),
      nextSteps: any.listOf(() => ({summary: any.sentence(), description: any.sentence()}))
    }
  }, {octokit: octokit.getNetrcAuthenticatedInstance()});
}
```

## Contributing

<!--contribution-badges start -->

[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![semantic-release: angular][semantic-release-badge]][semantic-release-link]
[![Renovate][renovate-badge]][renovate-link]
[![PRs Welcome][PRs-badge]][PRs-link]

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Verification

```sh
$ npm test
```

[commitizen-link]: http://commitizen.github.io/cz-cli/

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[commit-convention-link]: https://conventionalcommits.org

[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot

[PRs-link]: https://makeapullrequest.com

[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

[github-actions-ci-link]: https://github.com/form8ion/github/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://img.shields.io/github/actions/workflow/status/form8ion/github/node-ci.yml.svg?branch=master&logo=github

[coverage-link]: https://codecov.io/github/form8ion/github

[coverage-badge]: https://img.shields.io/codecov/c/github/form8ion/github?logo=codecov

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/github.svg?logo=opensourceinitiative

[npm-link]: https://www.npmjs.com/package/@form8ion/github

[npm-badge]: https://img.shields.io/npm/v/@form8ion/github?logo=npm

[runkit-link]: https://npm.runkit.com/@form8ion/github

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/github.svg

[node-badge]: https://img.shields.io/node/v/@form8ion/github?logo=node.js
