---
id: context-manifest-standard
version: 1.0.0
enforced_by: orchestrator
applies_to: all agents
---

# Context Manifest Standard

Defines the universal loading protocol for all agents. Every agent manifest MUST reference this file and follow the three-tier pattern.

---

## Tier 1 — Always Load (Every Session)

```yaml
always_load:
  - file: ".github/checkpoint.yaml"
    purpose: "Current PDLC phase, active epic/story, TDD cycle state — SOLE source of truth"
  - file: ".github/agents/{self}.agent.md"
    purpose: "Your role, responsibilities, constraints, and decision framework"
```

> **Read `checkpoint.yaml` FIRST**, before any other action.

---

## Tier 2 — Phase-Specific (Load Based on `current_phase`)

Load only files relevant to the checkpoint's active phase. Do NOT load all phases at once.

| Phase | Load |
|-------|------|
| `00-assessment` | `00-assessment.workflows.yml` + assessment inputs |
| `01-requirements` | `01-requirements.workflows.yml` + user-stories.md |
| `02-architecture` | `02-architecture.workflows.yml` + tech-spec.md + architecture-design.md |
| `03-testing` | `03-testing.workflows.yml` + test-strategies.md |
| `04-planning` | `04-planning.workflows.yml` + iteration-planning.md |
| `05-implementation` | `05-implementation.workflows.yml` + current story plan |

---

## Tier 3 — Story Context (Load When `current_user_story` Set)

```yaml
story_context:
  - "docs/05-implementation/epics/{EPIC-REF}/user-stories/{US-REF}/description.md"
  - "docs/05-implementation/epics/{EPIC-REF}/user-stories/{US-REF}/implementation-plan.md"
  - "docs/05-implementation/epics/{EPIC-REF}/user-stories/{US-REF}/plan-approval.yaml"
  - "docs/05-implementation/epics/{EPIC-REF}/user-stories/{US-REF}/features/"
```

> **Block TDD execution if `plan-approval.yaml` status ≠ `approved`.**

---

## Tier Budgets (PRU)

| Tier | Max PRU | Notes |
|------|---------|-------|
| Tier 1 | ~500 PRU | checkpoint (~100) + agent file (~400) |
| Tier 2 | ~2K–6K PRU | Varies by phase complexity |
| Tier 3 | ~1K–3K PRU | Single story only; no previous sprints |
| **Total session** | **<10K PRU** | Target for focused agent actions |

---

## Anti-Patterns

| ❌ Never | ✅ Instead |
|---------|----------|
| Load all docs/ at startup | Use tier-based selective loading |
| Repeat content from another loaded file | Reference by path only |
| Load previous sprint archive files | Only load `current-sprint.md` |
| Pass full handoff history to next agent | Pass delta summary + canonical reference |
| Include full implementation plan in handoff | Reference `implementation-plan.md` path |

---

## Logging Requirement

Every agent log entry MUST include:

```yaml
context_manifest_loaded:
  tier1: [".github/checkpoint.yaml", ".github/agents/{self}.agent.md"]
  tier2: ["list of phase-specific files actually loaded"]
  tier3: ["list of story context files, or null"]
```

> Omitting this field = **non-compliant** action per agent-logging.instructions.md.

---

**Reference**: `.github/instructions/context-manifest.instructions.md` for full standard  
**Reference**: `.github/reference/pdlc-phases.md` for phase descriptions and folder structure
