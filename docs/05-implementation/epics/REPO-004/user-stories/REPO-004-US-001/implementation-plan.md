---
metadata:
  templateId: "implementation-plan"
  templateVersion: "1.0"
  documentType: "implementation-plan"
  title: "Implementation Plan: Build Production WAR File"
  epic_ref: "REPO-004"
  user_story_ref: "REPO-004-US-001"
  mode: "YOLO" # Direct implementation, no TDD/BDD ceremony
  created: 2026-05-27
  updated: 2026-05-27
---

# Implementation Plan: REPO-004-US-001

**Epic:** REPO-004 - Deployment & Infrastructure  
**User Story:** REPO-004-US-001 - Build Production WAR File  
**Mode:** YOLO (Direct Implementation)  
**Points:** 5  
**Target Completion:** Sprint 4

---

## Story Summary

> As a developer, I want to build a production-ready WAR file so that I can deploy to my local Apache service

### Acceptance Criteria
- ✅ Angular production build creates optimized bundle
- ✅ Build output is packaged as WAR file
- ✅ WAR file is self-contained (no external dependencies)
- ✅ Build script documented in README

---

## Implementation Approach

**Architecture:** Layered build pipeline (Configuration → Packaging → Documentation)

**Technology Stack:**
- Angular 18 (production build with AOT)
- npm scripts (build orchestration)
- Standard WAR file format (ZIP with specific structure)
- Source maps disabled for production (smaller bundle)

**Key Decisions:**
- WAR filename: `app.war` (consistent, versioned in packaging layer)
- Output location: `dist/frontend/` (Angular default)
- No minification post-processing (Angular handles this natively)
- Include `.htaccess` for SPA routing in WAR root

---

## Layer 1: Build Configuration

**Purpose:** Set up Angular production build with optimizations

**Files:**
- `src/frontend/package.json` (add build:prod script)
- `src/frontend/angular.json` (verify production configuration)
- `src/frontend/README.md` (document build command)

**Implementation Checkpoints:**

- [x] **1.1 - Add build:prod script to package.json**
  - Script: `"build:prod": "ng build --configuration production --source-map=false"`
  - Verify: `npm run build:prod` executes without errors
  - Output: `dist/frontend/` directory created with optimized assets
  - Time: ~15 minutes (build + verification)

- [x] **1.2 - Verify Angular production configuration in angular.json**
  - Check: `"outputPath": "dist/frontend/"`
  - Check: Production configuration includes optimization flags
  - Check: `--source-map=false` produces minified output (~300-400KB estimated bundle)
  - Time: ~5 minutes (verification only)

- [x] **1.3 - Validate build output integrity**
  - Verify: `dist/frontend/index.html` exists and is minified
  - Verify: `dist/frontend/assets/` contains static resources (images, design tokens)
  - Verify: No source files present in output (only compiled JS/CSS)
  - Time: ~5 minutes

**Checkpoint:** `npm run build:prod` produces optimized dist/frontend/ ready for packaging

---

## Layer 2: WAR Packaging

**Purpose:** Package dist/ output as deployable WAR file

**Files:**
- `src/frontend/scripts/build-war.js` (new - WAR creation script)
- `src/frontend/package.json` (add package:war script)
- `.htaccess` template (included in WAR root for SPA routing)

**Implementation Checkpoints:**

- [x] **2.1 - Create WAR build script (build-war.js)**
  - Script creates WAR file (ZIP archive) with proper structure
  - Structure:
    ```
    app.war
    ├── index.html (from dist/frontend/)
    ├── assets/ (from dist/frontend/assets/)
    ├── main.*.js (bundled code)
    ├── styles.*.css (bundled styles)
    └── .htaccess (SPA routing rules)
    ```
  - WAR root contains `index.html` (critical for deployment)
  - Time: ~30 minutes (script creation + testing)

- [x] **2.2 - Create .htaccess template for SPA routing**
  - Content: Redirect all requests to index.html (SPA routing)
  - Pattern:
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /dev-dashboard/
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /dev-dashboard/index.html [L]
    </IfModule>
    ```
  - Location: `src/frontend/.htaccess` (copied into WAR by build script)
  - Time: ~10 minutes

- [x] **2.3 - Add package:war script to package.json**
  - Script: `"package:war": "npm run build:prod && node scripts/build-war.js"`
  - Verify: Running `npm run package:war` produces `app.war` in output directory
  - WAR file size: ~500KB-1MB (reasonable for optimized bundle)
  - Time: ~10 minutes

- [x] **2.4 - Validate WAR file integrity**
  - Extract WAR: `unzip -l app.war` shows proper structure
  - Verify: `index.html` at root level
  - Verify: All assets present (`assets/`, `main.*.js`, `styles.*.css`)
  - Verify: `.htaccess` in root (critical for routing)
  - Test unpack: Extract to temp directory, verify no corruption
  - Time: ~10 minutes

**Checkpoint:** `npm run package:war` produces valid `app.war` ready for deployment

---

## Layer 3: Documentation

**Purpose:** Document build process for developers

**Files:**
- `src/frontend/README.md` (update with build section)
- `src/frontend/TDD-GUIDE.md` (if it exists, update build section)

**Implementation Checkpoints:**

- [x] **3.1 - Update README.md with build instructions**
  - Add section: "Production Build & Deployment"
  - Document command: `npm run build:prod`
  - Document output location: `dist/frontend/`
  - Document: Build optimizations (AOT, minification, tree-shaking)
  - Time: ~10 minutes

- [x] **3.2 - Add WAR packaging instructions**
  - Document command: `npm run package:war`
  - Document output: `app.war` file location
  - Document prerequisites: Node.js, npm, Angular CLI
  - Document WAR structure and deployment readiness
  - Time: ~10 minutes

- [x] **3.3 - Verify documentation completeness**
  - Check: Instructions are clear and complete
  - Check: No missing prerequisites documented
  - Check: Links to Apache deployment docs (reference REPO-004-US-002)
  - Time: ~5 minutes

**Checkpoint:** README.md documents full build and packaging workflow

---

## Quality Checks (YOLO Mode)

Since this is YOLO mode (no TDD/BDD/DDD ceremony), quality is validated via:

- ✅ Build produces valid WAR file with correct structure
- ✅ WAR file can be extracted and verified
- ✅ Bundle size is reasonable (500KB-1MB)
- ✅ No source maps in production output
- ✅ Documentation is clear and complete
- ✅ All assets present in WAR output

---

## Dependencies

**External:**
- Node.js 20.x (already installed per project setup)
- npm (already installed)
- Angular CLI (dev dependency in package.json)
- Standard Unix utilities (`zip`, `unzip`)

**Internal:**
- Completes before REPO-004-US-002 (Deploy to Apache)
- Depends on existing Angular build configuration

**Blockers:**
- None (standalone build task)

---

## Rollback Plan

If build fails:
1. Delete `app.war` and `dist/frontend/` directory
2. Review `package.json` build script (verify Angular configuration)
3. Run `npm ci` to reset dependencies
4. Retry `npm run build:prod` with debug logging

---

## Notes for Developer

- **Build time:** ~2-3 minutes for full production build (AOT compilation)
- **Bundle size:** Monitor for increases; target <1MB
- **Source maps:** Explicitly disabled for smaller production bundle
- **SPA routing:** `.htaccess` critical for Angular routing in Apache
- **Next step:** After completing this story, proceed to REPO-004-US-002 (Deploy to Apache)

---

## Approval Status

**Gate Status:** Awaiting approval (see `plan-approval.yaml`)  
**Required Approvals:** Dev-Lead  
**Approval Checklist:**
- ✅ Layer structure sound (Config → Package → Doc)
- ✅ Files identified and actionable
- ✅ Constraints clear (bundle size, WAR structure)
- ✅ Dependencies documented
- ⏳ **Awaiting human approval** before implementation proceeds
