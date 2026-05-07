Feature: Edit Repository Description
  As a developer
  I want to edit repository descriptions
  So that I can add or update project context

  Background:
    Given repositories are displayed in the dashboard
    And I have located a repository with description "Old description"

  @REPO-003-US-001 @high-priority
  Scenario: Edit description inline
    Given a repository is displayed with description "Old description"
    When I double-click the description field
    Then an editable text input appears with "Old description"
    And the input has focus
    And I can type to modify the text

  @REPO-003-US-001 @high-priority
  Scenario: Save edited description with Enter key
    Given I have edited a description to "New description"
    When I press Enter
    Then the description is saved as "New description"
    And the input field closes
    And the updated description is displayed
    And the change persists after page reload

  @REPO-003-US-001 @high-priority
  Scenario: Save edited description by clicking outside
    Given I am editing a description
    And I have changed the text to "Updated description"
    When I click outside the input field
    Then the description is saved as "Updated description"
    And the input field closes

  @REPO-003-US-001 @high-priority
  Scenario: Cancel editing with Escape key
    Given I am editing a description
    And I have changed the text
    When I press Escape
    Then the original description is restored
    And no changes are saved
    And the input field closes

  @REPO-003-US-001 @edge-case
  Scenario: Save empty description
    Given I am editing a description
    When I clear all text and press Enter
    Then the description is saved as empty
    And no error is shown

  @REPO-003-US-001 @edge-case
  Scenario: Edit very long description
    Given I am editing a description
    When I enter a description with 500 characters
    Then the full text is saved
    And the text is displayed with truncation and tooltip if needed
