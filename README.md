# MagentaA11y MCP Server

MCP server providing accessibility criteria from [MagentaA11y](https://www.magentaa11y.com/). Works locally (stdio) and remotely (Netlify Functions).

## Example Prompts:
- Get me the accessibility criteria for the Web Button component in Gherkin format.
- Get me a list of all the native components.
- Get me the Tooltip AC for Web - Condensed in markdown format.

## Tools

All tools are read-only, non-destructive, and idempotent. They include OpenAI Apps SDK annotations for enhanced integration.

| Tool | Description |
|------|-------------|
| `list_web_components` | List web accessibility components |
| `get_web_component` | Get detailed criteria for a web component |
| `search_web_criteria` | Search web criteria by keyword |
| `list_native_components` | List native iOS/Android components |
| `get_native_component` | Get detailed criteria for a native component |
| `search_native_criteria` | Search native criteria by keyword |
| `get_component_gherkin` | Get Gherkin-style acceptance criteria |
| `get_component_condensed` | Get condensed acceptance criteria |
| `get_component_developer_notes` | Get developer implementation notes |
| `get_component_native_notes` | Get iOS or Android specific notes |
| `list_component_formats` | List available formats for a component |

### OpenAI Marketplace Tool Annotations

Each tool includes these annotations (OpenAI Apps SDK compatible):
- `readOnlyHint: true` - Tools only read data, never modify
- `destructiveHint: false` - No destructive operations
- `idempotentHint: true` - Same input always produces same output
- `openWorldHint: false` - Operates on curated MagentaA11y dataset

## Development Setup

```bash
git clone --recurse-submodules https://github.com/joe-watkins/magentaa11y-mcp.git
cd magentaa11y-mcp
npm install
npm run update-content
```

## Updating Content

The accessibility criteria comes from the [magentaA11y](https://github.com/tmobile/magentaA11y) submodule. To update:

```bash
npm run update-content
```

This pulls the latest from magentaA11y, builds it, and copies the generated `content.json` to `/data`.

## Usage

### Local Development

```json
{
  "mcpServers": {
    "magentaa11y": {
      "command": "node",
      "args": ["/path/to/src/index.js"]
    }
  }
}
```

### Remote (Netlify)
Clone this project, build it, and deploy to Netlify. Then use the following configuration:

```json
{
  "mcpServers": {
    "magentaa11y": {
      "command": "npx",
      "args": ["mcp-remote@next", "https://your-site.netlify.app/mcp"]
    }
  }
}
```

## Project Structure

```
src/
  index.js          # MCP server (stdio transport)
  tools.js          # Tool definitions and handlers
  helpers.js        # Data loading and search utilities
data/
  content.json      # MagentaA11y accessibility criteria
netlify/
  functions/api.js  # Netlify Function (SSE transport)
scripts/
  update-content.js # Build script for updating content
```
