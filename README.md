# Dev-Dashboard

**Local Angular Material SPA for managing code repositories on developer's laptop**

## Project Status

**Current Phase:** Design System Complete ✅  
**Date:** 2026-05-04  
**Next:** Implementation Phase

### Completed Milestones

- ✅ **Requirements** (10 user stories across 4 epics)
- ✅ **Architecture** (Angular + Material Design, Node.js backend)
- ✅ **Design System** (Penpot: 3 boards, 345 elements, Palo IT branding)

## Overview

Single-page application for viewing and managing all local git repositories with metadata management.

**Features:**
- Auto-scan workspace directories for git repositories
- Display repository info (name, description, path, tech stack, phase, status)
- Inline editing for descriptions
- README.md parsing for initial descriptions
- Tech stack detection (Node.js, Java, .NET, Python, Angular)

**Tech Stack:**
- Frontend: Angular 18+ with Material Design
- Backend: Node.js/Express for file system operations
- Deployment: WAR file to local Apache service
- Persistence: JSON file (~/.dev-dashboard/repos.json)
- Auth: None (local use only)

**Workspaces:**
- `/Users/oboukhris-palo/workspace`
- `/Users/oboukhris-palo/Documents/workspace`

## Documentation

See [docs/](docs/) for complete PDLC-organized documentation:
- [Requirements](docs/01-requirements/) — User stories, personas, business case
- [Architecture](docs/02-architecture/) — System design, tech specs, design system
- [Design System](docs/02-architecture/design-systems.md) — Palo IT branding, Material components
