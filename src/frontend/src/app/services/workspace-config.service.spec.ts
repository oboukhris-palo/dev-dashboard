import { TestBed } from '@angular/core/testing';
import { WorkspaceConfigService } from './workspace-config.service';
import { DEFAULT_WORKSPACE_CONFIG } from '@domain/workspace-config.model';

/**
 * Unit Tests for WorkspaceConfigService
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 2 - Core Services
 */
describe('WorkspaceConfigService', () => {
  let service: WorkspaceConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkspaceConfigService);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getConfig', () => {
    // TODO RED: Write test for first load (should return default config)
    // it('should return default config on first load', (done) => {
    //   service.getConfig().subscribe(config => {
    //     expect(config).toEqual(DEFAULT_WORKSPACE_CONFIG);
    //     done();
    //   });
    // });

    // TODO RED: Write test for subsequent load with saved config
  });

  describe('saveConfig', () => {
    // TODO RED: Write test for successful save
    // TODO RED: Write test for invalid config
  });

  describe('resetConfig', () => {
    // TODO RED: Write test for reset
  });

  describe('addWorkspacePath', () => {
    // TODO RED: Write test for adding new path
    // TODO RED: Write test for duplicate path
  });

  describe('removeWorkspacePath', () => {
    // TODO RED: Write test for removing existing path
    // TODO RED: Write test for removing non-existing path
  });
});
