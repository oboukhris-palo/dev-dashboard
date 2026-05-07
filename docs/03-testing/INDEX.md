# 03-testing

Phase 5: Testing strategies

**Location**: `docs/03-testing`  
**Last Updated**: 2026-05-07  
**Items**: 4 core documents + 47 BDD scenarios

---

## Core Documentation

1. **test-strategies.md** — Comprehensive testing approach (unit, integration, E2E, performance, security)
2. **test-coverage-targets.md** — Coverage targets and BDD-to-AC mapping (79% → 95%+ target)
3. **test-data-strategy.md** — Mock repositories, fixtures, test data generation
4. **non-functional-testing-plan.md** — Performance, security, usability, reliability testing

## BDD Feature Files

Located in `features/` directory, organized by epic:

- **repo-001-discovery/** — 18 scenarios (scan, metadata, tech detection)
- **repo-002-display/** — 10 scenarios (display, interactions)
- **repo-003-management/** — 15 scenarios (edit, persist)
- **repo-004-deployment/** — 4 scenarios (build, deploy)

**Total:** 47 BDD scenarios covering 79% of acceptance criteria

## Quality Gate Status

✅ Testing strategy complete  
⚠️ Need 8-9 additional scenarios for 95% coverage target  
⏳ Ready for Phase 5 quality gate execution

---

**Navigation**: [← Up](../INDEX.md) | [🏠 Project Root](../../INDEX.md)  
**Framework**: Gen‑e2 Compliance v2.0.0 | **Updated**: 2026-05-07
