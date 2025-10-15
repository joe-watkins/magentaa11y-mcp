#!/usr/bin/env node

/**
 * MagentaA11y MCP Server
 * Provides accessibility acceptance criteria from the MagentaA11y project
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ContentLoader } from './content-loader.js';

// Initialize content loader
const contentLoader = new ContentLoader();

// Create MCP server
const server = new Server(
  {
    name: 'magentaa11y-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * Register all MCP tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Web Platform Tools
      {
        name: 'list_web_components',
        description: 'List all available web accessibility components from MagentaA11y. Optionally filter by category (e.g., controls, forms, components).',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Optional category filter (e.g., "controls", "forms", "components")',
            },
          },
        },
      },
      {
        name: 'get_web_component',
        description: 'Get detailed accessibility criteria for a specific web component. Returns acceptance criteria, WCAG mappings, code examples, and implementation guidelines.',
        inputSchema: {
          type: 'object',
          properties: {
            component: {
              type: 'string',
              description: 'Component name (e.g., "button", "checkbox", "text-input")',
            },
            include_code_examples: {
              type: 'boolean',
              description: 'Include code examples in response (default: true)',
              default: true,
            },
          },
          required: ['component'],
        },
      },
      {
        name: 'search_web_criteria',
        description: 'Search web accessibility criteria using keywords. Find criteria related to WCAG guidelines, implementation patterns, or specific accessibility requirements.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search term or phrase (e.g., "focus indicator", "aria-label")',
            },
            max_results: {
              type: 'number',
              description: 'Maximum number of results to return (default: 10)',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      // Native Platform Tools
      {
        name: 'list_native_components',
        description: 'List all available native (iOS/Android) accessibility components from MagentaA11y. Optionally filter by category.',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Optional category filter (e.g., "controls", "components")',
            },
          },
        },
      },
      {
        name: 'get_native_component',
        description: 'Get detailed accessibility criteria for a specific native component. Returns iOS and Android implementation details, platform-specific properties, and code examples.',
        inputSchema: {
          type: 'object',
          properties: {
            component: {
              type: 'string',
              description: 'Component name (e.g., "button", "switch", "picker")',
            },
            include_code_examples: {
              type: 'boolean',
              description: 'Include platform-specific code examples (default: true)',
              default: true,
            },
          },
          required: ['component'],
        },
      },
      {
        name: 'search_native_criteria',
        description: 'Search native accessibility criteria using keywords. Find platform-specific implementation details for iOS (VoiceOver) and Android (TalkBack).',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search term or phrase (e.g., "voiceover", "talkback", "accessibility label")',
            },
            max_results: {
              type: 'number',
              description: 'Maximum number of results to return (default: 10)',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      // Content Format Tools
      {
        name: 'get_component_gherkin',
        description: 'Get Gherkin-style acceptance criteria for a component. These are detailed Given/When/Then scenarios for testing accessibility.',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              enum: ['web', 'native'],
              description: 'Platform (web or native)',
            },
            component: {
              type: 'string',
              description: 'Component name (e.g., "button", "checkbox")',
            },
          },
          required: ['platform', 'component'],
        },
      },
      {
        name: 'get_component_condensed',
        description: 'Get condensed acceptance criteria for a component. These are shorter, more focused testing instructions.',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              enum: ['web', 'native'],
              description: 'Platform (web or native)',
            },
            component: {
              type: 'string',
              description: 'Component name (e.g., "button", "checkbox")',
            },
          },
          required: ['platform', 'component'],
        },
      },
      {
        name: 'get_component_developer_notes',
        description: 'Get developer implementation notes for a component. Includes code examples, WCAG mappings, and technical guidance.',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              enum: ['web', 'native'],
              description: 'Platform (web or native)',
            },
            component: {
              type: 'string',
              description: 'Component name (e.g., "button", "checkbox")',
            },
          },
          required: ['platform', 'component'],
        },
      },
      {
        name: 'get_component_native_notes',
        description: 'Get platform-specific developer notes for native components (iOS or Android implementation details).',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              enum: ['ios', 'android'],
              description: 'Native platform (ios or android)',
            },
            component: {
              type: 'string',
              description: 'Component name (e.g., "button", "switch")',
            },
          },
          required: ['platform', 'component'],
        },
      },
      {
        name: 'list_component_formats',
        description: 'List all available content formats for a specific component (e.g., gherkin, condensed, developer notes).',
        inputSchema: {
          type: 'object',
          properties: {
            platform: {
              type: 'string',
              enum: ['web', 'native'],
              description: 'Platform (web or native)',
            },
            component: {
              type: 'string',
              description: 'Component name (e.g., "button", "checkbox")',
            },
          },
          required: ['platform', 'component'],
        },
      },
    ],
  };
});

/**
 * Handle tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_web_components':
        return await handleListWebComponents(args);
      case 'get_web_component':
        return await handleGetWebComponent(args);
      case 'search_web_criteria':
        return await handleSearchWebCriteria(args);
      case 'list_native_components':
        return await handleListNativeComponents(args);
      case 'get_native_component':
        return await handleGetNativeComponent(args);
      case 'search_native_criteria':
        return await handleSearchNativeCriteria(args);
      case 'get_component_gherkin':
        return await handleGetComponentGherkin(args);
      case 'get_component_condensed':
        return await handleGetComponentCondensed(args);
      case 'get_component_developer_notes':
        return await handleGetComponentDeveloperNotes(args);
      case 'get_component_native_notes':
        return await handleGetComponentNativeNotes(args);
      case 'list_component_formats':
        return await handleListComponentFormats(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: error.message || 'An error occurred',
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
});

/**
 * Tool Handlers
 */

async function handleListWebComponents(args: any) {
  const components = contentLoader.listComponents('web', args?.category);
  const categories = contentLoader.getCategories('web');

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            components,
            categories,
          },
          null,
          2
        ),
      },
    ],
  };
}

async function handleGetWebComponent(args: any) {
  try {
    const componentData = await contentLoader.getComponent('web', args.component);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(componentData, null, 2),
        },
      ],
    };
  } catch (error: any) {
    const suggestions = contentLoader.getSimilarComponents('web', args.component);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: 'Component not found',
              component: args.component,
              suggestions,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

async function handleSearchWebCriteria(args: any) {
  const maxResults = args?.max_results || 10;
  const results = await contentLoader.search('web', args.query, maxResults);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(results, null, 2),
      },
    ],
  };
}

async function handleListNativeComponents(args: any) {
  const components = contentLoader.listComponents('native', args?.category);
  const categories = contentLoader.getCategories('native');

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            components,
            categories,
          },
          null,
          2
        ),
      },
    ],
  };
}

async function handleGetNativeComponent(args: any) {
  try {
    const componentData = await contentLoader.getComponent('native', args.component);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(componentData, null, 2),
        },
      ],
    };
  } catch (error: any) {
    const suggestions = contentLoader.getSimilarComponents('native', args.component);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: 'Component not found',
              component: args.component,
              suggestions,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

async function handleSearchNativeCriteria(args: any) {
  const maxResults = args?.max_results || 10;
  const results = await contentLoader.search('native', args.query, maxResults);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(results, null, 2),
      },
    ],
  };
}

/**
 * Content Format Handlers
 */

async function handleGetComponentGherkin(args: any) {
  try {
    const content = await contentLoader.getComponentContent(args.platform, args.component, 'gherkin');
    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  } catch (error: any) {
    const suggestions = contentLoader.getSimilarComponents(args.platform, args.component);
    const formats = contentLoader.getAvailableFormats(args.platform, args.component);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: error.message,
              component: args.component,
              suggestions,
              availableFormats: formats,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

async function handleGetComponentCondensed(args: any) {
  try {
    const content = await contentLoader.getComponentContent(args.platform, args.component, 'condensed');
    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  } catch (error: any) {
    const suggestions = contentLoader.getSimilarComponents(args.platform, args.component);
    const formats = contentLoader.getAvailableFormats(args.platform, args.component);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: error.message,
              component: args.component,
              suggestions,
              availableFormats: formats,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

async function handleGetComponentDeveloperNotes(args: any) {
  try {
    const content = await contentLoader.getComponentContent(args.platform, args.component, 'developerNotes');
    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  } catch (error: any) {
    const suggestions = contentLoader.getSimilarComponents(args.platform, args.component);
    const formats = contentLoader.getAvailableFormats(args.platform, args.component);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: error.message,
              component: args.component,
              suggestions,
              availableFormats: formats,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

async function handleGetComponentNativeNotes(args: any) {
  try {
    const format = args.platform === 'ios' ? 'iosDeveloperNotes' : 'androidDeveloperNotes';
    const content = await contentLoader.getComponentContent('native', args.component, format);
    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  } catch (error: any) {
    const suggestions = contentLoader.getSimilarComponents('native', args.component);
    const formats = contentLoader.getAvailableFormats('native', args.component);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: error.message,
              component: args.component,
              platform: args.platform,
              suggestions,
              availableFormats: formats,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

async function handleListComponentFormats(args: any) {
  try {
    const formats = contentLoader.getAvailableFormats(args.platform, args.component);
    const component = await contentLoader.getComponent(args.platform, args.component);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              component: args.component,
              displayName: component.label,
              platform: args.platform,
              availableFormats: formats,
              formatDescriptions: {
                gherkin: 'Given/When/Then style acceptance criteria for comprehensive testing',
                condensed: 'Shortened, focused testing instructions',
                developerNotes: 'Implementation guidance with code examples and WCAG mappings',
                androidDeveloperNotes: 'Android-specific implementation details',
                iosDeveloperNotes: 'iOS-specific implementation details'
              }
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error: any) {
    const suggestions = contentLoader.getSimilarComponents(args.platform, args.component);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              error: error.message,
              component: args.component,
              suggestions,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

/**
 * Start the server
 */
async function main() {
  console.error('Initializing MagentaA11y MCP Server...');
  
  try {
    await contentLoader.initialize();
    console.error('Content indexed successfully');
  } catch (error: any) {
    console.error('Failed to initialize content:', error.message);
    console.error('Make sure content.json exists in magentaA11y/src/shared/');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('MagentaA11y MCP Server running on stdio');
  console.error('Available tools: list_web_components, get_web_component, search_web_criteria, list_native_components, get_native_component, search_native_criteria, get_component_gherkin, get_component_condensed, get_component_developer_notes, get_component_native_notes, list_component_formats');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

