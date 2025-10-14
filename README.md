# MagentaA11y MCP Server

An MCP server that provides LLMs with programmatic access to accessibility acceptance criteria from the [MagentaA11y project](https://github.com/tmobile/magentaA11y).

## Quick Start

### Installation

1. **Install dependencies and build:**
   ```bash
   git submodule update --init --recursive
   npm install
   npm run build
   ```

2. **Configure your IDE** (see [Configuration](#configuration) below)

3. **Restart your IDE** (completely quit and reopen)

That's it! You'll have 6 new accessibility tools available.

### Try It

Ask your AI assistant:
- *"List all web components"*
- *"Show me the accessibility criteria for a button"*
- *"What are the iOS VoiceOver requirements for a switch?"*

---

## The 6 Tools

### Web Platform
- **`list_web_components`** - List all web accessibility components
- **`get_web_component`** - Get detailed web component criteria  
- **`search_web_criteria`** - Search web accessibility content

### Native Platform (iOS/Android)
- **`list_native_components`** - List all native components
- **`get_native_component`** - Get detailed native component criteria
- **`search_native_criteria`** - Search native accessibility content

---

## Configuration

After building the project, configure your IDE to use the MCP server. You'll need the absolute path to your `build/index.js` file.

**Get your absolute path:**
```bash
cd magentaa11y-mcp
echo "$(pwd)/build/index.js"
```

### Cursor (with Cline)

**Config file location:**
- macOS: `~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- Windows: `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- Linux: `~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

**Configuration:**
```json
{
  "mcpServers": {
    "magentaa11y": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/magentaa11y-mcp/build/index.js"
      ]
    }
  }
}
```

### VSCode (with MCP Support)

**Config file location:**
- macOS: `~/Library/Application Support/Code/User/mcp.json`
- Windows: `%APPDATA%\Code\User\mcp.json`
- Linux: `~/.config/Code/User/mcp.json`

**Configuration:**
```json
{
  "MagentaA11y MCP": {
    "type": "stdio",
    "command": "node",
    "args": [
      "/ABSOLUTE/PATH/TO/magentaa11y-mcp/build/index.js"
    ]
  }
}
```

### VSCode (with Cline Extension)

**Config file location:**
- macOS: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
- Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
- Linux: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

**Configuration:**
```json
{
  "mcpServers": {
    "magentaa11y": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/magentaa11y-mcp/build/index.js"
      ]
    }
  }
}
```

### Claude Desktop

**Config file location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

**Configuration:**
```json
{
  "mcpServers": {
    "magentaa11y": {
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/magentaa11y-mcp/build/index.js"
      ]
    }
  }
}
```

**Important:** Replace `/ABSOLUTE/PATH/TO/magentaa11y-mcp` with your actual project path.

---

## Usage Examples

### Discovery
```
"What web accessibility components are available?"
"List all native controls"
"Show me all form components"
```

### Get Detailed Criteria
```
"What are the accessibility requirements for a checkbox?"
"Show me the iOS VoiceOver requirements for a switch"
"Get the web button accessibility criteria"
```

### Search Across Content
```
"Search for focus indicator requirements"
"Find VoiceOver announcement patterns"
"Search for ARIA label examples"
```

### WCAG Compliance
```
"What WCAG criteria apply to text inputs?"
"Show me WCAG 2.1 requirements for buttons"
```

---

## Troubleshooting

### Tools don't appear in IDE

1. **Verify the build exists:**
   ```bash
   ls build/index.js
   ```

2. **Test the server manually:**
   ```bash
   node build/index.js
   ```
   Should show: "MagentaA11y MCP Server running on stdio"  
   Press Ctrl+C to stop.

3. **Check the path in your MCP config is absolute:**
   ```bash
   pwd  # Copy this path
   ```

4. **Restart your IDE completely** (quit and reopen, not just reload)

### "Failed to initialize content" error

The MagentaA11y submodule isn't initialized:
```bash
git submodule update --init --recursive
npm run build
```

### Debug with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

This opens a web UI for testing and debugging the MCP server.

---

## Updating Content

Get the latest MagentaA11y accessibility criteria:

```bash
git submodule update --remote --merge
npm run build
# Restart your IDE
```

---

## Development

### Project Structure

```
magentaa11y-mcp/
├── src/                      # TypeScript source code
│   ├── index.ts             # Main MCP server
│   ├── content-loader.ts    # Content indexing & search
│   └── types.ts             # Type definitions
├── build/                    # Compiled JavaScript
├── magentaA11y/             # Git submodule (content)
├── docs/prd.md              # Product Requirements
├── package.json
└── tsconfig.json
```

### Commands

```bash
npm install      # Install dependencies
npm run build    # Compile TypeScript
npm run watch    # Watch mode (auto-rebuild)
npm start        # Run the server
```

### Technology Stack

- **Language:** TypeScript
- **Runtime:** Node.js 18+
- **MCP SDK:** @modelcontextprotocol/sdk
- **Markdown:** gray-matter, remark, unified
- **Search:** Fuse.js (fuzzy search)
- **Content:** Git submodule

---

## What's Included

- ✅ **100+ Components** - Web and native accessibility criteria
- ✅ **WCAG Mappings** - Automatic extraction of success criteria
- ✅ **Smart Search** - Fuzzy search with relevance ranking
- ✅ **Code Examples** - HTML, CSS, JavaScript, Swift, Kotlin
- ✅ **Platform-Specific** - iOS (VoiceOver) and Android (TalkBack)
- ✅ **Easy Updates** - Git submodule for latest content

---

## Resources

- **MagentaA11y:** https://github.com/tmobile/magentaA11y
- **MagentaA11y Website:** https://www.magentaa11y.com/
- **MCP Documentation:** https://modelcontextprotocol.io/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Full PRD:** See `docs/prd.md`

---

## License

MIT License - See LICENSE file

---

## Support

For issues with:
- **Installation:** Check the Troubleshooting section above
- **MagentaA11y content:** Visit https://github.com/tmobile/magentaA11y
- **MCP protocol:** Visit https://modelcontextprotocol.io/

---

**Made with ❤️ for accessible web and native applications**
