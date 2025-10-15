#!/usr/bin/env node

/**
 * Build script that:
 * 1. Builds the MagentaA11y project to generate fresh content.json
 * 2. Copies content.json to our data folder
 * 3. Builds our MCP server
 * 4. Resets the submodule to clean state
 */

import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAGENTA_DIR = path.join(__dirname, 'magentaA11y');
const DATA_DIR = path.join(__dirname, 'data');
const SOURCE_CONTENT = path.join(MAGENTA_DIR, 'src', 'shared', 'content.json');
const TARGET_CONTENT = path.join(DATA_DIR, 'content.json');

console.log('🚀 Starting MagentaA11y MCP build process...\n');

try {
  // Step 1: Check if MagentaA11y submodule is initialized
  console.log('📋 Step 1: Checking MagentaA11y submodule...');
  try {
    await fs.access(SOURCE_CONTENT);
    console.log('✅ MagentaA11y submodule found');
  } catch (error) {
    console.log('⚠️  MagentaA11y submodule not found, initializing...');
    execSync('git submodule update --init --recursive', { 
      cwd: __dirname,
      stdio: 'inherit'
    });
  }

  // Step 2: Install dependencies in MagentaA11y if needed
  console.log('\n📦 Step 2: Installing MagentaA11y dependencies...');
  try {
    await fs.access(path.join(MAGENTA_DIR, 'node_modules'));
    console.log('✅ Dependencies already installed');
  } catch (error) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { 
      cwd: MAGENTA_DIR,
      stdio: 'inherit'
    });
  }

  // Step 3: Build MagentaA11y to generate fresh content.json
  console.log('\n🔨 Step 3: Building MagentaA11y project...');
  execSync('npm run build', { 
    cwd: MAGENTA_DIR,
    stdio: 'inherit'
  });
  console.log('✅ MagentaA11y build complete');

  // Step 4: Copy content.json to our data folder
  console.log('\n📄 Step 4: Copying content.json...');
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.copyFile(SOURCE_CONTENT, TARGET_CONTENT);
  console.log(`✅ Copied content.json to ${TARGET_CONTENT}`);

  // Step 5: Build our MCP server
  console.log('\n🔧 Step 5: Building MCP server...');
  execSync('tsc', { 
    cwd: __dirname,
    stdio: 'inherit'
  });
  console.log('✅ MCP server build complete');

  // Step 6: Reset the submodule to clean state
  console.log('\n🧹 Step 6: Cleaning up MagentaA11y submodule...');
  execSync('git reset --hard HEAD', { 
    cwd: MAGENTA_DIR,
    stdio: 'inherit'
  });
  execSync('git clean -fd', { 
    cwd: MAGENTA_DIR,
    stdio: 'inherit'
  });
  console.log('✅ MagentaA11y submodule reset to clean state');

  // Step 7: Verify the content was copied successfully
  console.log('\n🔍 Step 7: Verifying content...');
  const stats = await fs.stat(TARGET_CONTENT);
  const content = await fs.readFile(TARGET_CONTENT, 'utf-8');
  const data = JSON.parse(content);
  
  const webCount = data.web?.reduce((count, category) => count + (category.children?.length || 0), 0) || 0;
  const nativeCount = data.native?.reduce((count, category) => count + (category.children?.length || 0), 0) || 0;
  
  console.log(`✅ Content verified: ${webCount} web + ${nativeCount} native components`);
  console.log(`📊 File size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`📅 Last modified: ${stats.mtime.toISOString()}`);

  console.log('\n🎉 Build process completed successfully!');
  console.log('\n📋 Summary:');
  console.log(`  • Built MagentaA11y project`);
  console.log(`  • Copied fresh content.json (${webCount} web + ${nativeCount} native components)`);
  console.log(`  • Built MCP server with 11 tools`);
  console.log(`  • Reset submodule to clean state`);
  console.log('\n✨ Your MCP server is ready to use!');

} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  process.exit(1);
}