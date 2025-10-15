# MagentaA11y MCP Server

An MCP server that provides accessibility acceptance criteria from the [MagentaA11y project](https://github.com/tmobile/magentaA11y).

## Installation

1. **Install and build:**
   ```bash
   npm install
   npm run build
   ```

## Configuration

Configure your IDE with the absolute path to `build/index.js`:

### Cursor (Cline Extension)
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

### VSCode (MCP Support)
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

MIT License - See LICENSE file

---

## Support

For issues with:
- **Installation:** Check the Troubleshooting section above
- **MagentaA11y content:** Visit https://github.com/tmobile/magentaA11y
- **MCP protocol:** Visit https://modelcontextprotocol.io/

---

**Made with ❤️ for accessible web and native applications**
