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

- [ ] Angular production build creates optimized bundle
- [ ] Build output is packaged as WAR file
- [ ] WAR file is self-contained (no external dependencies)
- [ ] Build script documented in README

---

## BDD Scenarios

```gherkin
Feature: Production Build

  Scenario: Build WAR file
    Given the Angular application source code
    When I run the production build command
    Then a WAR file is created in the output directory
    And the WAR file contains all necessary assets
```

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

## Test Strategy

**Unit Tests:**
- Test build configuration is correct
- Test optimization flags are enabled
- Test output hashing is applied

**Integration Tests:**
- Test full build process completes successfully
- Test WAR file creation
- Test WAR file contains all expected assets
- Test WAR file size is within limits (< 5MB)

**BDD Tests:**
- Implement Gherkin scenario above
- Verify WAR file is created in output directory
- Verify WAR file contains all necessary assets

**Performance Tests:**
- Measure build time (target: < 2 minutes)
- Measure bundle size (target: < 5MB)

**Manual Verification:**
- Extract WAR file and inspect contents
- Verify all assets present (HTML, JS, CSS, images)
- Verify no source maps included (sourceMap: false)

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Deployment Architecture
- [Tech Spec](../../../02-architecture/tech-spec.md) - Section: Build Configuration
- [Deployment Plan](../../../04-planning/deployment-plan.md) - Detailed build steps
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-004-deployment/build-war.feature
