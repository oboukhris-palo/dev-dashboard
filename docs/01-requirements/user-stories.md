# User Stories

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-04  
**Status:** Draft

---

## Epic Structure

This document organizes user stories by epic following Jira-compatible schema.

---

## EPIC-001: Repository Discovery & Scanning

**Epic Key:** REPO-001  
**Epic Name:** Repository Discovery & Scanning  
**Description:** Automatically discover and scan code repositories from configured workspace directories  
**Priority:** High  
**Status:** To Do

### User Stories

#### REPO-001-US-001: Scan Workspace Directories

**Story Key:** REPO-001-US-001  
**Priority:** High  
**Status:** To Do

**User Story:**
> As a developer  
> I want the application to automatically scan my workspace directories  
> So that I can see all my code repositories without manual configuration

**Acceptance Criteria:**
- [ ] Application scans `/Users/oboukhris-palo/workspace` on load
- [ ] Application scans `/Users/oboukhris-palo/Documents/workspace` on load
- [ ] Scan detects presence of `.git` directory to identify repositories
- [ ] Scan completes within 5 seconds
- [ ] Repositories are sorted alphabetically by name

**BDD Scenarios:**
```gherkin
Feature: Repository Discovery

  Scenario: Discover repositories in primary workspace
    Given the application loads
    When the scanner runs on "/Users/oboukhris-palo/workspace"
    Then all directories containing ".git" folders are identified as repositories
    And each repository appears in the dashboard

  Scenario: Discover repositories in secondary workspace
    Given the application loads
    When the scanner runs on "/Users/oboukhris-palo/Documents/workspace"
    Then all git repositories are discovered
    And repositories from both workspaces are combined in the list
```

---

#### REPO-001-US-002: Extract Repository Metadata

**Story Key:** REPO-001-US-002  
**Priority:** High  
**Status:** To Do

**User Story:**
> As a developer  
> I want repository metadata extracted automatically  
> So that I don't have to manually enter basic information

**Acceptance Criteria:**
- [ ] Extract repository name from directory name
- [ ] Extract absolute path to repository
- [ ] Read README.md if present
- [ ] Extract first paragraph of README as default description
- [ ] Handle missing README files gracefully (empty description)

**BDD Scenarios:**
```gherkin
Feature: Metadata Extraction

  Scenario: Extract name and path
    Given a repository exists at "/Users/oboukhris-palo/workspace/my-project"
    When the scanner processes this repository
    Then the name is extracted as "my-project"
    And the path is stored as "/Users/oboukhris-palo/workspace/my-project"

  Scenario: Parse README for description
    Given a repository contains a README.md file
    And the README contains text content
    When metadata is extracted
    Then the first paragraph is used as the description
    And markdown formatting is stripped

  Scenario: Handle missing README
    Given a repository has no README.md file
    When metadata is extracted
    Then the description field is empty
    And no error is thrown
```

---

#### REPO-001-US-003: Detect Technology Stack

**Story Key:** REPO-001-US-003  
**Priority:** Medium  
**Status:** To Do

**User Story:**
> As a developer  
> I want the technology stack detected automatically  
> So that I know what technologies are used without opening files

**Acceptance Criteria:**
- [ ] Detect Node.js/JavaScript from `package.json`
- [ ] Detect Java/Maven from `pom.xml`
- [ ] Detect .NET/C# from `*.csproj` files
- [ ] Detect Python from `requirements.txt` or `pyproject.toml`
- [ ] Detect Angular from `angular.json`
- [ ] Support multiple technologies per repository (e.g., "Angular, Node.js")

**BDD Scenarios:**
```gherkin
Feature: Technology Stack Detection

  Scenario: Detect JavaScript project
    Given a repository contains "package.json"
    When technology detection runs
    Then "Node.js" is added to the tech stack

  Scenario: Detect Angular project
    Given a repository contains "angular.json"
    When technology detection runs
    Then "Angular" is added to the tech stack

  Scenario: Detect multi-technology project
    Given a repository contains "package.json" and "requirements.txt"
    When technology detection runs
    Then "Node.js, Python" is displayed as the tech stack
```

---

## EPIC-002: Repository Information Display

**Epic Key:** REPO-002  
**Epic Name:** Repository Information Display  
**Description:** Display repository information in an interactive, easy-to-read format using Material Design  
**Priority:** High  
**Status:** To Do

### User Stories

#### REPO-002-US-001: Display Repository List

**Story Key:** REPO-002-US-001  
**Priority:** High  
**Status:** To Do

**User Story:**
> As a developer  
> I want to see all repositories in a clean, organized list  
> So that I can quickly scan and find the project I need

**Acceptance Criteria:**
- [ ] Display repositories in Material Design table or card layout
- [ ] Show columns: Name, Description, Path, Dev Stack, Phase, Status
- [ ] List renders within 1 second after data loads
- [ ] UI is responsive and works on different screen sizes
- [ ] Table supports sorting by name, phase, and status

**BDD Scenarios:**
```gherkin
Feature: Repository List Display

  Scenario: Display all repositories
    Given 25 repositories have been discovered
    When the dashboard loads
    Then all 25 repositories are displayed in the table
    And each row shows name, description, path, dev stack, phase, and status

  Scenario: Sort repositories by name
    Given repositories are displayed
    When I click the "Name" column header
    Then repositories are sorted alphabetically by name
```

---

#### REPO-002-US-002: Interactive Repository Cards

**Story Key:** REPO-002-US-002  
**Priority:** Medium  
**Status:** To Do

**User Story:**
> As a developer  
> I want an interactive, easy-to-read interface  
> So that I can quickly understand project details

**Acceptance Criteria:**
- [ ] Use Material Design components (mat-table or mat-card)
- [ ] Hover effects indicate interactivity
- [ ] Click on repository row highlights it
- [ ] Path is displayed as truncated text with tooltip showing full path
- [ ] Technology stack displayed as chips/badges

**BDD Scenarios:**
```gherkin
Feature: Interactive Repository Display

  Scenario: Hover interaction
    Given repositories are displayed
    When I hover over a repository row
    Then the row highlights with subtle background color change

  Scenario: View full path on hover
    Given a repository has path "/Users/oboukhris-palo/workspace/long-project-name"
    When I hover over the truncated path
    Then a tooltip displays the full path
```

---

## EPIC-003: Repository Metadata Management

**Epic Key:** REPO-003  
**Epic Name:** Repository Metadata Management  
**Description:** Allow users to edit and persist repository metadata  
**Priority:** High  
**Status:** To Do

### User Stories

#### REPO-003-US-001: Edit Repository Description

**Story Key:** REPO-003-US-001  
**Priority:** High  
**Status:** To Do

**User Story:**
> As a developer  
> I want to edit repository descriptions  
> So that I can add or update project context

**Acceptance Criteria:**
- [ ] Double-click description field to enable editing
- [ ] Inline text input appears with current description
- [ ] Press Enter or click outside to save
- [ ] Press Escape to cancel editing
- [ ] Changes persist to local storage or file system

**BDD Scenarios:**
```gherkin
Feature: Description Editing

  Scenario: Edit description inline
    Given a repository is displayed with description "Old description"
    When I double-click the description field
    Then an editable text input appears with "Old description"

  Scenario: Save edited description
    Given I have edited a description to "New description"
    When I press Enter or click outside the field
    Then the description is saved as "New description"
    And the change persists after page reload

  Scenario: Cancel editing
    Given I am editing a description
    When I press Escape
    Then the original description is restored
    And no changes are saved
```

---

#### REPO-003-US-002: Edit Project Phase and Status

**Story Key:** REPO-003-US-002  
**Priority:** High  
**Status:** To Do

**User Story:**
> As a developer  
> I want to set project phase and status  
> So that I can track which projects are active, paused, or completed

**Acceptance Criteria:**
- [ ] Click phase field to show dropdown with options: "Planning", "Development", "Testing", "Production", "Maintenance", "Archived"
- [ ] Click status field to show dropdown with options: "Active", "Paused", "Blocked", "Completed", "Archived"
- [ ] Selected value saves immediately on selection
- [ ] Changes persist across sessions

**BDD Scenarios:**
```gherkin
Feature: Phase and Status Management

  Scenario: Change project phase
    Given a repository has phase "Planning"
    When I click the phase field
    And I select "Development" from the dropdown
    Then the phase is updated to "Development"
    And the change is saved

  Scenario: Change project status
    Given a repository has status "Active"
    When I click the status field
    And I select "Paused" from the dropdown
    Then the status is updated to "Paused"
    And the status indicator color changes accordingly
```

---

#### REPO-003-US-003: Persist Metadata Locally

**Story Key:** REPO-003-US-003  
**Priority:** High  
**Status:** To Do

**User Story:**
> As a developer  
> I want my edits to persist across sessions  
> So that I don't lose my metadata changes

**Acceptance Criteria:**
- [ ] All edits save to browser localStorage or local file
- [ ] Metadata persists after browser refresh
- [ ] Metadata persists after Apache service restart
- [ ] Handle storage quota gracefully

**BDD Scenarios:**
```gherkin
Feature: Metadata Persistence

  Scenario: Persist edits after refresh
    Given I have edited repository metadata
    When I refresh the page
    Then all my edits are still present

  Scenario: Persist across service restart
    Given I have edited repository metadata
    When the Apache service is restarted
    And I reload the application
    Then all my edits are still present
```

---

## EPIC-004: Deployment & Infrastructure

**Epic Key:** REPO-004  
**Epic Name:** Deployment & Infrastructure  
**Description:** Package and deploy application to local Apache service  
**Priority:** Medium  
**Status:** To Do

### User Stories

#### REPO-004-US-001: Build Production WAR File

**Story Key:** REPO-004-US-001  
**Priority:** Medium  
**Status:** To Do

**User Story:**
> As a developer  
> I want to build a production-ready WAR file  
> So that I can deploy to my local Apache service

**Acceptance Criteria:**
- [ ] Angular production build creates optimized bundle
- [ ] Build output is packaged as WAR file
- [ ] WAR file is self-contained (no external dependencies)
- [ ] Build script documented in README

**BDD Scenarios:**
```gherkin
Feature: Production Build

  Scenario: Build WAR file
    Given the Angular application source code
    When I run the production build command
    Then a WAR file is created in the output directory
    And the WAR file contains all necessary assets
```

---

#### REPO-004-US-002: Deploy to Apache Service

**Story Key:** REPO-004-US-002  
**Priority:** Medium  
**Status:** To Do

**User Story:**
> As a developer  
> I want the application deployed to my local Apache  
> So that it's always accessible when I need it

**Acceptance Criteria:**
- [ ] WAR file deploys to Apache webapps directory
- [ ] Application accessible at configured URL (e.g., http://localhost:8080/dev-dashboard)
- [ ] Application starts with Apache service
- [ ] Deployment script documented

**BDD Scenarios:**
```gherkin
Feature: Apache Deployment

  Scenario: Deploy to Apache
    Given a production WAR file
    When I deploy to Apache webapps directory
    Then the application is accessible at the configured URL

  Scenario: Auto-start with Apache
    Given the application is deployed
    When Apache service starts
    Then the application is automatically available
```

---

## Story Summary

| Epic | Stories | Priority | Status |
|------|---------|----------|--------|
| REPO-001: Repository Discovery & Scanning | 3 | High | To Do |
| REPO-002: Repository Information Display | 2 | High | To Do |
| REPO-003: Repository Metadata Management | 3 | High | To Do |
| REPO-004: Deployment & Infrastructure | 2 | Medium | To Do |
| **Total** | **10 stories** | - | - |

---

## Dependencies

- REPO-001 (Discovery) must complete before REPO-002 (Display)
- REPO-002 (Display) must complete before REPO-003 (Editing)
- REPO-004 (Deployment) can proceed independently

---

**Document Status:** Ready for Architecture Phase
