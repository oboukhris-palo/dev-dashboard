import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TechStackDetectorService } from './tech-stack-detector.service';
import { FileSystemService } from './filesystem.service';

/**
 * Unit Tests for TechStackDetectorService
 *
 * TDD RED Phase — REPO-001-US-003 — Detect Technology Stack
 *
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-003 - Detect Technology Stack
 * @layer Layer 2 - Core Services
 *
 * BDD Scenarios covered:
 *  - Scenario 1: Detect JavaScript/Node.js project (package.json)
 *  - Scenario 2: Detect Angular project (angular.json)
 *  - Scenario 3: Detect Java Maven project (pom.xml)
 *  - Scenario 4: Detect .NET/C# project (*.csproj)
 *  - Scenario 5: Detect Python project (requirements.txt / pyproject.toml)
 *  - Scenario 6: Detect multi-technology project
 *  - Scenario 7: Handle repository with no detectable technology
 */
describe('TechStackDetectorService', () => {
  let service: TechStackDetectorService;
  let fileSystemSpy: jasmine.SpyObj<FileSystemService>;

  const REPO_PATH = '/Users/oboukhris-palo/workspace/my-project';

  beforeEach(() => {
    const fsSpy = jasmine.createSpyObj('FileSystemService', ['exists', 'readDirectory']);

    TestBed.configureTestingModule({
      providers: [
        TechStackDetectorService,
        { provide: FileSystemService, useValue: fsSpy }
      ]
    });

    service = TestBed.inject(TechStackDetectorService);
    fileSystemSpy = TestBed.inject(FileSystemService) as jasmine.SpyObj<FileSystemService>;

    // Default: no files exist, empty directory
    fileSystemSpy.exists.and.returnValue(of(false));
    fileSystemSpy.readDirectory.and.returnValue(of([]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── Test 1: Detect Node.js ──────────────────────────────────────────────

  describe('Test 1 — Detect Node.js from package.json', () => {
    it('should return [Node.js] when package.json exists', (done) => {
      fileSystemSpy.exists.and.callFake((path: string) =>
        of(path === `${REPO_PATH}/package.json`)
      );

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).toContain('Node.js');
        done();
      });
    });
  });

  // ─── Test 2: Detect Angular ──────────────────────────────────────────────

  describe('Test 2 — Detect Angular from angular.json', () => {
    it('should return [Angular] when angular.json exists', (done) => {
      fileSystemSpy.exists.and.callFake((path: string) =>
        of(path === `${REPO_PATH}/angular.json`)
      );

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).toContain('Angular');
        done();
      });
    });
  });

  // ─── Test 3: Detect Java ─────────────────────────────────────────────────

  describe('Test 3 — Detect Java from pom.xml', () => {
    it('should return [Java] when pom.xml exists', (done) => {
      fileSystemSpy.exists.and.callFake((path: string) =>
        of(path === `${REPO_PATH}/pom.xml`)
      );

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).toContain('Java');
        done();
      });
    });
  });

  // ─── Test 4: Detect .NET ─────────────────────────────────────────────────

  describe('Test 4 — Detect .NET from *.csproj files', () => {
    it('should return [.NET] when a .csproj file exists in directory', (done) => {
      fileSystemSpy.readDirectory.and.returnValue(of(['MyApp.csproj', 'README.md']));

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).toContain('.NET');
        done();
      });
    });

    it('should not return .NET when no .csproj file exists', (done) => {
      fileSystemSpy.readDirectory.and.returnValue(of(['README.md', 'package.json']));
      fileSystemSpy.exists.and.callFake((path: string) =>
        of(path === `${REPO_PATH}/package.json`)
      );

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).not.toContain('.NET');
        done();
      });
    });
  });

  // ─── Test 5: Detect Python from requirements.txt ─────────────────────────

  describe('Test 5 — Detect Python from requirements.txt', () => {
    it('should return [Python] when requirements.txt exists', (done) => {
      fileSystemSpy.exists.and.callFake((path: string) =>
        of(path === `${REPO_PATH}/requirements.txt`)
      );

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).toContain('Python');
        done();
      });
    });
  });

  // ─── Test 6: Detect Python from pyproject.toml ───────────────────────────

  describe('Test 6 — Detect Python from pyproject.toml', () => {
    it('should return [Python] when pyproject.toml exists', (done) => {
      fileSystemSpy.exists.and.callFake((path: string) =>
        of(path === `${REPO_PATH}/pyproject.toml`)
      );

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).toContain('Python');
        done();
      });
    });

    it('should not duplicate Python when both requirements.txt and pyproject.toml exist', (done) => {
      fileSystemSpy.exists.and.callFake((path: string) =>
        of(
          path === `${REPO_PATH}/requirements.txt` ||
          path === `${REPO_PATH}/pyproject.toml`
        )
      );

      service.detectTechStack(REPO_PATH).subscribe(result => {
        const pythonCount = result.filter(t => t === 'Python').length;
        expect(pythonCount).toBe(1);
        done();
      });
    });
  });

  // ─── Test 7: Multi-technology ────────────────────────────────────────────

  describe('Test 7 — Detect multiple technologies (Angular + Node.js)', () => {
    it('should return both Angular and Node.js when both marker files exist', (done) => {
      fileSystemSpy.exists.and.callFake((path: string) =>
        of(
          path === `${REPO_PATH}/angular.json` ||
          path === `${REPO_PATH}/package.json`
        )
      );

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).toContain('Angular');
        expect(result).toContain('Node.js');
        done();
      });
    });
  });

  // ─── Test 8: No detectable tech ──────────────────────────────────────────

  describe('Test 8 — Handle repository with no detectable tech', () => {
    it('should return empty array when no marker files exist', (done) => {
      fileSystemSpy.exists.and.returnValue(of(false));
      fileSystemSpy.readDirectory.and.returnValue(of([]));

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  // ─── Test 9: Alphabetical sorting ────────────────────────────────────────

  describe('Test 9 — Alphabetical sorting', () => {
    it('should return technologies sorted alphabetically', (done) => {
      // Python, Angular, Java — should come back as Angular, Java, Python
      fileSystemSpy.exists.and.callFake((path: string) =>
        of(
          path === `${REPO_PATH}/requirements.txt` ||
          path === `${REPO_PATH}/angular.json` ||
          path === `${REPO_PATH}/pom.xml`
        )
      );

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).toEqual(['Angular', 'Java', 'Python']);
        done();
      });
    });
  });

  // ─── Test 10: FileSystem errors handled gracefully ───────────────────────

  describe('Test 10 — FileSystem errors handled gracefully', () => {
    it('should return empty array when FileSystemService throws error', (done) => {
      fileSystemSpy.exists.and.returnValue(throwError(() => new Error('FS error')));
      fileSystemSpy.readDirectory.and.returnValue(throwError(() => new Error('FS error')));

      service.detectTechStack(REPO_PATH).subscribe(result => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  // ─── checkFileExists (unit) ──────────────────────────────────────────────

  describe('checkFileExists', () => {
    it('should return true when file exists', (done) => {
      fileSystemSpy.exists.and.returnValue(of(true));

      service.checkFileExists('/some/path/package.json').subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should return false when file does not exist', (done) => {
      fileSystemSpy.exists.and.returnValue(of(false));

      service.checkFileExists('/some/path/package.json').subscribe(result => {
        expect(result).toBeFalse();
        done();
      });
    });

    it('should return false when FileSystemService throws', (done) => {
      fileSystemSpy.exists.and.returnValue(throwError(() => new Error('not found')));

      service.checkFileExists('/some/path/package.json').subscribe(result => {
        expect(result).toBeFalse();
        done();
      });
    });
  });

  // ─── checkGlobPattern (unit) ─────────────────────────────────────────────

  describe('checkGlobPattern', () => {
    it('should return true when a .csproj file exists in directory', (done) => {
      fileSystemSpy.readDirectory.and.returnValue(of(['MyApp.csproj', 'README.md']));

      service.checkGlobPattern(REPO_PATH, '*.csproj').subscribe(result => {
        expect(result).toBeTrue();
        done();
      });
    });

    it('should return false when no .csproj file exists', (done) => {
      fileSystemSpy.readDirectory.and.returnValue(of(['README.md', 'package.json']));

      service.checkGlobPattern(REPO_PATH, '*.csproj').subscribe(result => {
        expect(result).toBeFalse();
        done();
      });
    });

    it('should return false when directory is empty', (done) => {
      fileSystemSpy.readDirectory.and.returnValue(of([]));

      service.checkGlobPattern(REPO_PATH, '*.csproj').subscribe(result => {
        expect(result).toBeFalse();
        done();
      });
    });

    it('should return false when readDirectory throws', (done) => {
      fileSystemSpy.readDirectory.and.returnValue(throwError(() => new Error('FS error')));

      service.checkGlobPattern(REPO_PATH, '*.csproj').subscribe(result => {
        expect(result).toBeFalse();
        done();
      });
    });
  });
});
