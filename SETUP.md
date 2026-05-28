# 🛠️ Dev-Dashboard Setup Guide

> **Complete setup, build, and deployment instructions**

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Development Setup](#-development-setup)
- [Build & Test](#-build--test)
- [Production Deployment](#-production-deployment)
- [Troubleshooting](#-troubleshooting)
- [Configuration](#-configuration)

---

## 🔧 Prerequisites

### Required Software

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| **Node.js** | 18.x or higher | Runtime for Electron app |
| **npm** | 8.x or higher | Package manager |
| **Git** | 2.x or higher | Version control |
| **VS Code Insiders** | Latest | (Optional) For quick launch feature |

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version   # Should be 8.x or higher
```

---

## � Configuration

### Configure Your Workspace Paths

⚠️ **Important:** Before launching the desktop app, you must configure your workspace directories where you keep your git repositories.

### Backend Configuration (.env File)

**Interactive Setup (macOS/Linux - Recommended)**

1. Navigate to backend directory:
   ```bash
   cd src/backend
   ```

2. Run the setup script:
   ```bash
   ./setup.sh
   ```

3. Follow the prompts to configure your workspace paths

**Manual Setup (All Platforms)**

1. Navigate to backend directory:
   ```bash
   cd src/backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` file with your text editor:
   ```bash
   # macOS/Linux
   nano .env
   # or
   code .env
   
   # Windows
   notepad .env
   ```

4. Update `WORKSPACE_PATHS` with your actual directories:
   ```env
   # Example for macOS
   WORKSPACE_PATHS=/Users/johndoe/workspace,/Users/johndoe/projects
   
   # Example for Windows (use forward slashes)
   WORKSPACE_PATHS=C:/Users/johndoe/workspace,C:/Users/johndoe/projects
   
   # Example for Linux
   WORKSPACE_PATHS=/home/johndoe/workspace,/home/johndoe/projects
   ```

5. **(Optional)** Customize exclude patterns:
   ```env
   EXCLUDE_PATTERNS=node_modules,.git,dist,build,target,.vscode,.idea,coverage,out
   ```

### Verify Configuration

After configuring, you can verify your setup:

```bash
cat src/backend/.env
# Should show your WORKSPACE_PATHS
```

### Finding Your Workspace Directories

Not sure which directories to configure? Use these commands:

**macOS/Linux:**
```bash
# List your user directories
ls -d ~/*/

# Common workspace locations
ls -d ~/workspace ~/projects ~/dev ~/code ~/Documents/workspace 2>/dev/null

# Find all git repositories in your home directory (may take a minute)
find ~ -name .git -type d -maxdepth 3 2>/dev/null | sed 's/\/.git$//'
```

**Windows (PowerShell):**
```powershell
# List your user directories
Get-ChildItem ~\ -Directory

# Common workspace locations
Get-ChildItem "C:\Users\$env:USERNAME\workspace","C:\Users\$env:USERNAME\projects" -ErrorAction SilentlyContinue

# Find all git repositories
Get-ChildItem -Path ~ -Filter .git -Recurse -Depth 3 -Directory -ErrorAction SilentlyContinue | Select-Object Parent
```

---

## 📦 Installation

```bash
git clone <repository-url>
cd dev-dashboard
npm install  # Installs all dependencies (frontend + backend + Electron)
```

**What gets installed:**
- Electron desktop framework
- Angular 18 + Material Design
- Node.js backend (Express, TypeScript)
- Testing tools (Karma, Playwright)

**Note:** Run from project root only. Subdirectory installs happen automatically.

---

## 🚀 Development Setup

⚠️ **Prerequisites:** Make sure you've completed the [Configuration](#-configuration) section above.

### Launch Desktop App

**Production Mode:**
```bash
npm run build:prod  # Build once
npm start           # Launch app
```

**Development Mode (Hot-Reload):**
```bash
npm run dev  # Watch mode + auto-reload
```

The Electron app automatically:
- Starts the backend server (port 3000)
- Loads the Angular frontend
- Opens the desktop window
- Scans your configured workspaces

---

## 🔨 Build & Test

### Commands

#### Build

```bash
npm run build:prod  # Production build (run from project root)
```

**Output:** `src/frontend/dist/dev-dashboard/browser/` (~300-400KB gzipped)

#### Testing

```bash
# Unit tests
cd src/frontend
npm test                # Single run (headless)
npm run test:watch     # Watch mode

# E2E tests
npm run e2e            # Headless
npm run e2e:ui         # Interactive

# Coverage
npm run test:coverage  # Generate report
```

**Coverage Thresholds:** Statements 65%, Branches 55%, Functions 50%, Lines 70%

#### Linting

```bash
cd src/frontend
npm run lint           # Check
npm run lint:fix       # Auto-fix
```

---

## 🏭 Production Deployment

### Package Desktop App

```bash
npm run package:mac     # macOS: Dev Dashboard-2.1.0.dmg
npm run package:win     # Windows: Dev Dashboard Setup 2.1.0.exe
npm run package:linux   # Linux: dev-dashboard-2.1.0.AppImage
```

**Output location:** `release/`

### Distribution

1. Build for your platform
2. Share the installer
3. Users install and configure `src/backend/.env` on first launch

---

## 🐛 Troubleshooting

### Common Issues

**Port 3000 in use:**
```bash
lsof -i :3000 | awk 'NR==2 {print $2}' | xargs kill -9
```

**App won't launch:**
```bash
npm run build:prod && npm start
```

**White screen:**
```bash
cd src/frontend && rm -rf dist/ && cd ../.. && npm run build:prod && npm start
```

**Build fails:**
```bash
cd src/frontend && npx ng cache clean && rm -rf node_modules && npm install
```

**macOS permissions (can't scan Documents):**
System Settings → Privacy & Security → Full Disk Access → Add Terminal + VS Code

---

## ⚙️ Advanced Configuration

### Add More Workspace Paths

Edit `src/backend/.env`:
```env
WORKSPACE_PATHS=/path1,/path2,/path3
```

### Customize Tech Stack Detection

Edit `src/backend/dist/services.js`:
```javascript
const markers = {
  'Node.js': ['package.json'],
  'Angular': ['angular.json'],
  'Python': ['requirements.txt'],
  // Add more...
};
```

---

## 📝 Project Structure

```
dev-dashboard/
├── electron/main.js        # App entry point
├── src/
│   ├── backend/            # Node.js API
│   │   ├── .env           # Your workspace config
│   │   └── dist/          # Compiled services
│   └── frontend/           # Angular UI
│       ├── src/app/       # Components, services, state
│       └── dist/          # Production build
├── build/                  # App icons
├── release/                # Built installers
└── package.json           # Root config
```

### Workflow

1. Configure `src/backend/.env`
2. `npm run build:prod`
3. `npm start`
4. `npm run package:mac` (or `:win`, `:linux`)

---

## � Need Help?

1. Check [Troubleshooting](#-troubleshooting) above
2. Review [docs/](docs/) for architecture details
3. Contact the Palo IT dev team

---

*Last updated: May 28, 2026*
