#!/usr/bin/env node

/**
 * Quick sync script that just copies the current content.json
 * Use this when you've already built MagentaA11y and just need to sync the content
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_CONTENT = path.join(__dirname, 'magentaA11y', 'src', 'shared', 'content.json');
const TARGET_CONTENT = path.join(__dirname, 'data', 'content.json');

console.log('🔄 Syncing content.json...\n');

try {
  // Copy content.json
  await fs.mkdir(path.dirname(TARGET_CONTENT), { recursive: true });
  await fs.copyFile(SOURCE_CONTENT, TARGET_CONTENT);
  
  // Verify the content
  const stats = await fs.stat(TARGET_CONTENT);
  const content = await fs.readFile(TARGET_CONTENT, 'utf-8');
  const data = JSON.parse(content);
  
  const webCount = data.web?.reduce((count, category) => count + (category.children?.length || 0), 0) || 0;
  const nativeCount = data.native?.reduce((count, category) => count + (category.children?.length || 0), 0) || 0;
  
  console.log(`✅ Content synced successfully!`);
  console.log(`📊 ${webCount} web + ${nativeCount} native components`);
  console.log(`📄 File size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`📅 Last modified: ${stats.mtime.toISOString()}`);

} catch (error) {
  console.error('❌ Sync failed:', error.message);
  process.exit(1);
}