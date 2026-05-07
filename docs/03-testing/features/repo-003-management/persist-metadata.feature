Feature: Persist Repository Metadata Locally
  As a developer
  I want my edits to persist across sessions
  So that I don't lose my metadata changes

  Background:
    Given the application is running
    And I have a repository displayed

  @REPO-003-US-003 @high-priority
  Scenario: Persist edits after browser refresh
    Given I have edited a repository description to "Persistent description"
    And I have set the phase to "Development"
    And I have set the status to "Active"
    When I refresh the page
    Then the description is still "Persistent description"
    And the phase is still "Development"
    And the status is still "Active"

  @REPO-003-US-003 @high-priority
  Scenario: Persist across Apache service restart
    Given I have edited repository metadata
    When the Apache service is restarted
    And I reload the application
    Then all my edits are still present
    And the repositories display with updated metadata

  @REPO-003-US-003 @edge-case
  Scenario: Handle storage quota exceeded
    Given localStorage is nearly full
    When I attempt to save metadata edits
    Then the application detects the quota error
    And a warning message is displayed to the user
    And the application continues to function

  @REPO-003-US-003 @data-integrity
  Scenario: Metadata stored with repository path as key
    Given I have edited metadata for repository "/Users/oboukhris-palo/workspace/project-a"
    When I check localStorage
    Then the metadata is stored under key "/Users/oboukhris-palo/workspace/project-a"
    And the data includes description, phase, status, and lastUpdated timestamp

  @REPO-003-US-003 @data-integrity
  Scenario: Merge scanned data with stored metadata
    Given I have previously edited metadata for "project-a"
    And the metadata is stored in localStorage
    When I restart the application and scan repositories
    Then "project-a" is discovered by the scanner
    And the stored metadata (description, phase, status) is applied
    And the merged data is displayed in the dashboard
