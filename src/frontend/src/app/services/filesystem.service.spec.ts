import { TestBed } from '@angular/core/testing';
import { FileSystemService } from './filesystem.service';

/**
 * Unit Tests for FileSystemService
 * 
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-001 - Scan Workspace Directories
 * @layer Layer 2 - Core Services
 * 
 * @tdd-approach
 * Follow RED-GREEN-REFACTOR cycle:
 * 1. Write failing test (RED)
 * 2. Implement minimal code to pass (GREEN)
 * 3. Refactor for quality (REFACTOR)
 */
describe('FileSystemService', () => {
  let service: FileSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('directoryExists', () => {
    it('should return true for existing directory', (done) => {
      service.directoryExists('/Users/oboukhris-palo/workspace').subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return false for non-existing directory', (done) => {
      service.directoryExists('/non/existing/path').subscribe(result => {
        expect(result).toBe(false);
        done();
      });
    });
  });

  describe('listDirectories', () => {
    it('should return list of subdirectories for workspace path', (done) => {
      service.listDirectories('/Users/oboukhris-palo/workspace').subscribe(result => {
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should return empty array for directory with no subdirectories', (done) => {
      service.listDirectories('/empty/directory').subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });

    it('should throw error for invalid path', (done) => {
      service.listDirectories('/invalid/path').subscribe({
        next: () => fail('Should have thrown error'),
        error: (err) => {
          expect(err).toBeDefined();
          done();
        }
      });
    });
  });

  describe('isGitRepository', () => {
    it('should return true for directory with .git subdirectory', (done) => {
      service.isGitRepository('/Users/oboukhris-palo/workspace/dev-dashboard').subscribe(result => {
        expect(result).toBe(true);
        done();
      });
    });

    it('should return false for directory without .git subdirectory', (done) => {
      service.isGitRepository('/Users/oboukhris-palo/Documents').subscribe(result => {
        expect(result).toBe(false);
        done();
      });
    });
  });

  describe('readFile', () => {
    it('should return file contents for existing file', (done) => {
      service.readFile('/Users/oboukhris-palo/workspace/dev-dashboard/README.md').subscribe(result => {
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should throw error for non-existing file', (done) => {
      service.readFile('/non/existing/file.txt').subscribe({
        next: () => fail('Should have thrown error'),
        error: (err) => {
          expect(err).toBeDefined();
          done();
        }
      });
    });
  });

  describe('getDirectoryName', () => {
    it('should extract directory name from Unix path', () => {
      const result = service.getDirectoryName('/Users/oboukhris-palo/workspace/dev-dashboard');
      expect(result).toBe('dev-dashboard');
    });

    it('should extract directory name from Windows path', () => {
      const result = service.getDirectoryName('C:\\Users\\dev\\workspace\\project');
      expect(result).toBe('project');
    });

    it('should handle path with trailing slash', () => {
      const result = service.getDirectoryName('/Users/oboukhris-palo/workspace/dev-dashboard/');
      expect(result).toBe('dev-dashboard');
    });
  });
});
