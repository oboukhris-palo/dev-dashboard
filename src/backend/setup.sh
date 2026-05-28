#!/bin/bash

echo "🚀 Dev Dashboard Backend Setup"
echo "=============================="
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled. Your existing .env file was not modified."
        exit 0
    fi
fi

# Copy example file
cp .env.example .env
echo "✅ Created .env file from template"

# Detect OS and suggest default paths
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    USER_HOME="$HOME"
    DEFAULT_PATH1="$HOME/workspace"
    DEFAULT_PATH2="$HOME/Documents/workspace"
    OS_NAME="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    USER_HOME="$HOME"
    DEFAULT_PATH1="$HOME/workspace"
    DEFAULT_PATH2="$HOME/projects"
    OS_NAME="Linux"
else
    # Windows or other
    USER_HOME="$HOME"
    DEFAULT_PATH1="$HOME/workspace"
    DEFAULT_PATH2="$HOME/projects"
    OS_NAME="Other"
fi

echo ""
echo "📁 Configure your workspace directories"
echo "Detected OS: $OS_NAME"
echo "Current user: $USER"
echo "Home directory: $USER_HOME"
echo ""
echo "Checking common workspace locations..."
[ -d "$DEFAULT_PATH1" ] && echo "  ✅ $DEFAULT_PATH1 (exists)"
[ ! -d "$DEFAULT_PATH1" ] && echo "  ❌ $DEFAULT_PATH1 (not found)"
[ -d "$DEFAULT_PATH2" ] && echo "  ✅ $DEFAULT_PATH2 (exists)"
[ ! -d "$DEFAULT_PATH2" ] && echo "  ❌ $DEFAULT_PATH2 (not found)"
echo ""

# Prompt for paths
echo "Enter your workspace directories (where you keep your git repositories):"
read -p "Workspace path 1 (or press Enter for $DEFAULT_PATH1): " PATH1
PATH1=${PATH1:-$DEFAULT_PATH1}

read -p "Workspace path 2 (or press Enter for $DEFAULT_PATH2, or type 'none' to skip): " PATH2
PATH2=${PATH2:-$DEFAULT_PATH2}

# Build workspace paths string
if [[ "$PATH2" == "none" ]] || [[ -z "$PATH2" ]]; then
    WORKSPACE_PATHS="$PATH1"
else
    WORKSPACE_PATHS="$PATH1,$PATH2"
fi

# Update .env file (compatible with macOS and Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS (BSD sed)
    sed -i '' "s|WORKSPACE_PATHS=.*|WORKSPACE_PATHS=$WORKSPACE_PATHS|" .env
else
    # Linux (GNU sed)
    sed -i "s|WORKSPACE_PATHS=.*|WORKSPACE_PATHS=$WORKSPACE_PATHS|" .env
fi

echo ""
echo "✅ Configuration complete!"
echo ""
echo "📋 Your workspace configuration:"
echo "────────────────────────────────"
if [[ "$PATH2" == "none" ]] || [[ -z "$PATH2" ]]; then
    echo "  • $PATH1"
else
    echo "  • $PATH1"
    echo "  • $PATH2"
fi
echo ""
echo "📝 Next steps:"
echo "  1. (Optional) Review/edit .env file: nano .env"
echo "  2. Install dependencies: npm install"
echo "  3. Start backend: npm run dev"
echo ""
echo "💡 Tip: You can add more workspace paths by editing the .env file"
echo "    Format: WORKSPACE_PATHS=/path1,/path2,/path3"
echo ""
