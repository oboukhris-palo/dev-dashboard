#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Angular 18 outputs to dist/dev-dashboard/browser/
const buildOutputPath = path.join(__dirname, '../dist/dev-dashboard/browser');
const distPath = path.join(__dirname, '../dist/dev-dashboard');
const warPath = path.join(__dirname, '../dist/app.war');
const webInfPath = path.join(buildOutputPath, 'WEB-INF');

// Create WEB-INF/web.xml for Tomcat SPA routing
function createWebXml() {
  const webXml = `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
         https://jakarta.ee/xml/ns/jakartaee/web-app_6_0.xsd"
         version="6.0">
    
    <display-name>Dev Dashboard</display-name>
    <description>Local repository management SPA</description>
    
    <!-- Default welcome file -->
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
    
    <!-- Error page for 404 - redirect to index.html for SPA routing -->
    <error-page>
        <error-code>404</error-code>
        <location>/index.html</location>
    </error-page>
    
    <!-- MIME type mappings for Angular assets -->
    <mime-mapping>
        <extension>css</extension>
        <mime-type>text/css</mime-type>
    </mime-mapping>
    <mime-mapping>
        <extension>js</extension>
        <mime-type>application/javascript</mime-type>
    </mime-mapping>
    <mime-mapping>
        <extension>json</extension>
        <mime-type>application/json</mime-type>
    </mime-mapping>
    <mime-mapping>
        <extension>ico</extension>
        <mime-type>image/x-icon</mime-type>
    </mime-mapping>
    
</web-app>`;
  
  // Create WEB-INF directory
  if (!fs.existsSync(webInfPath)) {
    fs.mkdirSync(webInfPath, { recursive: true });
  }
  
  // Write web.xml
  fs.writeFileSync(path.join(webInfPath, 'web.xml'), webXml);
  console.log('✅ WEB-INF/web.xml created for Tomcat SPA routing');
}

async function createWar() {
  // Validate build output exists (Angular 18 outputs to browser/ subdirectory)
  if (!fs.existsSync(buildOutputPath)) {
    console.error(`❌ Error: Build output not found at ${buildOutputPath}`);
    console.error('Run "npm run build:prod" first');
    process.exit(1);
  }

  try {
    // Create WEB-INF/web.xml for Tomcat
    createWebXml();

    // Create WAR from browser/ directory (not parent)
    // This ensures index.html is at WAR root, not inside browser/ subdirectory
    process.chdir(buildOutputPath);
    const { stdout, stderr } = await execAsync('jar -cvf ../../app.war *');
    
    if (fs.existsSync(warPath)) {
      const stats = fs.statSync(warPath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`✅ WAR file created: ${warPath} (${sizeMB} MB)`);
      console.log(`✅ WAR contains: index.html, WEB-INF/web.xml, JS/CSS bundles`);
      console.log(`✅ Ready for Tomcat deployment`);
    }
  } catch (error) {
    console.error(`❌ WAR creation failed: ${error.message}`);
    process.exit(1);
  }
}

createWar();
