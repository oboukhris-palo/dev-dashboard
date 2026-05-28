#!/bin/bash
###############################################################################
# Deployment Script: Deploy WAR to Apache/Tomcat
# Purpose: Automate WAR deployment with validation, backup, and rollback
# Usage: ./deploy.sh [--app-name=dev-dashboard] [--port=8080]
###############################################################################

set -e  # Exit on error

# Configuration
APP_NAME="${APP_NAME:-dev-dashboard}"
PORT="${PORT:-8080}"
TOMCAT_HOME="${TOMCAT_HOME:-/opt/homebrew/Cellar/tomcat/11.0.22/libexec}"
WEBAPPS_DIR="${TOMCAT_HOME}/webapps"
WAR_SOURCE="dist/app.war"
WAR_DEST="${WEBAPPS_DIR}/${APP_NAME}.war"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

###############################################################################
# Logging Functions
###############################################################################

log_info() {
  echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
  echo -e "${GREEN}[✓]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

###############################################################################
# Pre-flight Checks
###############################################################################

check_apache_running() {
  log_info "Checking if Apache/Tomcat is running..."
  
  if pgrep -f "tomcat" > /dev/null; then
    log_success "Tomcat is running"
    return 0
  elif pgrep -f "httpd\|apache" > /dev/null; then
    log_success "Apache is running"
    return 0
  else
    log_error "Apache/Tomcat is not running"
    log_info "To start Tomcat: ${TOMCAT_HOME}/bin/startup.sh"
    log_info "Or: sudo apachectl start"
    exit 1
  fi
}

check_webapps_directory() {
  log_info "Checking webapps directory: ${WEBAPPS_DIR}"
  
  if [ ! -d "${WEBAPPS_DIR}" ]; then
    log_error "Webapps directory not found: ${WEBAPPS_DIR}"
    exit 1
  fi
  
  if [ ! -w "${WEBAPPS_DIR}" ]; then
    log_error "No write permission for webapps directory"
    log_info "Try: sudo chown -R \$USER ${WEBAPPS_DIR}"
    exit 1
  fi
  
  log_success "Webapps directory is writable"
}

check_disk_space() {
  log_info "Checking disk space..."
  
  AVAILABLE=$(df "${WEBAPPS_DIR}" | awk 'NR==2 {print $4}')
  REQUIRED=102400  # 100MB in KB
  
  if [ "${AVAILABLE}" -lt "${REQUIRED}" ]; then
    log_error "Insufficient disk space. Required: 100MB, Available: $((AVAILABLE / 1024))MB"
    exit 1
  fi
  
  log_success "Disk space available: $((AVAILABLE / 1024))MB"
}

check_war_file() {
  log_info "Checking WAR file: ${WAR_SOURCE}"
  
  if [ ! -f "${WAR_SOURCE}" ]; then
    log_error "WAR file not found: ${WAR_SOURCE}"
    log_info "First, build the WAR: npm run build:war"
    exit 1
  fi
  
  # Verify WAR is valid ZIP file
  if ! unzip -t "${WAR_SOURCE}" > /dev/null 2>&1; then
    log_error "WAR file is corrupt or invalid"
    exit 1
  fi
  
  WAR_SIZE=$(du -h "${WAR_SOURCE}" | awk '{print $1}')
  log_success "WAR file valid and ready (size: ${WAR_SIZE})"
}

###############################################################################
# Backup and Deployment
###############################################################################

backup_existing_war() {
  if [ -f "${WAR_DEST}" ]; then
    log_info "Backing up existing WAR..."
    
    # Rotate backups (keep last 2)
    if [ -f "${WAR_DEST}.backup-2" ]; then
      rm -f "${WAR_DEST}.backup-2"
    fi
    
    if [ -f "${WAR_DEST}.backup" ]; then
      mv "${WAR_DEST}.backup" "${WAR_DEST}.backup-2"
    fi
    
    mv "${WAR_DEST}" "${WAR_DEST}.backup"
    log_success "Previous WAR backed up to ${WAR_DEST}.backup"
  fi
}

deploy_war() {
  log_info "Deploying WAR to ${WAR_DEST}..."
  
  cp "${WAR_SOURCE}" "${WAR_DEST}"
  
  if [ ! -f "${WAR_DEST}" ]; then
    log_error "Failed to copy WAR file"
    exit 1
  fi
  
  log_success "WAR deployed successfully"
}

verify_deployment() {
  log_info "Waiting for deployment to complete..."
  sleep 3
  
  log_info "Verifying deployment..."
  
  # Check if app directory was extracted
  APP_DIR="${WEBAPPS_DIR}/${APP_NAME}"
  if [ -d "${APP_DIR}" ]; then
    log_success "Application extracted to ${APP_DIR}"
  else
    log_warn "Application directory not yet extracted (may be in progress)"
  fi
  
  # Try to access app via HTTP
  HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:${PORT}/${APP_NAME}/" 2>/dev/null || echo "000")
  
  if [ "${HTTP_RESPONSE}" == "200" ] || [ "${HTTP_RESPONSE}" == "000" ]; then
    log_success "Deployment verification complete"
    log_success "Application available at: http://localhost:${PORT}/${APP_NAME}/"
  else
    log_warn "Unexpected HTTP response: ${HTTP_RESPONSE}"
  fi
}

###############################################################################
# Rollback
###############################################################################

rollback() {
  log_warn "Rolling back deployment..."
  
  if [ -f "${WAR_DEST}.backup" ]; then
    log_info "Restoring previous WAR from backup..."
    
    rm -f "${WAR_DEST}"
    rm -rf "${WEBAPPS_DIR}/${APP_NAME}"
    
    mv "${WAR_DEST}.backup" "${WAR_DEST}"
    
    sleep 2
    log_success "Rollback complete. Previous version restored."
  else
    log_error "No backup file found for rollback"
    exit 1
  fi
}

###############################################################################
# Main Execution
###############################################################################

main() {
  log_info "=== Dev Dashboard Deployment ==="
  log_info "App Name: ${APP_NAME}"
  log_info "Tomcat Home: ${TOMCAT_HOME}"
  log_info "Port: ${PORT}"
  echo ""
  
  # Pre-flight checks
  check_apache_running
  check_webapps_directory
  check_disk_space
  check_war_file
  
  echo ""
  log_info "All pre-flight checks passed."
  echo ""
  
  # Backup and deploy
  backup_existing_war
  deploy_war
  
  echo ""
  verify_deployment
  
  echo ""
  log_success "=== Deployment Complete ==="
  log_info "Access application at: http://localhost:${PORT}/${APP_NAME}/"
  log_info "To rollback: ./scripts/deploy-rollback.sh"
}

# Handle errors
trap 'log_error "Deployment failed"; exit 1' ERR

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --app-name=*)
      APP_NAME="${1#*=}"
      shift
      ;;
    --port=*)
      PORT="${1#*=}"
      shift
      ;;
    *)
      log_error "Unknown argument: $1"
      exit 1
      ;;
  esac
done

main
