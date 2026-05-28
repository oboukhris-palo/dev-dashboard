---
id: pdlc-phases
version: 1.0.0
source_of_truth: true
replaces_duplication_in: [copilot-instructions.md, framework-standards.instructions.md, project-structure.instructions.md]
---

# PDLC Phase Reference

Canonical reference for all 8 product development lifecycle phases. All agents and documents MUST reference this file instead of duplicating phase descriptions.

---

## Phase Map

| # | Folder | Phases | Workflow | Status During Impl. |
|---|--------|--------|----------|---------------------|
| 0 | `docs/00-assessment/` | Phase 0 | `00-assessment.workflows.yml` | Output-only |
| 1 | `docs/01-requirements/` | Phases 1-2 | `01-requirements.workflows.yml` | Frozen (read-only) |
| 2 | `docs/02-architecture/` | Phases 3-4 | `02-architecture.workflows.yml` | Frozen (read-only) |
| 3 | `docs/03-testing/` | Phase 5 | `03-testing.workflows.yml` | Frozen (read-only) |
| 4 | `docs/04-planning/` | Phases 6-7 | `04-planning.workflows.yml` | Frozen (read-only) |
| 5 | `docs/05-implementation/` | Phase 8 | `05-implementation.workflows.yml` | Active (mutable) |

---

## Phase Descriptions

### Phase 0 — Assessment
- **Folder**: `docs/00-assessment/`
- **Outputs**: `prerequisites-request.yml`, `ai-readiness-report.md`, `inventory-technical.md`
- **Routing**: Classifies client into maturity tier (1–4), selects Route A/B/C/D
- **Gate**: None (output only; routes to Phase 1-2)

### Phases 1-2 — Requirements
- **Folder**: `docs/01-requirements/`
- **Key Files**: `requirements.md`, `personas.md`, `user-stories.md` ⭐ (SSOT), `business-case.md`
- **Gate**: `gate-01-requirements.md` → PASS routes to Phases 3-4
- **Status**: FROZEN after phase completes

### Phases 3-4 — Architecture
- **Folder**: `docs/02-architecture/`
- **Key Files**: `architecture-design.md`, `tech-spec.md`, `design-systems.md`, `flow-diagrams.md`, `journey-maps.md`
- **Gate**: `gate-02-architecture.md` → PASS routes to Phase 5
- **Status**: FROZEN after phase completes

### Phase 5 — Testing
- **Folder**: `docs/03-testing/`
- **Key Files**: `test-strategies.md`
- **Gate**: `gate-03-testing.md` → PASS routes to Phases 6-7
- **Status**: FROZEN after phase completes

### Phases 6-7 — Planning
- **Folder**: `docs/04-planning/`
- **Key Files**: `iteration-planning.md`, `deployment-plan.md`, `code-generation.md`
- **Gate**: `gate-04-planning.md` → PASS routes to Phase 8
- **Status**: FROZEN after phase completes

### Phase 8 — Implementation
- **Folder**: `docs/05-implementation/`
- **Key Files**: `user-stories.md` ⭐ (master status SSOT), `current-sprint.md`, `epics/`
- **Story Structure**: `epics/{EPIC-REF}/user-stories/{US-REF}/` → `description.md`, `implementation-plan.md`, `plan-approval.yaml`, `features/`
- **Gate**: None (TDD cycle gates enforced per story)
- **Status**: ACTIVE (mutable throughout)

---

## Routing Decision Tree

```
Assessment Complete?
├─ Tier 1 (80-100% docs quality) → Route A: Traditional → 01-requirements.workflows.yml
├─ Tier 2 (60-79% docs quality) → Route B: Functional Extraction → 01-requirements.workflows.yml
├─ Tier 3 (40-59% docs quality) → Route C: Interview-Driven → 01-requirements.workflows.yml
└─ Tier 4 (<40% docs quality)   → Route D: Hybrid Assembly → 01-requirements.workflows.yml
```

---

## Gate Chain

```
Phase 0 ──→ gate-00-assessment ──→ Phase 1-2 ──→ gate-01-requirements
──→ Phase 3-4 ──→ gate-02-architecture ──→ Phase 5 ──→ gate-03-testing
──→ Phase 6-7 ──→ gate-04-planning ──→ Phase 8 (TDD)
```

---

## Checkpoint State Reference

When reading `.github/checkpoint.yaml`, map `current_phase` values:

```yaml
"00-assessment"    → Phase 0
"01-requirements"  → Phases 1-2
"02-architecture"  → Phases 3-4
"03-testing"       → Phase 5
"04-planning"      → Phases 6-7
"05-implementation"→ Phase 8
```

---

**Used by**: All agents (Context Manifest tier-2 loading), orchestrator (routing), gates (transition)  
**Do NOT duplicate**: Reference this file via `#file:.github/reference/pdlc-phases.md`
