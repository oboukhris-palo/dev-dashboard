# Design System

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-04  
**Framework:** Angular Material 18+ with Palo IT Branding  
**Design Philosophy:** Minimal, clean, professional

---

## 1. Design Tokens

### Color Palette (Palo IT Brand)

**Primary Colors**
```scss
// Palo IT Core Colors
$palo-black: #000000;        // Primary text, headers, main content
$palo-white: #FFFFFF;        // Primary background, text on dark
$palo-gray-light: #F0F0F0;   // Subtle backgrounds, borders
$palo-gray-medium: #808080;  // Secondary text, captions
$palo-gray-dark: #404040;    // Alternative text, subtle emphasis
```

**Accent Colors (Use Sparingly)**
```scss
$tech-blue: #0066CC;         // Hyperlinks, interactive elements, primary actions
$gen-e2-purple: #7B3FF2;     // Premium features, Gen-e2™ references
$success-green: #00A651;     // Positive indicators, success states
$warning-orange: #FF8C42;    // Alerts, important notices (minimal use)
```

**Material Theme Configuration**
```scss
// Custom Palo IT theme for Angular Material
$primary: mat.define-palette((
  50: #E6F0FF,
  100: #B3D9FF,
  500: #0066CC,    // Tech Blue as primary
  700: #004C99,
  contrast: (
    500: white,
  )
));

$accent: mat.define-palette((
  500: #000000,    // Palo IT Black
  contrast: (
    500: white,
  )
));

$warn: mat.define-palette((
  500: #FF8C42,    // Warning Orange
));
```

**Status Colors**
```scss
$status-active: #00A651;     // Success Green
$status-paused: #FF8C42;     // Warning Orange
$status-archived: #808080;   // Medium Gray
```

**Tech Stack Badge Colors**
```scss
$tech-nodejs: #00A651;       // Success Green
$tech-angular: #DD0031;      // Angular Red (brand color)
$tech-dotnet: #7B3FF2;       // Gen-e2 Purple
$tech-java: #0066CC;         // Tech Blue
$tech-python: #0066CC;       // Tech Blue
```

---

## 2. Typography

**Font Family (Palo IT Standard)**
```scss
// Primary: System fonts for optimal clarity
$font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
               "Helvetica Neue", Arial, sans-serif;

// Alternative: Premium modern sans-serif
$font-secondary: "Inter", "Helvetica", "Arial", sans-serif;

// Monospace: Technical content
$font-mono: "Monaco", "Fira Code", "Courier New", monospace;
```

**Typography Scale (Palo IT Standard)**

```scss
// Main Title / Document Headline
h1: 40-48px, 600-700 weight (semibold/bold), $palo-black

// Section Headers / Major Headings  
h2: 28-32px, 600 weight (semibold), $palo-black

// Sub-headers / Feature Titles
h3: 18-20px, 600 weight (semibold), $palo-black

// Body Text / Primary Content
body: 14-16px, 400 weight (regular), $palo-gray-dark

// Secondary Content / Descriptions
body-small: 12-14px, 400 weight (regular), $palo-gray-medium

// Fine Print / Metadata
caption: 11-12px, 400 weight (regular), $palo-gray-medium
```

**Line Height Standards**
```scss
$line-height-tight: 1.2;    // Headers
$line-height-normal: 1.5;   // Body text (primary)
$line-height-relaxed: 1.6;  // Long-form content
```

---

## 3. Spacing System

**Base Unit:** 4px

```scss
$spacing-xs: 4px;   // 0.25rem
$spacing-sm: 8px;   // 0.5rem
$spacing-md: 16px;  // 1rem
$spacing-lg: 24px;  // 1.5rem
$spacing-xl: 32px;  // 2rem
$spacing-2xl: 48px; // 3rem
```

**Usage:**
```html
<!-- Padding -->
<div class="p-4">...</div>  <!-- 16px padding -->

<!-- Margin -->
<div class="mb-2">...</div> <!-- 8px margin-bottom -->

<!-- Gap (Flexbox) -->
<div class="flex gap-3">    <!-- 12px gap -->
```

---

## 4. Component Library

### Material Components Used

| Component | Purpose | Customization |
|-----------|---------|---------------|
| `mat-toolbar` | Top navigation bar | White background, Palo IT logo |
| `mat-table` | Repository list | Clean borders (#F0F0F0) |
| `mat-card` | Mobile view cards | Subtle shadow, 8px rounded corners |
| `mat-form-field` | Inline editing | Outline variant, Tech Blue focus |
| `mat-select` | Phase/Status dropdowns | Minimal style, Tech Blue accent |
| `mat-button` | Actions | Tech Blue primary, minimal elevation |
| `mat-icon` | Icons throughout | Material Icons, Palo IT Black |
| `mat-snackbar` | Success/Error toasts | 3s duration, minimal style |
| `mat-chip` | Tech stack badges | Custom Palo IT colors |
| `mat-paginator` | Table pagination | 20 per page, clean styling |

### Palo IT Branding Integration

**Logo Placement**
```html
<!-- Toolbar with Palo IT Logo -->
<mat-toolbar class="palo-toolbar">
  <div class="toolbar-container">
    <div class="logo-section">
      <img src="assets/images/palo-it-logo.png" 
           alt="Palo IT" 
           class="palo-logo"
           height="40">
      <span class="app-title">Dev Dashboard</span>
    </div>
    <div class="toolbar-actions">
      <button mat-button (click)="scanNow()">
        <mat-icon>refresh</mat-icon>
        Scan Now
      </button>
      <mat-form-field appearance="outline" class="filter-dropdown">
        <mat-select [(value)]="statusFilter">
          <mat-option value="all">All Repositories</mat-option>
          <mat-option value="active">Active Only</mat-option>
          <mat-option value="paused">Paused</mat-option>
          <mat-option value="archived">Archived</mat-option>
        </mat-select>
      </mat-form-field>
    </div>
  </div>
</mat-toolbar>
```

**Toolbar Styles**
```scss
.palo-toolbar {
  background-color: $palo-white;
  color: $palo-black;
  border-bottom: 1px solid $palo-gray-light;
  height: 64px;
  box-shadow: none; // Minimal elevation
}

.toolbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.palo-logo {
  height: 40px;
  width: auto;
}

.app-title {
  font-size: 20px;
  font-weight: 600;
  color: $palo-black;
  letter-spacing: -0.5px;
}

.toolbar-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}
```

---

## 5. Component Patterns

### Main Layout (Palo IT Style)

```html
<!-- Clean, minimal layout with logo -->
<div class="app-container">
  <!-- Toolbar with logo -->
  <mat-toolbar class="palo-toolbar">
    <div class="toolbar-container">
      <div class="logo-section">
        <img src="assets/images/palo-it-logo.png" 
             alt="Palo IT" 
             class="palo-logo">
        <span class="app-title">Dev Dashboard</span>
      </div>
      <div class="toolbar-actions">
        <button mat-button class="action-button">
          <mat-icon>refresh</mat-icon>
          Scan Now
        </button>
      </div>
    </div>
  </mat-toolbar>

  <!-- Content area -->
  <main class="content-container">
    <div class="content-wrapper">
      <!-- Repository table/cards -->
    </div>
  </main>
</div>
```

**Layout Styles**
```scss
.app-container {
  min-height: 100vh;
  background-color: $palo-white;
}

.content-container {
  background-color: $palo-gray-light; // Subtle background
  min-height: calc(100vh - 64px);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}
```

---

### Repository Table Component

```html
<div class="repos-section">
  <div class="section-header">
    <h2>Repositories ({{ repoCount }})</h2>
    <mat-form-field appearance="outline" class="search-field">
      <mat-icon matPrefix>search</mat-icon>
      <input matInput placeholder="Search repositories..." [(ngModel)]="searchTerm">
    </mat-form-field>
  </div>

  <table mat-table [dataSource]="repos$" class="palo-table">
    <!-- Name Column -->
    <ng-container matColumnDef="name">
      <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
      <td mat-cell *matCellDef="let repo">
        <span class="repo-name" [matTooltip]="repo.path">
          {{ repo.name }}
        </span>
      </td>
    </ng-container>
    
    <!-- Description Column -->
    <ng-container matColumnDef="description">
      <th mat-header-cell *matHeaderCellDef>Description</th>
      <td mat-cell *matCellDef="let repo">
        <span class="repo-description">{{ repo.description }}</span>
      </td>
    </ng-container>
    
    <!-- Tech Stack Column -->
    <ng-container matColumnDef="techStack">
      <th mat-header-cell *matHeaderCellDef>Tech Stack</th>
      <td mat-cell *matCellDef="let repo">
        <div class="tech-badges">
          <span *ngFor="let tech of repo.techStack" 
                class="tech-badge"
                [attr.data-tech]="tech.toLowerCase()">
            {{ tech }}
          </span>
        </div>
      </td>
    </ng-container>
    
    <!-- Phase Column -->
    <ng-container matColumnDef="phase">
      <th mat-header-cell *matHeaderCellDef>Phase</th>
      <td mat-cell *matCellDef="let repo">
        <mat-select [(value)]="repo.phase" 
                    class="inline-select"
                    (selectionChange)="updatePhase(repo)">
          <mat-option value="planning">Planning</mat-option>
          <mat-option value="development">Development</mat-option>
          <mat-option value="testing">Testing</mat-option>
          <mat-option value="maintenance">Maintenance</mat-option>
        </mat-select>
      </td>
    </ng-container>
    
    <!-- Status Column -->
    <ng-container matColumnDef="status">
      <th mat-header-cell *matHeaderCellDef>Status</th>
      <td mat-cell *matCellDef="let repo">
        <span class="status-badge" [attr.data-status]="repo.status">
          {{ repo.status }}
        </span>
      </td>
    </ng-container>
    
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
        class="table-row"></tr>
  </table>
</div>
```

**Table Styles (Palo IT Minimal)**
```scss
.repos-section {
  background-color: $palo-white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08); // Subtle shadow
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid $palo-gray-light;

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: $palo-black;
    margin: 0;
  }
}

.search-field {
  width: 300px;
  
  ::ng-deep .mat-mdc-text-field-wrapper {
    background-color: $palo-gray-light;
  }
}

.palo-table {
  width: 100%;
  background-color: $palo-white;

  th {
    background-color: $palo-white;
    color: $palo-gray-medium;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid $palo-gray-light;
    padding: 16px;
  }

  td {
    color: $palo-gray-dark;
    font-size: 14px;
    border-bottom: 1px solid $palo-gray-light;
    padding: 16px;
  }

  tr.table-row:hover {
    background-color: $palo-gray-light;
    transition: background-color 150ms ease;
  }
}

.repo-name {
  font-weight: 600;
  color: $palo-black;
}

.repo-description {
  color: $palo-gray-dark;
  display: block;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

### Inline Editable Field (Palo IT Minimal)

```html
<div class="editable-container">
  <mat-form-field appearance="outline" *ngIf="editing; else display" class="edit-field">
    <input matInput 
           [(ngModel)]="description" 
           (blur)="save()"
           (keyup.enter)="save()"
           (keyup.escape)="cancel()"
           placeholder="Add description...">
  </mat-form-field>

  <ng-template #display>
    <span (click)="startEdit()" class="editable-field">
      {{ description || 'Click to add description' }}
    </span>
  </ng-template>
</div>
```

**Styles**
```scss
.editable-field {
  cursor: pointer;
  color: $palo-gray-dark;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 150ms ease;
  
  &:hover {
    background-color: $palo-gray-light;
  }
  
  &:empty::before {
    content: 'Click to add description';
    color: $palo-gray-medium;
    font-style: italic;
  }
}

.edit-field {
  width: 100%;
  
  ::ng-deep .mat-mdc-text-field-wrapper {
    background-color: $palo-white;
  }
  
  ::ng-deep .mat-mdc-form-field-focus-overlay {
    background-color: transparent;
  }
  
  ::ng-deep .mdc-notched-outline__leading,
  ::ng-deep .mdc-notched-outline__notch,
  ::ng-deep .mdc-notched-outline__trailing {
    border-color: $palo-gray-light !important;
  }
  
  ::ng-deep .mat-mdc-form-field.mat-focused {
    .mdc-notched-outline__leading,
    .mdc-notched-outline__notch,
    .mdc-notched-outline__trailing {
      border-color: $tech-blue !important;
    }
  }
}
```

---

### Tech Stack Badge (Palo IT Style)

```html
<div class="tech-badges">
  <span *ngFor="let tech of techStack"
        class="tech-badge"
        [attr.data-tech]="tech.toLowerCase()">
    {{ tech }}
  </span>
</div>
```

**Styles (Minimal Badges)**
```scss
.tech-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  background-color: $palo-gray-light;
  color: $palo-gray-dark;
  border: 1px solid $palo-gray-light;
  transition: all 150ms ease;
  
  &:hover {
    border-color: $palo-gray-medium;
  }
  
  // Tech-specific colors (minimal, professional)
  &[data-tech="nodejs"],
  &[data-tech="node.js"] {
    background-color: rgba(0, 166, 81, 0.1);
    color: #00A651;
    border-color: rgba(0, 166, 81, 0.2);
  }
  
  &[data-tech="angular"] {
    background-color: rgba(221, 0, 49, 0.1);
    color: #DD0031;
    border-color: rgba(221, 0, 49, 0.2);
  }
  
  &[data-tech="dotnet"],
  &[data-tech=".net"],
  &[data-tech="c#"] {
    background-color: rgba(123, 63, 242, 0.1);
    color: #7B3FF2;
    border-color: rgba(123, 63, 242, 0.2);
  }
  
  &[data-tech="java"],
  &[data-tech="python"],
  &[data-tech="typescript"] {
    background-color: rgba(0, 102, 204, 0.1);
    color: #0066CC;
    border-color: rgba(0, 102, 204, 0.2);
  }
}

// Status Badge (similar minimal style)
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: capitalize;
  
  &[data-status="active"] {
    background-color: rgba(0, 166, 81, 0.1);
    color: #00A651;
    border: 1px solid rgba(0, 166, 81, 0.2);
  }
  
  &[data-status="paused"] {
    background-color: rgba(255, 140, 66, 0.1);
    color: #FF8C42;
    border: 1px solid rgba(255, 140, 66, 0.2);
  }
  
  &[data-status="archived"] {
    background-color: rgba(128, 128, 128, 0.1);
    color: #808080;
    border: 1px solid rgba(128, 128, 128, 0.2);
  }
}
```
```

---

## 6. Layout Patterns

### Responsive Grid (Palo IT Clean Style)

```html
<div class="repo-grid">
  <div *ngFor="let repo of repos$ | async" class="repo-card">
    <div class="card-header">
      <h3 class="card-title">{{ repo.name }}</h3>
      <span class="status-badge" [attr.data-status]="repo.status">
        {{ repo.status }}
      </span>
    </div>
    
    <div class="card-content">
      <p class="card-description">{{ repo.description }}</p>
      
      <div class="tech-badges">
        <span *ngFor="let tech of repo.techStack" 
              class="tech-badge"
              [attr.data-tech]="tech.toLowerCase()">
          {{ tech }}
        </span>
      </div>
      
      <div class="card-meta">
        <span class="meta-item">
          <mat-icon>folder</mat-icon>
          {{ repo.phase }}
        </span>
        <span class="meta-item">
          <mat-icon>access_time</mat-icon>
          {{ repo.lastScanned | date:'short' }}
        </span>
      </div>
    </div>
    
    <div class="card-actions">
      <button mat-button class="action-link">
        <mat-icon>edit</mat-icon>
        Edit
      </button>
      <button mat-button class="action-link" color="warn">
        <mat-icon>delete</mat-icon>
        Delete
      </button>
    </div>
  </div>
</div>
```

**Grid CSS (Minimal, Clean)**
```scss
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  padding: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
}

.repo-card {
  background-color: $palo-white;
  border: 1px solid $palo-gray-light;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 150ms ease, border-color 150ms ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: $palo-gray-medium;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid $palo-gray-light;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: $palo-black;
  margin: 0;
}

.card-content {
  padding: 20px;
}

.card-description {
  color: $palo-gray-dark;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  min-height: 42px; // 3 lines
}

.card-meta {
  display: flex;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid $palo-gray-light;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $palo-gray-medium;
  
  mat-icon {
    font-size: 16px;
    width: 16px;
    height: 16px;
  }
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid $palo-gray-light;
  background-color: $palo-gray-light;
}

.action-link {
  font-size: 13px;
  font-weight: 600;
  color: $tech-blue;
  
  mat-icon {
    font-size: 18px;
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  
  &:hover {
    background-color: rgba(0, 102, 204, 0.08);
  }
  
  &[color="warn"] {
    color: $warning-orange;
    
    &:hover {
      background-color: rgba(255, 140, 66, 0.08);
    }
  }
}
```
```

---

## 7. Icons

**Icon Set:** Material Icons (Outline style for minimal aesthetic)

```typescript
// app.config.ts
provideHttpClient(),
provideAnimations(),
importProvidersFrom(MatIconModule)
```

**Usage (Palo IT Minimal)**
```html
<!-- Actions -->
<mat-icon>edit</mat-icon>
<mat-icon>delete_outline</mat-icon>
<mat-icon>refresh</mat-icon>
<mat-icon>open_in_new</mat-icon>

<!-- Navigation -->
<mat-icon>search</mat-icon>
<mat-icon>filter_list</mat-icon>
<mat-icon>more_vert</mat-icon>

<!-- Status Indicators -->
<mat-icon>check_circle_outline</mat-icon>   <!-- Active -->
<mat-icon>pause_circle_outline</mat-icon>   <!-- Paused -->
<mat-icon>archive</mat-icon>                <!-- Archived -->

<!-- Tech/Content -->
<mat-icon>folder_open</mat-icon>
<mat-icon>code</mat-icon>
<mat-icon>access_time</mat-icon>
```

**Icon Styling**
```scss
mat-icon {
  color: $palo-gray-medium;
  
  &.primary-icon {
    color: $tech-blue;
  }
  
  &.success-icon {
    color: $success-green;
  }
  
  &.warn-icon {
    color: $warning-orange;
  }
}
```

---

## 8. Animation (Minimal, Performance-First)

**Palo IT Animation Standards**
```scss
// Subtle transitions (Palo IT style)
$transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
$transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
$transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1);

// Hover states (minimal)
.interactive-element {
  transition: all $transition-fast;
  
  &:hover {
    background-color: $palo-gray-light;
  }
}

// Table row hover
.mat-mdc-row {
  transition: background-color $transition-fast;
  
  &:hover {
    background-color: $palo-gray-light;
  }
}

// Fade in (subtle, not distracting)
@keyframes fadeInSubtle {
  from { 
    opacity: 0; 
    transform: translateY(-4px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.fade-in {
  animation: fadeInSubtle 200ms ease-out;
}

// Loading state
.loading-indicator {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// NOTE: Avoid complex animations - Palo IT style is minimal and professional
```

---

## 9. Accessibility (WCAG AA Compliance)

### Color Contrast Standards

**Palo IT Color Accessibility**
| Combination | Contrast Ratio | WCAG Rating |
|-------------|----------------|-------------|
| Black on White (#000 / #FFF) | 21:1 | AAA ✓✓✓ |
| Dark Gray on White (#404040 / #FFF) | 10.4:1 | AAA ✓✓✓ |
| Tech Blue on White (#0066CC / #FFF) | 8.6:1 | AAA ✓✓✓ |
| Medium Gray on White (#808080 / #FFF) | 3.9:1 | AA (large text) |
| Success Green on White (#00A651 / #FFF) | 4.5:1 | AA ✓✓ |

### ARIA Labels & Semantic HTML
```html
<!-- Toolbar with proper semantics -->
<mat-toolbar role="banner" aria-label="Main navigation">
  <img src="assets/images/palo-it-logo.png" 
       alt="Palo IT Logo" 
       role="img">
  <button mat-button 
          aria-label="Scan repositories now"
          [matTooltip]="'Refresh repository list'">
    <mat-icon aria-hidden="true">refresh</mat-icon>
    Scan Now
  </button>
</mat-toolbar>

<!-- Table with screen reader support -->
<table mat-table 
       role="table" 
       aria-label="Repository list"
       [dataSource]="repos$">
  <ng-container matColumnDef="name">
    <th mat-header-cell *matHeaderCellDef scope="col">Name</th>
    <td mat-cell *matCellDef="let repo">{{ repo.name }}</td>
  </ng-container>
</table>

<!-- Interactive elements -->
<button mat-icon-button 
        aria-label="Edit repository details"
        [matTooltip]="'Edit'">
  <mat-icon aria-hidden="true">edit</mat-icon>
</button>

<!-- Status announcements -->
<div role="status" 
     aria-live="polite" 
     aria-atomic="true" 
     class="sr-only">
  {{ statusMessage }}
</div>
```

### Keyboard Navigation
- **Tab:** Navigate between interactive elements
- **Enter/Space:** Activate buttons and links
- **Escape:** Close dialogs and cancel inline edits
- **Arrow Keys:** Navigate table cells (native browser behavior)
- **Shift + Tab:** Navigate backwards

### Focus Management
```scss
// Visible focus indicators (Palo IT style)
:focus-visible {
  outline: 2px solid $tech-blue;
  outline-offset: 2px;
  border-radius: 4px;
}

// Remove default outline, rely on :focus-visible
:focus:not(:focus-visible) {
  outline: none;
}

// Button focus
button:focus-visible {
  outline: 2px solid $tech-blue;
  outline-offset: 2px;
}

// Input focus (Material Design)
.mat-mdc-form-field.mat-focused {
  .mdc-notched-outline {
    border-color: $tech-blue;
  }
}
```

### Screen Reader Utilities
```scss
// Visually hidden but accessible to screen readers
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 10. Responsive Breakpoints

**Palo IT Responsive Strategy**

```scss
// Mobile first approach
$breakpoint-mobile: 375px;   // Small phones
$breakpoint-tablet: 768px;   // Tablets, large phones
$breakpoint-desktop: 1024px; // Desktop
$breakpoint-wide: 1440px;    // Wide screens

// Usage
@media (max-width: 767px) {
  // Mobile styles
  .palo-toolbar {
    height: 56px;
    padding: 0 16px;
  }
  
  .logo-section {
    .app-title {
      display: none; // Hide app title on mobile
    }
  }
  
  .palo-table {
    display: none; // Switch to card view
  }
  
  .repo-grid {
    grid-template-columns: 1fr;
    padding: 16px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  // Tablet styles
  .content-wrapper {
    max-width: 768px;
    padding: 32px 24px;
  }
  
  .repo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  // Desktop styles
  .content-wrapper {
    max-width: 1200px;
    padding: 40px 24px;
  }
  
  .repo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1440px) {
  // Wide screen optimization
  .content-wrapper {
    max-width: 1400px;
  }
}
```

---

## 11. Theming Configuration

**Angular Material Theme (Palo IT)**

```scss
// _theme.scss
@use '@angular/material' as mat;

// Include core styles
@include mat.core();

// Define Palo IT theme
$palo-primary: mat.define-palette((
  50: #E6F0FF,
  100: #B3D9FF,
  200: #80C2FF,
  300: #4DABFF,
  400: #2699FF,
  500: #0066CC,  // Tech Blue
  600: #005BB8,
  700: #004C99,
  800: #003D7A,
  900: #002E5C,
  contrast: (
    50: rgba(black, 0.87),
    100: rgba(black, 0.87),
    200: rgba(black, 0.87),
    300: rgba(black, 0.87),
    400: white,
    500: white,
    600: white,
    700: white,
    800: white,
    900: white,
  )
));

$palo-accent: mat.define-palette((
  500: #000000,  // Palo IT Black
  contrast: (
    500: white,
  )
));

$palo-warn: mat.define-palette((
  500: #FF8C42,  // Warning Orange
  contrast: (
    500: white,
  )
));

// Create theme
$palo-theme: mat.define-light-theme((
  color: (
    primary: $palo-primary,
    accent: $palo-accent,
    warn: $palo-warn,
  ),
  typography: mat.define-typography-config(
    $font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,
  ),
  density: 0,
));

// Apply theme
@include mat.all-component-themes($palo-theme);

// Global overrides for Palo IT minimal style
.mat-mdc-button,
.mat-mdc-raised-button,
.mat-mdc-outlined-button {
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: none; // No uppercase
}

.mat-mdc-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important; // Subtle shadow
}

.mat-mdc-snack-bar-container {
  background-color: $palo-black !important;
  color: $palo-white !important;
}
```

---

## 12. Implementation Checklist

**Before Development:**
- [ ] Install Angular Material 18+
- [ ] Configure Palo IT theme in `styles.scss`
- [ ] Add Palo IT logo to `src/assets/images/`
- [ ] Set up system font stack in global styles
- [ ] Configure color variables (SCSS or CSS custom properties)

**Component Development:**
- [ ] Use standalone components (Angular 18+)
- [ ] Apply Palo IT color palette consistently
- [ ] Ensure logo appears in toolbar on all pages
- [ ] Implement responsive breakpoints
- [ ] Add keyboard navigation support
- [ ] Test color contrast (WCAG AA minimum)

**Quality Gates:**
- [ ] Lighthouse accessibility score > 90
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Keyboard navigation fully functional
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] Logo displays correctly on all screen sizes
- [ ] No console errors or warnings

---

**Dependencies:**
```json
{
  "@angular/material": "^18.0.0",
  "@angular/cdk": "^18.0.0",
  "material-icons": "^1.0.0"
}
```

**Assets Required:**
- `src/assets/images/palo-it-logo.png` (40px height recommended)
- Material Icons font (loaded via CDN or npm)

**Version:** 1.0.0  
**Last Updated:** 2026-05-04  
**Design System:** Palo IT Minimal & Professional  
**Brand Compliance:** ✅ Approved
