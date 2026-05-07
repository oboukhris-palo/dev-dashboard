# User Personas

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-04

---

## Persona: Local Developer

### Overview
**Name:** Alex (Representative Developer)  
**Role:** Software Developer / Engineer  
**Experience Level:** Intermediate to Senior  
**Technical Skills:** High (working with multiple technologies and projects)

---

### Demographics
- **Age Range:** 25-50
- **Technical Expertise:** Multiple programming languages and frameworks
- **Work Environment:** Local development on macOS
- **Tools:** VSCode, Terminal, Git, various IDEs

---

### Goals

1. **Quick Project Discovery**
   - Instantly see all available code repositories
   - Understand project status without opening each folder

2. **Efficient Context Switching**
   - Quickly identify which projects are active vs. archived
   - Understand technology stack before opening project

3. **Metadata Management**
   - Maintain project descriptions for future reference
   - Track development phase and current status
   - Document technology choices

4. **Workspace Organization**
   - Centralized view across multiple workspace directories
   - Easy navigation to project locations

---

### Pain Points

1. **Directory Navigation Overhead**
   - Time wasted navigating between `/workspace` and `/Documents/workspace`
   - Difficulty remembering project locations

2. **Context Loss**
   - Forgetting project purpose after weeks/months of inactivity
   - Unclear technology stack without opening files

3. **Status Tracking**
   - No way to mark projects as active, paused, or completed
   - Difficult to prioritize which projects need attention

4. **Documentation Gaps**
   - READMEs not always up-to-date or present
   - No consistent place for project notes

---

### User Behaviors

- **Daily Workflow**: Switches between 3-5 active projects
- **Repository Count**: Manages 20-50 repositories locally
- **Technology Diversity**: Works with 4-6 different tech stacks
- **Usage Pattern**: Checks dashboard at start of work day and when switching contexts

---

### Needs from Dev-Dashboard

- **Speed**: Instant repository list (< 1 second load time)
- **Simplicity**: No authentication, no complex setup
- **Editability**: Quick inline editing for descriptions and status
- **Accuracy**: Reliable technology detection
- **Availability**: Always accessible via local Apache service

---

### Success Criteria

Alex considers the tool successful if:
- Can find any repository within 5 seconds
- Project status is always current
- Technology stack is accurately detected
- Description field provides sufficient context for project recall
- No maintenance overhead (auto-discovery works reliably)
