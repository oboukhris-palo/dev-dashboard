Feature: Edit Project Phase and Status
  As a developer
  I want to set project phase and status
  So that I can track which projects are active, paused, or completed

  Background:
    Given repositories are displayed in the dashboard

  @REPO-003-US-002 @high-priority
  Scenario: Change project phase
    Given a repository has phase "Planning"
    When I click the phase field
    Then a dropdown appears with options:
      | Planning     |
      | Development  |
      | Testing      |
      | Production   |
      | Maintenance  |
      | Archived     |
    When I select "Development" from the dropdown
    Then the phase is updated to "Development"
    And the change is saved immediately
    And the dropdown closes

  @REPO-003-US-002 @high-priority
  Scenario: Change project status
    Given a repository has status "Active"
    When I click the status field
    Then a dropdown appears with options:
      | Active    |
      | Paused    |
      | Blocked   |
      | Completed |
      | Archived  |
    When I select "Paused" from the dropdown
    Then the status is updated to "Paused"
    And the status indicator color changes to orange
    And the change is saved immediately

  @REPO-003-US-002 @visual
  Scenario: Status colors reflect state
    Given repositories have different statuses
    Then "Active" status is displayed with green indicator
    And "Paused" status is displayed with orange indicator
    And "Blocked" status is displayed with red indicator
    And "Completed" status is displayed with gray indicator
    And "Archived" status is displayed with dark gray indicator

  @REPO-003-US-002 @keyboard
  Scenario: Keyboard navigation for dropdowns
    Given a repository is displayed
    When I tab to the phase field and press Enter
    Then the dropdown opens
    When I use arrow keys to navigate options
    And I press Enter to select an option
    Then the selected value is saved
