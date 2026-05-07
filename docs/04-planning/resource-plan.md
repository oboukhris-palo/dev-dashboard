# Resource Plan

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-07  
**Status:** Active  
**Owner:** Project Manager

---

## Overview

This document defines the resource allocation, team structure, and capacity planning for the Dev-Dashboard project.

---

## 1. Team Structure

### Solo Developer Project
**Team Size:** 1 developer (full-time)  
**Duration:** 5-6 weeks (MVP + deployment)  
**Effort:** ~100-120 hours total

---

## 2. Role Assignments

### Developer (Solo)
**Name:** [Developer Name]  
**Role:** Full-Stack Developer (Angular + TypeScript)  
**Responsibilities:**
- Requirements analysis
- Architecture design
- Frontend development (Angular Material)
- Service layer implementation
- Testing (unit, integration, E2E)
- Documentation
- Deployment
- Maintenance

**Skills Required:**
- Angular 18+ (intermediate-advanced)
- TypeScript (intermediate)
- Material Design (basic)
- RxJS (basic-intermediate)
- Jasmine/Karma (basic)
- Playwright (basic)
- Git (basic)

**Availability:** 100% dedicated (20-25 hours/week)

---

## 3. Capacity Planning

### Weekly Capacity
**Available Hours:** 20-25 hours/week (part-time, 4-5 hours/day)  
**Productive Hours:** 18-22 hours/week (accounting for meetings, context switching)

### Sprint Capacity
**Sprint Duration:** 1 week  
**Available Effort:** 20-25 hours  
**Story Points:** 3-5 user stories (S-M sized)

### Total Project Capacity
**Total Weeks:** 5-6 weeks  
**Total Hours:** 100-150 hours  
**Total Story Points:** ~10 user stories

---

## 4. Sprint Resource Allocation

### Sprint 1: Foundation & Scanning (May 8-14, 2026)
**Effort:** 25 hours

| Task | Hours | Assignee | Notes |
|------|-------|----------|-------|
| Angular project setup | 3h | Developer | Material, Tailwind, Elf |
| FileSystemService | 2h | Developer | Filesystem utilities |
| RepositoryScannerService | 8h | Developer | Core scanning logic |
| MetadataExtractorService | 6h | Developer | README parsing |
| Unit tests | 4h | Developer | TDD approach |
| Integration tests | 2h | Developer | Scan → extract flow |

**Deliverables:**
- ✅ RepositoryScannerService (tested)
- ✅ MetadataExtractorService (tested)
- ✅ Test coverage 80%+

---

### Sprint 2: Display & UI (May 15-21, 2026)
**Effort:** 25 hours

| Task | Hours | Assignee | Notes |
|------|-------|----------|-------|
| DashboardComponent | 3h | Developer | Page layout |
| RepositoryListComponent | 8h | Developer | Material table + sorting |
| Material Design styling | 3h | Developer | Match Penpot design |
| Inline editing skeleton | 4h | Developer | Double-click to edit |
| Unit tests | 5h | Developer | Component tests |
| Integration tests | 2h | Developer | Display flow |

**Deliverables:**
- ✅ Repository list displays correctly
- ✅ Sorting works
- ✅ UI matches design system

---

### Sprint 3: Editing & Persistence (May 22-28, 2026)
**Effort:** 25 hours

| Task | Hours | Assignee | Notes |
|------|-------|----------|-------|
| EditableFieldComponent | 6h | Developer | Reusable edit field |
| RepositoryStore (Elf) | 4h | Developer | State management |
| PersistenceService | 6h | Developer | localStorage logic |
| Unit tests | 5h | Developer | Component + service tests |
| Integration tests | 4h | Developer | Edit → save → reload |

**Deliverables:**
- ✅ Inline editing complete
- ✅ Data persists across sessions
- ✅ No data loss

---

### Sprint 4: Polish & Tech Stack (May 29 - June 4, 2026)
**Effort:** 25 hours

| Task | Hours | Assignee | Notes |
|------|-------|----------|-------|
| TechStackDetectorService | 6h | Developer | Detect Node.js, Angular, etc. |
| Phase/Status dropdowns | 6h | Developer | Material select components |
| Tech stack badges | 3h | Developer | Material chips |
| UI polish | 4h | Developer | Responsive, hover effects |
| Bug fixes | 4h | Developer | Fix any issues |
| Unit tests | 2h | Developer | New features |

**Deliverables:**
- ✅ Tech stack detection working
- ✅ Phase/status editing working
- ✅ UI polished

---

### Sprint 5: Deployment (June 5-11, 2026)
**Effort:** 25 hours

| Task | Hours | Assignee | Notes |
|------|-------|----------|-------|
| WAR build script | 4h | Developer | Angular → WAR |
| Apache configuration | 4h | Developer | Virtual host, routing |
| Deployment automation | 3h | Developer | deploy.sh script |
| E2E tests (Playwright) | 8h | Developer | BDD scenarios |
| Documentation | 4h | Developer | README, CHANGELOG |
| Final testing | 2h | Developer | Smoke tests |

**Deliverables:**
- ✅ WAR deploys to Apache
- ✅ E2E tests passing
- ✅ Documentation complete

---

## 5. External Dependencies

### No External Team Members
**Status:** Solo project, no dependencies on other teams

### Tools & Services (All Free/Open-Source)
- **Angular CLI:** Free (npm package)
- **Material Design:** Free (Angular Material)
- **Playwright:** Free (npm package)
- **Apache:** Pre-installed on macOS
- **Node.js:** Free (already installed)
- **Git:** Free (version control)

**Cost:** $0 (no paid tools or services)

---

## 6. Skills Matrix

### Required Skills

| Skill | Level Required | Developer Level | Gap | Mitigation |
|-------|---------------|-----------------|-----|------------|
| Angular | Intermediate | Intermediate | None | - |
| TypeScript | Intermediate | Intermediate | None | - |
| Material Design | Basic | Basic | None | Use documentation |
| RxJS | Basic | Basic | None | Use simple patterns |
| Jasmine/Karma | Basic | Basic | None | Use Angular defaults |
| Playwright | Basic | Beginner | Small | Learn via tutorials |
| Elf State Mgmt | Basic | Beginner | Small | Use documentation |
| Apache Config | Basic | Beginner | Small | Research during Sprint 5 |

**Overall:** No significant skill gaps

---

## 7. Training & Learning

### Learning Budget
**Time Allocated:** 5-10 hours (included in sprints)  
**Topics:**
- Playwright E2E testing (2-3 hours, Sprint 5)
- Elf state management (2-3 hours, Sprint 3)
- Apache configuration (2-3 hours, Sprint 5)

**Method:**
- Online documentation
- Tutorials (YouTube, blogs)
- Stack Overflow
- Trial and error

---

## 8. Risk Mitigation

### Risk: Developer Unavailable
**Probability:** Low  
**Impact:** High (project stalls)  
**Mitigation:**
- Keep code well-documented
- Commit frequently to Git
- Maintain clear README
- Can resume work later if interrupted

---

### Risk: Skill Gap (Playwright, Apache)
**Probability:** Medium  
**Impact:** Medium (delays Sprint 5)  
**Mitigation:**
- Allocate learning time in Sprint 5
- Use simple configurations
- Research ahead of time (Sprint 4)

---

### Risk: Scope Creep
**Probability:** Medium (solo developer, personal project)  
**Impact:** Medium (timeline extends)  
**Mitigation:**
- Stick to MVP scope
- Document new ideas for Phase 4
- Regular sprint reviews

---

## 9. Communication Plan

### Solo Developer Communication
**Internal:** Daily self-reflection (5-10 min)  
**Weekly:** Sprint review/retrospective (1 hour)

### Documentation Updates
**Frequency:** As needed  
**Artifacts:**
- README (each release)
- CHANGELOG (each deployment)
- Architecture docs (when design changes)

### Stakeholder Communication
**Stakeholder:** Self (developer is also user)  
**Frequency:** Continuous (dogfooding after Sprint 3)

---

## 10. Contingency Planning

### Timeline Slippage
**Scenario:** Sprint goals not met  
**Response:**
- Extend sprint by 1-2 days
- Move non-critical features to next sprint
- Re-prioritize backlog

**Example:**
- If Sprint 1 takes 4 days instead of 3, delay Sprint 2 start by 1 day
- If tech stack detection takes too long, move to Sprint 5

---

### Unexpected Blockers
**Scenario:** Technical issues (filesystem access, performance)  
**Response:**
- Allocate 1 day for research/prototyping
- Simplify requirements if needed
- Seek help (Stack Overflow, Angular community)

**Example:**
- If scanning performance is poor, research caching strategies
- If localStorage quota is an issue, switch to IndexedDB

---

## 11. Resource Utilization

### Expected Utilization
**Target:** 80-90% productive time  
**Actual:** Track via sprint retrospectives

### Time Allocation (Typical Week)
- **Coding:** 60% (12-15 hours)
- **Testing:** 20% (4-5 hours)
- **Documentation:** 10% (2-3 hours)
- **Planning/Review:** 10% (2-3 hours)

---

### Productivity Metrics
**Story Points Completed:** 3-5 per sprint  
**Test Coverage:** 80%+ maintained  
**Bug Rate:** < 3 critical bugs per sprint  
**Velocity:** Consistent across sprints

---

## 12. Post-Launch Support

### Maintenance (Post-v1.0)
**Effort:** 2-4 hours/month  
**Activities:**
- Dependency updates (npm audit)
- Bug fixes (if any)
- Minor enhancements (Phase 4)

**Schedule:** Ad-hoc, as needed

---

### Future Enhancements
**Effort:** TBD (Phase 4)  
**Funded By:** Personal time (low priority)

**Examples:**
- Search/filter repositories
- Export repository list
- Custom tags/labels
- Statistics dashboard

---

## 13. Resource Summary

### Total Effort Estimate
**Minimum:** 100 hours (5 weeks @ 20 hours/week)  
**Expected:** 125 hours (5 weeks @ 25 hours/week)  
**Maximum:** 150 hours (6 weeks @ 25 hours/week)

### Resource Cost
**Labor:** $0 (personal project)  
**Tools:** $0 (all free/open-source)  
**Infrastructure:** $0 (local deployment)  
**Total Project Cost:** $0

### Resource Efficiency
**ROI:** High (5-10 min/day savings after 1 month)  
**Payback Period:** < 1 month  
**Lifetime Value:** Ongoing daily use

---

## 14. Approval & Sign-Off

### Resource Plan Approved By
- **Developer:** [Name] — Date: 2026-05-07
- **Stakeholder:** Self — Date: 2026-05-07

### Change Control
**Process:** Update this document when sprint plans change  
**Notification:** Self-aware (solo project)

---

**Status:** ACTIVE | **Version:** 1.0 | **Last Updated:** 2026-05-07
