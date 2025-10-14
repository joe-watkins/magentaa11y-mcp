# MagentaA11y MCP Server - Product Requirements Document

## 1. Executive Summary

### 1.1 Overview
The MagentaA11y MCP (Model Context Protocol) Server is a tool that enables LLMs to access and query accessibility acceptance criteria from the [MagentaA11y project](https://github.com/tmobile/magentaA11y). This server will provide structured access to accessibility testing guidelines for both web and native (iOS/Android) technologies.

### 1.2 Objectives
- Provide LLMs with programmatic access to accessibility acceptance criteria
- Enable developers to query accessibility requirements during development
- Maintain up-to-date content through Git submodule integration
- Support both Web and Native platform accessibility guidelines
- Follow MCP protocol standards with focused, single-purpose tools

### 1.3 Target Users
- AI assistants helping developers with accessibility implementation
- Automated accessibility testing tools
- Development teams integrating accessibility checks into their workflow
- QA teams creating accessibility test plans

### 1.4 Tool Overview
The server provides **6 core MCP tools** organized by platform:

**Web Platform (3 tools):**
- `list_web_components` - List all available web components
- `get_web_component` - Get detailed web component criteria
- `search_web_criteria` - Search web accessibility content

**Native Platform (3 tools):**
- `list_native_components` - List all available native components
- `get_native_component` - Get detailed native component criteria  
- `search_native_criteria` - Search native accessibility content

---

## 2. Technical Architecture

### 2.1 Git Submodule Strategy
The project will use the official MagentaA11y repository as a Git submodule to:
- Stay synchronized with the latest accessibility criteria
- Avoid content duplication
- Enable easy updates via `git submodule update --remote`
- Reference content directly from `magentaA11y/public/content/documentation/`

```
magentaa11y-mcp/
├── src/
│   └── index.ts                    # MCP server implementation
├── magentaA11y/                    # Git submodule
│   └── public/
│       └── content/
│           └── documentation/
│               ├── native/         # Native platform criteria
│               │   ├── controls/
│               │   ├── components/
│               │   └── ...
│               ├── web/            # Web platform criteria
│               │   ├── components/
│               │   ├── forms/
│               │   └── ...
│               └── how-to-test/    # Testing guidelines
├── docs/
│   └── prd.md
└── package.json
```

### 2.2 Content Structure
The MagentaA11y content is organized as:
- **Platform**: `native` or `web`
- **Category**: `controls`, `components`, `forms`, `notifications`, etc.
- **Component**: Individual markdown files (e.g., `button.md`, `checkbox.md`)
- **Template Types**: `criteria` (acceptance criteria) or `how-to-test` (testing guidelines)

---

## 3. MCP Tools Specification

The server provides separate tools for Web and Native platforms, following MCP best practices of focused, single-purpose tools.

### 3.1 Web Platform Tools

#### 3.1.1 Tool: `list_web_components`
**Purpose**: List all available web accessibility components

**Parameters**:
- `category` (optional, string): Filter by category (e.g., `controls`, `forms`, `components`)
  - If omitted, returns all categories

**Returns**:
```typescript
{
  "components": [
    {
      "name": "button",
      "displayName": "Button",
      "category": "controls",
      "path": "web/controls/button.md"
    },
    {
      "name": "checkbox",
      "displayName": "Checkbox", 
      "category": "forms",
      "path": "web/forms/checkbox.md"
    }
  ],
  "categories": ["controls", "forms", "components", "notifications"]
}
```

**Use Cases**:
- Discover available web components
- Browse by category
- Get component inventory for documentation

---

#### 3.1.2 Tool: `get_web_component`
**Purpose**: Get detailed accessibility criteria for a specific web component

**Parameters**:
- `component` (required, string): Component name (e.g., `button`, `checkbox`, `text-input`)
- `include_code_examples` (optional, boolean): Include code examples in response
  - Default: `true`

**Returns**:
```typescript
{
  "component": "button",
  "displayName": "Button",
  "category": "controls",
  "content": "<full markdown content>",
  "sections": [
    "Expected behavior",
    "Focus requirements", 
    "Code examples",
    "iOS developer notes",
    "Android developer notes"
  ],
  "wcagCriteria": ["1.3.1", "2.1.1", "4.1.2"],
  "lastModified": "2024-10-14T10:30:00Z"
}
```

**Error Response**:
```typescript
{
  "error": "Component not found",
  "component": "invalid-name",
  "suggestions": ["button", "icon-button", "toggle-button"]
}
```

**Use Cases**:
- Get specific acceptance criteria for implementation
- Retrieve code examples for accessible web components
- Check WCAG compliance requirements

---

#### 3.1.3 Tool: `search_web_criteria`
**Purpose**: Search web accessibility criteria using keywords

**Parameters**:
- `query` (required, string): Search term or phrase
- `max_results` (optional, number): Maximum results to return (default: 10)

**Returns**:
```typescript
{
  "query": "focus indicator",
  "results": [
    {
      "component": "button",
      "category": "controls",
      "matches": [
        {
          "section": "Focus Requirements",
          "snippet": "...visible focus indicator with 3:1 contrast ratio...",
          "line": 45
        }
      ],
      "relevance": 0.95
    }
  ],
  "totalResults": 8
}
```

**Use Cases**:
- Find criteria related to specific WCAG guidelines
- Search for implementation patterns (e.g., "focus management", "aria-label")
- Discover related components

---

### 3.2 Native Platform Tools

#### 3.2.1 Tool: `list_native_components`
**Purpose**: List all available native (iOS/Android) accessibility components

**Parameters**:
- `category` (optional, string): Filter by category (e.g., `controls`, `components`)
  - If omitted, returns all categories

**Returns**:
```typescript
{
  "components": [
    {
      "name": "button",
      "displayName": "Button",
      "category": "controls",
      "path": "native/controls/button.md",
      "platforms": ["iOS", "Android"]
    },
    {
      "name": "switch",
      "displayName": "Switch",
      "category": "controls", 
      "path": "native/controls/switch.md",
      "platforms": ["iOS", "Android"]
    }
  ],
  "categories": ["controls", "components", "notifications"]
}
```

**Use Cases**:
- Discover available native components
- Browse by category
- Identify cross-platform components

---

#### 3.2.2 Tool: `get_native_component`
**Purpose**: Get detailed accessibility criteria for a specific native component

**Parameters**:
- `component` (required, string): Component name (e.g., `button`, `switch`, `picker`)
- `include_code_examples` (optional, boolean): Include platform-specific code examples
  - Default: `true`

**Returns**:
```typescript
{
  "component": "button",
  "displayName": "Button",
  "category": "controls",
  "content": "<full markdown content>",
  "sections": [
    "Expected behavior",
    "iOS implementation",
    "Android implementation",
    "Code examples"
  ],
  "platforms": {
    "iOS": {
      "traits": ["UIAccessibilityTraitButton"],
      "properties": ["accessibilityLabel", "accessibilityHint"]
    },
    "Android": {
      "classes": ["Button", "MaterialButton"],
      "properties": ["contentDescription", "stateDescription"]
    }
  },
  "wcagCriteria": ["1.3.1", "2.1.1", "4.1.2"],
  "lastModified": "2024-10-14T10:30:00Z"
}
```

**Error Response**:
```typescript
{
  "error": "Component not found",
  "component": "invalid-name",
  "suggestions": ["button", "switch", "segmented-control"]
}
```

**Use Cases**:
- Get native-specific accessibility criteria
- Retrieve iOS and Android implementation details
- Check platform-specific requirements

---

#### 3.2.3 Tool: `search_native_criteria`
**Purpose**: Search native accessibility criteria using keywords

**Parameters**:
- `query` (required, string): Search term or phrase
- `max_results` (optional, number): Maximum results to return (default: 10)

**Returns**:
```typescript
{
  "query": "voiceover",
  "results": [
    {
      "component": "button",
      "category": "controls",
      "matches": [
        {
          "section": "iOS Implementation",
          "snippet": "...VoiceOver announces the button label and hint...",
          "line": 67
        }
      ],
      "relevance": 0.92
    }
  ],
  "totalResults": 12
}
```

**Use Cases**:
- Find platform-specific implementation details
- Search for TalkBack/VoiceOver patterns
- Discover accessibility API usage

---

## 4. MCP Protocol Compliance

### 4.1 Tool Design Principles
Following MCP best practices, each tool:
- **Single Responsibility**: Each tool has one clear purpose
- **Platform Separation**: Web and Native tools are separate for clarity
- **Explicit Parameters**: All parameters are strongly typed with clear descriptions
- **Consistent Returns**: All tools return structured JSON responses
- **Error Handling**: Errors include helpful suggestions and context

### 4.2 Tool Naming Convention
- **Verb-based naming**: `list_*`, `get_*`, `search_*`
- **Platform prefix**: `_web_` or `_native_` for platform-specific tools
- **Descriptive**: Tool names clearly indicate their function

### 4.3 Standard MCP Response Format
All tools return standard MCP responses:
```typescript
{
  content: [
    {
      type: "text",
      text: "<structured JSON response>"
    }
  ]
}
```

### 4.4 Tool Schema Definition
Each tool includes complete JSON Schema definitions:
- Required vs optional parameters clearly marked
- Parameter types and constraints specified
- Response structure documented
- Example responses provided

---

## 5. Implementation Details

### 5.1 Technology Stack
- **Language**: TypeScript
- **MCP SDK**: `@modelcontextprotocol/sdk` (official MCP TypeScript SDK)
- **File System**: Node.js `fs/promises` for reading markdown files
- **Markdown Parsing**: `gray-matter` for frontmatter + `remark` for parsing content
- **Search**: `fuse.js` for fuzzy matching and relevance ranking

### 5.2 MCP SDK Implementation

#### 5.2.1 Package Installation
```bash
npm install @modelcontextprotocol/sdk
```

#### 5.2.2 Server Structure
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "magentaa11y-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);
```

#### 5.2.3 Tool Registration
Each tool is registered using the MCP SDK's tool handlers:

```typescript
// Register list_web_components tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_web_components",
        description: "List all available web accessibility components",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Optional category filter (e.g., 'controls', 'forms')",
            },
          },
        },
      },
      {
        name: "get_web_component",
        description: "Get detailed accessibility criteria for a specific web component",
        inputSchema: {
          type: "object",
          properties: {
            component: {
              type: "string",
              description: "Component name (e.g., 'button', 'checkbox')",
            },
            include_code_examples: {
              type: "boolean",
              description: "Include code examples in response",
              default: true,
            },
          },
          required: ["component"],
        },
      },
      // ... additional tools
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "list_web_components":
      return await handleListWebComponents(args);
    case "get_web_component":
      return await handleGetWebComponent(args);
    case "search_web_criteria":
      return await handleSearchWebCriteria(args);
    case "list_native_components":
      return await handleListNativeComponents(args);
    case "get_native_component":
      return await handleGetNativeComponent(args);
    case "search_native_criteria":
      return await handleSearchNativeCriteria(args);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});
```

#### 5.2.4 Tool Handler Response Format
Each tool handler returns content in the standardized MCP format:

```typescript
async function handleGetWebComponent(args: { 
  component: string; 
  include_code_examples?: boolean 
}) {
  try {
    const componentData = await loadWebComponent(args.component);
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            component: componentData.name,
            displayName: componentData.displayName,
            category: componentData.category,
            content: componentData.markdownContent,
            sections: componentData.sections,
            wcagCriteria: componentData.wcagCriteria,
            lastModified: componentData.lastModified,
          }, null, 2),
        },
      ],
    };
  } catch (error) {
    // Return error with suggestions
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            error: "Component not found",
            component: args.component,
            suggestions: await getSimilarComponents(args.component),
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
}
```

#### 5.2.5 Server Startup
```typescript
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MagentaA11y MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
```

### 5.3 File Discovery Algorithm
1. Scan `magentaA11y/public/content/documentation/` directory
2. Index all `.md` files with metadata:
   - Platform (from directory structure: `web/` or `native/`)
   - Category (from parent directory: `controls/`, `forms/`, etc.)
   - Component name (from filename, normalized)
3. Build in-memory index for fast lookups
4. Cache index and refresh on submodule updates

### 5.4 Content Parsing Strategy
- Extract frontmatter metadata using `gray-matter` (if present)
- Parse markdown sections using `remark` and heading structure
- Identify and tag code examples by language (HTML, CSS, JS, Swift, Kotlin)
- Extract WCAG success criteria references (regex patterns)
- Parse platform-specific sections (iOS/Android developer notes)

### 5.5 Error Handling & User Experience
- Return helpful suggestions when component not found (using `fuse.js` fuzzy matching)
- Validate all parameters with clear error messages
- Provide "did you mean?" suggestions for typos
- Return partial results when possible
- Log errors to stderr for debugging without exposing internal details

---

## 6. Development Phases

### Phase 1: Foundation (MVP)
- [ ] Set up MCP server boilerplate with TypeScript
- [ ] Add MagentaA11y as Git submodule
- [ ] Implement file indexing and discovery system
- [ ] Implement Web tools:
  - [ ] `list_web_components`
  - [ ] `get_web_component`
- [ ] Implement Native tools:
  - [ ] `list_native_components`
  - [ ] `get_native_component`
- [ ] Basic error handling with suggestions

### Phase 2: Search & Enhanced Parsing
- [ ] Implement search tools:
  - [ ] `search_web_criteria`
  - [ ] `search_native_criteria`
- [ ] Add structured markdown parsing
- [ ] Extract WCAG criteria mappings
- [ ] Extract platform-specific metadata (iOS/Android)
- [ ] Implement fuzzy search with relevance ranking

### Phase 3: Caching & Performance
- [ ] Implement file system caching layer
- [ ] Add cache invalidation on submodule updates
- [ ] Optimize file reading and parsing
- [ ] Add request deduplication
- [ ] Performance benchmarking

### Phase 4: Polish & Production Readiness
- [ ] Comprehensive error handling
- [ ] Component name normalization and suggestions
- [ ] Complete test suite
- [ ] API documentation and examples
- [ ] CI/CD pipeline
- [ ] Automated submodule update checks

---

## 7. Configuration

### 7.1 Package Dependencies
```json
{
  "name": "magentaa11y-mcp",
  "version": "1.0.0",
  "type": "module",
  "bin": {
    "magentaa11y-mcp": "./build/index.js"
  },
  "scripts": {
    "build": "tsc",
    "prepare": "npm run build",
    "watch": "tsc --watch"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "gray-matter": "^4.0.3",
    "remark": "^15.0.1",
    "remark-parse": "^11.0.0",
    "fuse.js": "^7.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "typescript": "^5.3.3"
  }
}
```

### 7.2 TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build"]
}
```

### 7.3 Server Configuration (optional config file)
```json
{
  "name": "magentaa11y-mcp",
  "version": "1.0.0",
  "contentPath": "./magentaA11y/public/content/documentation",
  "cacheEnabled": true,
  "cacheTTL": 3600
}
```

### 7.4 Git Submodule Setup
```bash
# Initial setup
git submodule add https://github.com/tmobile/magentaA11y.git magentaA11y

# Initialize submodule after clone
git submodule update --init --recursive

# Update to latest
git submodule update --remote --merge
```

### 7.5 MCP Client Configuration

#### Claude Desktop Configuration
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "magentaa11y": {
      "command": "node",
      "args": ["/path/to/magentaa11y-mcp/build/index.js"]
    }
  }
}
```

Or using npx after publishing:
```json
{
  "mcpServers": {
    "magentaa11y": {
      "command": "npx",
      "args": ["-y", "magentaa11y-mcp"]
    }
  }
}
```

#### Generic MCP Client Configuration
For any MCP-compatible client:
- **Transport**: stdio
- **Command**: `node /path/to/magentaa11y-mcp/build/index.js`
- **Environment Variables** (optional):
  - `MAGENTA_CONTENT_PATH`: Override default content path
  - `MAGENTA_CACHE_ENABLED`: Enable/disable caching (true/false)

---

## 8. Success Metrics

### 8.1 Functional Metrics
- All MCP tools respond within 100ms (cached)
- 100% coverage of available MagentaA11y content
- Zero data loss during submodule updates
- 6 core tools (3 web + 3 native) fully functional

### 8.2 Quality Metrics
- Clear error messages for all failure cases
- Accurate search results (>90% relevance)
- Complete documentation with examples
- Helpful suggestions for common typos/mistakes

---

## 9. Future Enhancements

### 9.1 Potential Additional Tools
- `compare_web_native`: Compare web vs native implementation for same component
- `get_wcag_details`: Get detailed WCAG success criteria information
- `validate_code`: Validate code snippet against accessibility criteria
- `generate_test_plan`: Generate test plan from component criteria

### 9.2 Potential Features
- **Version history**: Track changes in accessibility criteria over time
- **Batch operations**: Get multiple components in a single request
- **Multi-language support**: If MagentaA11y adds translations
- **Custom criteria**: Allow users to add organization-specific criteria
- **Analytics**: Track most-queried components and criteria
- **Auto-complete**: Suggest component names as user types

---

## 10. References

- [MagentaA11y GitHub Repository](https://github.com/tmobile/magentaA11y)
- [MagentaA11y Website](https://www.magentaa11y.com/)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 11. Appendix

### 11.1 Example MCP Server Usage
```typescript
// List all web components in the forms category
const webForms = await server.call_tool("list_web_components", {
  category: "forms"
});
// Returns: { components: [{name: "checkbox", ...}, {name: "text-input", ...}], categories: [...] }

// Get detailed web button accessibility criteria
const webButton = await server.call_tool("get_web_component", {
  component: "button",
  include_code_examples: true
});
// Returns: { component: "button", content: "...", wcagCriteria: ["1.3.1", ...], ... }

// List all native components
const nativeComponents = await server.call_tool("list_native_components", {});
// Returns: { components: [{name: "button", platforms: ["iOS", "Android"], ...}], ... }

// Get native switch implementation details
const nativeSwitch = await server.call_tool("get_native_component", {
  component: "switch"
});
// Returns: { platforms: { iOS: {...}, Android: {...} }, content: "...", ... }

// Search for focus-related web criteria
const focusResults = await server.call_tool("search_web_criteria", {
  query: "focus indicator",
  max_results: 5
});
// Returns: { results: [{component: "button", matches: [...], relevance: 0.95}], ... }

// Search for VoiceOver patterns in native
const voiceOverResults = await server.call_tool("search_native_criteria", {
  query: "voiceover announcement"
});
// Returns: { results: [{component: "button", matches: [...]}], totalResults: 8 }
```

### 11.2 MCP Tool Summary

| Tool Name | Platform | Purpose | Key Parameters |
|-----------|----------|---------|----------------|
| `list_web_components` | Web | List all web components | `category` (optional) |
| `get_web_component` | Web | Get web component details | `component` (required) |
| `search_web_criteria` | Web | Search web criteria | `query` (required) |
| `list_native_components` | Native | List all native components | `category` (optional) |
| `get_native_component` | Native | Get native component details | `component` (required) |
| `search_native_criteria` | Native | Search native criteria | `query` (required) |

### 11.3 Content Update Workflow
1. Developer runs: `git submodule update --remote`
2. Server detects content changes
3. Cache is invalidated
4. New content is indexed
5. Updated criteria immediately available to LLMs

### 11.4 Quick Start Guide

#### Initial Setup
```bash
# Clone the repository
git clone https://github.com/your-org/magentaa11y-mcp.git
cd magentaa11y-mcp

# Initialize submodule
git submodule update --init --recursive

# Install dependencies
npm install

# Build the project
npm run build
```

#### Testing Locally
```bash
# Run the server directly (for testing)
node build/index.js

# Or use MCP inspector for development
npx @modelcontextprotocol/inspector node build/index.js
```

#### Configure Claude Desktop
```bash
# Edit Claude Desktop config (macOS)
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json

# Add the server configuration (see section 7.5)
# Restart Claude Desktop
```

#### Verify Installation
In Claude Desktop, you should see 6 new tools available:
- list_web_components
- get_web_component
- search_web_criteria
- list_native_components
- get_native_component
- search_native_criteria

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-14 | Initial | Initial PRD creation |

---

**Status**: Draft  
**Last Updated**: October 14, 2025  
**Next Review**: TBD