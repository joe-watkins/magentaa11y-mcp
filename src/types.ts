/**
 * Types for the MagentaA11y MCP Server
 */

export interface ComponentMetadata {
  name: string;
  displayName: string;
  category: string;
  path: string;
  platform: 'web' | 'native';
  platforms?: string[]; // For native components (iOS, Android)
  lastModified?: string;
}

export interface ComponentContent {
  component: string;
  displayName: string;
  category: string;
  content: string;
  sections: string[];
  wcagCriteria: string[];
  lastModified?: string;
  platforms?: {
    iOS?: {
      traits?: string[];
      properties?: string[];
    };
    Android?: {
      classes?: string[];
      properties?: string[];
    };
  };
}

export interface SearchMatch {
  section: string;
  snippet: string;
  line: number;
}

export interface SearchResult {
  component: string;
  category: string;
  matches: SearchMatch[];
  relevance: number;
}

export interface ListComponentsResponse {
  components: ComponentMetadata[];
  categories: string[];
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalResults: number;
}

export interface ErrorResponse {
  error: string;
  component?: string;
  suggestions?: string[];
}

