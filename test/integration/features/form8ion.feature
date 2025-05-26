Feature: github as form8ion plugin

  Scenario: plugin conventions
    Given an Octokit instance is provided
    When the project is scaffolded
    Then the public interface is compatible with the plugin schema
    And the output produced by the scaffolder is detectable by the predicate
