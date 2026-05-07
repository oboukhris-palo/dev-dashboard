import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RepositoryStateService } from '@state/repository-state.service';
import { of } from 'rxjs';

/**
 * Unit Tests for AppComponent
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 4 - UI Components
 */
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let repositoryStateSpy: jasmine.SpyObj<RepositoryStateService>;

  beforeEach(async () => {
    const stateMock = jasmine.createSpyObj('RepositoryStateService', [
      'scanWorkspaces'
    ], {
      loading$: of(false),
      error$: of(null),
      repositoriesCount$: of(0)
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: RepositoryStateService, useValue: stateMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    repositoryStateSpy = TestBed.inject(RepositoryStateService) as jasmine.SpyObj<RepositoryStateService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "Dev Dashboard"', () => {
    expect(component.title).toEqual('Dev Dashboard');
  });

  // describe('ngOnInit', () => {
  //   // TODO RED: Write test for initial scan trigger
  //   // it('should trigger scan on initialization', () => {
  //   //   repositoryStateSpy.scanWorkspaces.and.returnValue(of(mockScanResult));
  //   //   component.ngOnInit();
  //   //   expect(repositoryStateSpy.scanWorkspaces).toHaveBeenCalled();
  //   // });
  // });

  // describe('onScanClick', () => {
  //   // TODO RED: Write test for scan button click
  //   // TODO RED: Write test for loading state during scan
  // });

  describe('ngOnInit', () => {
    it('should trigger scan on initialization', () => {
      repositoryStateSpy.scanWorkspaces.and.returnValue(of({
        repositories: [],
        totalCount: 0,
        scanDurationMs: 10,
        scannedAt: new Date(),
        scannedPaths: []
      }));

      fixture.detectChanges(); // triggers ngOnInit
      expect(repositoryStateSpy.scanWorkspaces).toHaveBeenCalledTimes(1);
    });
  });

  describe('onScanClick', () => {
    it('should call scanWorkspaces on service', () => {
      repositoryStateSpy.scanWorkspaces.and.returnValue(of({
        repositories: [],
        totalCount: 0,
        scanDurationMs: 10,
        scannedAt: new Date(),
        scannedPaths: []
      }));

      component.onScanClick();
      expect(repositoryStateSpy.scanWorkspaces).toHaveBeenCalled();
    });
  });

  describe('Template', () => {
    it('should render toolbar with title', () => {
      repositoryStateSpy.scanWorkspaces.and.returnValue(of({
        repositories: [],
        totalCount: 0,
        scanDurationMs: 10,
        scannedAt: new Date(),
        scannedPaths: []
      }));

      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('mat-toolbar')).toBeTruthy();
    });
  });
});
