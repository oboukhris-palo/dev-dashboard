---
applyTo: "**"
description: Context Manifest standard for all agents — defines which files to load at session start
priority: high
enforcement: strict
---

# Context Manifest Instructions

## Overview

Every agent session MUST load a defined set of files before taking any action. This is the **Context Manifest** standard: a three-tier file loading pattern ensuring agents always have the right information without consuming unnecessary tokens.

---

## Three-Tier Loading Pattern

Every agent's `## Context Manifest` section follows the three-tier loading pattern defined in `.github/templates/context-manifest-standard.md`.

> **Canonical Standard**: `#file:.github/templates/context-manifest-standard.md` — defines all tier rules, PRU budgets, anti-patterns, and logging requirements. **Do not duplicate here.**

The three tiers are: **Tier 1** (always: checkpoint + own agent file) → **Tier 2** (phase-specific files) → **Tier 3** (story context when active).

See `#file:.github/reference/pdlc-phases.md` for the full phase-to-folder mapping used in Tier 2 loading.

---

## Agent `.agent.md` Manifest Section Format

All agents MUST include a `## Context Manifest` section using this compact format:

```markdown
## Context Manifest

**Tier 1 (standard)**: `#file:.github/templates/context-manifest-standard.md` + `#file:.github/agents/{agent-name}.agent.md`

**Tier 2 — Phase-Specific**:
- `#file:.github/workflows/XX-name.workflows.yml`
- `#file:docs/...`

**Tier 3 — Story Context** (when `current_user_story` set):
- `#file:docs/05-implementation/epics/{EPIC-REF}/user-stories/{US-REF}/implementation-plan.md`
- `#file:docs/05-implementation/epics/{EPIC-REF}/user-stories/{US-REF}/features/`
```

**Orchestrator exception**: Also loads 3 validation files in Tier 1 (see `orchestrator.agent.md` for the pattern).

---

## Logging Requirement

Every agent action log (`/logs/{phase}/agent-{name}-YYYYMMDD.md`) MUST include a **Context Manifest Loaded** field listing which files were actually loaded that session. See `.github/templates/agent-log-tmpl.md` for the template field.

**Example log entry**:
```yaml
context_manifest_loaded:
  tier1: [".github/checkpoint.yaml", ".github/agents/dev-tdd-red.agent.md"]
  tier2: ["docs/05-implementation/user-stories.md", ".github/guides/tdd-enforcement.guide.md"]
  tier3: ["docs/05-implementation/epics/EPIC-01/user-stories/US-006/implementation-plan.md",
          "docs/05-implementation/epics/EPIC-01/user-stories/US-006/features/user-registration.feature"]
```

---

## Why This Matters

- **Consistency**: Every agent starts with the same minimum context — no agent operates blind
- **Token efficiency**: Agents only load what they need, not the entire docs/ tree
- **Auditability**: Log entries prove which files influenced each agent decision
- **Debuggability**: When agents behave unexpectedly, check if manifest was fully loaded

---

## Anti-Patterns (Never Do These)

| ❌ Wrong | ✅ Correct |
|---------|----------|
| Agent acts without reading `checkpoint.yaml` | Always read checkpoint first |
| Agent reads ALL docs/ files at startup | Use tier-based selective loading |
| Log entry omits `Context Manifest Loaded` field | Always record which files were loaded |
| Agent skips `plan-approval.yaml` check | Tier 3 always includes approval status |

---

**Document Status**: ACTIVE  
**Version**: 1.0  
**Created**: 2026-04-20  
**Enforcement**: STRICT (validated by orchestrator at every handoff)
