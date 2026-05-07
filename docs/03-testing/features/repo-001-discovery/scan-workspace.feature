Feature: Repository Discovery
  As a developer
  I want the application to automatically scan my workspace directories
  So that I can see all my code repositories without manual configuration

  Background:
    Given the application is loaded
    And the scanner service is initialized

  @REPO-001-US-001 @high-priority
  Scenario: Discover repositories in primary workspace
    Given the primary workspace is "/Users/oboukhris-palo/workspace"
    When the scanner runs on the primary workspace
    Then all directories containing ".git" folders are identified as repositories
    And each repository appears in the dashboard
    And the repositories are sorted alphabetically by name

  @REPO-001-US-001 @high-priority
  Scenario: Discover repositories in secondary workspace
    Given the secondary workspace is "/Users/oboukhris-palo/Documents/workspace"
    When the scanner runs on the secondary workspace
    Then all git repositories are discovered
    And repositories from both workspaces are combined in the list
    And the repositories are sorted alphabetically by name

  @REPO-001-US-001 @performance
  Scenario: Complete scan within performance target
    Given there are 100 repositories across both workspaces
    When the scanner runs on both workspaces
    Then the scan completes within 5 seconds
    And all 100 repositories are identified

  @REPO-001-US-001 @edge-case
  Scenario: Handle workspace directory that doesn't exist
    Given the workspace path is "/non/existent/path"
    When the scanner runs on this workspace
    Then an error message is displayed
    And the application continues to run
    And other valid workspaces are still scanned

  @REPO-001-US-001 @edge-case
  Scenario: Handle permission denied on workspace directory
    Given the workspace path exists but is not readable
    When the scanner runs on this workspace
    Then a warning is logged
    And the directory is skipped
    And the scan continues with other workspaces
