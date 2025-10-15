/**
 * Types for the MagentaA11y MCP Server
 * 
 * Note: Most types are now defined in content-loader.ts to align with the JSON structure
 */

export interface ErrorResponse {
  error: string;
  component?: string;
  suggestions?: string[];
}

