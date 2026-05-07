Feature: Technology Stack Detection
  As a developer
  I want the technology stack detected automatically
  So that I know what technologies are used without opening files

  Background:
    Given the scanner has discovered repositories
    And the tech stack detector service is initialized

  @REPO-001-US-003 @high-priority
  Scenario: Detect JavaScript/Node.js project
    Given a repository contains "package.json"
    When technology detection runs
    Then "Node.js" is added to the tech stack
    And the tech stack badge is displayed

  @REPO-001-US-003 @high-priority
  Scenario: Detect Angular project
    Given a repository contains "angular.json"
    When technology detection runs
    Then "Angular" is added to the tech stack
    And the Angular badge is displayed with color "#DD0031"

  @REPO-001-US-003 @high-priority
  Scenario: Detect multi-technology project
    Given a repository contains "package.json" and "requirements.txt"
    When technology detection runs
    Then "Node.js, Python" is displayed as the tech stack
    And both badges are shown

  @REPO-001-US-003 @medium-priority
  Scenario: Detect Java Maven project
    Given a repository contains "pom.xml"
    When technology detection runs
    Then "Java" is added to the tech stack
    And the Java badge is displayed with color "#0066CC"

  @REPO-001-US-003 @medium-priority
  Scenario: Detect .NET/C# project
    Given a repository contains "*.csproj" files
    When technology detection runs
    Then ".NET" is added to the tech stack
    And the .NET badge is displayed with color "#7B3FF2"

  @REPO-001-US-003 @medium-priority
  Scenario: Detect Python project
    Given a repository contains "requirements.txt" or "pyproject.toml"
    When technology detection runs
    Then "Python" is added to the tech stack
    And the Python badge is displayed

  @REPO-001-US-003 @edge-case
  Scenario: Handle repository with no detectable technology
    Given a repository has no recognizable technology files
    When technology detection runs
    Then the tech stack is empty
    And no badges are displayed
    And the repository still appears in the dashboard
