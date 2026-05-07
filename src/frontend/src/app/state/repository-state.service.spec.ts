import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';
import { RepositoryStateService } from './repository-state.service';
import { RepositoryScannerService } from '@services/repository-scanner.service';
import { Repository, ScanResult } from '@domain/index';
import { repositoryStore } from './repository.store';
import { setEntities } from '@ngneat/elf-entities';

/**
 * Unit Tests for RepositoryStateService
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 3 - State Management
 */
describe('RepositoryStateService', () => {
  let service: RepositoryStateService;
  let scannerSpy: jasmine.SpyObj<RepositoryScannerService>;

  const mockScanResult: ScanResult = {
    repositories: [
      { id: '/workspace/alpha', name: 'alpha', path: '/workspace/alpha' },
      { id: '/workspace/beta', name: 'beta', path: '/workspace/beta' }
    ],
    totalCount: 2,
    scanDurationMs: 123,
    scannedAt: new Date('2026-05-07'),
    scannedPaths: ['/workspace']
  };

  /** Helper: get current repositories synchronously from store */
  function getCurrentRepos(): Repository[] {
    let repos: Repository[] = [];
    service.repositories$.pipe(take(1)).subscribe(r => repos = r);
    return repos;
  }

  beforeEach(() => {
    const scannerMock = jasmine.createSpyObj('RepositoryScannerService', [
      'scanWorkspaces'
    ]);

    TestBed.configureTestingModule({
      providers: [
        RepositoryStateService,
        { provide: RepositoryScannerService, useValue: scannerMock }
      ]
    });

    service = TestBed.inject(RepositoryStateService);
    scannerSpy = TestBed.inject(RepositoryScannerService) as jasmine.SpyObj<RepositoryScannerService>;

    // Reset store to clean state before each test
    repositoryStore.update(
      setEntities([]),
      (state) => ({ ...state, loading: false, error: null, lastScan: null })
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('scanWorkspaces', () => {
    it('should call scanner service and emit scan result', () => {
      scannerSpy.scanWorkspaces.and.returnValue(of(mockScanResult));

      let result: ScanResult | undefined;
      service.scanWorkspaces().subscribe(r => result = r);

      expect(result).toEqual(mockScanResult);
      expect(scannerSpy.scanWorkspaces).toHaveBeenCalled();
    });

    it('should populate repositories in store after scan', () => {
      scannerSpy.scanWorkspaces.and.returnValue(of(mockScanResult));
      service.scanWorkspaces().subscribe();

      expect(getCurrentRepos().length).toBe(2);
    });

    it('should update lastScan in store after scan', () => {
      scannerSpy.scanWorkspaces.and.returnValue(of(mockScanResult));
      service.scanWorkspaces().subscribe();

      let lastScan: ScanResult | null = null;
      service.lastScan$.pipe(take(1)).subscribe(s => lastScan = s);
      expect(lastScan as unknown as ScanResult).toEqual(mockScanResult);
    });

    it('should set loading false after scan completes', () => {
      scannerSpy.scanWorkspaces.and.returnValue(of(mockScanResult));
      service.scanWorkspaces().subscribe();

      let loading = true;
      service.loading$.pipe(take(1)).subscribe(l => loading = l);
      expect(loading).toBe(false);
    });

    it('should set loading false on error', () => {
      scannerSpy.scanWorkspaces.and.returnValue(throwError(() => new Error('Scan failed')));
      service.scanWorkspaces().subscribe({ error: () => {} });

      let loading = true;
      service.loading$.pipe(take(1)).subscribe(l => loading = l);
      expect(loading).toBe(false);
    });

    it('should set error message in store on failure', () => {
      scannerSpy.scanWorkspaces.and.returnValue(throwError(() => new Error('Connection error')));
      service.scanWorkspaces().subscribe({ error: () => {} });

      let error: string | null = null;
      service.error$.pipe(take(1)).subscribe(e => error = e);
      expect(error as unknown as string).toBe('Connection error');
    });
  });

  describe('updateRepository', () => {
    it('should update a repository in the store', () => {
      scannerSpy.scanWorkspaces.and.returnValue(of(mockScanResult));
      service.scanWorkspaces().subscribe();

      service.updateRepository('/workspace/alpha', { description: 'Updated description' });

      const updated = getCurrentRepos().find(r => r.id === '/workspace/alpha');
      expect(updated?.description).toBe('Updated description');
    });
  });

  describe('clearRepositories', () => {
    it('should clear all repositories from store', () => {
      scannerSpy.scanWorkspaces.and.returnValue(of(mockScanResult));
      service.scanWorkspaces().subscribe();
      expect(getCurrentRepos().length).toBe(2); // sanity check

      service.clearRepositories();

      expect(getCurrentRepos().length).toBe(0);
    });

    it('should reset lastScan after clear', () => {
      scannerSpy.scanWorkspaces.and.returnValue(of(mockScanResult));
      service.scanWorkspaces().subscribe();

      service.clearRepositories();

      let lastScan: ScanResult | null = mockScanResult; // non-null initial
      service.lastScan$.pipe(take(1)).subscribe(s => lastScan = s);
      expect(lastScan).toBeNull();
    });
  });

  describe('getRepositoryCount', () => {
    it('should return 0 when store is empty', () => {
      expect(service.getRepositoryCount()).toBe(0);
    });

    it('should return correct count after scan', () => {
      scannerSpy.scanWorkspaces.and.returnValue(of(mockScanResult));
      service.scanWorkspaces().subscribe();

      expect(service.getRepositoryCount()).toBe(2);
    });
  });

  describe('repositoryExists', () => {
    it('should return false for non-existing repository', () => {
      expect(service.repositoryExists('/non/existing')).toBe(false);
    });

    it('should return true for existing repository after scan', () => {
      scannerSpy.scanWorkspaces.and.returnValue(of(mockScanResult));
      service.scanWorkspaces().subscribe();

      expect(service.repositoryExists('/workspace/alpha')).toBe(true);
    });
  });
});
