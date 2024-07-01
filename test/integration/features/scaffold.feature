Feature: Scaffolder

  Scenario: new repository
    Given netrc contains a GitHub token
    And no repository exists for the "user" on GitHub
#    And next steps are provided
    When the project is scaffolded
    Then a repository is created on GitHub
#    And issues are created for next-steps
#    And repository settings are configured
    And repository details are returned

  Scenario: existing repository
    Given netrc contains a GitHub token
    And a repository already exists for the "user" on GitHub
    When the project is scaffolded
    Then no repository is created on GitHub
    But repository details are returned
#    And repository settings are configured

  Scenario: no authentication
    Given no authentication is provided
#    And next steps are provided
    When the project is scaffolded
    Then no repository is created on GitHub
#    And no issues are created for next-steps
#    But repository settings are configured
    And no repository details are returned
