Feature: Lift

  Scenario: lift settings and create issues for next steps
    Given the project is versioned on GitHub
    And netrc contains a GitHub token
    And the repository settings are managed by the settings app
    And the user is a member of an organization
    And a maintenance team exists in the organization
    And next steps are provided
    When the scaffolder results are processed
    Then properties are updated in the settings file
    And issues are created for next-steps

  Scenario: lift but settings not managed by the repository-settings app
    Given the project is versioned on GitHub
    But the repository settings are not managed by the settings app
    When the scaffolder results are processed
    Then no settings file exists

  Scenario: non-GitHub project
    Given the project is not versioned on GitHub
    When the scaffolder results are processed
    Then no settings file exists

  Scenario: no authentication
    Given the project is versioned on GitHub
    But no authentication is provided
    And next steps are provided
    When the scaffolder results are processed
    Then no issues are created for next-steps
