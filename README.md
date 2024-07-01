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
* [Usage](#usage)
  * [Installation](#installation)
  * [Enabling actions against the GitHub API](#enabling-actions-against-the-github-api)
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

This plugin leverages the [.netrc strategy](https://github.com/travi/octokit-auth-netrc)
for [octokit](https://github.com/octokit/rest.js/). Be sure to
[add your personal access token](https://github.com/travi/octokit-auth-netrc#defining-your-token)
to leverage the GitHub API integration benefits of this plugin.

### Example

#### Import

```javascript
import {scaffold} from '@form8ion/github';
```

#### Execute

```javascript
await scaffold({
  projectRoot: process.cwd(),
  name: 'foo',
  owner: 'travi'
});
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

[license-badge]: https://img.shields.io/github/license/form8ion/github.svg

[npm-link]: https://www.npmjs.com/package/@form8ion/github

[npm-badge]: https://img.shields.io/npm/v/@form8ion/github?logo=npm

[runkit-link]: https://npm.runkit.com/@form8ion/github

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/github.svg

[node-badge]: https://img.shields.io/node/v/@form8ion/github?logo=node.js
