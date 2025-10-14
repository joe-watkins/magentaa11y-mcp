#!/bin/bash

# MagentaA11y MCP Server - Universal Setup Script

clear
echo "════════════════════════════════════════════════════════════"
echo "  MagentaA11y MCP Server Setup"
echo "════════════════════════════════════════════════════════════"
echo ""

# Get absolute project path
PROJECT_PATH=$(cd "$(dirname "$0")" && pwd)

# Check if build exists
if [ ! -f "$PROJECT_PATH/build/index.js" ]; then
    echo "⚠️  Build not found. Running npm install and build..."
    npm install
    npm run build
    echo ""
fi

# Ask user for IDE choice
echo "Which IDE/client are you using?"
echo ""
echo "  1) Cursor"
echo "  2) VSCode (with Cline extension)"
echo "  3) VSCode (with GitHub Copilot)"
echo "  4) Claude Desktop"
echo ""
read -p "Enter your choice (1-4): " choice
echo ""

# Determine OS and set config path based on choice
case "$choice" in
    1)
        IDE="Cursor"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            CONFIG_DIR="$HOME/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings"
            CONFIG_FILE="$CONFIG_DIR/cline_mcp_settings.json"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            CONFIG_DIR="$HOME/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings"
            CONFIG_FILE="$CONFIG_DIR/cline_mcp_settings.json"
        elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            CONFIG_DIR="$APPDATA/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings"
            CONFIG_FILE="$CONFIG_DIR/cline_mcp_settings.json"
        else
            echo "❌ Unsupported OS: $OSTYPE"
            exit 1
        fi
        ;;
    2)
        IDE="VSCode (Cline)"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            CONFIG_DIR="$HOME/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings"
            CONFIG_FILE="$CONFIG_DIR/cline_mcp_settings.json"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            CONFIG_DIR="$HOME/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings"
            CONFIG_FILE="$CONFIG_DIR/cline_mcp_settings.json"
        elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            CONFIG_DIR="$APPDATA/Code/User/globalStorage/saoudrizwan.claude-dev/settings"
            CONFIG_FILE="$CONFIG_DIR/cline_mcp_settings.json"
        else
            echo "❌ Unsupported OS: $OSTYPE"
            exit 1
        fi
        ;;
    3)
        IDE="VSCode (GitHub Copilot)"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            CONFIG_DIR="$HOME/Library/Application Support/Code/User"
            CONFIG_FILE="$CONFIG_DIR/settings.json"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            CONFIG_DIR="$HOME/.config/Code/User"
            CONFIG_FILE="$CONFIG_DIR/settings.json"
        elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            CONFIG_DIR="$APPDATA/Code/User"
            CONFIG_FILE="$CONFIG_DIR/settings.json"
        else
            echo "❌ Unsupported OS: $OSTYPE"
            exit 1
        fi
        ;;
    4)
        IDE="Claude Desktop"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            CONFIG_DIR="$HOME/Library/Application Support/Claude"
            CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            CONFIG_DIR="$HOME/.config/Claude"
            CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
        elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
            CONFIG_DIR="$APPDATA/Claude"
            CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
        else
            echo "❌ Unsupported OS: $OSTYPE"
            exit 1
        fi
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again and choose 1, 2, 3, or 4."
        exit 1
        ;;
esac

echo "📝 Configuring $IDE..."
echo ""

# Create config directory if it doesn't exist
mkdir -p "$CONFIG_DIR"

# Backup existing config if present
if [ -f "$CONFIG_FILE" ]; then
    BACKUP_FILE="${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"
    echo "⚠️  Existing config found. Creating backup..."
    cp "$CONFIG_FILE" "$BACKUP_FILE"
    echo "   Backup saved: $BACKUP_FILE"
    echo ""
fi

# Create MCP config file based on IDE choice
if [ "$choice" = "3" ]; then
    # GitHub Copilot - merge with existing settings.json
    if [ -f "$CONFIG_FILE" ]; then
        # Read existing settings and add MCP configuration
        echo "📝 Merging MCP configuration with existing VSCode settings..."
        
        # Use jq if available, otherwise manual merge
        if command -v jq &> /dev/null; then
            TEMP_FILE="${CONFIG_FILE}.tmp"
            jq --arg path "$PROJECT_PATH/build/index.js" \
               '.["github.copilot.chat.codeGeneration.instructions"] += [
                   "Use MagentaA11y accessibility guidelines when building components"
               ] | 
               .mcp.servers.magentaa11y = {
                   "command": "node",
                   "args": [$path]
               }' "$CONFIG_FILE" > "$TEMP_FILE"
            mv "$TEMP_FILE" "$CONFIG_FILE"
        else
            echo "⚠️  Note: jq not found. Please manually add the following to your VSCode settings.json:"
            echo ""
            echo '  "mcp.servers": {'
            echo '    "magentaa11y": {'
            echo '      "command": "node",'
            echo "      \"args\": [\"$PROJECT_PATH/build/index.js\"]"
            echo '    }'
            echo '  }'
            echo ""
        fi
    else
        # Create new settings.json for GitHub Copilot
        cat > "$CONFIG_FILE" << EOF
{
  "github.copilot.chat.codeGeneration.instructions": [
    "Use MagentaA11y accessibility guidelines when building components"
  ],
  "mcp": {
    "servers": {
      "magentaa11y": {
        "command": "node",
        "args": [
          "$PROJECT_PATH/build/index.js"
        ]
      }
    }
  }
}
EOF
    fi
else
    # Standard MCP config for Cursor, Cline, or Claude Desktop
    cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "magentaa11y": {
      "command": "node",
      "args": [
        "$PROJECT_PATH/build/index.js"
      ]
    }
  }
}
EOF
fi

echo "════════════════════════════════════════════════════════════"
echo "  ✅ Setup Complete!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Configuration file created at:"
echo "  $CONFIG_FILE"
echo ""
echo "Project path:"
echo "  $PROJECT_PATH"
echo ""
echo "Server script:"
echo "  $PROJECT_PATH/build/index.js"
echo ""
echo "════════════════════════════════════════════════════════════"
echo "  🔄 Next Steps"
echo "════════════════════════════════════════════════════════════"
echo ""
if [ "$IDE" = "VSCode (Cline)" ]; then
    echo "1. Make sure the Cline extension is installed in VSCode"
    echo "2. Restart VSCode completely (quit and reopen)"
    echo "3. Open a chat with Cline"
elif [ "$IDE" = "VSCode (GitHub Copilot)" ]; then
    echo "1. Make sure GitHub Copilot is enabled in VSCode"
    echo "2. Install the MCP extension for VSCode if not already installed"
    echo "3. Restart VSCode completely (quit and reopen)"
    echo "4. Open GitHub Copilot Chat"
else
    echo "1. Restart $IDE completely (quit and reopen)"
    echo "2. Open a chat with Claude"
fi
echo ""
echo "You should see 6 new MagentaA11y tools available:"
echo "   • list_web_components"
echo "   • get_web_component"
echo "   • search_web_criteria"
echo "   • list_native_components"
echo "   • get_native_component"
echo "   • search_native_criteria"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "✨ Done! Enjoy your accessibility superpowers!"
echo ""

