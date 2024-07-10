Feature: Scaffolder

  Scenario: new public repository
    Given netrc contains a GitHub token
    And no repository exists for the "user" on GitHub
    And the visibility of the repository should be "Public"
    When the project is scaffolded
    Then a repository is created on GitHub
    And the .github directory was created
    And repository settings are configured
    And repository details are returned

  Scenario: new private repository
    Given netrc contains a GitHub token
    And no repository exists for the "user" on GitHub
    And the visibility of the repository should be "Private"
    When the project is scaffolded
    Then a repository is created on GitHub
    And the .github directory was created
    And repository settings are configured
    And repository details are returned

  Scenario: existing repository
    Given netrc contains a GitHub token
    And a repository already exists for the "user" on GitHub
    When the project is scaffolded
    Then no repository is created on GitHub
    But repository details are returned
    And the .github directory was created
    And repository settings are configured

  Scenario: no authentication
    Given no authentication is provided
    When the project is scaffolded
    Then no repository is created on GitHub
    But repository settings are configured
    And the .github directory was created
    And no repository details are returned

  Scenario: ~/.netrc contains no GitHub token
    Given netrc contains no GitHub token
    When the project is scaffolded
    Then no repository is created on GitHub
    But repository settings are configured
    And the .github directory was created
    And no repository details are returned

  Scenario: user is a member of an organization and the public project is new
    Given netrc contains a GitHub token
    And the user is a member of an organization
    And no repository exists for the "organization" on GitHub
    And the visibility of the repository should be "Public"
    When the project is scaffolded
    Then a repository is created on GitHub
    And the .github directory was created
    And repository settings are configured
    And repository details are returned

  Scenario: user is a member of an organization and the private project is new
    Given netrc contains a GitHub token
    And the user is a member of an organization
    And no repository exists for the "organization" on GitHub
    And the visibility of the repository should be "Private"
    When the project is scaffolded
    Then a repository is created on GitHub
    And the .github directory was created
    And repository settings are configured
    And repository details are returned

  Scenario: user is a member of an organization and the repository exists
    Given netrc contains a GitHub token
    And the user is a member of an organization
    And a repository already exists for the "organization" on GitHub
    When the project is scaffolded
    Then no repository is created on GitHub
    And the .github directory was created
    And repository settings are configured
    And repository details are returned

  Scenario: user is not a member of the organization
    Given netrc contains a GitHub token
    And the user is not a member of the organization
    When the project is scaffolded
    Then no repository is created on GitHub
    But the .github directory was created
    And no repository settings are configured
    And and an authorization error is thrown
