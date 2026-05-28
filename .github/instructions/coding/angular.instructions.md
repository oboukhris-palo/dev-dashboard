---
description: Angular framework best practices, patterns, and conventions
applyTo: "frontend/**,**/*.ts"
priority: high
enforcement: strict
---

# Angular Framework Best Practices & Conventions

This document establishes systematic coding standards and best practices for Angular development following the SOLID principles, Clean Code methodology, and AI-first delivery patterns. These guidelines ensure consistency, quality, maintainability, and scalability across all Angular projects.

---

## 1. Project Setup & Angular CLI

### Initial Setup
```bash
# Create new Angular project (standalone components recommended for Angular 17+)
ng new project-name --standalone --routing --package-manager=npm

# Install dependencies
npm install

# Start development server on http://localhost:4200
ng serve

# Build for production
ng build --prod

# Run tests
ng test

# Run linting
ng lint
```

### Version Requirements
- **Angular**: 17.x or higher
- **Node.js**: 18.x or higher
- **TypeScript**: 5.2.x or higher
- **npm**: 9.x or higher

### Project Configuration
Keep `angular.json` optimized:
- Set `budgets` for bundle size limits (alert at 500KB, error at 800KB)
- Enable `production` optimizations: AOT, minification, dead code elimination
- Configure CSS/SCSS preprocessor settings

---

## 2. Component Architecture & Best Practices

### 2.1 Component Declaration
Use **standalone components** (Angular 17+) with `OnPush` change detection:
```typescript
// ✅ GOOD: Standalone component with OnPush
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, ItemStatusComponent, PaginationComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush  // ⭐ Always use OnPush
})
export class ItemListComponent {
  @Input() items: Item[] = [];
  @Output() itemSelected = new EventEmitter<Item>();

  onItemClick(item: Item): void {
    this.itemSelected.emit(item);
  }
}
```

### 2.2 Component Organization & File Structure
```
src/app/
├── pages/                    # Routed page components
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   ├── dashboard.component.css
│   │   └── dashboard.component.spec.ts
│   └── items/
│       ├── items.component.ts
│       └── ...
├── shared/                   # App-wide reusable code
│   ├── components/           # Presentational components
│   ├── services/             # Business logic
│   ├── models/               # TypeScript interfaces
│   ├── pipes/                # Custom pipes
│   ├── directives/           # Custom directives
│   └── guards/               # Route guards
├── layout/                   # Shell layout
│   ├── layout.component.ts
│   ├── header.component.ts
│   └── navigation.component.ts
└── app.routes.ts             # Route definitions
```

**Naming**: kebab-case files (e.g., `item-list.component.ts`, `item.service.ts`, `item.model.ts`)

### 2.3 Component Lifecycle & OnInit
```typescript
import { Component, OnInit, OnDestroy, Input, ChangeDetectionStrategy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-detail.component.html',
  styleUrl: './item-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  @Input() itemId?: string;
  item$ = new Subject<Item>();
  private destroy$ = new Subject<void>();

  constructor(
    private itemService: ItemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.itemId) {
      this.itemService
        .getItemById(this.itemId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(item => {
          this.item$.next(item);
          this.cdr.markForCheck();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 2.4 Component Input/Output & Communication
```typescript
// Parent → Child: @Input | Child → Parent: @Output
@Component({
  selector: 'app-parent',
  template: `<app-child [item]="selected" (itemDeleted)="onDelete($event)"></app-child>`
})
export class ParentComponent {
  selected: Item | null = null;
  onDelete(item: Item): void { /* handle delete */ }
}

@Component({
  selector: 'app-child',
  standalone: true,
  template: `<button (click)="delete()">Delete</button>`
})
export class ChildComponent {
  @Input() item: Item | null = null;
  @Output() itemDeleted = new EventEmitter<Item>();

  delete(): void {
    if (this.item) this.itemDeleted.emit(this.item);
  }
}
```

**Rules**:
- Single responsibility per component
- Use `@Input` for parent → child data
- Use `@Output` + `EventEmitter` for child → parent (avoid two-way binding)
- Move business logic to services

### 2.5 Change Detection Strategy
Always use **OnPush** for performance:
```typescript
@Component({
  selector: 'app-item-list',
  changeDetection: ChangeDetectionStrategy.OnPush  // ⭐ Always use this
})
export class ItemListComponent {
  // Checks only on:
  // 1. @Input change
  // 2. @Output events
  // 3. Async pipe emissions
  // 4. Manual ChangeDetectorRef.markForCheck()
}
```

---

## 3. Services & Dependency Injection

### 3.1 Service Creation
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })  // App-wide singleton
export class ItemService {
  private apiUrl = '/api/items';

  constructor(private http: HttpClient) {}

  /** Fetch all items with optional filters */
  getItems(filters?: ItemFilters): Observable<Item[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);

    return this.http.get<Item[]>(this.apiUrl, { params }).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      map(items => items.map(item => this.enrichItem(item))),
      catchError(error => {
        console.error('Failed to fetch items:', error);
        throw new Error(`Item service error: ${error.message}`);
      })
    );
  }

  /** Fetch single item by ID */
  getItemById(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          throw new Error(`Failed to fetch item ${id}: ${error.message}`);
        })
      );
  }

  /** Update item */
  updateItem(id: string, data: Partial<Item>): Observable<Item> {
    return this.http.patch<Item>(`${this.apiUrl}/${id}`, data);
  }

  /** Private: Enrich item with computed properties */
  private enrichItem(item: Item): Item {
    return { ...item, computed: this.calculateComputed(item) };
  }

  private calculateComputed(item: Item): any { /* business logic */ }
}
```

### 3.2 HTTP Interceptor Pattern
```typescript
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Redirect to login
        }
        throw error;
      })
    );
  }
}

// Provide in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([apiInterceptor]))]
};
```

### 3.3 Dependency Injection Rules
```typescript
// ✅ GOOD: Constructor injection
@Component({...})
export class ItemsComponent {
  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute
  ) {}
}

// ❌ BAD: Service locator pattern
export class BadComponent {
  constructor(private injector: Injector) {
    const service = this.injector.get(ItemService);  // Avoid
  }
}
```

---

## 4. RxJS & Reactive Programming

### 4.1 Observable Patterns
```typescript
// Fetch and cache data
items$ = this.itemService.getItems().pipe(
  shareReplay({ bufferSize: 1, refCount: true }),
  catchError(error => {
    console.error('Failed to load items', error);
    return of([]); // Fallback
  })
);

// Combine and filter
filteredItems$ = combineLatest([this.items$, this.filter$]).pipe(
  map(([items, filter]) => items.filter(i => i.status === filter))
);

// Debounce form changes
saveItem$ = this.form.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(data => this.itemService.updateItem(data.id, data)),
  catchError(error => (this.error = error.message, EMPTY))
);
```

### 4.2 Subject vs BehaviorSubject
```typescript
// BehaviorSubject: State (late subscribers get last value)
private selectedSubject = new BehaviorSubject<Item | null>(null);
selected$ = this.selectedSubject.asObservable();
select(item: Item): void { this.selectedSubject.next(item); }

// Subject: Events (late subscribers miss past events)
private deletedSubject = new Subject<Item>();
deleted$ = this.deletedSubject.asObservable();
confirmDelete(item: Item): void { this.deletedSubject.next(item); }
```

### 4.3 Unsubscribe Patterns
```typescript
// ✅ BEST: takeUntil for manual subscriptions
export class ItemListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.itemService.getItems()
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => this.items = items);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ✅ GOOD: Async pipe (automatic cleanup)
export class ItemListComponent {
  items$ = this.itemService.getItems();
  // In template: {{ items$ | async }}
}

// ❌ BAD: Manual subscription management
private sub?: Subscription;
ngOnInit(): void { this.sub = this.itemService.getItems().subscribe(...); }
ngOnDestroy(): void { this.sub?.unsubscribe(); }  // Easy to forget
```

---

## 5. Routing & Navigation

### 5.1 Route Configuration
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent },
      { path: 'items', component: ItemsComponent },
      { path: 'items/:id', component: ItemDetailComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'home' }
];

// main.ts
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
```

### 5.2 Route Guards
```typescript
// Functional guard (modern, preferred)
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

// Class-based guard (complex logic)
@Injectable({ providedIn: 'root' })
export class ItemExistsGuard implements CanActivate {
  constructor(private itemService: ItemService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const id = route.paramMap.get('id');
    return this.itemService.getItemById(id!).pipe(
      map(() => true),
      catchError(() => (this.router.navigate(['/items']), of(false)))
    );
  }
}
```

### 5.3 Navigation
```typescript
@Component({...})
export class ItemsComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  viewItem(id: string): void {
    this.router.navigate([id], { relativeTo: this.route });
  }

  filterByStatus(status: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status },
      queryParamsHandling: 'merge'
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => this.status = params['status']);
  }

  goBack(): void { window.history.back(); }
}
```

---

## 6. Forms & Validation

### 6.1 Reactive Forms
```typescript
@Component({
  selector: 'app-filter-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="status" required />
      @if (form.get('status')?.hasError('required')) {
        <span>Status required</span>
      }
      <button [disabled]="form.invalid">Filter</button>
    </form>
  `
})
export class FilterFormComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private itemService: ItemService) {
    this.form = this.fb.group({
      status: ['', Validators.required],
      from: [''],
      to: ['']
    }, { validators: this.dateRangeValidator });
  }

  private dateRangeValidator(g: FormGroup): ValidationErrors | null {
    const from = g.get('from')?.value;
    const to = g.get('to')?.value;
    return from && to && new Date(from) > new Date(to) 
      ? { dateRange: true } 
      : null;
  }

  submit(): void {
    if (this.form.valid) {
      this.itemService.getItems(this.form.value).subscribe();
    }
  }
}
```

### 6.2 Custom Validators
```typescript
export function businessEmailValidator(ctrl: AbstractControl): ValidationErrors | null {
  if (!ctrl.value) return null;
  const tempDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
  const domain = ctrl.value.split('@')[1];
  return tempDomains.includes(domain) ? { tempEmail: true } : null;
}

// Usage
this.form.get('email')?.setValidators([
  Validators.required,
  Validators.email,
  businessEmailValidator
]);
```

### 6.3 Async Form Submission
```typescript
@Component({...})
export class EditItemComponent {
  form: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private itemService: ItemService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      value: ['', Validators.required]
    });
  }

  submit(): void {
    if (!this.form.valid) return;

    this.isSubmitting = true;
    this.itemService.updateItem(this.form.value)
      .pipe(
        finalize(() => this.isSubmitting = false),
        catchError(error => (console.error(error), EMPTY))
      )
      .subscribe(() => this.router.navigate(['../'], { relativeTo: this.route }));
  }
}
```

---

## 7. Performance Optimization

### 7.1 OnPush Change Detection
```typescript
// ⭐ Always use OnPush for performance
@Component({
  selector: 'app-item-card',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemCardComponent {
  @Input() item!: Item;
  // Checks only on @Input changes
}
```

### 7.2 TrackBy for Lists
```typescript
// ❌ BAD: Full re-render on data change
<div *ngFor="let item of items">{{ item.name }}</div>

// ✅ GOOD: Only changed items re-rendered
<div *ngFor="let item of items; trackBy: trackById">
  {{ item.name }}
</div>

trackById(index: number, item: Item): string { return item.id; }
```

### 7.3 Lazy Loading Routes
```typescript
export const routes: Routes = [
  {
    path: 'items',
    loadChildren: () => import('./items/items.routes').then(m => m.ITEMS_ROUTES)
  }
];

// items/items.routes.ts
export const ITEMS_ROUTES: Routes = [
  { path: '', component: ItemsComponent },
  { path: ':id', component: ItemDetailComponent }
];
```

---

## 8. Testing

### 8.1 Component Unit Tests
```typescript
describe('ItemListComponent', () => {
  let component: ItemListComponent;
  let fixture: ComponentFixture<ItemListComponent>;
  let mockService: jasmine.SpyObj<ItemService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('ItemService', ['getItems']);

    await TestBed.configureTestingModule({
      imports: [ItemListComponent],
      providers: [{ provide: ItemService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemListComponent);
    component = fixture.componentInstance;
  });

  it('should display items on init', fakeAsync(() => {
    const mockItems = [{ id: '1', name: 'Item 1' }];
    mockService.getItems.and.returnValue(of(mockItems));

    fixture.detectChanges();
    tick();

    expect(mockService.getItems).toHaveBeenCalled();
    expect(component.items).toEqual(mockItems);
  }));

  it('should emit event on selection', () => {
    spyOn(component.selected, 'emit');
    const item = { id: '1', name: 'Item 1' };
    component.select(item);
    expect(component.selected.emit).toHaveBeenCalledWith(item);
  });
});
```

### 8.2 Service Tests
```typescript
describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemService]
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch items', () => {
    const mockItems = [{ id: '1', name: 'Item 1' }];
    service.getItems().subscribe(items => {
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne('/api/items');
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });

  it('should handle HTTP errors', () => {
    service.getItems().subscribe(
      () => fail('should error'),
      (error: any) => {
        expect(error.message).toContain('service error');
      }
    );

    httpMock.expectOne('/api/items').error(new ErrorEvent('Network'));
  });
});
```

### 8.3 Test Coverage Targets
- **Unit tests**: 70% (business logic, services)
- **Integration tests**: 20% (component + service)
- **E2E tests**: 10% (critical flows)
- **Target**: 80%+ coverage for `src/app/`

---

## 9. Security

### 9.1 Input Sanitization
```typescript
@Component({
  selector: 'app-html-display',
  template: `<div [innerHTML]="sanitized"></div>`
})
export class HtmlDisplayComponent {
  sanitized: SafeHtml;
  constructor(private sanitizer: DomSanitizer) {}

  display(html: string): void {
    // Always sanitize user input
    this.sanitized = this.sanitizer.sanitize(SecurityContext.HTML, html) || '';
  }
}
```

### 9.2 Token Management
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'authToken';

  setToken(token: string): void { localStorage.setItem(this.tokenKey, token); }
  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  clearToken(): void { localStorage.removeItem(this.tokenKey); }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  }
}
```

### 9.3 CSRF Protection
```typescript
// Angular automatically handles CSRF in HttpClient (looks for X-CSRF-TOKEN header)

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private csrfService: CsrfTokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.csrfService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { 'X-CSRF-TOKEN': token }
      });
    }
    return next.handle(req);
  }
}
```

### 9.4 XSS Prevention
```typescript
// ✅ SAFE: Angular interpolation (auto-escapes)
<div>{{ userText }}</div>

// ⚠️ CAREFUL: Only for trusted data
<div [innerHTML]="sanitizedHtml"></div>

// ❌ NEVER: String concatenation
// element.innerHTML = "Hello " + userInput;  // XSS risk
```

---

## 10. Accessibility (WCAG 2.1 AA)

### 10.1 Semantic HTML & ARIA
```typescript
@Component({
  selector: 'app-invoice-list',
  template: `
    <!-- Use semantic elements -->
    <main role="main">
      <h1>Invoices</h1>
      
      <!-- Use proper table structure -->
      <table role="table">
        <thead>
          <tr>
            <th scope="col">Invoice #</th>
            <th scope="col">Amount</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let invoice of invoices">
            <td>{{ invoice.number }}</td>
            <td>{{ invoice.amount | currency }}</td>
            <td>{{ invoice.status }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Use aria-label for icon buttons -->
      <button aria-label="Download invoice" (click)="onDownload()">
        <i class="icon-download"></i>
      </button>

      <!-- Use aria-live for dynamic updates -->
      <div aria-live="polite" aria-atomic="true">
        @if (loadingMessage) {
          {{ loadingMessage }}
        }
      </div>
    </main>
  `
})
export class InvoiceListComponent {}
```

### 10.2 Keyboard Navigation
```typescript
// Enable keyboard support for custom components
@Component({
  selector: 'app-invoice-item',
  template: `
    <div 
      role="button" 
      tabindex="0"
      (click)="select()"
      (keydown.enter)="select()"
      (keydown.space)="select()"
      [attr.aria-selected]="isSelected"
    >
      {{ invoice.amount }}
    </div>
  `
})
export class InvoiceItemComponent {
  @Output() selected = new EventEmitter<void>();

  select(): void {
    this.selected.emit();
  }
}
```

### 10.3 Focus Management
```typescript
@Component({...})
export class DialogComponent implements AfterViewInit {
  @ViewChild('closeButton') closeButton?: ElementRef;
  private previousActiveElement: HTMLElement | null = null;

  ngAfterViewInit(): void {
    // Set focus to first interactive element when dialog opens
    this.closeButton?.nativeElement.focus();
  }

  closeDialog(): void {
    // Restore focus to previously focused element
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }
}
```

---

## 11. Styling & Theming

### 11.1 CSS Organization
```css
/* styles/global.css */
/* Base styles and CSS variables */

:root {
  /* Colors */
  --color-primary: #0066cc;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-text: #111827;
  --color-border: #e5e7eb;
  --color-background: #f9fafb;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Typography */
  --font-family: system-ui, -apple-system, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.5;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

body {
  font-family: var(--font-family);
  color: var(--color-text);
  background: var(--color-background);
}

/* Component styles */
```

### 11.2 Component Styles (Scoped)
```typescript
@Component({
  selector: 'app-invoice-status-badge',
  standalone: true,
  template: `<span [ngClass]="getClasses()">{{ status }}</span>`,
  styles: [`
    span {
      display: inline-block;
      padding: var(--space-sm) var(--space-md);
      border-radius: 0.25rem;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .status-unpaid {
      background-color: #fee2e2;  /* Light red */
      color: #991b1b;  /* Dark red */
    }

    .status-paid {
      background-color: #d1fae5;  /* Light green */
      color: #065f46;  /* Dark green */
    }

    .status-partial {
      background-color: #dbeafe;  /* Light blue */
      color: #1e40af;  /* Dark blue */
    }
  `]
})
export class InvoiceStatusBadgeComponent {
  @Input() status: InvoiceStatus = 'unpaid';

  getClasses(): string[] {
    return ['status', `status-${this.status}`];
  }
}
```

### 11.3 Responsive Design
```css
/* Mobile first approach */
.invoice-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .invoice-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .invoice-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## 12. Common Pitfalls & How to Avoid

### 12.1 Memory Leaks (Unsubscribed Observables)
```typescript
// ❌ MEMORY LEAK: Subscription never cleaned up
export class BadComponent implements OnInit {
  ngOnInit(): void {
    this.service.getData().subscribe(data => {
      this.data = data;
    });  // No unsubscribe!
  }
}

// ✅ FIXED: Use takeUntil
export class GoodComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.service.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 12.2 Excessive Change Detection
```typescript
// ❌ DEFAULT: Component checks on every event
@Component({
  selector: 'app-list',
  template: `<div *ngFor="let item of items">{{ item.name }}</div>`
  // No changeDetection specified = CheckAlways
})

// ✅ GOOD: OnPush only checks on input change
@Component({
  selector: 'app-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush  // <-- Add this
})
```

### 12.3 Mutating Form Values
```typescript
// ❌ BAD: Direct mutation
this.form.value.amount = 100;  // Won't trigger validation

// ✅ GOOD: Use form methods
this.form.patchValue({ amount: 100 });
this.form.setValue({ amount: 100 });
```

### 12.4 Calling Async Operations in Template
```typescript
// ❌ BAD: Calls function on every change detection cycle
<div>{{ expensiveFunction() }}</div>

// ✅ GOOD: Pre-compute in component
export class Component {
  computedValue = this.expensiveFunction();
}
```

### 12.5 Not Handling Observable Errors
```typescript
// ❌ BAD: Error stops observable, page breaks
this.service.loadData().subscribe(data => {
  this.data = data;
});

// ✅ GOOD: Handle errors gracefully
this.service.loadData()
  .pipe(
    catchError(error => {
      console.error('Failed to load:', error);
      return of(null);  // Fallback value
    })
  )
  .subscribe(data => {
    this.data = data;
  });
```

---

## 13. Code Organization & Best Practices

### 13.1 Folder Structure (by feature)
```
src/app/
├── shared/                    # Reusable across entire app
│   ├── components/
│   │   ├── invoice-status-badge/
│   │   ├── pagination/
│   │   └── loading-spinner/
│   ├── services/
│   │   ├── invoice.service.ts
│   │   ├── merchant.service.ts
│   │   ├── api.service.ts
│   │   └── auth.service.ts
│   ├── models/
│   │   ├── invoice.model.ts
│   │   ├── merchant.model.ts
│   │   └── index.ts
│   ├── pipes/
│   │   └── currency-format.pipe.ts
│   ├── directives/
│   │   └── highlight.directive.ts
│   └── guards/
│       └── auth.guard.ts
│
├── layout/                    # App shell
│   ├── layout.component.ts
│   ├── header.component.ts
│   ├── navigation.component.ts
│   ├── footer.component.ts
│   └── layout.component.css
│
├── pages/                     # Routed page components
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── dashboard.component.spec.ts
│   └── invoices/
│       ├── invoices.component.ts
│       ├── invoices.component.html
│       ├── invoices-list.component.ts
│       └── invoices.component.spec.ts
│
├── app.routes.ts              # Route configuration
├── app.component.ts           # Root component
└── app.config.ts              # App configuration
```

### 13.2 Model Definitions (Type Safety)
```typescript
// shared/models/invoice.model.ts
export interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  currency: 'EUR' | 'USD';
  date: Date;
  dueDate: Date;
  status: InvoiceStatus;
  description?: string;
  items?: InvoiceItem[];
}

export type InvoiceStatus = 'unpaid' | 'paid' | 'paid-in-part';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  tax: number;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
}

// Re-export from index for convenience
export * from './invoice.model';
```

### 13.3 API Service Pattern
```typescript
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Generic GET method
   */
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic POST method
   */
  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Generic error handler
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.message || `Status: ${error.status}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
```

---

## 14. Project-Specific Conventions (Merchant Portal)

### 14.1 Styling & Design System
- **CSS Framework**: Bootstrap 5
- **Color Palette**: 
  - Primary: Blue (#0066cc)
  - Success: Green (#10b981)
  - Danger: Red (#ef4444)
  - Neutral text: Gray (#111827)
- **Status Badge Colors**:
  - Unpaid: Red background
  - Paid: Green background
  - Paid in part: Blue background
- Use CSS variables for theming consistency

### 14.2 API Integration
- Base URL: `http://localhost:3000/api`
- All API endpoints require Bearer token in Authorization header
- Error responses include `status`, `message`, `code`
- Use `InvoiceService` for invoice operations
- Use `MerchantService` for merchant account data

### 14.3 Navigation Structure
- Main navigation items: Home, Invoices, Transactions, Stores, Billing entities
- Use route parameters for detail pages (e.g., `/invoices/:id`)
- Always include breadcrumbs for accessibility
- Active menu item should be highlighted

### 14.4 Performance Targets
- Initial bundle size < 500KB
- Lighthouse score > 90
- First Contentful Paint < 2 seconds
- Interactive < 3 seconds
- Use lazy loading for feature modules

### 14.5 Test Coverage
- Target 80%+ coverage for `src/app/`
- Write tests for all services
- Write tests for page components
- Use mocks for HTTP calls
- E2E tests for critical user journeys

---

## 15. Development Workflow

### 14.1 Component Creation Checklist
- [ ] Create component using `ng generate component`
- [ ] Use standalone: true
- [ ] Implement OnInit, OnDestroy if needed
- [ ] Use ChangeDetectionStrategy.OnPush
- [ ] Add @Input/@Output for communication
- [ ] Create .spec.ts file with tests
- [ ] Document public methods with JSDoc
- [ ] Add accessibility attributes (ARIA, semantic HTML)
- [ ] Add string internationalization keys (i18n)

### 14.2 Service Creation Checklist
- [ ] Create service using `ng generate service`
- [ ] Provide in 'root'
- [ ] Document all public methods with JSDoc
- [ ] Use HttpClient for API calls
- [ ] Include error handling
- [ ] Return Observables (not Promises)
- [ ] Create mock service for testing

### 14.3 Before Committing Code
- [ ] Run `npm run lint` (ESLint passes)
- [ ] Run `npm test` (unit tests pass)
- [ ] Run `npm run build` (prod build succeeds)
- [ ] Check bundle size (< 500KB)
- [ ] Verify accessibility (Lighthouse > 90)
- [ ] Ensure no console errors/warnings
- [ ] Update documentation

---

## 15. Quick Reference

```bash
# Project setup
ng new merchant-portal --standalone --routing
npm install

# Development
ng serve                    # Start dev server
ng lint                     # Run ESLint
ng test                     # Run unit tests
ng test --code-coverage     # Generate coverage report

# Build & Deploy
ng build --prod             # Production build
ng build --prod --stats-json  # Build with bundle analysis

# Code generation
ng generate component pages/invoices
ng generate service shared/services/invoice
ng generate guard shared/guards/auth
ng generate pipe shared/pipes/currency-format

# Testing
ng test --watch            # Watch mode
ng test --code-coverage    # Coverage report
ng e2e                      # End-to-end tests

# Analysis
npm run build -- --stats-json  # Analyze bundle size
npm run lighthouse             # Lighthouse audit
```

---

## 16. Resources & References

### Official Documentation
- [Angular Official Docs](https://angular.io/docs)
- [RxJS Documentation](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Best Practices
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Clean Code Principles](https://en.wikipedia.org/wiki/Robert_C._Martin#Books)

### Performance
- [Angular Performance Optimization Guide](https://angular.io/guide/performance-best-practices)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Accessibility
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Angular Accessibility Guide](https://angular.io/guide/accessibility)
- [Web Accessibility Evaluation Tool (WAVE)](https://wave.webaim.org/)

---

## Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 6, 2026 | Initial Angular best practices guide for Merchant Portal |

**Last Updated**: February 6, 2026  
**Maintained By**: Tech Lead / Frontend Team  
**Review Cycle**: Quarterly or as needed

---

**Next Steps**:
1. Review this guide as a team
2. Agree on any project-specific modifications
3. Add to onboarding checklist for new developers
4. Reference in code reviews
5. Update quarterly with lessons learned
