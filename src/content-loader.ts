/**
 * Content loading and indexing system for MagentaA11y content
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import Fuse from 'fuse.js';
import type { ComponentMetadata, ComponentContent } from './types.js';

const CONTENT_BASE_PATH = path.join(process.cwd(), 'magentaA11y', 'public', 'content', 'documentation');

export class ContentLoader {
  private webComponents: Map<string, ComponentMetadata> = new Map();
  private nativeComponents: Map<string, ComponentMetadata> = new Map();
  private indexed = false;

  /**
   * Initialize and index all content
   */
  async initialize(): Promise<void> {
    if (this.indexed) return;

    try {
      await this.indexPlatform('web', this.webComponents);
      await this.indexPlatform('native', this.nativeComponents);
      this.indexed = true;
      console.error(`Indexed ${this.webComponents.size} web and ${this.nativeComponents.size} native components`);
    } catch (error) {
      console.error('Error indexing content:', error);
      throw new Error('Failed to initialize content. Ensure magentaA11y submodule is initialized.');
    }
  }

  /**
   * Index a platform's content
   */
  private async indexPlatform(platform: 'web' | 'native', targetMap: Map<string, ComponentMetadata>): Promise<void> {
    const platformPath = path.join(CONTENT_BASE_PATH, platform);
    
    try {
      await fs.access(platformPath);
    } catch {
      console.error(`Warning: ${platform} platform directory not found at ${platformPath}`);
      return;
    }

    const categories = await fs.readdir(platformPath, { withFileTypes: true });

    for (const categoryEntry of categories) {
      if (!categoryEntry.isDirectory()) continue;
      
      const category = categoryEntry.name;
      const categoryPath = path.join(platformPath, category);

      try {
        const files = await fs.readdir(categoryPath);
        
        for (const file of files) {
          if (!file.endsWith('.md')) continue;

          const componentName = file.replace('.md', '');
          const filePath = path.join(categoryPath, file);
          const stats = await fs.stat(filePath);

          const metadata: ComponentMetadata = {
            name: componentName,
            displayName: this.formatDisplayName(componentName),
            category,
            path: path.relative(CONTENT_BASE_PATH, filePath),
            platform,
            lastModified: stats.mtime.toISOString(),
          };

          if (platform === 'native') {
            metadata.platforms = ['iOS', 'Android'];
          }

          targetMap.set(componentName, metadata);
        }
      } catch (error) {
        console.error(`Error reading category ${category}:`, error);
      }
    }
  }

  /**
   * Format component name for display
   */
  private formatDisplayName(name: string): string {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * List components for a platform
   */
  listComponents(platform: 'web' | 'native', category?: string): ComponentMetadata[] {
    const componentsMap = platform === 'web' ? this.webComponents : this.nativeComponents;
    let components = Array.from(componentsMap.values());

    if (category) {
      components = components.filter(c => c.category === category);
    }

    return components.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get unique categories for a platform
   */
  getCategories(platform: 'web' | 'native'): string[] {
    const componentsMap = platform === 'web' ? this.webComponents : this.nativeComponents;
    const categories = new Set<string>();
    
    for (const component of componentsMap.values()) {
      categories.add(component.category);
    }

    return Array.from(categories).sort();
  }

  /**
   * Get detailed component content
   */
  async getComponent(platform: 'web' | 'native', componentName: string): Promise<ComponentContent> {
    const componentsMap = platform === 'web' ? this.webComponents : this.nativeComponents;
    const metadata = componentsMap.get(componentName);

    if (!metadata) {
      throw new Error(`Component '${componentName}' not found`);
    }

    const filePath = path.join(CONTENT_BASE_PATH, metadata.path);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const parsed = matter(fileContent);
    
    const sections = this.extractSections(parsed.content);
    const wcagCriteria = this.extractWCAGCriteria(parsed.content);
    
    const result: ComponentContent = {
      component: metadata.name,
      displayName: metadata.displayName,
      category: metadata.category,
      content: parsed.content,
      sections,
      wcagCriteria,
      lastModified: metadata.lastModified,
    };

    // Extract platform-specific metadata for native components
    if (platform === 'native') {
      result.platforms = this.extractPlatformMetadata(parsed.content);
    }

    return result;
  }

  /**
   * Extract section headings from markdown
   */
  private extractSections(content: string): string[] {
    const sections: string[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      const match = line.match(/^#{1,3}\s+(.+)$/);
      if (match) {
        sections.push(match[1].trim());
      }
    }

    return sections;
  }

  /**
   * Extract WCAG success criteria references
   */
  private extractWCAGCriteria(content: string): string[] {
    const criteria = new Set<string>();
    const regex = /(\d+\.\d+\.\d+)/g;
    
    let match;
    while ((match = regex.exec(content)) !== null) {
      criteria.add(match[1]);
    }

    return Array.from(criteria).sort();
  }

  /**
   * Extract platform-specific metadata for native components
   */
  private extractPlatformMetadata(content: string): ComponentContent['platforms'] {
    const platforms: ComponentContent['platforms'] = {};

    // Extract iOS-specific information
    const iosTraits = this.extractPatterns(content, /UIAccessibilityTrait\w+/g);
    const iosProperties = this.extractPatterns(content, /accessibility(?:Label|Hint|Value|Traits|Frame)/g);
    
    if (iosTraits.length > 0 || iosProperties.length > 0) {
      platforms.iOS = {
        traits: iosTraits.length > 0 ? iosTraits : undefined,
        properties: iosProperties.length > 0 ? iosProperties : undefined,
      };
    }

    // Extract Android-specific information
    const androidClasses = this.extractPatterns(content, /(?:Material)?(?:Button|Switch|Checkbox|TextView|EditText)\b/g);
    const androidProperties = this.extractPatterns(content, /content(?:Description|Info)|stateDescription/g);
    
    if (androidClasses.length > 0 || androidProperties.length > 0) {
      platforms.Android = {
        classes: androidClasses.length > 0 ? androidClasses : undefined,
        properties: androidProperties.length > 0 ? androidProperties : undefined,
      };
    }

    return platforms;
  }

  /**
   * Extract unique patterns from content
   */
  private extractPatterns(content: string, regex: RegExp): string[] {
    const matches = new Set<string>();
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      matches.add(match[0]);
    }

    return Array.from(matches);
  }

  /**
   * Search components
   */
  async search(platform: 'web' | 'native', query: string, maxResults: number = 10): Promise<any> {
    const components = this.listComponents(platform);
    const searchData: Array<{ component: ComponentMetadata; content: string }> = [];

    // Load content for all components
    for (const component of components) {
      try {
        const content = await this.getComponent(platform, component.name);
        searchData.push({ component, content: content.content });
      } catch (error) {
        console.error(`Error loading component ${component.name}:`, error);
      }
    }

    // Configure fuzzy search
    const fuse = new Fuse(searchData, {
      keys: ['content', 'component.name', 'component.displayName'],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
    });

    const results = fuse.search(query);

    return {
      query,
      results: results.slice(0, maxResults).map(result => ({
        component: result.item.component.name,
        category: result.item.component.category,
        matches: this.extractMatchSnippets(result.item.content, query),
        relevance: 1 - (result.score || 0),
      })),
      totalResults: results.length,
    };
  }

  /**
   * Extract match snippets from content
   */
  private extractMatchSnippets(content: string, query: string): any[] {
    const snippets: any[] = [];
    const lines = content.split('\n');
    const queryLower = query.toLowerCase();
    let currentSection = 'Content';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Track current section
      const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
      if (headingMatch) {
        currentSection = headingMatch[1].trim();
        continue;
      }

      // Find matches
      if (line.toLowerCase().includes(queryLower)) {
        const start = Math.max(0, i - 1);
        const end = Math.min(lines.length, i + 2);
        const snippet = lines.slice(start, end).join(' ').substring(0, 200);

        snippets.push({
          section: currentSection,
          snippet: snippet + '...',
          line: i + 1,
        });

        if (snippets.length >= 3) break; // Limit snippets per component
      }
    }

    return snippets;
  }

  /**
   * Get similar component names for suggestions
   */
  getSimilarComponents(platform: 'web' | 'native', componentName: string, limit: number = 5): string[] {
    const components = this.listComponents(platform);
    
    const fuse = new Fuse(components, {
      keys: ['name', 'displayName'],
      threshold: 0.5,
    });

    const results = fuse.search(componentName);
    return results.slice(0, limit).map(r => r.item.name);
  }
}

