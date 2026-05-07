# Product Requirements Document

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-04  
**Status:** Draft

---

## 1. Overview

Dev-Dashboard is a local single-page Angular Material application for viewing and managing code repositories on the developer's laptop. It provides a simple CRUD interface without authentication, deployed to local Apache service.

---

## 2. Business Objectives

- **Developer Productivity**: Centralized view of all local code repositories
- **Repository Organization**: Track project status, tech stack, and development phase
- **Quick Access**: Easy navigation to project information and metadata

---

## 3. Functional Requirements

### FR-001: Repository Discovery
**Priority:** High  
**Description:** Automatically scan configured workspace directories to discover all code repositories.

**Acceptance Criteria:**
- Scan `/Users/oboukhris-palo/workspace`
- Scan `/Users/oboukhris-palo/Documents/workspace`
- Detect git repositories (presence of .git directory)
- Extract basic repository information

### FR-002: Repository Information Display
**Priority:** High  
**Description:** Display repository information in an interactive, easy-to-read format.

**Acceptance Criteria:**
- Show repository name, description, path
- Display dev stack (technologies used)
- Show project phase and status
- Material Design UI components
- Responsive table/card layout

### FR-003: Repository Metadata Management
**Priority:** High  
**Description:** Allow editing of repository metadata.

**Acceptance Criteria:**
- Editable description field
- Editable project phase field
- Editable status field
- Persist changes locally

### FR-004: README Parsing
**Priority:** Medium  
**Description:** Initialize repository descriptions from README.md files.

**Acceptance Criteria:**
- Read README.md from each repository
- Extract first paragraph or description section
- Use as default description value
- Handle missing README gracefully

### FR-005: Technology Stack Detection
**Priority:** Medium  
**Description:** Automatically detect technology stack from repository contents.

**Acceptance Criteria:**
- Detect package.json → Node.js/JavaScript
- Detect pom.xml → Java/Maven
- Detect *.csproj → .NET/C#
- Detect requirements.txt → Python
- Support multiple technologies per repository

---

## 4. Non-Functional Requirements

### NFR-001: Performance
- Repository scan completes within 5 seconds
- UI renders repository list within 1 second

### NFR-002: Usability
- Material Design for consistent UX
- Single-page application (no page refreshes)
- Intuitive inline editing

### NFR-003: Deployment
- Deploy as WAR file to local Apache
- Auto-launch with Apache service
- Local access only (no network exposure)

### NFR-004: Security
- No authentication required (local use)
- No external network calls
- File system access limited to configured paths

---

## 5. Constraints

- **Local Use Only**: No multi-user support, no authentication
- **Technology Stack**: Angular + Material Design
- **Deployment Target**: Apache service (WAR file)
- **Data Storage**: Local file system or browser storage
- **Workspace Paths**: Fixed to two directories

---

## 6. Success Metrics

- All repositories in workspace directories discovered
- Repository information displayed within 1 second
- Description editing persists correctly
- README parsing success rate > 80%
- Technology detection accuracy > 70%

---

## 7. Out of Scope

- Multi-user support
- Authentication/authorization
- Remote repository access
- Git operations (clone, pull, push)
- Repository creation/deletion
- Advanced analytics or reporting
