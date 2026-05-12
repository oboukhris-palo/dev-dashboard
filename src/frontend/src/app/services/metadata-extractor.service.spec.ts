import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MetadataExtractorService } from './metadata-extractor.service';
import { FileSystemService } from './filesystem.service';
import { ReadmeParserService } from './readme-parser.service';
import { TechStackDetectorService } from './tech-stack-detector.service';
import { Repository } from '@domain/repository.model';

/**
 * Unit Tests for MetadataExtractorService
 *
 * @epic REPO-001 - Repository Discovery & Scanning
 * @story REPO-001-US-002 - Extract Repository Metadata
 * @layer Layer 2 - Core Services
 *
 * BDD Scenarios covered:
 *  - Scenario 1: Extract name and path
 *  - Scenario 2: Parse README for description
 *  - Scenario 3: Handle missing README
 */
describe('MetadataExtractorService', () => {
  let service: MetadataExtractorService;
  let fileSystemSpy: jasmine.SpyObj<FileSystemService>;
  let parserSpy: jasmine.SpyObj<ReadmeParserService>;
  let techDetectorSpy: jasmine.SpyObj<TechStackDetectorService>;

  const baseRepo: Repository = {
    id: '/Users/oboukhris-palo/workspace/my-project',
    name: 'my-project',
    path: '/Users/oboukhris-palo/workspace/my-project'
  };

  beforeEach(() => {
    const fsSpy = jasmine.createSpyObj('FileSystemService', ['readFile', 'getDirectoryName']);
    const reSpy = jasmine.createSpyObj('ReadmeParserService', ['parseDescription']);
    const tdSpy = jasmine.createSpyObj('TechStackDetectorService', ['detectTechStack']);
    tdSpy.detectTechStack.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        MetadataExtractorService,
        { provide: FileSystemService, useValue: fsSpy },
        { provide: ReadmeParserService, useValue: reSpy },
        { provide: TechStackDetectorService, useValue: tdSpy }
      ]
    });

    service = TestBed.inject(MetadataExtractorService);
    fileSystemSpy = TestBed.inject(FileSystemService) as jasmine.SpyObj<FileSystemService>;
    parserSpy = TestBed.inject(ReadmeParserService) as jasmine.SpyObj<ReadmeParserService>;
    techDetectorSpy = TestBed.inject(TechStackDetectorService) as jasmine.SpyObj<TechStackDetectorService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─── extractName ─────────────────────────────────────────────────────────

  describe('extractName', () => {
    it('should delegate to FileSystemService.getDirectoryName', () => {
      fileSystemSpy.getDirectoryName.and.returnValue('my-project');
      expect(service.extractName('/workspace/my-project')).toBe('my-project');
      expect(fileSystemSpy.getDirectoryName).toHaveBeenCalledWith('/workspace/my-project');
    });
  });

  // ─── extractDescription ──────────────────────────────────────────────────

  describe('extractDescription', () => {
    it('should read README.md and return parsed description', (done) => {
      const rawContent = '# My Project\n\nA great project.';
      fileSystemSpy.readFile.and.returnValue(of(rawContent));
      parserSpy.parseDescription.and.returnValue('A great project.');

      service.extractDescription('/workspace/my-project').subscribe(result => {
        expect(result).toBe('A great project.');
        expect(fileSystemSpy.readFile).toHaveBeenCalledWith('/workspace/my-project/README.md');
        expect(parserSpy.parseDescription).toHaveBeenCalledWith(rawContent);
        done();
      });
    });

    it('should return empty string when README.md does not exist', (done) => {
      fileSystemSpy.readFile.and.returnValue(throwError(() => new Error('File not found')));

      service.extractDescription('/workspace/my-project').subscribe(result => {
        expect(result).toBe('');
        done();
      });
    });

    it('should return empty string when readFile returns empty content', (done) => {
      fileSystemSpy.readFile.and.returnValue(of(''));
      parserSpy.parseDescription.and.returnValue('');

      service.extractDescription('/workspace/my-project').subscribe(result => {
        expect(result).toBe('');
        done();
      });
    });
  });

  // ─── extractMetadata ─────────────────────────────────────────────────────

  describe('extractMetadata', () => {
    it('should enrich repository with description, readmeExists=true, and techStack when README found', (done) => {
      fileSystemSpy.readFile.and.returnValue(of('# My Project\n\nA great project.'));
      parserSpy.parseDescription.and.returnValue('A great project.');
      techDetectorSpy.detectTechStack.and.returnValue(of(['Node.js']));

      service.extractMetadata(baseRepo).subscribe(enriched => {
        expect(enriched.description).toBe('A great project.');
        expect(enriched.readmeExists).toBeTrue();
        expect(enriched.techStack).toEqual(['Node.js']);
        expect(enriched.name).toBe('my-project');
        expect(enriched.path).toBe('/Users/oboukhris-palo/workspace/my-project');
        done();
      });
    });

    it('should enrich repository with empty description, readmeExists=false, and techStack when README missing', (done) => {
      fileSystemSpy.readFile.and.returnValue(throwError(() => new Error('File not found')));
      techDetectorSpy.detectTechStack.and.returnValue(of(['Java']));

      service.extractMetadata(baseRepo).subscribe(enriched => {
        expect(enriched.description).toBe('');
        expect(enriched.readmeExists).toBeFalse();
        expect(enriched.techStack).toEqual(['Java']);
        done();
      });
    });

    // Test 11 (US-003): Tech stack included in metadata extraction
    it('should include techStack from TechStackDetectorService in returned repository', (done) => {
      fileSystemSpy.readFile.and.returnValue(of('# My Project'));
      parserSpy.parseDescription.and.returnValue('My Project');
      techDetectorSpy.detectTechStack.and.returnValue(of(['Angular', 'Node.js']));

      service.extractMetadata(baseRepo).subscribe(enriched => {
        expect(enriched.techStack).toEqual(['Angular', 'Node.js']);
        expect(techDetectorSpy.detectTechStack).toHaveBeenCalledWith(baseRepo.path);
        done();
      });
    });

    it('should return empty techStack when TechStackDetectorService returns empty array', (done) => {
      fileSystemSpy.readFile.and.returnValue(throwError(() => new Error('not found')));
      techDetectorSpy.detectTechStack.and.returnValue(of([]));

      service.extractMetadata(baseRepo).subscribe(enriched => {
        expect(enriched.techStack).toEqual([]);
        done();
      });
    });

    it('should preserve all existing repository fields', (done) => {
      fileSystemSpy.readFile.and.returnValue(throwError(() => new Error('not found')));
      techDetectorSpy.detectTechStack.and.returnValue(of(['Angular']));

      const repoWithExtras: Repository = {
        ...baseRepo,
        status: 'Active'
      };

      service.extractMetadata(repoWithExtras).subscribe(enriched => {
        expect(enriched.id).toBe(repoWithExtras.id);
        expect(enriched.status).toBe('Active');
        done();
      });
    });

    it('should not throw when metadata extraction fails completely', (done) => {
      fileSystemSpy.readFile.and.returnValue(throwError(() => new Error('disk error')));
      techDetectorSpy.detectTechStack.and.returnValue(of([]));

      expect(() => {
        service.extractMetadata(baseRepo).subscribe(() => done());
      }).not.toThrow();
    });
  });
});
