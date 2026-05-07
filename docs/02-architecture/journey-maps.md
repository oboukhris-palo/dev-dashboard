# User Journey Maps

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-04

---

## Journey 1: First-Time Use

**Actor:** Developer (Omar)  
**Goal:** View all local repositories in one place

### Steps

1. **Launch Application**
   - Opens browser to `http://localhost:8080/dev-dashboard`
   - Sees loading indicator

2. **Automatic Scan**
   - Backend scans `/workspace` and `/Documents/workspace`
   - Detects all git repositories
   - Extracts README descriptions

3. **View Dashboard**
   - Sees Material table with all repositories
   - Columns: Name, Description, Tech Stack, Phase, Status, Path
   - Repositories sorted alphabetically

4. **Quick Review**
   - Scans list for specific project
   - Notices some descriptions missing
   - Decides to enrich metadata later

**Outcome:** ✅ All repositories visible at a glance

---

## Journey 2: Update Repository Metadata

**Actor:** Developer  
**Goal:** Add missing descriptions and update project phase

### Steps

1. **Identify Repository**
   - Finds "legacy-api" project in table
   - Description is empty

2. **Inline Edit**
   - Clicks description field (becomes editable)
   - Types "Legacy REST API for customer orders"
   - Presses Enter to save

3. **Update Phase**
   - Clicks phase dropdown (currently "Development")
   - Changes to "Maintenance"
   - Auto-saves on change

4. **Visual Feedback**
   - Sees success toast notification
   - Updated values persist in UI

**Outcome:** ✅ Repository metadata enriched

---

## Journey 3: Manage Archived Projects

**Actor:** Developer  
**Goal:** Mark old projects as archived

### Steps

1. **Filter Active Projects**
   - Uses status dropdown filter
   - Selects "Show All"

2. **Archive Old Project**
   - Finds "old-experiment" project
   - Changes status from "Active" to "Archived"
   - Row becomes grayed out

3. **Hide Archived**
   - Toggles status filter to "Active Only"
   - Archived projects disappear from view

**Outcome:** ✅ Dashboard shows only relevant projects

---

## Journey 4: Discover Tech Stack

**Actor:** Developer  
**Goal:** Find all Node.js projects

### Steps

1. **View Tech Stack Column**
   - Sees badges for each technology (Node.js, Angular, Java, etc.)

2. **Use Search/Filter**
   - Types "Node.js" in search box
   - Table filters to show only Node.js projects

3. **Review Results**
   - Sees 15 Node.js projects
   - Notices mix of Angular, React, Express backends

**Outcome:** ✅ Quickly identified all Node.js codebases

---

**Pain Points Addressed:**
- No more manual searches in Terminal/Finder
- Centralized project metadata
- Quick status overview for all projects
