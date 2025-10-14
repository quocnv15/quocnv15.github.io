#!/usr/bin/env node

/**
 * Enhanced Development Environment with HMR Integration
 *
 * This script provides a complete development environment that includes:
 * - Hot Module Replacement (HMR) for TypeScript and CSS
 * - Jekyll server with LiveReload
 * - Performance monitoring
 * - Error overlay
 * - Development tools integration
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const DEV_CONFIG = {
  jekyllPort: 4001,
  hmrPort: 3000,
  errorOverlayPort: 3002,
  enableHMR: true,
  enablePerformance: true,
  enableErrorOverlay: true
};

class EnhancedDevServer {
  constructor() {
    this.processes = new Map();
    this.isShuttingDown = false;
    this.setupCleanupHandlers();
  }

  setupCleanupHandlers() {
    const cleanup = () => {
      if (!this.isShuttingDown) {
        this.isShuttingDown = true;
        console.log('\n🛑 Shutting down enhanced development server...');
        this.stopAll();
        process.exit(0);
      }
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('exit', cleanup);
  }

  startProcess(name, command, args = [], options = {}) {
    console.log(`🚀 Starting ${name}...`);

    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    this.processes.set(name, process);

    process.on('error', (error) => {
      console.error(`❌ Failed to start ${name}:`, error.message);
    });

    process.on('close', (code) => {
      if (code !== 0 && !this.isShuttingDown) {
        console.error(`❌ ${name} exited with code ${code}`);
      }
      this.processes.delete(name);
    });

    return process;
  }

  async start() {
    console.log('🌟 Starting Enhanced Development Environment...\n');

    try {
      // Step 1: Clean up any existing HMR client script
      if (fs.existsSync('hmr-client.js')) {
        fs.unlinkSync('hmr-client.js');
      }

      // Step 2: Start HMR Server if enabled
      if (DEV_CONFIG.enableHMR) {
        this.startProcess('hmr', 'node', ['scripts/dev-server.js', 'start'], {
          env: { ...process.env, NODE_ENV: 'development' }
        });

        // Wait a moment for HMR server to start
        await this.sleep(1000);
      }

      // Step 3: Start Jekyll with LiveReload
      console.log(`📝 Starting Jekyll server on port ${DEV_CONFIG.jekyllPort}...`);
      this.startProcess('jekyll', 'bundle', ['exec', 'jekyll', 'serve', '--livereload', `--port=${DEV_CONFIG.jekyllPort}`]);

      // Step 4: Start TypeScript watcher
      console.log('📝 Starting TypeScript watcher...');
      this.startProcess('typescript', 'npm', ['run', 'build:ts:watch']);

      // Give servers time to start
      await this.sleep(2000);

      console.log('\n✅ Enhanced Development Environment is ready!');
      console.log(`🌐 Jekyll server: http://localhost:${DEV_CONFIG.jekyllPort}`);

      if (DEV_CONFIG.enableHMR) {
        console.log(`🔌 HMR WebSocket: ws://localhost:${DEV_CONFIG.hmrPort}`);
        console.log(`🚨 Error overlay: http://localhost:${DEV_CONFIG.errorOverlayPort}`);
      }

      console.log('\n📋 Available commands:');
      console.log('  • Ctrl+C: Stop all servers');
      console.log('  • npm run dev:hmr:status: Check HMR status');
      console.log('  • npm run dev:health: Check project health');
      console.log('  • npm run dev:size: Check bundle size');
      console.log('\n🎯 Development features enabled:');

      const features = [];
      if (DEV_CONFIG.enableHMR) features.push('✅ Hot Module Replacement');
      if (DEV_CONFIG.enablePerformance) features.push('✅ Performance Monitoring');
      if (DEV_CONFIG.enableErrorOverlay) features.push('✅ Error Overlay');
      features.push('✅ LiveReload');
      features.push('✅ TypeScript Watcher');

      features.forEach(feature => console.log(`    ${feature}`));
      console.log('');

    } catch (error) {
      console.error('❌ Failed to start enhanced development environment:', error);
      this.stopAll();
      process.exit(1);
    }
  }

  stopAll() {
    console.log('🛑 Stopping all development servers...');

    for (const [name, process] of this.processes) {
      console.log(`  🛑 Stopping ${name}...`);
      try {
        process.kill('SIGTERM');
      } catch (error) {
        console.error(`    ⚠️  Failed to stop ${name}:`, error.message);
      }
    }

    // Clean up HMR client script if it exists
    if (fs.existsSync('hmr-client.js')) {
      try {
        fs.unlinkSync('hmr-client.js');
        console.log('  🧹 Cleaned up HMR client script');
      } catch (error) {
        console.error(`    ⚠️  Failed to clean up HMR client script:`, error.message);
      }
    }

    console.log('✅ All development servers stopped');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI Interface
function showHelp() {
  console.log('🌟 Enhanced Development Environment');
  console.log('\nUsage: node scripts/enhanced-dev.js [command]\n');
  console.log('Commands:');
  console.log('  start     Start enhanced development environment (default)');
  console.log('  stop      Stop all development servers');
  console.log('  help      Show this help message');
  console.log('\nFeatures:');
  console.log('  • Hot Module Replacement (HMR) for TypeScript and CSS');
  console.log('  • Jekyll server with LiveReload');
  console.log('  • Performance monitoring');
  console.log('  • Error overlay for build errors');
  console.log('  • Automatic cleanup on shutdown');
}

async function main() {
  const command = process.argv[2] || 'start';

  if (command === '--help' || command === '-h' || command === 'help') {
    showHelp();
    return;
  }

  const devServer = new EnhancedDevServer();

  switch (command) {
    case 'start':
      await devServer.start();
      break;
    case 'stop':
      devServer.stopAll();
      break;
    default:
      console.error(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

// Run the enhanced development server
if (require.main === module) {
  main();
}

module.exports = { EnhancedDevServer, DEV_CONFIG };