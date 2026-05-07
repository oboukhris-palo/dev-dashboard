---
generated_from_template: epic-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
epic_key: REPO-004
project_key: dev-dashboard
epic_name: Deployment & Infrastructure
priority: Medium
status: To Do
---

# EPIC-004: Deployment & Infrastructure

## Epic Overview

**Epic Key:** REPO-004  
**Epic Name:** Deployment & Infrastructure  
**Priority:** Medium  
**Status:** To Do

**Objective:**  
Package and deploy the application to local Apache service to enable always-available access without manual startup and ensure production-ready distribution.

**Business Context:**  
The application runs locally on the developer's laptop but should be as accessible as any web application. Deploying to Apache eliminates manual startup steps and ensures the application is available whenever the laptop is running. WAR file packaging provides a standard, self-contained deployment artifact.

**Success Criteria:**
- ✅ Angular production build creates optimized, minified bundle
- ✅ Build output is packaged as WAR file
- ✅ WAR deploys to Apache webapps directory
- ✅ Application accessible at http://localhost:8080/dev-dashboard
- ✅ Application starts automatically with Apache service
- ✅ Build and deployment scripts are documented

---

## Scope

### Features Included
1. **Production Build** - Angular AOT compilation, minification, tree-shaking
2. **WAR Packaging** - Bundle all assets into deployable WAR file
3. **Apache Deployment** - Copy WAR to Apache webapps directory
4. **Auto-Start Configuration** - Configure Apache to serve application on startup
5. **Build Automation** - Scripts for one-command build and deploy

### Functional Boundaries
- **In Scope**: Production build, WAR packaging, local Apache deployment, auto-start configuration
- **Out of Scope**: Docker containerization, cloud deployment, CI/CD pipelines, multi-environment configuration

---

## User Stories

| Story Key | Title | Status | Story Points | Priority |
|-----------|-------|--------|--------------|----------|
| REPO-004-US-001 | Build Production WAR File | To Do | 5 | Medium |
| REPO-004-US-002 | Deploy to Apache Service | To Do | 3 | Medium |

**Total Story Points:** 8

---

## Dependencies

### Internal Dependencies
- **REPO-001, REPO-002, REPO-003** - Core features must be implemented before deployment
  - Functional application required for deployment

### External Dependencies
- Apache HTTP Server (or Tomcat) installed on developer's laptop
- Java JDK (if using Tomcat for WAR deployment)
- Node.js and npm for Angular build
- Angular CLI for production build

### Can Run In Parallel With
- This epic can proceed independently once core features are implemented
- Does not block other epics

---

## Timeline

**Target Start:** Week 7 (after core features complete)  
**Target Completion:** End of Sprint 4 (Week 8)

**Milestones:**
- Week 7: REPO-004-US-001 (Production Build) + WAR packaging
- Week 8: REPO-004-US-002 (Apache Deployment) + Documentation

---

## Related Documents

- [Architecture Design](../../02-architecture/architecture-design.md) - Deployment architecture and infrastructure setup
- [Tech Spec](../../02-architecture/tech-spec.md) - Build configuration and deployment scripts
- [Deployment Plan](../../04-planning/deployment-plan.md) - Detailed deployment steps and rollback procedures
- [User Stories (PRD)](../../01-requirements/user-stories.md) - Complete user story definitions

---

## Technical Constraints

- **Build Time**: Production build must complete in < 2 minutes
- **Bundle Size**: Final bundle size < 5MB (uncompressed)
- **Compatibility**: Apache HTTP Server 2.4+ OR Tomcat 9+
- **No Backend Dependency**: Application is fully client-side (no backend server required)
- **File System Access**: Application must access local file system for repository scanning (Node.js backend may be required)

---

## Acceptance Criteria (Epic-Level)

- [ ] Both user stories pass their BDD scenarios
- [ ] Production build completes successfully with no errors
- [ ] WAR file is self-contained (all assets included)
- [ ] Application accessible at configured URL
- [ ] Application starts automatically with Apache service
- [ ] Build and deployment scripts documented in README
- [ ] Deployment tested on clean Apache installation
