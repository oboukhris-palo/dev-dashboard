---
generated_from_template: user-story-tmpl.yml
generation_date: 2026-05-07
generator_agent: product-owner
story_key: REPO-004-US-002
epic_key: REPO-004
project_key: dev-dashboard
priority: Medium
status: To Do
story_points: 3
---

# REPO-004-US-002: Deploy to Apache Service

## User Story

**As a** developer  
**I want** the application deployed to my local Apache  
**So that** it's always accessible when I need it

---

## Acceptance Criteria

- [ ] WAR file deploys to Apache webapps directory
- [ ] Application accessible at configured URL (e.g., http://localhost:8080/dev-dashboard)
- [ ] Application starts with Apache service
- [ ] Deployment script documented

---

## BDD Scenarios

```gherkin
Feature: Apache Deployment

  Scenario: Deploy to Apache
    Given a production WAR file
    When I deploy to Apache webapps directory
    Then the application is accessible at the configured URL

  Scenario: Auto-start with Apache
    Given the application is deployed
    When Apache service starts
    Then the application is automatically available
```

---

## Dependencies

### Prerequisites
- REPO-004-US-001 (Build Production WAR File) must be completed
- Apache HTTP Server or Tomcat installed on developer's laptop

### Unblocks
- Final deployment milestone for project

---

## Technical Constraints

**From [Architecture Design](../../../02-architecture/architecture-design.md):**
- Apache HTTP Server 2.4+ OR Tomcat 9+ required
- Application must be accessible at http://localhost:8080/dev-dashboard
- No backend server required (fully client-side application)
- Auto-start with Apache service (no manual startup)

**Deployment Paths:**
- **Apache HTTP Server**: `/usr/local/apache2/htdocs/dev-dashboard/` (or equivalent)
- **Tomcat**: `/opt/tomcat/webapps/dev-dashboard.war` (auto-extracts)

**Technology Stack:**
- Apache HTTP Server with `mod_rewrite` for SPA routing
- OR Tomcat for WAR deployment

---

## Implementation Notes

**Deployment Script (deploy.sh):**
```bash
#!/bin/bash

# Build production WAR
npm run package:war

# Deploy to Apache
WAR_FILE="dev-dashboard.war"
DEPLOY_DIR="/usr/local/apache2/htdocs/"

# Extract WAR to deployment directory
mkdir -p "$DEPLOY_DIR/dev-dashboard"
cd "$DEPLOY_DIR/dev-dashboard"
jar -xvf "$WAR_FILE"

# Configure Apache for SPA routing
echo "RewriteEngine On
RewriteBase /dev-dashboard/
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /dev-dashboard/index.html [L]" > .htaccess

# Restart Apache
sudo systemctl restart apache2  # or: sudo apachectl restart

echo "Deployment complete. Application available at http://localhost:8080/dev-dashboard"
```

**Apache Configuration (httpd.conf):**
```apache
<Directory "/usr/local/apache2/htdocs/dev-dashboard">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

**Tomcat Deployment (simpler):**
```bash
#!/bin/bash

# Build production WAR
npm run package:war

# Copy WAR to Tomcat webapps
cp dev-dashboard.war /opt/tomcat/webapps/

# Tomcat auto-extracts and deploys
# Wait for deployment
sleep 10

echo "Deployment complete. Application available at http://localhost:8080/dev-dashboard"
```

---

## Test Strategy

**Unit Tests:**
- Test deployment script syntax
- Test paths are correct for target environment

**Integration Tests:**
- Test WAR extraction to deployment directory
- Test Apache configuration is valid
- Test SPA routing works (all routes return index.html)

**BDD Tests:**
- Implement both Gherkin scenarios above
- Verify application accessible at configured URL after deployment
- Verify application starts with Apache service

**Manual Verification:**
1. Deploy WAR to Apache/Tomcat
2. Access http://localhost:8080/dev-dashboard in browser
3. Verify application loads correctly
4. Verify SPA routing works (navigate to different routes, refresh page)
5. Restart Apache/Tomcat, verify application still accessible
6. Test on clean Apache installation

**Rollback Test:**
- Document rollback procedure (remove WAR, restore previous version)
- Test rollback to previous version

---

## Related Documents

- [Architecture Design](../../../02-architecture/architecture-design.md) - Section: Deployment Infrastructure
- [Tech Spec](../../../02-architecture/tech-spec.md) - Section: Apache Configuration
- [Deployment Plan](../../../04-planning/deployment-plan.md) - Detailed deployment steps, rollback procedures
- [Test Strategies](../../../03-testing/test-strategies.md) - Feature: repo-004-deployment/deploy-apache.feature
