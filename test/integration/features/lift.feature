Feature: Lift

  Scenario: lift settings
    Given the project is versioned on GitHub
    And the repository settings are managed by the settings app
    When the scaffolder results are processed
    Then properties are updated in the settings file

  Scenario: lift but settings not managed by the repository-settings app
    Given the project is versioned on GitHub
    But the repository settings are not managed by the settings app
    When the scaffolder results are processed
    Then no settings file exists

  Scenario: non-GitHub project
    Given the project is not versioned on GitHub
    When the scaffolder results are processed
    Then no settings file exists
