Feature: Scaffolder

  Scenario: new public repository
    Given an Octokit instance is provided
    And no repository exists for the "user" on GitHub
    And the visibility of the repository should be "Public"
    When the project is scaffolded
    Then no error is thrown
    And a repository is created on GitHub
    And the .github directory was created
    And repository settings are configured
    And repository details are returned

  Scenario: new private repository
    Given an Octokit instance is provided
    And no repository exists for the "user" on GitHub
    And the visibility of the repository should be "Private"
    When the project is scaffolded
    Then a repository is created on GitHub
    And the .github directory was created
    And repository settings are configured
    And repository details are returned

  Scenario: existing repository
    Given an Octokit instance is provided
    And a repository already exists for the "user" on GitHub
    When the project is scaffolded
    Then no repository is created on GitHub
    But repository details are returned
    And the .github directory was created
    And repository settings are configured

  Scenario: no octokit
    Given no octokit instance is provided
    When the project is scaffolded
    Then no repository is created on GitHub
    And no repository settings are configured
    And the .github directory does not exist
    And no repository details are returned

  Scenario: user is a member of an organization and the public project is new
    Given an Octokit instance is provided
    And the user is a member of an organization
    And no repository exists for the "organization" on GitHub
    And the visibility of the repository should be "Public"
    When the project is scaffolded
    Then a repository is created on GitHub
    And the .github directory was created
    And repository settings are configured
    And repository details are returned

  Scenario: user is a member of an organization and the private project is new
    Given an Octokit instance is provided
    And the user is a member of an organization
    And no repository exists for the "organization" on GitHub
    And the visibility of the repository should be "Private"
    When the project is scaffolded
    Then no error is thrown
    And a repository is created on GitHub
    And the .github directory was created
    And repository settings are configured
    And repository details are returned

  Scenario: user is a member of an organization and the repository exists
    Given an Octokit instance is provided
    And the user is a member of an organization
    And a repository already exists for the "organization" on GitHub
    When the project is scaffolded
    Then no repository is created on GitHub
    And the .github directory was created
    And repository settings are configured
    And repository details are returned

  Scenario: user is not a member of the organization
    Given an Octokit instance is provided
    And the user is not a member of the organization
    When the project is scaffolded
    Then no repository is created on GitHub
    And the .github directory does not exist
    And no repository settings are configured
    And and an authorization error is thrown

  Scenario: admin settings not managed by the repository-settings app
    Given an Octokit instance is provided
    And no repository exists for the "user" on GitHub
    And the visibility of the repository should be "Public"
    But the admin settings should not be managed by the repository-settings app
    When the project is scaffolded
    Then a repository is created on GitHub
    And the .github directory was created
    And repository details are returned
    And no repository settings are configured
