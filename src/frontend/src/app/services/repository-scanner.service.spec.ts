import { TestBed } from '@angular/core/testing';
import { RepositoryScannerService } from './repository-scanner.service';
import { FileSystemService } from './filesystem.service';
import { WorkspaceConfigService } from './workspace-config.service';

/**
 * Unit Tests for RepositoryScannerService
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 2 - Core Services
 * 
 * @critical PERFORMANCE TEST: Scan must complete in < 5 seconds for 50+ repos
 */
describe('RepositoryScannerService', () => {
  let service: RepositoryScannerService;
  let fileSystemSpy: jasmine.SpyObj<FileSystemService>;
  let configSpy: jasmine.SpyObj<WorkspaceConfigService>;

  beforeEach(() => {
    const fileSystemMock = jasmine.createSpyObj('FileSystemService', [
      'directoryExists',
      'listDirectories',
      'isGitRepository',
      'getDirectoryName'
    ]);
    
    const configMock = jasmine.createSpyObj('WorkspaceConfigService', [
      'getConfig'
    ]);

    TestBed.configureTestingModule({
      providers: [
        RepositoryScannerService,
        { provide: FileSystemService, useValue: fileSystemMock },
        { provide: WorkspaceConfigService, useValue: configMock }
      ]
    });
    
    service = TestBed.inject(RepositoryScannerService);
    fileSystemSpy = TestBed.inject(FileSystemService) as jasmine.SpyObj<FileSystemService>;
    configSpy = TestBed.inject(WorkspaceConfigService) as jasmine.SpyObj<WorkspaceConfigService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('scanWorkspaces', () => {
    // TODO RED: Write test for single workspace with repositories
    // TODO RED: Write test for multiple workspaces
    // TODO RED: Write test for empty workspace
    // TODO RED: Write test for workspace with nested repositories
    
    // TODO RED: CRITICAL - Write performance test
    // it('should complete scan in < 5 seconds for 50+ repositories', (done) => {
    //   const startTime = Date.now();
    //   service.scanWorkspaces().subscribe(result => {
    //     const duration = Date.now() - startTime;
    //     expect(duration).toBeLessThan(5000);
    //     expect(result.repositories.length).toBeGreaterThanOrEqual(50);
    //     done();
    //   });
    // }, 10000); // Jasmine timeout
  });

  describe('scanDirectory (private)', () => {
    // TODO RED: Test via scanWorkspaces public method
    // Test recursive scanning behavior indirectly
  });

  describe('shouldExclude (private)', () => {
    // TODO RED: Test via scanWorkspaces public method
    // Verify node_modules, .git, etc. are excluded
  });

  describe('createRepository (private)', () => {
    // TODO RED: Test via scanWorkspaces public method
    // Verify Repository object structure
  });

  describe('sortRepositories (private)', () => {
    // TODO RED: Write test for alphabetical sorting
    // TODO RED: Write test for case-insensitive sorting
  });
});
