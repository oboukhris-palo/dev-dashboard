# Deployment Plan

**Project:** Dev-Dashboard  
**Version:** 1.0.0  
**Date:** 2026-05-07  
**Status:** Active  
**Owner:** Solution Architect, Project Manager

---

## Overview

This document defines the deployment strategy for the Dev-Dashboard application, including build process, deployment architecture, rollback procedures, and operational considerations.

---

## 1. Deployment Architecture

### Target Environment
- **Platform:** Local macOS laptop (developer workstation)
- **Web Server:** Apache HTTP Server (pre-installed on macOS)
- **Application Type:** Angular SPA packaged as WAR file
- **Database:** None (localStorage only)
- **Authentication:** None (local use only)

### Architecture Diagram
```
┌─────────────────────────────────────────┐
│     Developer's MacBook Pro             │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │   macOS System                   │  │
│  │                                  │  │
│  │  ┌────────────────────────────┐ │  │
│  │  │  Apache HTTP Server        │ │  │
│  │  │  (localhost:8080)          │ │  │
│  │  │                            │ │  │
│  │  │  ┌──────────────────────┐  │ │  │
│  │  │  │  dev-dashboard.war   │  │ │  │
│  │  │  │  (Angular SPA)       │  │ │  │
│  │  │  └──────────────────────┘  │ │  │
│  │  └────────────────────────────┘ │  │
│  │                                  │  │
│  │  ┌────────────────────────────┐ │  │
│  │  │  Browser (Chrome)          │ │  │
│  │  │  http://localhost:8080     │ │  │
│  │  └────────────────────────────┘ │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Workspace Directories           │  │
│  │  - /Users/.../workspace          │  │
│  │  - /Users/.../Documents/workspace│  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 2. Build Process

### 2.1 Development Build
**Command:**
```bash
cd src/frontend
npm install
npm run start
```

**Output:** Development server at `http://localhost:4200`  
**Features:** Hot reload, source maps, verbose errors  
**Use Case:** Local development and testing

---

### 2.2 Production Build
**Command:**
```bash
cd src/frontend
npm run build:prod
```

**Angular CLI Configuration:**
```json
{
  "configurations": {
    "production": {
      "optimization": true,
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "aot": true,
      "extractLicenses": true,
      "vendorChunk": false,
      "buildOptimizer": true,
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "500kb",
          "maximumError": "1mb"
        }
      ]
    }
  }
}
```

**Output:** Optimized bundle in `dist/dev-dashboard/`  
**Features:** 
- AOT compilation
- Tree shaking
- Minification
- Bundle size < 500KB (gzipped)

---

### 2.3 WAR Packaging
**Command:**
```bash
cd src/frontend
npm run build:war
```

**Script (package.json):**
```json
{
  "scripts": {
    "build:prod": "ng build --configuration production",
    "build:war": "npm run build:prod && cd dist && jar -cvf dev-dashboard.war dev-dashboard/*"
  }
}
```

**Prerequisites:** Java JDK installed (for `jar` command)

**Output:** `dist/dev-dashboard.war`  
**Contents:**
- index.html (entry point)
- main.*.js (application bundle)
- polyfills.*.js (browser compatibility)
- runtime.*.js (webpack runtime)
- styles.*.css (compiled styles)
- assets/ (images, fonts, logo)

---

## 3. Deployment Process

### 3.1 Manual Deployment (Initial)

**Step 1: Build WAR File**
```bash
cd /Users/oboukhris-palo/dev-dashboard
npm run build:war
```

**Step 2: Stop Apache (if running)**
```bash
sudo apachectl stop
```

**Step 3: Deploy WAR to Apache**
```bash
# Copy WAR to Apache webapps directory
sudo cp dist/dev-dashboard.war /Library/WebServer/Documents/webapps/

# Extract WAR (Apache doesn't auto-extract)
cd /Library/WebServer/Documents/webapps
sudo jar -xvf dev-dashboard.war
sudo rm dev-dashboard.war
```

**Step 4: Configure Apache Virtual Host**

Create `/etc/apache2/other/dev-dashboard.conf`:
```apache
<VirtualHost *:8080>
    ServerName localhost
    DocumentRoot "/Library/WebServer/Documents/webapps/dev-dashboard"
    
    <Directory "/Library/WebServer/Documents/webapps/dev-dashboard">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # SPA routing - redirect all requests to index.html
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>
</VirtualHost>
```

**Step 5: Start Apache**
```bash
sudo apachectl start
```

**Step 6: Verify Deployment**
```bash
# Open in browser
open http://localhost:8080

# Check Apache logs
tail -f /var/log/apache2/error_log
```

---

### 3.2 Automated Deployment (Future)

**Deployment Script:** `scripts/deploy.sh`
```bash
#!/bin/bash
set -e

echo "🚀 Deploying Dev-Dashboard..."

# Build WAR
echo "📦 Building WAR file..."
npm run build:war

# Stop Apache
echo "🛑 Stopping Apache..."
sudo apachectl stop

# Deploy
echo "📂 Deploying to Apache..."
sudo rm -rf /Library/WebServer/Documents/webapps/dev-dashboard
sudo mkdir -p /Library/WebServer/Documents/webapps/dev-dashboard
cd /Library/WebServer/Documents/webapps/dev-dashboard
sudo jar -xvf /Users/oboukhris-palo/dev-dashboard/dist/dev-dashboard.war

# Start Apache
echo "✅ Starting Apache..."
sudo apachectl start

echo "🎉 Deployment complete! Visit http://localhost:8080"
```

**Usage:**
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

---

## 4. Environment Configuration

### 4.1 Development Environment
- **URL:** `http://localhost:4200`
- **API:** None (local filesystem)
- **Storage:** Browser localStorage
- **Workspaces:** 
  - `/Users/oboukhris-palo/workspace`
  - `/Users/oboukhris-palo/Documents/workspace`

### 4.2 Production Environment (Local)
- **URL:** `http://localhost:8080`
- **API:** None (local filesystem)
- **Storage:** Browser localStorage
- **Workspaces:** Same as development
- **Auto-launch:** Launch Agent configured (see below)

---

## 5. Auto-Launch Configuration

### macOS Launch Agent
Create `~/Library/LaunchAgents/com.paloit.dev-dashboard.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" 
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.paloit.dev-dashboard</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/usr/sbin/apachectl</string>
        <string>start</string>
    </array>
    
    <key>RunAtLoad</key>
    <true/>
    
    <key>KeepAlive</key>
    <false/>
</dict>
</plist>
```

**Load Launch Agent:**
```bash
launchctl load ~/Library/LaunchAgents/com.paloit.dev-dashboard.plist
```

**Unload Launch Agent:**
```bash
launchctl unload ~/Library/LaunchAgents/com.paloit.dev-dashboard.plist
```

---

## 6. Rollback Procedures

### 6.1 Manual Rollback

**Scenario:** New deployment has critical bugs

**Process:**
1. **Stop Apache:**
   ```bash
   sudo apachectl stop
   ```

2. **Restore Previous Version:**
   ```bash
   # Keep backups in /tmp/dev-dashboard-backups/
   sudo cp -r /tmp/dev-dashboard-backups/v0.3/* \
     /Library/WebServer/Documents/webapps/dev-dashboard/
   ```

3. **Start Apache:**
   ```bash
   sudo apachectl start
   ```

**Recovery Time:** < 5 minutes

---

### 6.2 Backup Strategy

**Pre-Deployment Backup:**
```bash
# Create backup before each deployment
BACKUP_DIR="/tmp/dev-dashboard-backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR
cp -r /Library/WebServer/Documents/webapps/dev-dashboard/ $BACKUP_DIR/
echo "Backup created at $BACKUP_DIR"
```

**Retention Policy:**
- Keep last 5 deployments
- Delete backups older than 30 days

---

## 7. Monitoring & Health Checks

### 7.1 Health Check Endpoint
**URL:** `http://localhost:8080/health` (optional feature)

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-05-07T10:30:00Z",
  "checks": {
    "workspaces": "accessible",
    "localStorage": "available"
  }
}
```

---

### 7.2 Log Monitoring

**Apache Access Log:**
```bash
tail -f /var/log/apache2/access_log
```

**Apache Error Log:**
```bash
tail -f /var/log/apache2/error_log
```

**Application Errors:**
- Browser console (F12 Developer Tools)
- Angular error handler logs

---

### 7.3 Performance Monitoring

**Metrics to Track:**
- **Page Load Time:** < 1 second (Lighthouse)
- **Scan Duration:** < 5 seconds (100 repos)
- **Memory Usage:** < 100MB (Chrome Task Manager)
- **Bundle Size:** < 500KB gzipped (Webpack analyzer)

**Tools:**
- Chrome DevTools Performance
- Lighthouse CI
- Angular Performance Profiler

---

## 8. Security Considerations

### 8.1 Local-Only Deployment
- **Network Access:** localhost only (127.0.0.1)
- **No External Access:** No port forwarding, no cloud deployment
- **Authentication:** Not required (single-user, local machine)

### 8.2 Data Security
- **Storage:** Browser localStorage (unencrypted)
- **Workspaces:** Local filesystem (OS-level permissions)
- **No Sensitive Data:** No passwords, tokens, or credentials stored

### 8.3 Apache Hardening (Optional)
```apache
# Disable directory listing
Options -Indexes

# Prevent access to sensitive files
<FilesMatch "\.(md|json|yml)$">
    Require all denied
</FilesMatch>

# Add security headers
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
```

---

## 9. Troubleshooting

### 9.1 Common Issues

#### Issue: Apache Won't Start
**Symptoms:** `apachectl start` fails  
**Diagnosis:**
```bash
sudo apachectl configtest
```
**Solution:** Fix Apache configuration errors

---

#### Issue: Application Not Loading
**Symptoms:** Blank page at `http://localhost:8080`  
**Diagnosis:**
1. Check Apache is running: `ps aux | grep httpd`
2. Check error log: `tail -f /var/log/apache2/error_log`
3. Check browser console (F12)

**Solution:** 
- Verify WAR deployed correctly
- Check file permissions
- Clear browser cache

---

#### Issue: Repository Scan Not Working
**Symptoms:** No repositories displayed  
**Diagnosis:**
1. Check workspace paths in app configuration
2. Check filesystem permissions
3. Check browser console for errors

**Solution:**
- Verify workspace paths exist and are readable
- Grant filesystem access if needed

---

## 10. Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (unit, integration, E2E)
- [ ] Test coverage ≥ 80%
- [ ] Performance targets met
- [ ] No critical bugs
- [ ] README updated
- [ ] CHANGELOG updated
- [ ] Backup previous version

### Deployment
- [ ] Build WAR file successfully
- [ ] Stop Apache
- [ ] Deploy WAR to Apache directory
- [ ] Configure Apache virtual host
- [ ] Start Apache
- [ ] Verify http://localhost:8080 loads

### Post-Deployment
- [ ] Smoke test: Scan repositories
- [ ] Verify metadata persistence
- [ ] Check performance (scan < 5s)
- [ ] Monitor logs for errors
- [ ] Update version in docs

### Rollback (If Needed)
- [ ] Stop Apache
- [ ] Restore backup
- [ ] Start Apache
- [ ] Document issues

---

## 11. Future Enhancements

### v1.1+ Deployment Improvements
- **Docker Container:** Package as Docker image for portability
- **CI/CD Pipeline:** Automate build and deployment
- **Blue-Green Deployment:** Zero-downtime updates
- **Cloud Backup:** Sync metadata to cloud storage

**Priority:** Low (post-v1.0)

---

**Status:** ACTIVE | **Version:** 1.0 | **Last Updated:** 2026-05-07
