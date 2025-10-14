#!/usr/bin/env node

/**
 * Development CLI Helper
 *
 * Provides convenient commands for common development tasks.
 * Usage: node scripts/dev-cli.js [command] [options]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ============================================================================
// CLI Configuration
// ============================================================================

const COMMANDS = {
  'build': {
    description: 'Build the project with detailed output',
    handler: handleBuild
  },
  'test': {
    description: 'Run tests with coverage',
    handler: handleTest
  },
  'lint': {
    description: 'Run ESLint (if available)',
    handler: handleLint
  },
  'clean': {
    description: 'Clean all build artifacts',
    handler: handleClean
  },
  'serve': {
    description: 'Start development server',
    handler: handleServe
  },
  'analyze': {
    description: 'Analyze bundle size and dependencies',
    handler: handleAnalyze
  },
  'check': {
    description: 'Run all quality checks',
    handler: handleCheck
  },
  'size': {
    description: 'Check current bundle size',
    handler: handleSize
  },
  'deps': {
    description: 'Check for outdated dependencies',
    handler: handleDeps
  },
  'health': {
    description: 'Run project health check',
    handler: handleHealth
  },
  'perf': {
    description: 'Run performance audit',
    handler: handlePerf
  },
  'docs': {
    description: 'Generate documentation',
    handler: handleDocs
  }
};

// ============================================================================
// Command Handlers
// ============================================================================

function handleBuild() {
  console.log('🏗️  Building project...');

  try {
    // Clean first
    console.log('🧹 Cleaning previous build...');
    execSync('npm run clean', { stdio: 'inherit' });

    // Type check
    console.log('🔍 Running type checking...');
    execSync('npm run check:types', { stdio: 'inherit' });

    // Build
    console.log('📦 Building TypeScript...');
    execSync('npm run build:ts', { stdio: 'inherit' });

    // Check bundle size
    const size = getBundleSize();
    console.log(`✅ Build completed successfully!`);
    console.log(`📊 Bundle size: ${formatBytes(size.bytes)} (${size.kb}KB)`);

    if (size.kb > 15) {
      console.warn(`⚠️  Bundle size exceeds 15KB target`);
    } else {
      console.log(`✅ Bundle size within target (< 15KB)`);
    }

  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

function handleTest() {
  console.log('🧪 Running test suite...');

  try {
    execSync('npm run test:unit', { stdio: 'inherit' });

    try {
      execSync('npm run test:coverage', { stdio: 'inherit' });
      console.log('✅ All tests passed with coverage');
    } catch (error) {
      console.log('⚠️  Tests passed but coverage check failed');
    }

  } catch (error) {
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
  }
}

function handleLint() {
  console.log('🔍 Running linter...');

  try {
    execSync('npm run lint', { stdio: 'inherit' });
    console.log('✅ No linting issues found');
  } catch (error) {
    if (error.message.includes('ESLint not configured')) {
      console.log('ℹ️  ESLint not configured - install with npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin');
    } else {
      console.error('❌ Linting failed:', error.message);
      process.exit(1);
    }
  }
}

function handleClean() {
  console.log('🧹 Cleaning build artifacts...');

  try {
    execSync('npm run clean', { stdio: 'inherit' });
    console.log('✅ Build artifacts cleaned');
  } catch (error) {
    console.error('❌ Clean failed:', error.message);
    process.exit(1);
  }
}

function handleServe() {
  console.log('🌐 Starting development server...');

  try {
    execSync('npm run dev', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to start dev server:', error.message);
    process.exit(1);
  }
}

function handleAnalyze() {
  console.log('📊 Analyzing bundle...');

  try {
    // Build first
    execSync('npm run build:ts', { stdio: 'inherit' });

    const size = getBundleSize();
    const modules = countModules();

    console.log('\n📈 Bundle Analysis:');
    console.log(`   Size: ${formatBytes(size.bytes)} (${size.kb}KB)`);
    console.log(`   Modules: ${modules}`);
    console.log(`   Gzipped: ~${Math.round(size.bytes * 0.4)}B (estimated)`);

    // Check for potential optimizations
    if (size.kb > 10) {
      console.log('\n💡 Optimization suggestions:');
      console.log('   - Consider tree shaking');
      console.log('   - Check for unused dependencies');
      console.log('   - Implement code splitting');
    }

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

function handleCheck() {
  console.log('🔍 Running all quality checks...');

  const checks = [
    { name: 'Type checking', command: 'npm run check:types' },
    { name: 'Unit tests', command: 'npm run test:unit' },
    { name: 'Build test', command: 'npm run build:ts' }
  ];

  let passed = 0;
  let failed = 0;

  for (const check of checks) {
    console.log(`\n🔍 Running ${check.name}...`);

    try {
      execSync(check.command, { stdio: 'pipe' });
      console.log(`✅ ${check.name} passed`);
      passed++;
    } catch (error) {
      console.log(`❌ ${check.name} failed`);
      failed++;
    }
  }

  console.log(`\n📊 Quality Check Results:`);
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);

  if (failed > 0) {
    console.log(`\n❌ Quality checks failed`);
    process.exit(1);
  } else {
    console.log(`\n✅ All quality checks passed`);
  }
}

function handleSize() {
  try {
    const size = getBundleSize();
    const target = 15;
    const percentage = (size.kb / target * 100).toFixed(1);

    console.log('📊 Bundle Size Report:');
    console.log(`   Current: ${size.kb}KB (${formatBytes(size.bytes)})`);
    console.log(`   Target:  ${target}KB`);
    console.log(`   Usage:   ${percentage}%`);

    if (size.kb <= target) {
      console.log(`\n✅ Bundle size within target`);
    } else {
      console.log(`\n⚠️  Bundle size exceeds target by ${size.kb - target}KB`);
    }

    // Size breakdown
    console.log('\n📋 Size Breakdown:');
    console.log(`   Main bundle: ${size.kb}KB`);
    console.log(`   Source maps: ${Math.round(size.mapSize / 1024)}KB`);

  } catch (error) {
    console.error('❌ Failed to get bundle size:', error.message);
    process.exit(1);
  }
}

function handleDeps() {
  console.log('📦 Checking dependencies...');

  try {
    // Check for outdated packages
    execSync('npm outdated', { stdio: 'inherit' });

    // Check for security vulnerabilities
    try {
      execSync('npm audit --audit-level=moderate', { stdio: 'inherit' });
      console.log('✅ No security vulnerabilities found');
    } catch (error) {
      if (!error.message.includes('found 0 vulnerabilities')) {
        console.log('⚠️  Security vulnerabilities found - run npm audit fix');
      }
    }

  } catch (error) {
    if (error.message.includes('Your dependencies are up to date')) {
      console.log('✅ All dependencies are up to date');
    } else {
      console.error('❌ Dependency check failed:', error.message);
      process.exit(1);
    }
  }
}

function handleHealth() {
  console.log('🏥 Running project health check...');

  const healthChecks = [
    {
      name: 'Package.json exists',
      check: () => fs.existsSync('package.json')
    },
    {
      name: 'TypeScript config exists',
      check: () => fs.existsSync('tsconfig.json')
    },
    {
      name: 'Source files exist',
      check: () => fs.existsSync('src/ts/main.ts')
    },
    {
      name: 'Build script exists',
      check: () => {
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        return pkg.scripts && pkg.scripts.build;
      }
    },
    {
      name: 'Bundle size check',
      check: () => {
        try {
          const size = getBundleSize();
          return size.kb <= 15;
        } catch {
          return false;
        }
      }
    },
    {
      name: 'Dependencies installed',
      check: () => fs.existsSync('node_modules')
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const check of healthChecks) {
    try {
      const result = check.check();
      if (result) {
        console.log(`✅ ${check.name}`);
        passed++;
      } else {
        console.log(`❌ ${check.name}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${check.name} (${error.message})`);
      failed++;
    }
  }

  console.log(`\n📊 Health Check Results:`);
  console.log(`   Passed: ${passed}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Score:  ${Math.round(passed / (passed + failed) * 100)}%`);

  if (failed > 0) {
    console.log(`\n❌ Project health check failed`);
    process.exit(1);
  } else {
    console.log(`\n✅ Project is healthy`);
  }
}

function handlePerf() {
  console.log('⚡ Running performance audit...');

  try {
    // Check if Lighthouse CI is available
    execSync('npx lhci autorun', { stdio: 'inherit' });
  } catch (error) {
    if (error.message.includes('command not found')) {
      console.log('ℹ️  Lighthouse CLI not installed');
      console.log('   Install with: npm install -g @lhci/cli@0.12.x');
    } else {
      console.error('❌ Performance audit failed:', error.message);
    }
  }
}

function handleDocs() {
  console.log('📚 Generating documentation...');

  try {
    // Check if TypeDoc is available
    execSync('npx typedoc --out docs src/ts', { stdio: 'inherit' });
    console.log('✅ Documentation generated in docs/ folder');
  } catch (error) {
    if (error.message.includes('command not found')) {
      console.log('ℹ️  TypeDoc not installed');
      console.log('   Install with: npm install --save-dev typedoc');
      console.log('   Basic docs available in agent/ folder');
    } else {
      console.error('❌ Documentation generation failed:', error.message);
    }
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

function getBundleSize() {
  const mainJsPath = 'assets/js/main.js';

  if (!fs.existsSync(mainJsPath)) {
    throw new Error('Bundle not found - run npm run build first');
  }

  const stats = fs.statSync(mainJsPath);
  const mapStats = fs.existsSync('assets/js/main.js.map')
    ? fs.statSync('assets/js/main.js.map')
    : { size: 0 };

  return {
    bytes: stats.size,
    kb: Math.round(stats.size / 1024),
    mapSize: mapStats.size
  };
}

function countModules() {
  // This is a simplified count - in a real implementation,
  // you might parse the bundle to get actual module count
  try {
    const mainJs = fs.readFileSync('assets/js/main.js', 'utf8');
    const moduleMatches = mainJs.match(/__esModule|exports\./g) || [];
    return Math.max(1, Math.floor(moduleMatches.length / 2));
  } catch {
    return 1;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showHelp() {
  console.log('🚀 Jekyll-TypeScript Development CLI');
  console.log('\nUsage: node scripts/dev-cli.js [command] [options]\n');
  console.log('Available commands:');

  Object.entries(COMMANDS).forEach(([cmd, info]) => {
    console.log(`  ${cmd.padEnd(10)} ${info.description}`);
  });

  console.log('\nExamples:');
  console.log('  node scripts/dev-cli.js build');
  console.log('  node scripts/dev-cli.js test');
  console.log('  node scripts/dev-cli.js analyze');
  console.log('  node scripts/dev-cli.js health');
}

// ============================================================================
// Main CLI Logic
// ============================================================================

function main() {
  const command = process.argv[2];

  if (!command) {
    showHelp();
    return;
  }

  if (command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  const commandHandler = COMMANDS[command];

  if (!commandHandler) {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Run --help for available commands');
    process.exit(1);
  }

  commandHandler.handler();
}

// Run the CLI
if (require.main === module) {
  main();
}

module.exports = {
  COMMANDS,
  getBundleSize,
  countModules,
  formatBytes
};