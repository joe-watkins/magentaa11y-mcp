# MagentaA11y MCP Server

An MCP server that provides LLMs with programmatic access to accessibility acceptance criteria from the [MagentaA11y project](https://github.com/tmobile/magentaA11y).

**✨ Now uses content.json as the source of truth!**

## Quick Start

### Installation

1. **Install dependencies and build:**
   ```bash
   npm install
   npm run build  # Full build: builds MagentaA11y + MCP server + copies content
   ```

2. **Configure your IDE** (see [Configuration](#configuration) below)

3. **Restart your IDE** (completely quit and reopen)

That's it! You'll have 11 new accessibility tools available.

---

## Build Process

The MCP server uses an automated build system that manages the MagentaA11y submodule and content synchronization.

### Available Build Commands

| Command | Purpose | What It Does |
|---------|---------|--------------|
| `npm run build` | **Full Build** (Recommended) | Builds MagentaA11y → Copies content.json → Builds MCP → Resets submodule |
| `npm run sync` | **Quick Sync** | Just copies content.json from submodule to `/data` |
| `npm run build:mcp-only` | **MCP Only** | Just compiles TypeScript (for code-only changes) |
| `npm start` | **Run Server** | Starts the MCP server for testing |

### Full Build Process (`npm run build`)

The full build automatically:

1. **🔍 Checks MagentaA11y submodule** - Initializes if missing
2. **📦 Installs dependencies** - In MagentaA11y project if needed  
3. **🔨 Builds MagentaA11y** - Generates fresh content.json (~1MB, 51 web + 42 native components)
4. **📄 Copies content.json** - From submodule to `/data/content.json`
5. **🔧 Builds MCP server** - Compiles TypeScript to `/build`
6. **🧹 Resets submodule** - `git reset --hard` to keep it clean
7. **✅ Verifies content** - Ensures everything loaded correctly

**Output Example:**
```
🚀 Starting MagentaA11y MCP build process...
📋 Step 1: Checking MagentaA11y submodule... ✅
📦 Step 2: Installing MagentaA11y dependencies... ✅
🔨 Step 3: Building MagentaA11y project... ✅
📄 Step 4: Copying content.json... ✅
🔧 Step 5: Building MCP server... ✅
🧹 Step 6: Cleaning up MagentaA11y submodule... ✅
🔍 Step 7: Verifying content... ✅

✅ Content verified: 51 web + 42 native components
📊 File size: 1002.4 KB
🎉 Build process completed successfully!
```

### Development Workflow

**For Content Changes:**
```bash
# 1. Make changes in magentaA11y/ submodule
# 2. Quick sync the content
npm run sync
# 3. Test your changes
npm start
```

**For TypeScript Changes:**
```bash
# Just rebuild MCP server
npm run build:mcp-only
```

**For Production/Release:**
```bash
# Full automated build
npm run build
```

### File Structure After Build

```
magentaa11y-mcp/
├── data/                    # 📄 Generated content (gitignored)
│   └── content.json         # ✅ 1MB, 93 components total
├── build/                   # 🔧 Compiled MCP server  
│   ├── index.js            # ✅ Main MCP server
│   ├── content-loader.js   # ✅ Content management
│   └── types.js            # ✅ Type definitions
├── magentaA11y/             # 🧹 Clean submodule
└── src/                     # 💻 TypeScript source
```

### Troubleshooting Build Issues

**"Failed to initialize content" error:**
```bash
# Initialize submodule manually
git submodule update --init --recursive
npm run build
```

**Build fails during MagentaA11y compilation:**
```bash
# Clean and rebuild
cd magentaA11y
npm install
npm run build
cd ..
npm run sync  # Just copy the content
```

**MCP server won't start:**
```bash
# Check if build completed
ls -la build/index.js
ls -la data/content.json

# Test server manually
node build/index.js
# Should show: "MagentaA11y MCP Server running on stdio"
```

### Try It

Ask your AI assistant:
- *"List all web components"*
- *"Show me the Gherkin acceptance criteria for a button"*
- *"Get the condensed testing instructions for a checkbox"*
- *"What are the developer notes for an alert notification?"*
- *"Show me iOS implementation notes for a native button"*

---

## The 11 Tools

### Component Discovery
- **`list_web_components`** - List all web accessibility components
- **`list_native_components`** - List all native components (iOS/Android)
- **`search_web_criteria`** - Search web accessibility content
- **`search_native_criteria`** - Search native accessibility content

### Component Details  
- **`get_web_component`** - Get full web component details
- **`get_native_component`** - Get full native component details

### Content Formats (NEW!)
- **`get_component_gherkin`** - Get Given/When/Then testing scenarios
- **`get_component_condensed`** - Get shortened acceptance criteria  
- **`get_component_developer_notes`** - Get implementation guidance with code examples
- **`get_component_native_notes`** - Get iOS or Android specific implementation details
- **`list_component_formats`** - See what content formats are available for a component

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

### Get Latest MagentaA11y Content

**Method 1: Update from remote (Recommended)**
```bash
# Pull latest changes from MagentaA11y repository
git submodule update --remote --merge
npm run build  # Full build with latest content
# Restart your IDE
```

**Method 2: Work with local changes**
```bash
# If you've made changes in the magentaA11y/ folder
cd magentaA11y
# Make your changes...
npm run build  # Build MagentaA11y to generate content.json
cd ..
npm run sync   # Copy the updated content.json
npm run build:mcp-only  # Rebuild just the MCP server
# Restart your IDE
```

### Content Update Workflow

1. **Check for updates:**
   ```bash
   cd magentaA11y
   git fetch
   git log HEAD..origin/main --oneline  # See what's new
   ```

2. **Update and rebuild:**
   ```bash
   cd ..
   git submodule update --remote
   npm run build  # Automatically handles everything
   ```

3. **Verify the update:**
   ```bash
   npm start  # Test the server
   # In another terminal:
   # Use MCP Inspector or test in your IDE
   ```

### Content Statistics

After updating, check what you've got:
```bash
# The build process shows this automatically, but you can also check:
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));
const web = data.web.reduce((c, cat) => c + cat.children.length, 0);
const native = data.native.reduce((c, cat) => c + cat.children.length, 0);
console.log(\`📊 Content: \${web} web + \${native} native = \${web + native} total components\`);
console.log(\`📄 File size: \${(fs.statSync('data/content.json').size / 1024).toFixed(1)} KB\`);
"
```

---

## Development

### Project Structure

```
magentaa11y-mcp/
├── 📁 src/                      # TypeScript source code
│   ├── 🎯 index.ts             # Main MCP server (11 tools)
│   ├── 📚 content-loader.ts    # Content indexing & search
│   └── 🏷️  types.ts             # Type definitions
├── 📁 build/                    # Compiled JavaScript (generated)
│   ├── ✅ index.js             # Compiled MCP server
│   ├── ✅ content-loader.js    # Compiled content loader
│   └── ✅ types.js             # Compiled types
├── 📁 data/                     # Content storage (generated, gitignored)
│   └── 📄 content.json         # ~1MB, 93 components
├── 📁 magentaA11y/             # Git submodule (stays clean)
│   └── src/shared/content.json # Source content (gets copied to /data)
├── 🔧 build-all.js             # Full build automation script
├── ⚡ sync-content.js          # Quick content sync script  
├── 📖 BUILD_PROCESS.md         # Detailed build documentation
├── 📋 docs/prd.md              # Product Requirements
├── 📦 package.json             # Dependencies & scripts
└── ⚙️  tsconfig.json            # TypeScript configuration
```

### All Available Commands

| Command | Speed | Purpose | When to Use |
|---------|-------|---------|-------------|
| `npm install` | Medium | Install dependencies | First setup |
| `npm run build` | Slow (~60s) | **Full automated build** | Production, first build |
| `npm run build:full` | Slow (~60s) | Same as `npm run build` | Explicit full build |
| `npm run build:mcp-only` | Fast (~5s) | Just compile TypeScript | Code-only changes |
| `npm run sync` | Very Fast (~1s) | Copy content.json only | Content iteration |
| `npm run watch` | - | Auto-rebuild on changes | Development |
| `npm run dev` | - | Same as watch | Development |
| `npm start` | Fast | Run MCP server | Testing |

### Development Workflows

**🚀 First Time Setup:**
```bash
git clone <repo>
cd magentaa11y-mcp
npm install
npm run build  # Full build (includes submodule setup)
```

**🔧 Working on TypeScript Code:**
```bash
# Terminal 1: Watch for changes
npm run watch

# Terminal 2: Test changes
npm start
```

**📄 Working on Content:**
```bash
# Make changes in magentaA11y/ submodule
npm run sync           # Quick copy content
npm run build:mcp-only # Rebuild TypeScript
npm start             # Test
```

**🎯 Production Build:**
```bash
npm run build  # Full automated process
# Restart your IDE
```

### Build Scripts Deep Dive

The build system consists of two main scripts:

**📜 `build-all.js` - Full Build Automation**
- ✅ Initializes MagentaA11y submodule if missing
- ✅ Installs MagentaA11y dependencies  
- ✅ Builds MagentaA11y React app (generates content.json)
- ✅ Copies content.json to `/data` folder
- ✅ Compiles MCP server TypeScript
- ✅ Resets submodule with `git reset --hard`
- ✅ Validates final content (reports component counts)

**⚡ `sync-content.js` - Quick Content Sync**
- ✅ Copies content.json from submodule to `/data`
- ✅ Validates JSON structure
- ✅ Reports content statistics

**Why This Architecture?**
- 🧹 **Clean Submodule**: Submodule stays pristine for upstream updates
- 📄 **Reliable Content**: `/data` folder has consistent, generated content  
- ⚡ **Fast Development**: Quick sync during content iteration
- 🔒 **Automated**: One command does everything for production

### Technology Stack

**Core Technologies:**
- **Language:** TypeScript (compiled to ES modules)
- **Runtime:** Node.js 18+ 
- **Protocol:** Model Context Protocol (MCP) 
- **Architecture:** Stdio-based MCP server

**Key Dependencies:**
- **MCP SDK:** `@modelcontextprotocol/sdk` - MCP server framework
- **Search:** `fuse.js` - Fuzzy search with weighted scoring
- **Content:** Git submodule + JSON data structure

**Content Pipeline:**
- **Source:** MagentaA11y React app markdown files
- **Generation:** Custom TypeScript parser (`parseMDFiles.ts`) 
- **Storage:** Structured JSON (~1MB, 93 components)
- **Distribution:** Copied to `/data` folder during build

**Development Tools:**
- **Compiler:** TypeScript with ES module output
- **Build:** Custom Node.js automation scripts  
- **Watch Mode:** `tsc --watch` for development
- **Testing:** Manual MCP Inspector + IDE integration

---

## What's Included

- ✅ **93 Components Total** - 51 web + 42 native accessibility criteria
- ✅ **Multiple Content Formats** - Gherkin, condensed, developer notes, platform-specific
- ✅ **11 MCP Tools** - Complete discovery, search, and content access
- ✅ **Smart Search** - Fuse.js fuzzy search with weighted relevance scoring
- ✅ **Code Examples** - HTML, CSS, JavaScript, Swift, Kotlin implementation examples
- ✅ **Platform-Specific** - iOS (VoiceOver) and Android (TalkBack) implementation details
- ✅ **WCAG Integration** - Links to relevant WCAG success criteria
- ✅ **Automated Updates** - Git submodule + build system for latest content
- ✅ **Fast Performance** - JSON-based content (~1MB) loaded into memory
- ✅ **Clean Architecture** - Automated build process keeps submodule pristine

---

## Build System Summary

The MagentaA11y MCP server features a sophisticated build system designed for reliability and developer experience:

### 🎯 **One-Command Setup**
```bash
npm install && npm run build
```
Handles submodule initialization, dependency installation, content generation, and server compilation automatically.

### 🔄 **Content Synchronization**
- **Source**: MagentaA11y markdown files (submodule)  
- **Processing**: TypeScript parser generates structured JSON
- **Storage**: Copied to `/data/content.json` (1MB, 93 components)
- **Cleanup**: Submodule reset to pristine state

### ⚡ **Development Speed** 
- **Full Build**: ~60 seconds (production)
- **Quick Sync**: ~1 second (development)
- **TypeScript Only**: ~5 seconds (code changes)

### 🧹 **Clean State Management**
- Submodule stays clean for upstream updates
- Generated content isolated in `/data` folder  
- Automated cleanup with `git reset --hard`

### 📊 **Content Verification**
Every build reports:
```
✅ Content verified: 51 web + 42 native components
📊 File size: 1002.4 KB  
📅 Last modified: 2025-10-15T03:56:35.218Z
```

**See [BUILD_PROCESS.md](./BUILD_PROCESS.md) for detailed technical documentation.**

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
