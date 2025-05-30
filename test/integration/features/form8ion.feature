Feature: github as form8ion plugin

  Scenario: plugin conventions
    Given an Octokit instance is provided
    And no repository exists for the "user" on GitHub
    And the user is a member of an organization
    When the project is scaffolded
    Then no error is thrown
    And the public interface is compatible with the plugin schema
    And the output produced by the scaffolder is detectable by the predicate
