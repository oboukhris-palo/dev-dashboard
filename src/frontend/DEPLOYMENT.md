# DEPLOYMENT GUIDE - Dev Dashboard

**Status:** Ready for Production Deployment  
**Last Updated:** May 27, 2026  
**Application:** Dev Dashboard (Angular 18 SPA)  
**Target:** Apache/Tomcat Local Service

---

## Prerequisites

### System Requirements
- **Apache Tomcat 9+** or **Apache httpd 2.4+**
- **Disk Space:** 100MB minimum free
- **Memory:** 512MB RAM minimum
- **OS:** macOS, Linux, or Windows (with appropriate Apache installation)

### Software Prerequisites
- Node.js 20.x LTS (for building and running backend)
- npm 10.x (for building and running backend)

### Backend Server
The Dev Dashboard requires a Node.js backend server to scan your real repositories.

**Backend serves:**
- Repository scanning API
- Filesystem operations
- README parsing
- Tech stack detection

**Configuration:**
- Default port: 3000
- Workspace paths (configurable in `src/backend/server.js`):
  - `/Users/oboukhris-palo/workspace`
  - `/Users/oboukhris-palo/Documents/workspace`

### Apache/Tomcat Setup Verification

**For Tomcat:**
```bash
# Check if Tomcat is installed
which catalina.sh
# or
ls -la /usr/local/opt/tomcat/bin/

# Check if Tomcat is running
ps aux | grep tomcat
```

**For Apache httpd:**
```bash
# Check if Apache is installed
which apachectl
# or
which httpd

# Check if Apache is running
ps aux | grep httpd
sudo apachectl status
```

**Enable mod_rewrite (required for SPA routing):**
```bash
# For Apache (macOS)
sudo a2enmod rewrite

# Check if enabled
httpd -M | grep rewrite_module
```

---

## Quick Deploy (10 Minutes)

### Step 0: Start Backend Server

The backend must be running before the frontend can scan repositories.

```bash
# Navigate to backend directory
cd src/backend

# Install dependencies (first time only)
npm install

# Start backend server
node server.js
```

**Expected Output:**
```
🚀 Dev Dashboard Backend running on http://localhost:3000
📁 Scanning workspaces:
   - /Users/oboukhris-palo/workspace
   - /Users/oboukhris-palo/Documents/workspace

✅ Ready to scan repositories!
```

**Keep this terminal running** - the backend must stay active for the frontend to work.

### Step 1: Build Production WAR

Open a **new terminal window** for the frontend:

```bash
cd src/frontend

# Install dependencies (if needed)
npm ci

# Build production WAR (includes --base-href=/dev-dashboard/ for Tomcat subdirectory deployment)
npm run build:war

# Verify WAR was created
ls -lh dist/app.war
```

**Important:** The `build:prod` script includes `--base-href=/dev-dashboard/` which is **required** for Tomcat subdirectory deployment. Without this flag, assets will fail to load with 404 errors.

**Expected Output:**
```
-rw-r--r--  1 user  staff  450K May 27 14:22 dist/frontend/app.war
```

### Step 2: Deploy to Apache

```bash
# Make deploy script executable (one-time)
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh

# Or with custom settings
./scripts/deploy.sh --app-name=dev-dashboard --port=8080
```

**Expected Output:**
```
[INFO] === Dev Dashboard Deployment ===
[✓] Tomcat is running
[✓] Webapps directory is writable
[✓] Disk space available: 50GB
[✓] WAR file valid and ready (size: 450K)
[INFO] All pre-flight checks passed.
[✓] Previous WAR backed up to /usr/local/opt/tomcat/webapps/dev-dashboard.war.backup
[✓] WAR deployed successfully
[✓] Application extracted to /usr/local/opt/tomcat/webapps/dev-dashboard
[✓] Deployment verification complete
[✓] Application available at: http://localhost:8080/dev-dashboard/
```

### Step 3: Verify Deployment

```bash
# Access application in browser
open http://localhost:8080/dev-dashboard/

# Or test with curl
curl http://localhost:8080/dev-dashboard/
curl http://localhost:8080/dev-dashboard/assets/styles.css
curl http://localhost:8080/dev-dashboard/repositories  # SPA route → index.html
```

**Expected Results:**
- ✅ Landing page loads with Angular Material UI
- ✅ All assets (CSS, JS, images) load without errors
- ✅ Navigation between routes works (client-side routing)
- ✅ No 404 errors in console

---

## Manual Deployment (Step-by-Step)

Use this if the automated `deploy.sh` script encounters issues.

### Step 1: Pre-flight Checks

```bash
# 1. Check Apache/Tomcat is running
ps aux | grep -E "tomcat|httpd" | grep -v grep

# 2. Check webapps directory permissions
ls -ld /usr/local/opt/tomcat/webapps
# Should show: drwxr-xr-x (or similar with write permission)

# 3. Check disk space
df -h /usr/local/opt/tomcat
# Should show >100MB available

# 4. Check WAR file is valid
unzip -t dist/frontend/app.war | head -20
```

### Step 2: Backup Existing Deployment (if any)

```bash
# Navigate to Tomcat webapps
cd /usr/local/opt/tomcat/webapps

# Backup current version
if [ -f dev-dashboard.war ]; then
  cp dev-dashboard.war dev-dashboard.war.backup
  rm -rf dev-dashboard  # Remove extracted directory
fi
```

### Step 3: Deploy WAR

```bash
# Copy WAR to webapps directory
cp /path/to/dev-dashboard/src/frontend/dist/frontend/app.war /usr/local/opt/tomcat/webapps/dev-dashboard.war

# Verify copy
ls -lh /usr/local/opt/tomcat/webapps/dev-dashboard.war
```

### Step 4: Wait for Extraction

Tomcat automatically extracts WAR files. Wait for extraction to complete:

```bash
# Watch extraction progress
watch -n 1 'ls -la /usr/local/opt/tomcat/webapps/dev-dashboard/'

# Or check periodically
sleep 5
ls -la /usr/local/opt/tomcat/webapps/dev-dashboard/
```

**Expected:** `dev-dashboard/` directory created with `index.html`, `assets/`, etc.

### Step 5: Test Deployment

```bash
# Test root path
curl http://localhost:8080/dev-dashboard/

# Test static asset
curl http://localhost:8080/dev-dashboard/assets/styles.css -I

# Test SPA route (should return index.html, not 404)
curl http://localhost:8080/dev-dashboard/repositories -I

# Test within browser
open http://localhost:8080/dev-dashboard/
```

---

## Verify Deployment

### Browser Testing

1. **Access Application**
   ```
   Open: http://localhost:8080/dev-dashboard/
   ```

2. **Check UI Loads**
   - Angular Material header visible
   - Repository list displaying
   - No console errors (check browser DevTools → Console)

3. **Test Navigation**
   - Click through different pages
   - Each navigation should work without page reload (SPA behavior)

4. **Check Assets**
   - Styles applied correctly
   - Images displayed
   - No broken asset links (red X in DevTools)

### Command-Line Testing

```bash
# Test 1: Index page loads
curl -I http://localhost:8080/dev-dashboard/
# Expected: HTTP/1.1 200 OK

# Test 2: SPA route redirects to index
curl -I http://localhost:8080/dev-dashboard/repositories
# Expected: HTTP/1.1 200 OK (NOT 404)
curl -I http://localhost:8080/dev-dashboard/nonexistent
# Expected: HTTP/1.1 200 OK (SPA serves index.html for 404 routes)

# Test 3: Static assets serve correctly
curl -I http://localhost:8080/dev-dashboard/assets/styles.css
# Expected: HTTP/1.1 200 OK, Content-Type: text/css

# Test 4: Check response content
curl http://localhost:8080/dev-dashboard/ | head -20
# Should show HTML with Angular app shell
```

---

## Auto-Start Configuration (macOS)

### Option 1: Tomcat Auto-Start with launchd

**Create** `~/Library/LaunchAgents/org.apache.tomcat.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>org.apache.tomcat</string>
    <key>Program</key>
    <string>/usr/local/opt/tomcat/bin/catalina.sh</string>
    <key>ProgramArguments</key>
    <array>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/usr/local/opt/tomcat/logs/launchd.log</string>
    <key>StandardErrorPath</key>
    <string>/usr/local/opt/tomcat/logs/launchd-error.log</string>
</dict>
</plist>
```

**Load the launch agent:**
```bash
# Load
launchctl load ~/Library/LaunchAgents/org.apache.tomcat.plist

# Verify
launchctl list | grep tomcat

# Unload (if needed)
launchctl unload ~/Library/LaunchAgents/org.apache.tomcat.plist
```

### Option 2: Manual Startup

For local development without auto-start:

```bash
# Start Tomcat manually
/usr/local/opt/tomcat/bin/startup.sh

# Stop Tomcat
/usr/local/opt/tomcat/bin/shutdown.sh

# Check status
ps aux | grep tomcat
```

---

## Rollback Procedure

If deployment fails or you need to restore the previous version:

### Quick Rollback

```bash
# Make rollback script executable (one-time)
chmod +x scripts/deploy-rollback.sh

# Run rollback
./scripts/deploy-rollback.sh

# Or restart Tomcat/Apache to activate
sudo apachectl restart  # Apache
# or
/usr/local/opt/tomcat/bin/shutdown.sh
/usr/local/opt/tomcat/bin/startup.sh  # Tomcat
```

### Manual Rollback

```bash
# Navigate to webapps
cd /usr/local/opt/tomcat/webapps

# Restore from backup
rm -rf dev-dashboard.war dev-dashboard/
cp dev-dashboard.war.backup dev-dashboard.war

# Restart service
sudo apachectl restart  # or Tomcat shutdown/startup
```

---

## Troubleshooting

### Issue 1: "Permission Denied" When Running deploy.sh

**Problem:** Script is not executable

**Solution:**
```bash
chmod +x scripts/deploy.sh
chmod +x scripts/deploy-rollback.sh
./scripts/deploy.sh
```

### Issue 2: "Tomcat is not running"

**Problem:** Apache/Tomcat service not started

**Solution:**
```bash
# Start Tomcat
/usr/local/opt/tomcat/bin/startup.sh

# Or Apache
sudo apachectl start

# Verify
ps aux | grep -E "tomcat|httpd"
```

### Issue 3: "No write permission for webapps directory"

**Problem:** User doesn't own webapps directory

**Solution:**
```bash
# Make user own webapps directory
sudo chown -R $USER /usr/local/opt/tomcat/webapps

# Or fix permissions
sudo chmod -R 755 /usr/local/opt/tomcat/webapps
```

### Issue 4: "WAR file not found"

**Problem:** Build hasn't been run

**Solution:**
```bash
cd src/frontend
npm run build:war
```

### Issue 5: Assets fail to load with 404 errors (polyfills, main.js, styles.css)

**Problem:** Angular app built without correct base-href for subdirectory deployment

**Symptoms:**
- Browser console shows errors like:
  ```
  GET http://localhost:8080/polyfills-FFHMD2TL.js net::ERR_ABORTED 404 (Not Found)
  GET http://localhost:8080/main-2B2QJ5GB.js net::ERR_ABORTED 404 (Not Found)
  GET http://localhost:8080/styles-CECZ26Y3.css net::ERR_ABORTED 404 (Not Found)
  ```
- Assets are being requested from root (`/`) instead of `/dev-dashboard/`

**Solution:**
The `build:prod` script **must** include `--base-href=/dev-dashboard/` flag:

```bash
# Check package.json script (should include --base-href=/dev-dashboard/)
cat package.json | grep build:prod

# Should show:
# "build:prod": "ng build --configuration production --source-map=false --base-href=/dev-dashboard/"

# Rebuild and redeploy
npm run build:war
./scripts/deploy.sh

# Clear browser cache and reload
# Shift + Cmd + R (Mac) or Ctrl + Shift + R (Windows/Linux)
```

**Root Cause:** Angular generates asset paths relative to the base href. When deploying to a Tomcat subdirectory (`/dev-dashboard/`), the base href must match the deployment path.

### Issue 6: Application loads but shows 404 for SPA routes

**Problem:** mod_rewrite not enabled or .htaccess not processed

**Solution:**

```bash
# 1. Check if mod_rewrite is enabled
httpd -M | grep rewrite_module
# If not, enable it:
sudo a2enmod rewrite

# 2. Verify .htaccess in WAR
unzip -l dist/app.war | grep htaccess

# 3. Check Apache config allows .htaccess
# Look for "AllowOverride All" in /etc/apache2/httpd.conf
grep -n "AllowOverride" /etc/apache2/httpd.conf

# 4. Restart Apache
sudo apachectl restart
```

**Note:** For Tomcat deployments, SPA routing is handled by `WEB-INF/web.xml` (automatically included in the WAR), not `.htaccess`.

### Issue 7: Styles/Images not loading

**Problem:** Asset paths incorrect or service URL wrong

**Diagnosis:**
```bash
# Check browser console for 404s
# Check exact asset paths:
curl http://localhost:8080/dev-dashboard/styles-CECZ26Y3.css -I
curl http://localhost:8080/dev-dashboard/main-2B2QJ5GB.js -I

# Check WAR contents:
unzip -l dist/app.war | head -20
```

**Solution:**
- Verify base path is set correctly: Check `package.json` for `--base-href=/dev-dashboard/`
- Rebuild if paths were changed: `npm run build:war`
- Re-deploy: `./scripts/deploy.sh`
- Clear browser cache: Shift + Cmd + R (Mac) or Ctrl + Shift + R (Windows/Linux)

### Issue 8: Cannot rollback - "No backup file found"

**Problem:** First deployment or backup was deleted

**Solution:**
- This is the first deployment - no backup exists yet
- To rollback, manually restore from a version control or previous WAR backup if available
- Next deployment will create a backup for future rollbacks

### Issue 9: "Failed to load repositories" or "Backend not responding"

**Problem:** Backend server not running or not accessible

**Symptoms:**
- Frontend loads but shows error: "Failed to load repositories"
- Browser console shows: `GET http://localhost:3000/api/repos/scan net::ERR_CONNECTION_REFUSED`
- Empty repository list with loading spinner stuck

**Solution:**
```bash
# Check if backend is running
ps aux | grep "node.*server.js"

# If not running, start it
cd src/backend
node server.js

# Test backend directly
curl http://localhost:3000/health
# Should return: {"status":"ok"}

curl http://localhost:3000/api/repos/scan | jq
# Should return: {"repositories": [...], "totalCount": ...}

# Check for port conflicts (port 3000 in use)
lsof -i :3000
# If another process is using port 3000, kill it:
lsof -i :3000 | awk 'NR==2 {print $2}' | xargs kill -9
```

**CORS Issues:**
If backend runs but frontend can't connect:
```bash
# Check backend logs for CORS errors
# Backend should show: "✅ CORS enabled for: http://localhost:4200, http://localhost:8080"

# Verify backend allows your frontend URL
# Edit src/backend/server.js if needed to add your deployment URL
```

### Issue 10: "No repositories found" when you know repositories exist

**Problem:** Workspace paths not configured correctly

**Solution:**
```bash
# Edit backend configuration
nano src/backend/server.js

# Update workspacePaths array:
const workspacePaths = [
  '/Users/YOUR_USERNAME/workspace',        # ← Update path
  '/Users/YOUR_USERNAME/Documents/workspace'  # ← Update path
];

# Restart backend
# Ctrl+C to stop, then:
node server.js

# Test scan
curl http://localhost:3000/api/repos/scan | jq '.totalCount'
```

---

## Performance Tuning

### Tomcat JVM Settings

Edit `/usr/local/opt/tomcat/bin/catalina.sh`:

```bash
# Add before "exec "$PRGDIR"/"$EXECUTABLE"
export CATALINA_OPTS="-Xms512m -Xmx1024m"
```

**Explanation:**
- `-Xms512m`: Initial heap size 512MB
- `-Xmx1024m`: Maximum heap size 1GB

### Apache Performance

For static assets, consider enabling gzip:

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check disk space: `df -h /usr/local/opt/tomcat`
- Review logs: `tail -f /usr/local/opt/tomcat/logs/catalina.out`

**Monthly:**
- Verify app still accessible
- Clean up old WAR backups (> 1 month old)
- Check for Apache/Tomcat security updates

### Cleanup Old Backups

```bash
# List all backups
ls -lh /usr/local/opt/tomcat/webapps/dev-dashboard.war*

# Remove backups older than 30 days
find /usr/local/opt/tomcat/webapps -name "dev-dashboard.war.backup*" -mtime +30 -delete
```

---

## SPA Routing Configuration

### .htaccess File (Included in WAR)

The `.htaccess` file in the WAR root enables SPA routing:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /dev-dashboard/
  
  # Don't rewrite files/directories that exist
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  
  # Rewrite all other requests to index.html
  RewriteRule . /dev-dashboard/index.html [L]
</IfModule>
```

**How It Works:**
1. Client requests `/dev-dashboard/repositories`
2. Apache checks if file/directory exists (`!-f`, `!-d`)
3. Since it doesn't exist, Apache rewrites to `/dev-dashboard/index.html`
4. Browser receives `index.html` with Angular app
5. Angular router loads the `repositories` component client-side

---

## Verification Checklist

- [ ] Tomcat/Apache running
- [ ] Webapps directory writable
- [ ] Disk space available (100MB+)
- [ ] WAR built successfully
- [ ] Deploy script runs without errors
- [ ] Application accessible at http://localhost:8080/dev-dashboard/
- [ ] SPA routes work (no 404s)
- [ ] Static assets load correctly
- [ ] Browser console shows no errors
- [ ] Rollback script created and tested
- [ ] Documentation updated
- [ ] Team notified of deployment

---

## Support & Questions

**Common Questions:**

**Q: How do I see deployment logs?**
```bash
tail -f /usr/local/opt/tomcat/logs/catalina.out
```

**Q: Can I deploy to a different port?**
```bash
./scripts/deploy.sh --port=9000
```

**Q: How do I update the app after deployment?**
```bash
npm run build:war
./scripts/deploy.sh
```

**Q: Is my data persisted if I restart?**
Yes. The app uses `localStorage` for metadata persistence. Data survives app restarts.

**Q: How do I completely remove the deployment?**
```bash
rm -rf /usr/local/opt/tomcat/webapps/dev-dashboard*
# Or keep backups:
rm -rf /usr/local/opt/tomcat/webapps/dev-dashboard/
rm -f /usr/local/opt/tomcat/webapps/dev-dashboard.war
```

---

**Created:** May 27, 2026  
**Status:** Ready for Production  
**Next Review:** June 27, 2026
