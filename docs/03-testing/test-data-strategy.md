# Test Data Strategy

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-07  
**Status:** Active

---

## Overview

This document defines the test data strategy, including fixtures, mock repositories, and data generation approaches for all testing layers.

---

## 1. Mock Repository Structure

### Test Repository Location
All test repositories are created in a temporary directory:
```
/tmp/dev-dashboard-test/
├── minimal-repo/              # Minimal git repo
├── nodejs-repo/               # Node.js project
├── angular-repo/              # Angular project
├── java-maven-repo/           # Java Maven project
├── dotnet-repo/               # .NET C# project
├── python-repo/               # Python project
├── multi-tech-repo/           # Multiple technologies
├── large-repo/                # 100+ files (performance)
├── special-chars-repo/        # Special characters in name
└── deep-nested-repo/          # Deeply nested path
```

---

## 2. Test Repository Fixtures

### 2.1 Minimal Repository
**Purpose**: Test basic git repository detection

```
minimal-repo/
└── .git/
    ├── config
    ├── HEAD
    └── refs/
```

**Characteristics**:
- Only `.git` folder present
- No README, no source files
- Used for: Basic scanner tests, edge case handling

**Expected Output**:
```json
{
  "name": "minimal-repo",
  "path": "/tmp/dev-dashboard-test/minimal-repo",
  "description": "",
  "techStack": [],
  "phase": null,
  "status": null
}
```

---

### 2.2 Node.js Repository
**Purpose**: Test Node.js/JavaScript detection

```
nodejs-repo/
├── .git/
├── package.json
├── package-lock.json
├── README.md
├── src/
│   └── index.js
└── node_modules/ (optional)
```

**package.json**:
```json
{
  "name": "nodejs-repo",
  "version": "1.0.0",
  "description": "Test Node.js project for dev-dashboard",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

**README.md**:
```markdown
# Node.js Test Repository

This is a test Node.js project for the dev-dashboard application.

It demonstrates repository scanning and metadata extraction.

## Features
- Express web server
- Basic routing
```

**Expected Output**:
```json
{
  "name": "nodejs-repo",
  "path": "/tmp/dev-dashboard-test/nodejs-repo",
  "description": "This is a test Node.js project for the dev-dashboard application.",
  "techStack": ["Node.js"],
  "phase": null,
  "status": null
}
```

---

### 2.3 Angular Repository
**Purpose**: Test Angular framework detection

```
angular-repo/
├── .git/
├── package.json
├── angular.json
├── tsconfig.json
├── README.md
└── src/
    ├── app/
    └── main.ts
```

**angular.json**:
```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "projects": {
    "angular-repo": {
      "projectType": "application",
      "root": "",
      "sourceRoot": "src"
    }
  }
}
```

**Expected Output**:
```json
{
  "name": "angular-repo",
  "path": "/tmp/dev-dashboard-test/angular-repo",
  "description": "Test Angular project...",
  "techStack": ["Angular", "Node.js"],
  "phase": null,
  "status": null
}
```

---

### 2.4 Java Maven Repository
**Purpose**: Test Java/Maven detection

```
java-maven-repo/
├── .git/
├── pom.xml
├── README.md
└── src/
    └── main/
        └── java/
            └── com/example/App.java
```

**pom.xml**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>java-maven-repo</artifactId>
    <version>1.0.0</version>
    <name>Java Maven Test Repository</name>
</project>
```

**Expected Output**:
```json
{
  "name": "java-maven-repo",
  "path": "/tmp/dev-dashboard-test/java-maven-repo",
  "description": "Test Java Maven project...",
  "techStack": ["Java"],
  "phase": null,
  "status": null
}
```

---

### 2.5 .NET Repository
**Purpose**: Test .NET/C# detection

```
dotnet-repo/
├── .git/
├── dotnet-repo.csproj
├── README.md
└── Program.cs
```

**dotnet-repo.csproj**:
```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
  </PropertyGroup>
</Project>
```

**Expected Output**:
```json
{
  "name": "dotnet-repo",
  "path": "/tmp/dev-dashboard-test/dotnet-repo",
  "description": "Test .NET C# project...",
  "techStack": [".NET"],
  "phase": null,
  "status": null
}
```

---

### 2.6 Python Repository
**Purpose**: Test Python detection

```
python-repo/
├── .git/
├── requirements.txt
├── README.md
└── src/
    └── main.py
```

**requirements.txt**:
```
flask==2.3.0
pytest==7.4.0
```

**Expected Output**:
```json
{
  "name": "python-repo",
  "path": "/tmp/dev-dashboard-test/python-repo",
  "description": "Test Python project...",
  "techStack": ["Python"],
  "phase": null,
  "status": null
}
```

---

### 2.7 Multi-Technology Repository
**Purpose**: Test multiple technology detection

```
multi-tech-repo/
├── .git/
├── package.json          # Node.js
├── angular.json          # Angular
├── requirements.txt      # Python
├── pom.xml               # Java
├── README.md
└── src/
```

**Expected Output**:
```json
{
  "name": "multi-tech-repo",
  "path": "/tmp/dev-dashboard-test/multi-tech-repo",
  "description": "Full-stack project with multiple technologies",
  "techStack": ["Angular", "Node.js", "Python", "Java"],
  "phase": null,
  "status": null
}
```

---

### 2.8 Large Repository (Performance Testing)
**Purpose**: Test scanning performance with many files

```
large-repo/
├── .git/
├── README.md
└── src/
    ├── file001.js
    ├── file002.js
    ├── ...
    └── file500.js    # 500 files
```

**Characteristics**:
- 500+ files in source directory
- Used for: Performance testing (< 5s scan requirement)
- Expected: Should scan without timeout

---

### 2.9 Special Characters Repository
**Purpose**: Test handling of special characters in names

```
special-chars-repo!@#/
├── .git/
└── README.md
```

**Expected Behavior**:
- Name sanitized: `special-chars-repo`
- No errors during scan
- Path stored correctly

---

### 2.10 Deep Nested Repository
**Purpose**: Test deeply nested path handling

```
/tmp/dev-dashboard-test/level1/level2/level3/level4/deep-nested-repo/
├── .git/
└── README.md
```

**Expected Behavior**:
- Full path correctly extracted
- No path truncation issues
- Display shows truncated path with tooltip

---

## 3. README Content Variations

### 3.1 Standard README
```markdown
# Project Name

This is the first paragraph that should be extracted as the description.

## Installation
...
```
**Expected**: "This is the first paragraph that should be extracted as the description."

---

### 3.2 Short README
```markdown
# Project Name
Simple one-liner description.
```
**Expected**: "Simple one-liner description."

---

### 3.3 Empty README
```markdown
# Project Name


## Installation
```
**Expected**: "" (empty description)

---

### 3.4 README with Markdown Formatting
```markdown
# Project Name

This is **bold** and *italic* text with [links](http://example.com).

## Next Section
```
**Expected**: "This is bold and italic text with links." (markdown stripped)

---

### 3.5 README with Code Blocks
```markdown
# Project Name

This project uses `inline code` and:

\`\`\`javascript
const x = 1;
\`\`\`

More text here.
```
**Expected**: "This project uses inline code and: More text here." (code blocks removed)

---

## 4. Metadata Edit Fixtures

### 4.1 Edit Description
**Before**:
```json
{
  "name": "test-repo",
  "description": "Original description"
}
```

**After Edit**:
```json
{
  "name": "test-repo",
  "description": "Updated description with new information"
}
```

---

### 4.2 Edit Phase
**Before**:
```json
{
  "name": "test-repo",
  "phase": null
}
```

**After Edit**:
```json
{
  "name": "test-repo",
  "phase": "Development"
}
```

**Valid Phase Values**:
- "Planning"
- "Development"
- "Testing"
- "Production"
- "Maintenance"
- "Archived"

---

### 4.3 Edit Status
**Before**:
```json
{
  "name": "test-repo",
  "status": null
}
```

**After Edit**:
```json
{
  "name": "test-repo",
  "status": "Active"
}
```

**Valid Status Values**:
- "Active"
- "Paused"
- "Blocked"
- "Completed"
- "Archived"

---

## 5. Persistence Test Data

### 5.1 LocalStorage Structure
```json
{
  "dev-dashboard-metadata": {
    "/tmp/dev-dashboard-test/nodejs-repo": {
      "description": "Custom description",
      "phase": "Development",
      "status": "Active",
      "lastUpdated": "2026-05-07T10:30:00Z"
    },
    "/tmp/dev-dashboard-test/angular-repo": {
      "description": "Another custom description",
      "phase": "Testing",
      "status": "Paused",
      "lastUpdated": "2026-05-06T15:45:00Z"
    }
  }
}
```

---

### 5.2 File-Based Persistence (Alternative)
**File**: `~/.dev-dashboard/metadata.json`

```json
{
  "repositories": {
    "/Users/oboukhris-palo/workspace/project1": {
      "description": "Production project",
      "phase": "Production",
      "status": "Active"
    },
    "/Users/oboukhris-palo/Documents/workspace/project2": {
      "description": "Legacy system",
      "phase": "Maintenance",
      "status": "Paused"
    }
  },
  "lastSync": "2026-05-07T10:30:00Z"
}
```

---

## 6. Test Data Generation

### 6.1 Automated Setup Script
Create test repositories programmatically:

```typescript
// test-data-generator.ts
export class TestDataGenerator {
  generateMinimalRepo(path: string): void {
    fs.mkdirSync(`${path}/.git`, { recursive: true });
    fs.writeFileSync(`${path}/.git/config`, '[core]\n');
  }

  generateNodeJsRepo(path: string): void {
    this.generateMinimalRepo(path);
    fs.writeFileSync(
      `${path}/package.json`,
      JSON.stringify({ name: 'test-repo', version: '1.0.0' })
    );
    fs.writeFileSync(
      `${path}/README.md`,
      '# Test Repository\n\nThis is a test Node.js project.\n'
    );
  }

  // ... more generators
}
```

---

### 6.2 Cleanup Strategy
```typescript
export function cleanupTestData(): void {
  const testDir = '/tmp/dev-dashboard-test';
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
}
```

**Usage**:
- **beforeEach**: Generate fresh test data
- **afterEach**: Clean up test data
- **Isolation**: Each test gets pristine data

---

## 7. Edge Cases and Error Conditions

### 7.1 Missing .git Folder
**Scenario**: Directory looks like a repo but has no `.git`
**Expected**: Not identified as repository

### 7.2 Corrupted .git Folder
**Scenario**: `.git` exists but is empty or corrupted
**Expected**: Identified as repo, gracefully handle errors

### 7.3 Permission Denied
**Scenario**: Cannot read repository directory
**Expected**: Log warning, skip repository, continue scan

### 7.4 Symlink Loop
**Scenario**: Symlink creates infinite loop
**Expected**: Detect loop, skip, continue scan

### 7.5 Very Long Path
**Scenario**: Path exceeds OS limits (macOS: 1024 chars)
**Expected**: Handle gracefully, truncate display, store full path

### 7.6 Non-UTF8 Filenames
**Scenario**: Files with non-UTF8 characters
**Expected**: Handle encoding issues, don't crash

---

## 8. Performance Test Data

### 8.1 Scalability Testing
- **10 repositories**: Baseline performance
- **50 repositories**: Typical developer workload
- **100 repositories**: Maximum expected load
- **500 repositories**: Stress test

### 8.2 Large Repository Testing
- **Small repo**: < 100 files, < 10MB
- **Medium repo**: 100-1000 files, 10-100MB
- **Large repo**: 1000+ files, 100MB+
- **Huge repo**: 10,000+ files, 1GB+ (stress test)

---

## 9. Test Data Maintenance

### Versioning
- Test data fixtures stored in: `tests/fixtures/`
- Version controlled in git
- Updated when new features require new test cases

### Documentation
- Each fixture has inline comments
- README in `tests/fixtures/` explains structure
- Examples link to actual test files

### Validation
- Run validation script to ensure fixtures are valid
- Check that all expected files exist
- Verify JSON structure matches schema

---

**Status:** ACTIVE | **Version:** 1.0 | **Last Updated:** 2026-05-07
