Feature: Interactive Repository Display
  As a developer
  I want an interactive, easy-to-read interface
  So that I can quickly understand project details

  Background:
    Given repositories are displayed in the dashboard

  @REPO-002-US-002 @medium-priority
  Scenario: Hover interaction shows highlight
    Given repositories are displayed in table view
    When I hover over a repository row
    Then the row highlights with subtle background color change
    And the cursor changes to indicate interactivity

  @REPO-002-US-002 @medium-priority
  Scenario: View full path on hover
    Given a repository has path "/Users/oboukhris-palo/workspace/very-long-repository-name-that-gets-truncated"
    And the path is displayed as truncated text "…/very-long-repository-name-that-gets-truncated"
    When I hover over the truncated path
    Then a tooltip displays the full path
    And the tooltip remains visible while hovering

  @REPO-002-US-002 @medium-priority
  Scenario: Click repository row to select
    Given repositories are displayed
    When I click on a repository row
    Then the row is highlighted with a selected state
    And the row remains selected until another row is clicked

  @REPO-002-US-002 @visual
  Scenario: Technology stack displayed as chips
    Given a repository has tech stack "Angular, Node.js"
    When the repository is displayed
    Then two badge chips are shown
    And the Angular badge has color "#DD0031"
    And the Node.js badge has color "#00A651"

  @REPO-002-US-002 @visual
  Scenario: Material Design styling applied
    Given the dashboard is displayed
    Then all components use Material Design
    And buttons have elevation and ripple effects
    And cards have subtle shadows
    And the design follows Palo IT branding (blue #0066CC primary)
