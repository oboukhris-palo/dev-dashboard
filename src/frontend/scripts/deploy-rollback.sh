#!/bin/bash
###############################################################################
# Rollback Script: Restore Previous WAR Deployment
# Purpose: Quickly restore previous version if deployment fails
# Usage: ./deploy-rollback.sh [--app-name=dev-dashboard]
###############################################################################

set -e

# Configuration
APP_NAME="${APP_NAME:-dev-dashboard}"
TOMCAT_HOME="${TOMCAT_HOME:-/usr/local/opt/tomcat}"
WEBAPPS_DIR="${TOMCAT_HOME}/webapps"
WAR_DEST="${WEBAPPS_DIR}/${APP_NAME}.war"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

main() {
  log_info "=== Rollback Deployment ==="
  log_info "App Name: ${APP_NAME}"
  echo ""
  
  # Check if Apache is running
  log_info "Checking if Apache/Tomcat is running..."
  if ! pgrep -f "tomcat\|httpd\|apache" > /dev/null; then
    log_warn "Apache/Tomcat is not running (non-blocking)"
  else
    log_success "Apache/Tomcat is running"
  fi
  
  # Check if backup exists
  if [ ! -f "${WAR_DEST}.backup" ]; then
    log_error "No backup file found: ${WAR_DEST}.backup"
    log_info "Cannot rollback without a previous deployment"
    exit 1
  fi
  
  log_info "Rollback steps:"
  log_info "1. Remove current WAR and extracted app directory"
  log_info "2. Restore WAR from backup"
  log_info "3. Restart Tomcat/Apache for redeployment"
  echo ""
  
  # Backup the current version for inspection
  if [ -f "${WAR_DEST}" ]; then
    log_info "Archiving current version for inspection..."
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    mv "${WAR_DEST}" "${WAR_DEST}.failed-${TIMESTAMP}"
    log_success "Current version archived as ${WAR_DEST}.failed-${TIMESTAMP}"
  fi
  
  # Remove extracted app directory
  APP_DIR="${WEBAPPS_DIR}/${APP_NAME}"
  if [ -d "${APP_DIR}" ]; then
    log_info "Removing extracted application directory..."
    rm -rf "${APP_DIR}"
    log_success "Application directory removed"
  fi
  
  # Restore backup
  log_info "Restoring previous WAR from backup..."
  mv "${WAR_DEST}.backup" "${WAR_DEST}"
  log_success "Previous version restored: ${WAR_DEST}"
  
  echo ""
  log_info "Waiting for Apache/Tomcat to redeploy..."
  sleep 3
  
  log_success "=== Rollback Complete ==="
  log_info "Previous version is now active"
  log_info "Restart Apache/Tomcat for automatic redeployment"
  log_info "Command: sudo apachectl restart  (or catalina restart for Tomcat)"
}

# Handle errors
trap 'log_error "Rollback failed"; exit 1' ERR

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --app-name=*)
      APP_NAME="${1#*=}"
      shift
      ;;
    *)
      log_error "Unknown argument: $1"
      exit 1
      ;;
  esac
done

main
