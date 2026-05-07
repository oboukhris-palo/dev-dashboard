# Iteration Planning

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-07  
**Status:** Active  
**Owner:** Product Owner, Project Manager

---

## Overview

This document defines the iteration/sprint planning for the Dev-Dashboard project, including MVP scope, phased rollout strategy, and release timeline.

---

## 1. MVP Definition

### MVP Scope (Release 0.1)
**Target:** Minimum viable product for personal use  
**Timeline:** 2-3 weeks (solo developer)  
**Goal:** Basic repository scanning and viewing with manual metadata editing

### MVP Features (Essential)
- ✅ **REPO-001-US-001**: Scan workspace directories (HIGH)
- ✅ **REPO-001-US-002**: Extract repository metadata (HIGH)
- ✅ **REPO-002-US-001**: Display repository list (HIGH)
- ✅ **REPO-003-US-001**: Edit repository description (HIGH)
- ✅ **REPO-003-US-003**: Persist metadata locally (HIGH)

### Deferred to Post-MVP
- ⏳ **REPO-001-US-003**: Detect technology stack (MEDIUM)
- ⏳ **REPO-002-US-002**: Interactive repository cards (MEDIUM)
- ⏳ **REPO-003-US-002**: Edit project phase and status (HIGH - quick win)
- ⏳ **REPO-004**: Deployment & Infrastructure (MEDIUM)

**Rationale:** MVP focuses on core value - discovering and viewing repositories with basic metadata. Tech stack detection and phase/status tracking can be added incrementally.

---

## 2. Phased Rollout Strategy

### Phase 1: MVP (Weeks 1-3)
**Goal:** Functional local tool for personal use  
**User Base:** Single developer (local only)  
**Features:** Repository scanning, display, basic editing, persistence

**Exit Criteria:**
- Can scan both workspace directories in < 5 seconds
- Can view all repositories in clean table
- Can edit descriptions and save locally
- No critical bugs
- Basic unit test coverage (60%+)

---

### Phase 2: Enhanced Features (Weeks 4-5)
**Goal:** Add convenience features for daily use  
**Features:**
- Technology stack detection (badges)
- Phase and status tracking (dropdowns)
- Interactive cards with hover effects
- Sorting and filtering

**Exit Criteria:**
- Tech stack accurately detected for 90%+ repositories
- Phase/status editing works smoothly
- UI polish complete (Material Design)
- Unit test coverage 70%+

---

### Phase 3: Polish & Deployment (Week 6)
**Goal:** Production-ready deployment to local Apache  
**Features:**
- Build WAR file
- Deploy to Apache service
- Auto-launch on system startup
- Performance optimization

**Exit Criteria:**
- WAR build successful (< 500KB gzipped)
- Deploys to Apache without errors
- Performance targets met (all NFRs)
- Unit test coverage 80%+
- E2E tests passing

---

### Phase 4: Continuous Improvement (Ongoing)
**Goal:** Incremental enhancements based on usage  
**Features:**
- Search/filter repositories
- Export repository list
- Custom tags/labels
- Statistics dashboard

**Timeline:** As needed, low priority

---

## 3. Sprint Structure

### Sprint Duration
**Length:** 1 week sprints (flexible for solo developer)  
**Cadence:** Start Monday, review/retrospective Friday  
**Velocity:** 3-5 user stories per sprint (varies by complexity)

---

### Sprint 1: Foundation & Scanning (May 8-14, 2026)
**Goal:** Repository discovery and metadata extraction working  
**Stories:**
- REPO-001-US-001: Scan workspace directories (3 days)
- REPO-001-US-002: Extract repository metadata (2 days)

**Deliverables:**
- RepositoryScannerService with unit tests
- MetadataExtractorService with unit tests
- Integration test: scan → extract flow
- BDD scenarios passing for both stories

**Success Criteria:**
- Scan completes in < 5 seconds for 50 repositories
- Metadata extracted correctly (name, path, description)
- Test coverage 80%+

---

### Sprint 2: Display & UI (May 15-21, 2026)
**Goal:** Display repositories in Material Design table  
**Stories:**
- REPO-002-US-001: Display repository list (3 days)
- Start REPO-003-US-001: Edit description (2 days)

**Deliverables:**
- RepositoryListComponent with unit tests
- Material Design table layout
- Sorting functionality
- Inline editing skeleton

**Success Criteria:**
- Table renders in < 1 second for 50 repositories
- Sorting works for all columns
- UI matches design system (Penpot)
- Test coverage 75%+

---

### Sprint 3: Editing & Persistence (May 22-28, 2026)
**Goal:** Complete editing and persistence functionality  
**Stories:**
- Complete REPO-003-US-001: Edit description
- REPO-003-US-003: Persist metadata locally (2 days)

**Deliverables:**
- Inline editing complete (double-click, save, cancel)
- LocalStorage persistence service
- State management (Elf or standalone)
- Integration test: edit → save → reload

**Success Criteria:**
- Edits save immediately
- Data persists across browser refresh
- No data loss
- Test coverage 80%+

---

### Sprint 4: Polish & Tech Stack (May 29 - June 4, 2026)
**Goal:** Add tech stack detection and polish UI  
**Stories:**
- REPO-001-US-003: Detect technology stack (2 days)
- REPO-003-US-002: Edit phase and status (2 days)
- UI polish and bug fixes (1 day)

**Deliverables:**
- Tech stack detector with badges
- Phase/status dropdowns
- UI refinements
- Performance optimization

**Success Criteria:**
- Tech stack detected accurately
- Phase/status editing works
- All NFRs met (performance, usability)
- Test coverage 80%+

---

### Sprint 5: Deployment (June 5-11, 2026)
**Goal:** Production deployment to local Apache  
**Stories:**
- REPO-004-US-001: Build production WAR file (2 days)
- REPO-004-US-002: Deploy to Apache service (2 days)
- E2E testing and bug fixes (1 day)

**Deliverables:**
- WAR build script
- Apache deployment documentation
- E2E tests passing
- User documentation (README)

**Success Criteria:**
- WAR deploys successfully
- Apache serves application correctly
- Auto-launch configured
- All tests passing

---

## 4. Release Timeline

### Release Schedule

| Release | Date | Features | Status |
|---------|------|----------|--------|
| **v0.1-alpha** | May 14, 2026 | Scanning + metadata extraction | ⏳ Sprint 1 |
| **v0.2-beta** | May 21, 2026 | Display + basic editing | ⏳ Sprint 2 |
| **v0.3-beta** | May 28, 2026 | Full editing + persistence | ⏳ Sprint 3 |
| **v0.4-rc** | June 4, 2026 | Tech stack + phase/status | ⏳ Sprint 4 |
| **v1.0** | June 11, 2026 | Production deployment | ⏳ Sprint 5 |

### Release Criteria
Each release must pass:
- ✅ All BDD scenarios for included stories
- ✅ Unit test coverage target met
- ✅ No critical bugs
- ✅ Performance targets met for included features
- ✅ Manual testing checklist completed

---

## 5. Feature Dependencies

### Critical Path
```
REPO-001-US-001 (Scan)
    ↓
REPO-001-US-002 (Extract Metadata)
    ↓
REPO-002-US-001 (Display List)
    ↓
REPO-003-US-001 (Edit Description)
    ↓
REPO-003-US-003 (Persist)
```

### Parallel Tracks
- **REPO-001-US-003** (Tech Stack) can be done anytime after US-001
- **REPO-003-US-002** (Phase/Status) can be done anytime after US-001
- **REPO-004** (Deployment) can be done anytime after v0.3-beta

See `dependency-graph.md` for detailed dependency mapping.

---

## 6. Risk Mitigation

### High-Risk Stories
1. **REPO-001-US-001** (Scanning) — Filesystem access, performance
   - **Mitigation:** Prototype early, use Node.js fs APIs, optimize with caching
   
2. **REPO-003-US-003** (Persistence) — LocalStorage quota limits
   - **Mitigation:** Use JSON compression, fallback to file system

3. **REPO-004-US-001** (WAR Build) — Packaging complexity
   - **Mitigation:** Use standard Angular build, simple WAR structure

See `risk-register.md` for complete risk analysis.

---

## 7. Sprint Ceremonies (Solo Developer)

### Daily Activities
- **Morning:** Review progress, plan day's work (15 min)
- **Afternoon:** Code review own work, run tests (30 min)
- **End of Day:** Commit code, update task board (15 min)

### Weekly Activities
- **Monday:** Sprint planning (1 hour)
- **Friday:** Sprint review + retrospective (1 hour)
  - What went well?
  - What can be improved?
  - Adjust next sprint accordingly

---

## 8. Success Metrics

### Sprint Velocity
- **Target:** 3-5 user stories per sprint
- **Measurement:** Completed stories / sprint
- **Goal:** Consistent velocity across sprints

### Quality Metrics
- **Test Coverage:** 80%+ (target met every sprint)
- **Bug Rate:** < 3 critical bugs per sprint
- **Performance:** All NFRs met (scan < 5s, render < 1s)

### Business Metrics
- **Time Savings:** 5-10 min/day after v1.0 release
- **ROI:** < 1 month payback
- **Adoption:** Daily use by developer (self)

See `success-criteria.md` for detailed KPIs.

---

## 9. Stakeholder Communication

### Solo Developer Project
- **Primary Stakeholder:** Developer (self)
- **Communication:** Weekly sprint reviews (self-reflection)
- **Feedback:** Dogfooding (daily use after v0.3-beta)

### Documentation Updates
- **README:** Updated with each release
- **CHANGELOG:** Track all changes
- **Architecture Docs:** Updated as needed

---

## 10. Contingency Planning

### Schedule Slippage
- **Risk:** Sprint goals not met
- **Response:** 
  - Move non-critical features to next sprint
  - Extend sprint by 1-2 days if needed
  - Re-prioritize backlog

### Technical Blockers
- **Risk:** Complex technical issues (filesystem, performance)
- **Response:**
  - Research/prototype solutions (allocate 1 day)
  - Simplify requirements if needed
  - Seek help (Stack Overflow, Angular community)

### Scope Creep
- **Risk:** Adding features during development
- **Response:**
  - Document new ideas in backlog
  - Evaluate for Phase 4 (post-v1.0)
  - Stay focused on MVP

---

## Appendix: Story Estimates

### Estimation Basis
- **Story Points:** T-shirt sizes (S, M, L)
- **Time Mapping:** S=1 day, M=2-3 days, L=4-5 days
- **Solo Developer:** Estimates include design, code, test, documentation

### Epic Estimates

| Epic | Stories | Estimated Time | Priority |
|------|---------|---------------|----------|
| REPO-001 (Discovery) | 3 | 7-8 days | High |
| REPO-002 (Display) | 2 | 5-6 days | High |
| REPO-003 (Management) | 3 | 6-7 days | High |
| REPO-004 (Deployment) | 2 | 4-5 days | Medium |
| **TOTAL** | **10** | **22-26 days** | — |

**Total Timeline:** 5-6 weeks (with buffer for testing, polish, bug fixes)

---

**Status:** ACTIVE | **Version:** 1.0 | **Last Updated:** 2026-05-07
