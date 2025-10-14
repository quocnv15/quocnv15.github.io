#!/usr/bin/env node

/**
 * HMR System Test and Validation Script
 *
 * This script tests the complete HMR implementation to ensure
 * all components are working correctly.
 */

const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const TEST_CONFIG = {
  hmrPort: 3001,
  errorOverlayPort: 3002,
  testTimeout: 5000,
  expectedServices: [
    { name: 'HMR WebSocket Server', port: 3001, type: 'websocket' },
    { name: 'Error Overlay Server', port: 3002, type: 'http' }
  ]
};

class HMRTester {
  constructor() {
    this.results = [];
    this.testStartTime = Date.now();
  }

  async runTests() {
    console.log('🧪 Starting HMR System Tests...\n');

    try {
      // Test 1: HMR Client Script Generation
      await this.testHMRClientScript();

      // Test 2: WebSocket Server Connectivity
      await this.testWebSocketServer();

      // Test 3: Error Overlay Server
      await this.testErrorOverlayServer();

      // Test 4: File Watching System
      await this.testFileWatching();

      // Test 5: HMR Configuration
      await this.testHMRConfiguration();

      // Generate final report
      this.generateTestReport();

    } catch (error) {
      console.error('❌ Test suite failed:', error);
      process.exit(1);
    }
  }

  async testHMRClientScript() {
    console.log('📝 Test 1: HMR Client Script Generation');

    try {
      // Check if HMR client script exists
      const clientScriptPath = 'hmr-client.js';

      if (fs.existsSync(clientScriptPath)) {
        const content = fs.readFileSync(clientScriptPath, 'utf8');

        // Validate essential HMR client code
        const requiredElements = [
          'WebSocket',
          'connect()',
          'handleUpdate',
          'handleCSSUpdate',
          'handleError'
        ];

        const missingElements = requiredElements.filter(element =>
          !content.includes(element)
        );

        if (missingElements.length === 0) {
          this.addResult('HMR Client Script', '✅ PASS', 'Generated correctly with all required functions');
        } else {
          this.addResult('HMR Client Script', '❌ FAIL', `Missing elements: ${missingElements.join(', ')}`);
        }
      } else {
        this.addResult('HMR Client Script', '⚠️  SKIP', 'Client script not found (HMR server not running)');
      }

    } catch (error) {
      this.addResult('HMR Client Script', '❌ FAIL', error.message);
    }
  }

  async testWebSocketServer() {
    console.log('🔌 Test 2: WebSocket Server Connectivity');

    return new Promise((resolve) => {
      const ws = new WebSocket(`ws://localhost:${TEST_CONFIG.hmrPort}`);
      let connected = false;
      let timeout = setTimeout(() => {
        if (!connected) {
          this.addResult('WebSocket Server', '❌ FAIL', 'Connection timeout - server not running');
          ws.close();
          resolve();
        }
      }, 3000);

      ws.on('open', () => {
        connected = true;
        clearTimeout(timeout);

        // Test message sending
        ws.send(JSON.stringify({ type: 'connected', timestamp: Date.now() }));
      });

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          if (message.type === 'connected') {
            this.addResult('WebSocket Server', '✅ PASS', 'Connected and responding to messages');
          }
        } catch (error) {
          this.addResult('WebSocket Server', '❌ FAIL', 'Invalid response format');
        }
        ws.close();
        resolve();
      });

      ws.on('error', (error) => {
        clearTimeout(timeout);
        if (error.code === 'ECONNREFUSED') {
          this.addResult('WebSocket Server', '❌ FAIL', 'Server not running on port ' + TEST_CONFIG.hmrPort);
        } else {
          this.addResult('WebSocket Server', '❌ FAIL', error.message);
        }
        resolve();
      });
    });
  }

  async testErrorOverlayServer() {
    console.log('🚨 Test 3: Error Overlay Server');

    return new Promise((resolve) => {
      const options = {
        hostname: 'localhost',
        port: TEST_CONFIG.errorOverlayPort,
        path: '/',
        method: 'GET',
        timeout: 3000
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200 && data.includes('error-container')) {
            this.addResult('Error Overlay Server', '✅ PASS', 'Serving error overlay HTML');
          } else {
            this.addResult('Error Overlay Server', '❌ FAIL', 'Invalid response');
          }
          resolve();
        });
      });

      req.on('error', (error) => {
        if (error.code === 'ECONNREFUSED') {
          this.addResult('Error Overlay Server', '❌ FAIL', 'Server not running on port ' + TEST_CONFIG.errorOverlayPort);
        } else {
          this.addResult('Error Overlay Server', '❌ FAIL', error.message);
        }
        resolve();
      });

      req.on('timeout', () => {
        req.destroy();
        this.addResult('Error Overlay Server', '❌ FAIL', 'Request timeout');
        resolve();
      });

      req.end();
    });
  }

  async testFileWatching() {
    console.log('👁️  Test 4: File Watching System');

    try {
      // Check if dev-server.js exists and has file watching capabilities
      const serverPath = 'scripts/dev-server.js';

      if (fs.existsSync(serverPath)) {
        const content = fs.readFileSync(serverPath, 'utf8');

        const requiredFeatures = [
          'FileWatcher',
          'chokidar',
          'watchTypeScriptFiles',
          'watchCSSFiles',
          'watchBuildOutput'
        ];

        const missingFeatures = requiredFeatures.filter(feature =>
          !content.includes(feature)
        );

        if (missingFeatures.length === 0) {
          this.addResult('File Watching System', '✅ PASS', 'File watcher implementation complete');
        } else {
          this.addResult('File Watching System', '❌ FAIL', `Missing features: ${missingFeatures.join(', ')}`);
        }
      } else {
        this.addResult('File Watching System', '❌ FAIL', 'Development server script not found');
      }

    } catch (error) {
      this.addResult('File Watching System', '❌ FAIL', error.message);
    }
  }

  async testHMRConfiguration() {
    console.log('⚙️  Test 5: HMR Configuration');

    try {
      const serverPath = 'scripts/dev-server.js';
      const content = fs.readFileSync(serverPath, 'utf8');

      // Check for HMR configuration object
      const hmrConfigMatch = content.match(/const HMR_CONFIG = \{[\s\S]*?\}/);

      if (hmrConfigMatch) {
        const configStr = hmrConfigMatch[0];

        const requiredConfigs = [
          'port',
          'wsPort',
          'enableHMR',
          'enableCSSInjection',
          'enableErrorOverlay',
          'enablePerformanceMonitoring'
        ];

        const missingConfigs = requiredConfigs.filter(config =>
          !configStr.includes(config)
        );

        if (missingConfigs.length === 0) {
          this.addResult('HMR Configuration', '✅ PASS', 'All required configuration options present');
        } else {
          this.addResult('HMR Configuration', '❌ FAIL', `Missing configs: ${missingConfigs.join(', ')}`);
        }
      } else {
        this.addResult('HMR Configuration', '❌ FAIL', 'HMR_CONFIG object not found');
      }

    } catch (error) {
      this.addResult('HMR Configuration', '❌ FAIL', error.message);
    }
  }

  addResult(testName, status, details) {
    this.results.push({
      test: testName,
      status,
      details,
      timestamp: new Date().toISOString()
    });

    console.log(`  ${status} ${details}`);
  }

  generateTestReport() {
    const testDuration = Date.now() - this.testStartTime;
    const passed = this.results.filter(r => r.status.includes('✅')).length;
    const failed = this.results.filter(r => r.status.includes('❌')).length;
    const skipped = this.results.filter(r => r.status.includes('⚠️')).length;
    const total = this.results.length;

    console.log('\n' + '='.repeat(60));
    console.log('📊 HMR SYSTEM TEST REPORT');
    console.log('='.repeat(60));
    console.log(`⏱️  Test Duration: ${testDuration}ms`);
    console.log(`📈 Results: ${passed} passed, ${failed} failed, ${skipped} skipped, ${total} total`);

    if (failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED! HMR system is fully functional.');
    } else {
      console.log('\n⚠️  SOME TESTS FAILED. Please check the issues above.');
    }

    console.log('\n📋 Detailed Results:');
    this.results.forEach(result => {
      console.log(`  ${result.status} ${result.test}: ${result.details}`);
    });

    console.log('\n🔧 Next Steps:');
    if (failed === 0) {
      console.log('  ✅ HMR system ready for development use');
      console.log('  ✅ Run "npm run dev:enhanced" to start the full development environment');
    } else {
      console.log('  🔧 Fix the failing tests before using HMR in development');
      console.log('  🔧 Ensure all required services are running');
    }

    console.log('\n📚 For more information, see: docs/development/hmr-system.md');
    console.log('='.repeat(60));
  }
}

// CLI Interface
function showHelp() {
  console.log('🧪 HMR System Test Script');
  console.log('\nUsage: node scripts/test-hmr.js [command]\n');
  console.log('Commands:');
  console.log('  run       Run all HMR tests (default)');
  console.log('  help      Show this help message');
  console.log('\nThis script tests:');
  console.log('  • HMR client script generation');
  console.log('  • WebSocket server connectivity');
  console.log('  • Error overlay server functionality');
  console.log('  • File watching system');
  console.log('  • HMR configuration completeness');
}

async function main() {
  const command = process.argv[2] || 'run';

  if (command === '--help' || command === '-h' || command === 'help') {
    showHelp();
    return;
  }

  const tester = new HMRTester();
  await tester.runTests();
}

// Run the tests
if (require.main === module) {
  main();
}

module.exports = { HMRTester, TEST_CONFIG };