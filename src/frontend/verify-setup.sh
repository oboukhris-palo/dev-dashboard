#!/bin/bash

# Dev Dashboard - Quick Start Script
# Run this to verify setup before starting TDD

set -e

echo "🚀 Dev Dashboard - Sprint 1 Setup Verification"
echo "==============================================="
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "  Node.js: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v20 ]]; then
  echo "  ⚠️  Warning: Node.js 20.x LTS is recommended"
fi

# Check npm version
echo ""
echo "✓ Checking npm version..."
NPM_VERSION=$(npm -v)
echo "  npm: $NPM_VERSION"

# Check if node_modules exists
echo ""
if [ -d "node_modules" ]; then
  echo "✓ node_modules/ exists"
else
  echo "⚠️  node_modules/ not found"
  echo "  Run: npm install"
  exit 1
fi

# Check if Angular CLI is available
echo ""
echo "✓ Checking Angular CLI..."
if npm list @angular/cli > /dev/null 2>&1; then
  echo "  Angular CLI installed"
else
  echo "  ⚠️  Angular CLI not found"
  exit 1
fi

# Check TypeScript compilation
echo ""
echo "✓ Checking TypeScript compilation..."
if npx tsc --noEmit --skipLibCheck; then
  echo "  ✅ TypeScript compilation successful"
else
  echo "  ❌ TypeScript errors found"
  echo "  This is EXPECTED - services are not implemented yet"
fi

# Check directory structure
echo ""
echo "✓ Verifying project structure..."
EXPECTED_DIRS=(
  "src/app/domain"
  "src/app/services"
  "src/app/state"
  "src/app/components"
  "e2e"
)

for dir in "${EXPECTED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "  ✓ $dir/"
  else
    echo "  ❌ $dir/ missing"
    exit 1
  fi
done

# Count TODO annotations
echo ""
echo "✓ Counting TODO annotations..."
TODO_COUNT=$(grep -r "@todo" src/app --include="*.ts" | wc -l | xargs)
echo "  Found $TODO_COUNT TODO items for TDD implementation"

# Display next steps
echo ""
echo "==============================================="
echo "✅ Setup Verification Complete!"
echo "==============================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Start test runner (Terminal 1):"
echo "   npm test"
echo ""
echo "2. Start dev server (Terminal 2):"
echo "   npm start"
echo ""
echo "3. Open TDD Guide:"
echo "   cat TDD-GUIDE.md"
echo ""
echo "4. Begin TDD implementation:"
echo "   Open: src/app/services/filesystem.service.spec.ts"
echo "   Find: @todo RED comments"
echo "   Write: Failing tests"
echo ""
echo "🎯 Sprint 1 Target: REPO-001-US-001 (5 SP)"
echo "📅 Timeline: May 8-10, 2026 (3 days)"
echo ""
echo "Good luck! 🚀"
