# Non-Functional Testing Plan

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-07  
**Status:** Active

---

## Overview

This document defines the non-functional testing approach, including performance, security, usability, and reliability testing for the Dev-Dashboard application.

---

## 1. Performance Testing

### 1.1 Performance Requirements

| Requirement | Target | Measurement | Priority |
|-------------|--------|-------------|----------|
| **Repository Scan** | < 5 seconds for 100 repos | Total scan time | Critical |
| **Initial Page Load** | < 1 second | LCP (Largest Contentful Paint) | High |
| **Edit Interaction** | < 100ms | User input → UI update | High |
| **Memory Usage** | < 100MB baseline | Chrome DevTools Memory | Medium |
| **Bundle Size** | < 500KB (gzipped) | Webpack bundle analyzer | Medium |
| **First Input Delay (FID)** | < 100ms | Core Web Vitals | High |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Core Web Vitals | Medium |

---

### 1.2 Scan Performance Testing

#### Test Scenario 1: Baseline Performance
**Setup**:
- 10 repositories in workspace
- Mix of small (< 100 files) and medium (100-500 files) repos
- Each repo has README, tech stack files

**Test**:
```typescript
describe('Repository Scanner Performance', () => {
  it('should scan 10 repositories in under 2 seconds', async () => {
    const start = performance.now();
    const repos = await scanner.scan(workspacePaths);
    const duration = performance.now() - start;
    
    expect(repos.length).toBe(10);
    expect(duration).toBeLessThan(2000); // 2 seconds
  });
});
```

**Expected**: < 2 seconds (well under 5s target)

---

#### Test Scenario 2: Target Load
**Setup**:
- 50 repositories (typical developer workload)
- Variety of sizes and technologies

**Expected**: < 4 seconds

---

#### Test Scenario 3: Maximum Load
**Setup**:
- 100 repositories (maximum expected)
- Some large repos (1000+ files)

**Expected**: < 5 seconds

---

#### Test Scenario 4: Stress Test
**Setup**:
- 500 repositories (stress test)
- Identify performance bottlenecks

**Expected**: Document performance degradation, optimize if needed

---

### 1.3 UI Rendering Performance

#### Test Scenario 1: Initial Load (Lighthouse)
**Tool**: Lighthouse CI

**Metrics**:
- **LCP (Largest Contentful Paint)**: < 1.5s (target: < 1s)
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Performance Score**: > 90

**Test Command**:
```bash
lighthouse http://localhost:4200 --output=json --output-path=./lighthouse-report.json
```

---

#### Test Scenario 2: Table Rendering
**Setup**:
- Load 100 repositories in table
- Measure time to render all rows

**Test**:
```typescript
it('should render 100 repositories in under 500ms', async () => {
  const start = performance.now();
  component.repositories = generate100Repos();
  fixture.detectChanges();
  await fixture.whenStable();
  const duration = performance.now() - start;
  
  expect(duration).toBeLessThan(500);
});
```

**Expected**: < 500ms

---

### 1.4 Interaction Performance

#### Test Scenario 1: Edit Field Response
**Setup**:
- Open edit field for description
- Measure time from input to UI update

**Test**:
```typescript
it('should update UI within 100ms of user input', async () => {
  const input = fixture.debugElement.query(By.css('input'));
  const start = performance.now();
  
  input.nativeElement.value = 'New description';
  input.nativeElement.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  
  const duration = performance.now() - start;
  expect(duration).toBeLessThan(100);
});
```

**Expected**: < 100ms

---

#### Test Scenario 2: Dropdown Response
**Setup**:
- Open phase/status dropdown
- Measure time to display options

**Expected**: < 50ms (instant feel)

---

### 1.5 Memory Leak Testing

#### Test Scenario 1: Long Session
**Setup**:
- Simulate 1-hour user session
- Perform 100 edit operations
- Monitor memory usage over time

**Test Method**:
1. Open Chrome DevTools Memory profiler
2. Take heap snapshot at start
3. Perform operations (edit, scan, filter)
4. Take heap snapshot after 1 hour
5. Compare heap sizes

**Expected**: No significant memory growth (< 20MB increase)

---

#### Test Scenario 2: Navigation Cycle
**Setup**:
- Navigate between views 100 times
- Check for component cleanup

**Expected**: Components destroyed properly, no memory leaks

---

### 1.6 Bundle Size Optimization

#### Measurement
```bash
ng build --prod --stats-json
npx webpack-bundle-analyzer dist/dev-dashboard/stats.json
```

#### Targets
- **Main bundle**: < 300KB (gzipped)
- **Vendor bundle**: < 200KB (gzipped)
- **Total**: < 500KB (gzipped)

#### Optimization Strategies
- Lazy loading for routes (if applicable)
- Tree shaking unused Material components
- AOT compilation
- Minification and compression

---

## 2. Security Testing

### 2.1 Input Validation

#### Test Scenario 1: Path Traversal Attack
**Attack Vector**: User enters malicious path

**Test**:
```typescript
describe('Path Validation', () => {
  it('should reject path traversal attempts', () => {
    const maliciousPath = '../../etc/passwd';
    expect(() => service.scanPath(maliciousPath)).toThrowError();
  });
  
  it('should sanitize paths before processing', () => {
    const path = '../workspace/../sensitive';
    const sanitized = service.sanitizePath(path);
    expect(sanitized).not.toContain('..');
  });
});
```

**Expected**: Malicious paths rejected

---

#### Test Scenario 2: XSS (Cross-Site Scripting)
**Attack Vector**: Malicious content in repository metadata

**Test**:
```typescript
describe('XSS Prevention', () => {
  it('should escape HTML in descriptions', () => {
    const malicious = '<script>alert("XSS")</script>';
    component.repository.description = malicious;
    fixture.detectChanges();
    
    const element = fixture.debugElement.query(By.css('.description'));
    expect(element.nativeElement.innerHTML).not.toContain('<script>');
    expect(element.nativeElement.textContent).toBe(malicious);
  });
});
```

**Expected**: All HTML/scripts escaped

---

#### Test Scenario 3: SQL Injection (N/A)
**Status**: Not applicable (no database)

---

### 2.2 Dependency Security

#### npm audit
**Frequency**: Weekly + before each release

**Process**:
```bash
npm audit
npm audit fix
```

**Targets**:
- **Critical vulnerabilities**: 0
- **High vulnerabilities**: 0
- **Medium vulnerabilities**: < 3
- **Low vulnerabilities**: < 10

**Action**: Fix critical/high immediately, plan medium/low fixes

---

#### Snyk Scan (Optional)
**Tool**: Snyk CLI or GitHub integration

```bash
snyk test
snyk monitor
```

**Expected**: No critical/high vulnerabilities

---

### 2.3 Static Code Analysis

#### ESLint Security Plugin
**Plugin**: `eslint-plugin-security`

**Rules**:
- Detect eval() usage
- Detect unsafe regular expressions
- Detect command injection
- Detect path traversal

**Configuration**:
```json
{
  "extends": ["plugin:security/recommended"],
  "rules": {
    "security/detect-object-injection": "warn",
    "security/detect-non-literal-fs-filename": "error"
  }
}
```

---

### 2.4 Secrets Scanning

#### Git Pre-Commit Hook
**Tool**: `detect-secrets` or custom script

**Check For**:
- API keys
- Passwords
- Private keys
- Tokens
- AWS credentials

**Expected**: No secrets in git history

---

### 2.5 Content Security Policy (CSP)

#### HTTP Header
```http
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data:;
```

**Note**: Since deployed locally, CSP is less critical but good practice

---

### 2.6 Security Checklist

| Check | Method | Frequency | Status |
|-------|--------|-----------|--------|
| XSS prevention | Manual review + tests | Per PR | ⏳ |
| Path traversal | Unit tests | Per release | ⏳ |
| Input sanitization | Integration tests | Per PR | ⏳ |
| Dependency CVEs | npm audit | Weekly | ⏳ |
| ESLint security | Automated | Per commit | ⏳ |
| Secrets in code | Pre-commit hook | Per commit | ⏳ |

---

## 3. Usability Testing

### 3.1 Accessibility (A11y)

#### WCAG 2.1 AA Compliance
**Tool**: axe DevTools, Lighthouse

**Requirements**:
- Keyboard navigation works for all interactions
- Screen reader compatible (ARIA labels)
- Color contrast meets AA standards (4.5:1 for text)
- Focus indicators visible

**Test**:
```bash
lighthouse http://localhost:4200 --only-categories=accessibility
```

**Expected**: Accessibility score > 90

---

#### Keyboard Navigation Test
**Test Cases**:
1. Tab through all interactive elements
2. Enter/Space to activate buttons
3. Arrow keys for dropdowns
4. Escape to cancel edits

**Expected**: All functionality accessible via keyboard

---

### 3.2 Responsive Design

#### Breakpoint Testing
**Breakpoints**:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1440px (standard laptop)

**Test**: Visual inspection at each breakpoint

**Expected**:
- Layout adapts without horizontal scroll
- All content readable
- Buttons/inputs accessible

---

### 3.3 Browser Compatibility

#### Supported Browsers
- Chrome 130+ (primary)
- Firefox 120+ (secondary)
- Safari 17+ (if needed)
- Edge 130+ (if needed)

**Test**: Manual testing on each browser

**Expected**: UI/functionality consistent across browsers

---

## 4. Reliability Testing

### 4.1 Error Handling

#### Test Scenario 1: Missing Workspace Directory
**Setup**: Workspace path doesn't exist

**Expected**:
- Graceful error message displayed
- App doesn't crash
- Other workspaces still scanned

---

#### Test Scenario 2: Permission Denied
**Setup**: No read permission on repository

**Expected**:
- Warning logged
- Repository skipped
- Scan continues

---

#### Test Scenario 3: Corrupted README
**Setup**: README with invalid UTF-8 encoding

**Expected**:
- Fallback to empty description
- No error thrown
- Scan continues

---

### 4.2 Stability Testing

#### Long-Running Session
**Duration**: 4-hour continuous use

**Actions**:
- Periodic repository scans
- Multiple edits
- Filter/sort operations

**Expected**:
- No crashes
- No performance degradation
- No memory leaks

---

### 4.3 Recovery Testing

#### Browser Refresh
**Test**: Refresh page during operation

**Expected**:
- State recovered from localStorage
- No data loss
- UI renders correctly

---

#### Service Restart
**Test**: Restart Apache during use

**Expected**:
- Data persisted
- No corruption
- App reloads successfully

---

## 5. Test Execution Schedule

### Development Phase
- **Daily**: Unit tests, linting
- **Per PR**: Unit + integration tests, coverage check
- **Weekly**: npm audit, performance spot checks

### Pre-Release
- **Full test suite**: Unit + integration + E2E
- **Lighthouse audit**: Performance, accessibility, SEO
- **Security scan**: npm audit, manual review
- **Browser testing**: Chrome, Firefox
- **Performance testing**: 100-repo scan, memory profiling

### Production Monitoring
- **Weekly**: npm audit
- **Monthly**: Security review, dependency updates
- **Quarterly**: Load testing, stress testing

---

## 6. Performance Benchmarks

### Baseline Measurements
**Environment**:
- MacBook Pro M3, 16GB RAM
- Chrome 130.0
- macOS Sonoma 14.5

**Results** (targets):
| Metric | Value |
|--------|-------|
| Scan 10 repos | < 1s |
| Scan 50 repos | < 3s |
| Scan 100 repos | < 5s |
| Initial load (LCP) | < 0.8s |
| Edit response | < 50ms |
| Memory baseline | < 80MB |
| Bundle size | < 450KB gzip |

---

## 7. Continuous Monitoring

### Metrics Dashboard (Future)
- Test pass rate over time
- Coverage trend
- Performance metrics trend
- Dependency vulnerability count
- Bundle size trend

### Alerts
- Coverage drops below 80%
- Critical vulnerability detected
- Performance regression (> 10% slower)

---

**Status:** ACTIVE | **Version:** 1.0 | **Last Updated:** 2026-05-07
