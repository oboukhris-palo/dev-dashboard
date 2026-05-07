Feature: Repository List Display
  As a developer
  I want to see all repositories in a clean, organized list
  So that I can quickly scan and find the project I need

  Background:
    Given repositories have been discovered and scanned
    And the dashboard component is loaded

  @REPO-002-US-001 @high-priority
  Scenario: Display all repositories
    Given 25 repositories have been discovered
    When the dashboard loads
    Then all 25 repositories are displayed in the table
    And each row shows name, description, path, dev stack, phase, and status
    And the table renders within 1 second

  @REPO-002-US-001 @high-priority
  Scenario: Sort repositories by name
    Given repositories are displayed
    When I click the "Name" column header
    Then repositories are sorted alphabetically by name (A-Z)
    When I click the "Name" column header again
    Then repositories are sorted reverse alphabetically (Z-A)

  @REPO-002-US-001 @medium-priority
  Scenario: Sort repositories by phase
    Given repositories have different phases (Planning, Development, Testing)
    When I click the "Phase" column header
    Then repositories are grouped and sorted by phase

  @REPO-002-US-001 @medium-priority
  Scenario: Sort repositories by status
    Given repositories have different statuses (Active, Paused, Completed)
    When I click the "Status" column header
    Then repositories are sorted by status

  @REPO-002-US-001 @responsive
  Scenario: Display adapts to screen size
    Given the dashboard is loaded
    When I resize the browser window to mobile size (375px)
    Then the layout switches to card view
    And all repository information is still visible
    And no horizontal scrolling is required
