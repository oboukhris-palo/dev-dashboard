Feature: Repository Metadata Extraction
  As a developer
  I want repository metadata extracted automatically
  So that I don't have to manually enter basic information

  Background:
    Given the scanner has discovered repositories
    And the metadata extractor service is initialized

  @REPO-001-US-002 @high-priority
  Scenario: Extract name and path
    Given a repository exists at "/Users/oboukhris-palo/workspace/my-project"
    When the scanner processes this repository
    Then the name is extracted as "my-project"
    And the path is stored as "/Users/oboukhris-palo/workspace/my-project"

  @REPO-001-US-002 @high-priority
  Scenario: Parse README for description
    Given a repository contains a README.md file
    And the README contains the text:
      """
      # My Project
      
      This is the first paragraph that describes the project.
      
      ## Installation
      More details here.
      """
    When metadata is extracted
    Then the description is "This is the first paragraph that describes the project."
    And markdown formatting is stripped

  @REPO-001-US-002 @high-priority
  Scenario: Handle missing README
    Given a repository has no README.md file
    When metadata is extracted
    Then the description field is empty
    And no error is thrown
    And the repository still appears in the dashboard

  @REPO-001-US-002 @edge-case
  Scenario: Handle README with only headings
    Given a repository contains a README.md with only headings
    When metadata is extracted
    Then the description field is empty
    And no error is thrown

  @REPO-001-US-002 @edge-case
  Scenario: Handle README with markdown formatting
    Given a README contains "This is **bold** and *italic* text with [links](http://example.com)"
    When metadata is extracted
    Then the description is "This is bold and italic text with links"
    And all markdown syntax is removed

  @REPO-001-US-002 @edge-case
  Scenario: Handle README with code blocks
    Given a README contains inline code and code blocks
    When metadata is extracted
    Then code blocks are removed from the description
    And only plain text is retained
