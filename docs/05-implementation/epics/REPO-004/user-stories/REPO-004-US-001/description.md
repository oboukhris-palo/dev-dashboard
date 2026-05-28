---
generated_from_template: user-story-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
story_key: REPO-004-US-001
epic_key: REPO-004
project_key: dev-dashboard
priority: Medium
status: To Do
story_points: 5
---

# REPO-004-US-001: Build Production WAR File

## User Story

**As a** developer  
**I want** to build a production-ready WAR file  
**So that** I can deploy to my local Apache service

---

## Acceptance Criteria

**Given** the Angular application source code in `src/frontend/`  
**When** the production build command is executed  
**Then** all the following criteria must be satisfied:

- [ ] Angular production build creates optimized bundle (< 5MB uncompressed)
- [ ] Build output is packaged as WAR file at `./dev-dashboard.war`
- [ ] WAR file is self-contained (includes all assets, manifests, web.xml)
- [ ] Build script documented in README with `npm run package:war` command
- [ ] Build completes in < 2 minutes
- [ ] Source maps are excluded from production build
- [ ] Dead code elimination (tree-shaking) is applied
- [ ] Output includes all necessary Angular assets (JS, CSS, HTML, images)

---

## Dependencies

### Prerequisites
- All core features implemented (REPO-001, REPO-002, REPO-003)
- Angular application is functional in development mode

### Blocks
- REPO-004-US-002 (Deploy to Apache Service) - Cannot deploy without WAR file

---

## Technical Constraints

**From [Architecture Design](../../../02-architecture/architecture-design.md):**
- Build time: < 2 minutes for production build
- Bundle size: < 5MB (uncompressed)
- Angular AOT (Ahead-of-Time) compilation required
- Tree-shaking to remove unused code
- Minification and uglification enabled

**Technology Stack:**
- Angular CLI for production build (`ng build --configuration production`)
- WAR packaging tool (e.g., `jar` command or custom script)
- Node.js scripts for automation

**Build Configuration:**
```json
// angular.json
{
  "configurations": {
    "production": {
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true
    }
  }
}
```

---

## Implementation Notes

---

## Test Strategy

**Manual Verification (YOLO Mode):**
- [ ] Run `npm run package:war` and verify no errors
- [ ] Verify WAR file exists at `./dev-dashboard.war` with file size < 5MB
- [ ] Unzip WAR and verify index.html, main.*.js, and styles.*.css are present
- [ ] Verify web.xml is present in META-INF/

**Build Script (package.json):**
```json
{
  "scripts": {
    "build": "ng build --configuration production",
    "package:war": "npm run build && cd dist/dev-dashboard && jar -cvf ../../dev-dashboard.war *",
    "deploy": "npm run package:war && npm run copy:apache"
  }
}
```

**WAR Structure:**
```
dev-dashboard.war
├── index.html
├── main.[hash].js
├── polyfills.[hash].js
├── runtime.[hash].js
├── styles.[hash].css
└── assets/
    ├── images/
    └── icons/
```

**Build Steps:**
1. Run `ng build --configuration production`
2. Navigate to `dist/dev-dashboard`
3. Create WAR file using `jar` command or zip utility
4. Verify WAR file is self-contained (all assets included)
5. Test WAR deployment to Apache

**Alternative (No Java JDK):**
If `jar` command unavailable, package as ZIP and rename to `.war`:
```bash
cd dist/dev-dashboard
zip -r ../../dev-dashboard.war *
```

---

---

## Definition of Ready Checklist

- [x] Story has clear, testable acceptance criteria
- [x] Technical assumptions documented (AOT, tree-shaking, minification, < 2min build time)
- [x] Build performance constraints specified (< 2 minutes, < 5MB)
- [x] No BDD scenarios required (YOLO mode - acceptance criteria in plain text)
- [x] Acceptance criteria are measurable and verifiable
- [x] Dependencies identified (REPO-001-003 must be complete)
- [x] Build script template provided (package.json)
- [x] Ready for Dev-Lead Phase 3 (Implementation Planning)

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Deployment Architecture
- [Tech Spec](../../../02-architecture/tech-spec.md) - Section: Build Configuration
- [Deployment Plan](../../../04-planning/deployment-plan.md) - Detailed build steps
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-004-deployment/build-war.feature
