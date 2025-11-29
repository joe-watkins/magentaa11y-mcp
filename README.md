# MagentaA11y MCP Server

An MCP server that provides accessibility acceptance criteria from the [MagentaA11y project](https://github.com/tmobile/magentaA11y).

## Overview

This MCP server is a lightweight Node.js process that loads accessibility criteria into memory at startup and serves requests via JSON-RPC over stdin/stdout. It uses MagentaA11y as a Git submodule, running a build process that parses markdown files from `public/content/documentation/` into a structured `content.json` file. The ContentLoader class loads this JSON once at initialization, creates Fuse.js search indices, and keeps everything in memory for instant (<5ms) responses. When MCP clients like Claude Desktop need accessibility criteria, they spawn this server as a subprocess and communicate through standard pipes rather than HTTP, providing security through process isolation and eliminating network overhead while serving 11 different tools for querying web and native accessibility guidelines.

## Available Tools

The server provides 11 tools for accessing accessibility criteria:

**Web Accessibility:**
- `list_web_components` - List all 51 web components with optional category filtering
- `get_web_component` - Get complete accessibility criteria for a specific web component
- `search_web_criteria` - Fuzzy search across all web accessibility guidelines

**Native Accessibility:**
- `list_native_components` - List all 42 native components (iOS/Android) with optional category filtering
- `get_native_component` - Get complete accessibility criteria for a specific native component
- `search_native_criteria` - Fuzzy search across all native accessibility guidelines

**Content Formats:**
- `get_component_gherkin` - Get Given/When/Then style acceptance criteria for comprehensive testing
- `get_component_condensed` - Get shortened, focused testing instructions
- `get_component_developer_notes` - Get implementation guidance with code examples and WCAG mappings
- `get_component_native_notes` - Get platform-specific developer notes (iOS/Android)
- `list_component_formats` - List all available content formats for a component

## Installation

1. **Install and build:**
   ```bash
   npm install
   npm run build
   ```

## Configuration

Configure your IDE with the absolute path to `build/index.js`:

### Cursor
**File:** `%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
```json
{
  "mcpServers": {
    "magentaa11y": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/magentaa11y-mcp/build/index.js"]
    }
  }
}
```

### VSCode
**File:** `%APPDATA%\Code\User\mcp.json`
```json
{
  "MagentaA11y MCP": {
    "type": "stdio",
    "command": "node",
    "args": ["/ABSOLUTE/PATH/TO/magentaa11y-mcp/build/index.js"]
  }
}
```

### Claude Desktop
**File:** `%APPDATA%\Claude\claude_desktop_config.json`
```json
{
  "mcpServers": {
    "magentaa11y": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/magentaa11y-mcp/build/index.js"]
    }
  }
}
```

**Restart your IDE completely** after configuration.

## Build Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Full build (production) |
| `npm run sync` | Quick content update |
| `npm run build:mcp-only` | TypeScript only |
| `npm start` | Test server |

## Troubleshooting

**Tools don't appear:**
1. Check build exists: `ls build/index.js`
2. Test manually: `node build/index.js`
3. Verify absolute path in config
4. Restart IDE completely

**Build errors:**
```bash
git submodule update --init --recursive
npm run build
```

## Resources

- **MagentaA11y:** https://github.com/tmobile/magentaA11y
- **MagentaA11y Website:** https://www.magentaa11y.com/
- **MCP Documentation:** https://modelcontextprotocol.io/
- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **Full PRD:** See `docs/prd.md`

---

## License
[Apache-2.0 License](https://opensource.org/licenses/Apache-2.0)

---

## Support

For issues with:
- **Installation:** Check the Troubleshooting section above
- **MagentaA11y content:** Visit https://github.com/tmobile/magentaA11y
- **MCP protocol:** Visit https://modelcontextprotocol.io/

---
