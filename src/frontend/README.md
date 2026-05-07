# Dev Dashboard - Frontend

Local Angular Material SPA for managing code repositories on developer's laptop.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x LTS
- npm 10.x or later

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Navigate to `http://localhost:4200/`

## 📁 Project Structure

```
src/
├── app/
│   ├── domain/              # Layer 1: Domain Models
│   │   ├── repository.model.ts
│   │   ├── workspace-config.model.ts
│   │   └── scan-result.model.ts
│   ├── services/            # Layer 2: Core Services
│   │   ├── filesystem.service.ts
│   │   ├── workspace-config.service.ts
│   │   └── repository-scanner.service.ts
│   ├── state/               # Layer 3: State Management
│   │   ├── repository.store.ts
│   │   └── repository-state.service.ts
│   ├── components/          # Layer 4: UI Components
│   │   ├── repository-list/
│   │   └── index.ts
│   ├── app.component.ts     # Root component
│   └── app.component.html
├── assets/                  # Static assets
├── index.html               # HTML entry point
├── main.ts                  # TypeScript entry point
└── styles.scss              # Global styles
```

## 🧪 Testing

### Unit Tests (Jasmine + Karma)

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Coverage target: ≥80%
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run e2e
```

## 🏗️ Build

### Development Build

```bash
npm run build
```

### Production Build

```bash
npm run build:prod
```

### WAR Package (for Apache deployment)

```bash
npm run package:war
```

This creates `dist/dev-dashboard.war` ready for Apache deployment.

## 🎯 TDD Workflow

This project follows **RED-GREEN-REFACTOR** TDD approach:

### Layer-by-Layer Implementation

1. **Layer 1: Domain Models** (2 hours)
   - Define interfaces
   - No tests needed (pure TypeScript interfaces)

2. **Layer 2: Core Services** (8 hours)
   - Write failing test (RED)
   - Implement minimal code to pass (GREEN)
   - Refactor for quality (REFACTOR)
   - Repeat for each method

3. **Layer 3: State Management** (3 hours)
   - Test state transitions
   - Test side effects
   - Test error handling

4. **Layer 4: UI Components** (2 hours)
   - Test component logic
   - Test template rendering
   - Test user interactions

### Running TDD Cycles

```bash
# Terminal 1: Watch mode for tests
npm test

# Terminal 2: Development server
npm start

# Write failing test → Implement code → Refactor → Commit
```

## 📊 Sprint 1 Implementation Plan

### User Story: REPO-001-US-001 (Scan Workspace Directories)

**Day 1-3 (May 8-10, 2026)**

**Day 1:**
- ✅ Domain models complete (Repository, ScanResult, WorkspaceConfig)
- 🔴 RED: Write tests for FileSystemService
- 🟢 GREEN: Implement FileSystemService
- 🔵 REFACTOR: Optimize for performance
- ⚠️ **CRITICAL**: Prototype scanning on real directories (Hour 1-2)

**Day 2:**
- 🔴 RED: Write tests for RepositoryScannerService
- 🟢 GREEN: Implement recursive scanning
- 🔵 REFACTOR: Add parallel scanning
- ✅ Integration test: Scan both workspaces

**Day 3:**
- 🔴 RED: Write tests for RepositoryStateService
- 🟢 GREEN: Implement state management
- 🔴 RED: Write tests for AppComponent
- 🟢 GREEN: Implement UI trigger
- ✅ BDD scenarios passing
- ✅ Code review

## 🎨 Design System

### Colors (Palo IT Brand)

```scss
--color-primary: #0066CC;     // Tech Blue
--color-black: #000000;       // Black
--color-white: #FFFFFF;       // White
--color-gray-light: #F0F0F0;  // Light Gray
--color-gray-medium: #808080; // Medium Gray
--color-gray-dark: #404040;   // Dark Gray
--color-purple: #7B3FF2;      // Purple (Phase)
--color-green: #00A651;       // Green (Status)
--color-orange: #FF8C42;      // Orange (Warning)
```

### Spacing (4px base)

```scss
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```

### Typography

- **Font Family**: Roboto, "Helvetica Neue", Arial, sans-serif
- **Sizes**: 48px (h1), 32px (h2), 20px (h3), 16px (body), 12px (small)
- **Weights**: 400 (normal), 500 (medium), 700 (bold)

## 🔧 Configuration

### TypeScript Paths

Use barrel imports for clean code:

```typescript
import { Repository } from '@domain/repository.model';
import { FileSystemService } from '@services/filesystem.service';
import { RepositoryStateService } from '@state/repository-state.service';
import { RepositoryListComponent } from '@components/repository-list.component';
```

### Workspace Directories

Default workspace paths (configured in `workspace-config.model.ts`):
- `/Users/oboukhris-palo/workspace`
- `/Users/oboukhris-palo/Documents/workspace`

## 📝 Code Conventions

### Service Methods

```typescript
// All service methods return Observables
methodName(param: Type): Observable<ReturnType> {
  // Implementation
}
```

### Component Structure

```typescript
@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // Always use OnPush
})
```

### Test Data IDs

Use `data-testid` attributes for E2E tests:

```html
<button data-testid="btn-scan-app">Scan</button>
<div data-testid="card-repository-my-repo">...</div>
```

Pattern: `{element}-{descriptor}-{component}`

## 🚨 Known Limitations

### Browser Environment

Currently implements **mock filesystem** for browser compatibility:
- Real filesystem access not available in browser
- Use demo/mock data for development

### Future Enhancement: Electron/Tauri

For production use with real filesystem access:
- Wrap with Electron or Tauri
- Implement native filesystem APIs
- See implementation notes in `filesystem.service.ts`

## 📦 Dependencies

### Core
- Angular 18+ (standalone components)
- Angular Material 18+
- RxJS 7.8+

### State Management
- @ngneat/elf (lightweight alternative to NgRx)
- @ngneat/elf-entities (entity management)

### Testing
- Jasmine + Karma (unit tests)
- Playwright (E2E tests)
- Istanbul/nyc (coverage)

## 🎯 Performance Targets

- **Scan Duration**: < 5 seconds for 100 repositories
- **LCP (Largest Contentful Paint)**: < 1 second
- **Bundle Size**: < 500KB gzipped
- **Test Coverage**: ≥ 80% (statements, branches, functions, lines)

## 📚 Documentation

- [Requirements](../../docs/01-requirements/requirements.md)
- [User Stories](../../docs/01-requirements/user-stories.md)
- [Architecture Design](../../docs/02-architecture/architecture-design.md)
- [Implementation Plans](../../docs/05-implementation/epics/)
- [Sprint 1 Plan](../../docs/05-implementation/current-sprint.md)

## 🤝 Contributing

Follow TDD workflow:
1. Pick a TODO from implementation plan
2. Write failing test (RED)
3. Implement minimal code (GREEN)
4. Refactor for quality (REFACTOR)
5. Commit with descriptive message
6. Move to next TODO

## 📄 License

Internal project - Palo IT Labs

---

**Sprint 1 Status:** Ready for Implementation 🚀  
**Target:** REPO-001-US-001 & REPO-001-US-002 (8 SP)  
**Timeline:** May 8-14, 2026
