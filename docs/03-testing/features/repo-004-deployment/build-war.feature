Feature: Build Production WAR File
  As a developer
  I want to build a production-ready WAR file
  So that I can deploy to my local Apache service

  Background:
    Given the Angular application source code is available
    And Node.js and npm are installed
    And all dependencies are installed

  @REPO-004-US-001 @medium-priority
  Scenario: Build WAR file with production optimizations
    Given the Angular application source code
    When I run the production build command "npm run build:prod"
    Then a WAR file is created in the "dist/" directory
    And the WAR file contains all necessary assets
    And the bundle is minified and optimized
    And the bundle size is less than 500KB (gzipped)

  @REPO-004-US-001 @verification
  Scenario: Verify WAR file is self-contained
    Given a WAR file has been built
    When I inspect the WAR file contents
    Then it contains the compiled Angular application
    And it contains all required assets (images, fonts, styles)
    And it contains the Palo IT logo asset
    And no external dependencies are required

  @REPO-004-US-001 @documentation
  Scenario: Build script documented in README
    Given the project README file
    When I search for build instructions
    Then clear instructions for building the WAR file are present
    And the command "npm run build:prod" is documented
    And the output location "dist/" is specified

  @REPO-004-US-001 @edge-case
  Scenario: Handle build errors gracefully
    Given there is a compilation error in the source code
    When I run the production build command
    Then the build fails with a clear error message
    And the error indicates which file has the issue
    And no partial WAR file is created
