# UI Blueprints

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-04  
**Design System:** Penpot (3 boards, 345 elements)  
**Branding:** Palo IT

> **Note:** Complete interactive designs available in Penpot with:
> - **Design Tokens Board** (x: 0-2400): Color palette, typography, spacing
> - **UI Components Board** (x: 2500-4900): Buttons, badges, inputs, cards, toolbar
> - **Application Wireframes Board** (x: 5000-8200): Desktop (1440px), mobile (375px), empty state

---

## Layout Overview

```
┌─────────────────────────────────────────────────────────────┐
│ ☰  Dev Dashboard                             [Scan] [Filter]│  Toolbar
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Repositories (23)                          Search: [____]   │  Header
│                                                               │
├─────────────────────────────────────────────────────────────┤
│  Name          │ Description       │ Tech Stack  │ Phase     │  Table Header
├────────────────┼───────────────────┼─────────────┼───────────┤
│  dev-dashboard │ Local repo mgmt   │ 🟢 Node.js  │ Dev ▼     │  Row 1
│                │                   │ 🔵 Angular  │           │
├────────────────┼───────────────────┼─────────────┼───────────┤
│  merchant-bff  │ Merchant API      │ 🟣 .NET     │ Prod ▼    │  Row 2
├────────────────┼───────────────────┼─────────────┼───────────┤
│  ...                                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Toolbar (Top)
- **Left:** Material hamburger menu icon + "Dev Dashboard" title
- **Right:** 
  - "Scan Now" button (triggers manual rescan)
  - Filter dropdown (Active/Paused/Archived/All)

### 2. Search & Summary Bar
- **Left:** "Repositories (23)" count
- **Right:** Search text field with debounce (filters table)

### 3. Repository Table (Material Design)
- **Columns:**
  - **Name** (click to copy path, tooltip shows full path)
  - **Description** (inline editable, click to edit)
  - **Tech Stack** (colored badges, multi-select)
  - **Phase** (dropdown: Planning | Development | Testing | Maintenance)
  - **Status** (dropdown: Active | Paused | Archived)
  - **Actions** (icon buttons: Edit, Delete)

- **Sorting:** Click column header to sort
- **Pagination:** 20 rows per page (if > 20 repos)
- **Row Hover:** Light gray background

---

## Responsive Behavior

### Desktop (> 1024px)
- Full table view with all columns

### Tablet (768px - 1024px)
- Hide "Path" column
- Condense tech stack badges

### Mobile (< 768px)
- Switch to card layout:
```
┌──────────────────────────────┐
│ dev-dashboard                │  Card Header
│ Local repo management SPA    │  Description
│                              │
│ 🟢 Node.js  🔵 Angular       │  Tech Stack
│ Phase: Development ▼         │  Dropdowns
│ Status: Active ▼             │
│                              │
│ /Users/.../dev-dashboard     │  Path (truncated)
└──────────────────────────────┘
```

---

## Interaction Patterns

### Inline Editing
1. **Description Field:**
   - Default: Gray text, cursor pointer
   - On Click: Becomes text input with border
   - On Blur/Enter: Saves and reverts to display mode
   - Error: Red border + toast notification

2. **Dropdowns (Phase/Status):**
   - Material select dropdown
   - Auto-save on selection change
   - Success: Green check icon (1s)

### Manual Scan
1. Click "Scan Now" button
2. Button shows spinner
3. Table refreshes with new/updated repos
4. Toast: "Scan complete: X repos found"

### Delete Repository
1. Click trash icon in Actions column
2. Confirmation dialog: "Remove dev-dashboard from list?"
3. On confirm: Row fades out, removed from backend storage

---

## Color & Iconography

### Tech Stack Badges
- **Node.js:** Green circle
- **Angular:** Red angular logo
- **.NET:** Purple square
- **Java:** Coffee cup icon
- **Python:** Blue/yellow snake

### Status Colors
- **Active:** Green
- **Paused:** Orange
- **Archived:** Gray

### Phase Icons
- **Planning:** Blueprint icon
- **Development:** Code brackets
- **Testing:** Test tube
- **Maintenance:** Wrench

---

## Error States

### Empty State (No Repos Found)
```
┌─────────────────────────────┐
│     No Repositories Found    │
│                             │
│  Click "Scan Now" to search │
│  your workspace directories │
│                             │
│        [Scan Now]           │
└─────────────────────────────┘
```

### Scan Error
- Toast notification: "Scan failed: Permission denied"
- Retry button in toast

---

**Figma Link:** _TBD (high-fidelity mockups)_
