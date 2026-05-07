# Risk Register

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-07  
**Status:** Active  
**Owner:** Project Manager, Dev-Lead

---

## Overview

This document identifies, assesses, and tracks risks for the Dev-Dashboard project, along with mitigation strategies and contingency plans.

---

## 1. Risk Assessment Matrix

### Risk Severity Scale
- **Probability:** Low (< 25%), Medium (25-75%), High (> 75%)
- **Impact:** Low (minor delay), Medium (1-2 week delay), High (project failure)
- **Priority:** Critical (address immediately), High (monitor closely), Medium (track), Low (accept)

---

## 2. Technical Risks

### RISK-T001: Repository Scan Performance
**Category:** Technical — Performance  
**Description:** Scanning 100+ repositories takes longer than 5-second target

**Probability:** Medium (40%)  
**Impact:** High (blocks MVP)  
**Priority:** Critical  
**Phase:** Sprint 1

**Root Causes:**
- Inefficient filesystem I/O
- Synchronous scanning (blocking)
- Large repositories with many files
- Multiple workspace directories

**Mitigation Strategies:**
1. **Prototype Early:** Test scanning logic on Day 1 of Sprint 1
2. **Async/Parallel:** Use Node.js async APIs, scan workspaces in parallel
3. **Caching:** Cache repository list, only re-scan on demand
4. **Optimization:** Skip .git/objects directory (not needed for detection)
5. **Web Workers:** Offload scanning to background thread

**Contingency Plan:**
- If target not met after Sprint 1: Allocate Sprint 2 for optimization
- If still problematic: Reduce scope (scan 50 repos instead of 100)
- Worst case: Manual repository addition (fallback feature)

**Status:** Open  
**Owner:** Developer  
**Target Resolution:** End of Sprint 1

---

### RISK-T002: LocalStorage Quota Exceeded
**Category:** Technical — Storage  
**Description:** LocalStorage quota (5-10MB) exceeded with many repositories

**Probability:** Low (20%)  
**Impact:** Medium (data loss, user frustration)  
**Priority:** Medium  
**Phase:** Sprint 3

**Root Causes:**
- Storing large metadata objects
- Many repositories (100+)
- Browser localStorage limits (5MB typical)

**Mitigation Strategies:**
1. **JSON Compression:** Use gzip or LZString compression
2. **Minimal Storage:** Store only edited metadata (description, phase, status)
3. **IndexedDB Fallback:** Switch to IndexedDB if localStorage full
4. **File System Fallback:** Write to file (~/.dev-dashboard/metadata.json)
5. **Quota Monitoring:** Check storage usage, warn user at 80%

**Contingency Plan:**
- If quota exceeded: Migrate to IndexedDB automatically
- If IndexedDB unavailable: Fallback to filesystem (Electron/Tauri)
- Worst case: Limit to 50 repositories with metadata

**Status:** Open  
**Owner:** Developer  
**Target Resolution:** Sprint 3, Day 1 (prototype storage solution)

---

### RISK-T003: WAR Packaging Complexity
**Category:** Technical — Deployment  
**Description:** Angular app → WAR file packaging fails or is overly complex

**Probability:** Medium (30%)  
**Impact:** Low (delays deployment, not blocking MVP)  
**Priority:** Low  
**Phase:** Sprint 5

**Root Causes:**
- Unfamiliarity with WAR structure
- Angular routing not working in WAR
- Apache configuration issues

**Mitigation Strategies:**
1. **Research Early:** Study WAR structure in Sprint 4
2. **Simple Approach:** Use standard Angular build + JAR packaging
3. **Apache Rewrite:** Configure mod_rewrite for SPA routing
4. **Alternative:** Deploy as static files (no WAR needed)

**Contingency Plan:**
- If WAR packaging fails: Deploy as static files in Apache DocumentRoot
- Use symbolic link to dist/ folder (no copying needed)
- Worst case: Run via `ng serve` locally (development mode)

**Status:** Open  
**Owner:** Developer  
**Target Resolution:** Sprint 5, Day 1 (research and prototype)

---

### RISK-T004: Browser Compatibility Issues
**Category:** Technical — UI/UX  
**Description:** Application doesn't work correctly in Firefox or Safari

**Probability:** Low (15%)  
**Impact:** Low (minor functionality issues)  
**Priority:** Low  
**Phase:** Sprint 4-5

**Root Causes:**
- Browser-specific APIs
- CSS differences
- JavaScript inconsistencies

**Mitigation Strategies:**
1. **Use Standard APIs:** Stick to well-supported Web APIs
2. **Angular Material:** Use Material components (cross-browser tested)
3. **Polyfills:** Include Angular polyfills
4. **Test Early:** Test in Chrome (primary), Firefox (secondary)

**Contingency Plan:**
- If issues found: Fix critical bugs for Chrome only (primary browser)
- Document browser compatibility (Chrome 130+)
- Accept limited support for Safari/Firefox

**Status:** Open  
**Owner:** Developer  
**Target Resolution:** Sprint 5 (testing phase)

---

## 3. Project Management Risks

### RISK-PM001: Scope Creep
**Category:** Project Management  
**Description:** Adding features beyond MVP during development

**Probability:** Medium (50%)  
**Impact:** Medium (timeline extends 1-2 weeks)  
**Priority:** Medium  
**Phase:** All sprints

**Root Causes:**
- Solo developer (no external accountability)
- Personal project (temptation to add features)
- "Just one more feature" mindset

**Mitigation Strategies:**
1. **Stick to MVP:** Review MVP scope at start of each sprint
2. **Backlog Discipline:** Document new ideas in Phase 4 backlog
3. **Sprint Commitment:** Commit to sprint plan, no mid-sprint additions
4. **Weekly Review:** Ask "Is this MVP?" before adding features

**Contingency Plan:**
- If scope creeps: Cut features, extend timeline, or accept MVP+
- Defer non-critical features to post-v1.0
- Accept 6-week timeline instead of 5-week

**Status:** Open  
**Owner:** Developer (self-discipline)  
**Target Resolution:** Ongoing (weekly reviews)

---

### RISK-PM002: Timeline Slippage
**Category:** Project Management  
**Description:** Sprints take longer than planned (1 week → 1.5 weeks)

**Probability:** Medium (40%)  
**Impact:** Medium (v1.0 delayed by 1-2 weeks)  
**Priority:** Medium  
**Phase:** All sprints

**Root Causes:**
- Optimistic estimates
- Unexpected complexity
- Learning curve (Playwright, Elf, Apache)
- Other commitments (day job, personal life)

**Mitigation Strategies:**
1. **Buffer Time:** Plan for 5-6 weeks, not 4-5 weeks
2. **Flexible Sprints:** Allow 1-2 day extensions if needed
3. **Cut Scope:** Move Phase/Status editing to Sprint 6 if tight
4. **Time Tracking:** Track actual hours vs. estimated

**Contingency Plan:**
- If Sprint 1 overruns: Extend by 2 days, delay Sprint 2 start
- If multiple sprints overrun: Cut REPO-002-US-002 (Interactive Cards)
- Worst case: v1.0 in 7-8 weeks instead of 5-6 weeks

**Status:** Open  
**Owner:** Developer  
**Target Resolution:** Weekly sprint reviews

---

### RISK-PM003: Developer Unavailability
**Category:** Project Management  
**Description:** Developer unable to work due to illness, other commitments

**Probability:** Low (10%)  
**Impact:** High (project stalls)  
**Priority:** Low  
**Phase:** Any time

**Root Causes:**
- Single developer (no backup)
- Personal circumstances
- Day job conflicts

**Mitigation Strategies:**
1. **Flexible Timeline:** No hard deadlines (personal project)
2. **Documentation:** Keep README and docs up to date
3. **Git Commits:** Commit frequently, clear commit messages
4. **Resume Anytime:** Project can pause and resume

**Contingency Plan:**
- If unavailable 1-2 weeks: Pause project, resume later
- If unavailable > 1 month: Accept delay, adjust timeline
- Worst case: Project remains in current state until resumed

**Status:** Open  
**Owner:** N/A (external factor)  
**Target Resolution:** Accept risk

---

## 4. User Experience Risks

### RISK-UX001: Poor Performance (User Perception)
**Category:** User Experience  
**Description:** Application feels slow even if meets technical requirements

**Probability:** Low (20%)  
**Impact:** Medium (user abandons tool)  
**Priority:** Medium  
**Phase:** Sprint 2-4

**Root Causes:**
- Perceived performance vs. actual performance
- UI lag during operations
- Lack of loading indicators

**Mitigation Strategies:**
1. **Loading Indicators:** Show spinners during scan, save operations
2. **Optimistic Updates:** Update UI immediately, persist in background
3. **Smooth Animations:** Use Material Design animations
4. **Feedback:** Visual feedback for all user actions

**Contingency Plan:**
- If users complain: Add progress bars, loading states
- Optimize perceived performance (UI tricks)
- Worst case: Accept slower feel, focus on functionality

**Status:** Open  
**Owner:** Developer  
**Target Resolution:** Sprint 4 (polish phase)

---

### RISK-UX002: Confusing UI/UX
**Category:** User Experience  
**Description:** User doesn't understand how to use the application

**Probability:** Low (15%)  
**Impact:** Low (requires documentation/tutorials)  
**Priority:** Low  
**Phase:** Sprint 5

**Root Causes:**
- Lack of onboarding
- Non-intuitive interactions
- Missing help text

**Mitigation Strategies:**
1. **Simple Design:** Follow Material Design patterns (familiar)
2. **Tooltips:** Add tooltips for unclear elements
3. **Empty State:** Show helpful message when no repositories found
4. **README:** Document usage in README

**Contingency Plan:**
- If confusing: Add tooltips, help text
- Create video tutorial (1-2 min screen recording)
- Worst case: Accept learning curve (personal tool)

**Status:** Open  
**Owner:** Developer  
**Target Resolution:** Sprint 5 (documentation)

---

## 5. Security Risks

### RISK-S001: XSS Vulnerability
**Category:** Security  
**Description:** Cross-site scripting via repository metadata

**Probability:** Low (10%)  
**Impact:** Low (local use only, no network exposure)  
**Priority:** Low  
**Phase:** Sprint 2-3

**Root Causes:**
- Displaying user-edited descriptions without sanitization
- Reading README content without escaping

**Mitigation Strategies:**
1. **Angular Sanitization:** Use Angular DomSanitizer
2. **Avoid innerHTML:** Use Angular templates (automatic escaping)
3. **Security Tests:** Test with malicious input (`<script>alert("XSS")</script>`)
4. **ESLint Security:** Enable ESLint security plugin

**Contingency Plan:**
- If XSS found: Fix immediately (sanitize all user input)
- Low priority since local use only (no remote attackers)

**Status:** Open  
**Owner:** Developer  
**Target Resolution:** Sprint 3 (code review)

---

### RISK-S002: Path Traversal Attack
**Category:** Security  
**Description:** Malicious path input accesses unintended files

**Probability:** Low (5%)  
**Impact:** Low (local filesystem only, user owns files)  
**Priority:** Low  
**Phase:** Sprint 1

**Root Causes:**
- User can edit repository paths
- Filesystem scanning without validation

**Mitigation Strategies:**
1. **Path Validation:** Reject paths with `..` or absolute paths outside workspaces
2. **Sandboxing:** Only scan configured workspace directories
3. **Unit Tests:** Test with malicious paths (`../../etc/passwd`)

**Contingency Plan:**
- If vulnerability found: Add path validation
- Low priority (solo user, local files)

**Status:** Open  
**Owner:** Developer  
**Target Resolution:** Sprint 1 (unit tests)

---

### RISK-S003: Dependency Vulnerabilities
**Category:** Security  
**Description:** npm dependencies have known CVEs

**Probability:** Medium (30%)  
**Impact:** Low (local use, no network exposure)  
**Priority:** Low  
**Phase:** All sprints

**Root Causes:**
- Third-party dependencies
- Outdated packages

**Mitigation Strategies:**
1. **npm audit:** Run weekly, fix critical/high vulnerabilities
2. **Dependabot:** Enable GitHub Dependabot (auto PRs)
3. **Minimal Dependencies:** Use only necessary packages

**Contingency Plan:**
- If critical vulnerability: Update dependency immediately
- If update breaks app: Find alternative package
- Worst case: Accept risk (local use only)

**Status:** Open  
**Owner:** Developer  
**Target Resolution:** Ongoing (weekly audits)

---

## 6. Business Risks

### RISK-B001: Low ROI (Not Used Daily)
**Category:** Business  
**Description:** Tool not used daily, ROI < 1 month not achieved

**Probability:** Low (20%)  
**Impact:** Low (time wasted, but learning experience)  
**Priority:** Low  
**Phase:** Post-v1.0

**Root Causes:**
- Tool doesn't solve actual pain point
- Easier to use `ls` or Finder
- Workflow doesn't integrate

**Mitigation Strategies:**
1. **Dogfooding:** Use tool daily starting Sprint 3
2. **Feedback Loop:** Adjust features based on usage
3. **Low Barrier:** Make tool easy to launch (auto-start)

**Contingency Plan:**
- If not used daily: Simplify features, improve UX
- If still not used: Accept as learning project
- Worst case: Archive project, move on

**Status:** Open  
**Owner:** Developer (as user)  
**Target Resolution:** 1 month post-v1.0 (measure usage)

---

## 7. Risk Tracking

### Open Risks by Priority

| Priority | Count | Risk IDs |
|----------|-------|----------|
| Critical | 1 | RISK-T001 |
| High | 0 | — |
| Medium | 6 | RISK-T002, RISK-PM001, RISK-PM002, RISK-UX001, RISK-S003 |
| Low | 8 | RISK-T003, RISK-T004, RISK-PM003, RISK-UX002, RISK-S001, RISK-S002, RISK-B001 |

### Risk Burn Down
**Target:** Resolve 50% of medium+ risks by Sprint 3  
**Measurement:** Weekly review, update risk status

---

## 8. Risk Review Schedule

### Sprint Planning (Weekly)
- Review open risks for upcoming sprint
- Assign risk mitigation tasks if needed
- Update risk probabilities based on progress

### Sprint Retrospective (Weekly)
- Identify new risks
- Close resolved risks
- Update risk register

### Monthly Review (Optional)
- Overall risk trend analysis
- Re-assess probability/impact
- Adjust mitigation strategies

---

## 9. Risk Response Strategies

### Accept
- RISK-PM003 (Developer Unavailability)
- RISK-B001 (Low ROI)
- RISK-S001, RISK-S002 (Low-impact security risks)

**Rationale:** Low probability or low impact, not worth mitigation effort

---

### Mitigate
- RISK-T001 (Scan Performance) — Prototype early, optimize
- RISK-T002 (Storage Quota) — Use compression, IndexedDB fallback
- RISK-PM001 (Scope Creep) — Sprint discipline, backlog management

**Rationale:** High impact, medium probability, proactive mitigation needed

---

### Monitor
- RISK-T003, RISK-T004 (Technical issues)
- RISK-PM002 (Timeline Slippage)
- RISK-UX001, RISK-UX002 (UX issues)

**Rationale:** Watch for signs, respond if materialized

---

### Transfer
- **None** (no external parties to transfer risk to)

---

## 10. Lessons Learned (Future Reference)

### Post-Sprint 1
- Document actual scan performance achieved
- Note any unexpected blockers

### Post-Sprint 3
- Document storage approach chosen (localStorage, IndexedDB, file)
- Note any data loss issues

### Post-Sprint 5
- Document WAR packaging lessons
- Note Apache configuration challenges

### Post-v1.0
- Overall timeline accuracy (5-6 weeks vs. actual)
- ROI achievement (daily use?)
- Top 3 risks that materialized

---

**Status:** ACTIVE | **Version:** 1.0 | **Last Updated:** 2026-05-07
