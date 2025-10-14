#!/usr/bin/env node

/**
 * Development Server with Hot Module Replacement
 *
 * Provides enhanced development experience with:
 * - Hot Module Replacement (HMR)
 * - Live CSS injection
 * - Performance monitoring
 * - Error overlay
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const { WebSocketServer } = require('ws');
const { execSync } = require('child_process');

// ============================================================================
// HMR Configuration
// ============================================================================

const HMR_CONFIG = {
  port: 3000,
  wsPort: 3001,
  reloadDelay: 100,
  errorOverlayPort: 3002,
  enableHMR: true,
  enableCSSInjection: true,
  enableErrorOverlay: true,
  enablePerformanceMonitoring: true
};

// ============================================================================
// HMR Server Implementation
// ============================================================================

class HMREngine {
  constructor() {
    this.clients = new Set();
    this.wss = null;
    this.fileWatchers = new Map();
    this.lastBuild = Date.now();
    this.building = false;
    this.setupWebSocketServer();
  }

  setupWebSocketServer() {
    this.wss = new WebSocketServer({ port: HMR_CONFIG.wsPort });

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log('🔌 HMR client connected');

      ws.on('close', () => {
        this.clients.delete(ws);
      });

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(message, ws);
        } catch (error) {
          console.error('❌ Failed to parse HMR message:', error);
        }
      });
    });

    console.log(`🔌 HMR WebSocket server running on port ${HMR_CONFIG.wsPort}`);
  }

  handleMessage(message, ws) {
    switch (message.type) {
      case 'connected':
        this.sendToClient(ws, {
          type: 'connected',
          data: { timestamp: Date.now() }
        });
        break;
      case 'error':
        this.broadcastError(message.data);
        break;
      default:
        console.log('📨 Unknown HMR message:', message.type);
    }
  }

  broadcastUpdate(update) {
    const message = {
      type: 'update',
      data: update,
      timestamp: Date.now()
    };

    this.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  broadcastError(error) {
    const message = {
      type: 'error',
      data: error,
      timestamp: Date.now()
    };

    this.clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }

  sendToClient(client, message) {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  }

  notifyBuildStart() {
    this.building = true;
    this.broadcastUpdate({
      type: 'build-start',
      data: { timestamp: Date.now() }
    });
  }

  notifyBuildComplete(files) {
    this.building = false;
    this.lastBuild = Date.now();

    this.broadcastUpdate({
      type: 'build-complete',
      data: {
        files,
        timestamp: Date.now()
      }
    });
  }

  notifyFileChange(filePath) {
    this.broadcastUpdate({
      type: 'file-change',
      data: {
        path: filePath,
        timestamp: Date.now()
      }
    });
  }

  notifyCSSUpdate(cssContent) {
    this.broadcastUpdate({
      type: 'css-update',
      data: {
        css: cssContent,
        timestamp: Date.now()
      }
    });
  }

  notifyError(error) {
    this.broadcastError({
      message: error.message,
      stack: error.stack,
      file: error.file || null,
      line: error.line || null,
      column: error.column || null
    });
  }

  getStatus() {
    return {
      connectedClients: this.clients.size,
      isBuilding: this.building,
      lastBuild: this.lastBuild,
      uptime: Date.now() - this.startTime
    };
  }
}

// ============================================================================
// File Watcher
// ============================================================================

class FileWatcher {
  constructor(hmrEngine) {
    this.hmrEngine = hmrEngine;
    this.watchers = new Map();
  }

  startWatching() {
    console.log('👁️  Starting file watchers...');

    // Watch TypeScript files
    this.watchTypeScriptFiles();

    // Watch CSS files
    this.watchCSSFiles();

    // Watch build output
    this.watchBuildOutput();
  }

  watchTypeScriptFiles() {
    const tsWatcher = this.createWatcher('src/ts', ['**/*.ts'], (event, filePath) => {
      if (event === 'change') {
        console.log(`📝 TypeScript file changed: ${path.relative(process.cwd(), filePath)}`);
        this.hmrEngine.notifyFileChange(path.relative(process.cwd(), filePath));
        this.triggerRebuild();
      }
    });

    this.watchers.set('typescript', tsWatcher);
  }

  watchCSSFiles() {
    const cssWatcher = this.createWatcher('src/css', ['**/*.css'], (event, filePath) => {
      if (event === 'change' && HMR_CONFIG.enableCSSInjection) {
        console.log(`🎨 CSS file changed: ${path.relative(process.cwd(), filePath)}`);
        this.injectCSSUpdate(filePath);
      }
    });

    this.watchers.set('css', cssWatcher);
  }

  watchBuildOutput() {
    const buildWatcher = this.createWatcher('assets/js', ['**/*.js', '**/*.js.map'], (event, filePath) => {
      if (event === 'change' && HMR_CONFIG.enableHMR) {
        console.log(`📦 Build output changed: ${path.relative(process.cwd(), filePath)}`);
        this.hmrEngine.notifyFileChange(path.relative(process.cwd(), filePath));
      }
    });

    this.watchers.set('build', buildWatcher);
  }

  createWatcher(dir, patterns, callback) {
    const chokidar = require('chokidar');

    const watcher = chokidar.watch(patterns.map(pattern => path.join(dir, pattern)), {
      ignored: /node_modules/,
      persistent: true
    });

    watcher.on('all', callback);
    return watcher;
  }

  injectCSSUpdate(filePath) {
    try {
      const cssContent = fs.readFileSync(filePath, 'utf8');
      this.hmrEngine.notifyCSSUpdate(cssContent);
    } catch (error) {
      console.error(`❌ Failed to read CSS file ${filePath}:`, error);
    }
  }

  triggerRebuild() {
    try {
      console.log('🔄 Triggering TypeScript rebuild...');
      execSync('npm run build:ts', { stdio: 'pipe' });
      console.log('✅ TypeScript rebuild completed');
    } catch (error) {
      console.error('❌ TypeScript rebuild failed:', error.message);
      this.hmrEngine.notifyError(error);
    }
  }

  stop() {
    this.watchers.forEach(watcher => {
      watcher.close();
    });
    this.watchers.clear();
  }
}

// ============================================================================
// Error Overlay Server
// ============================================================================

class ErrorOverlayServer {
  constructor() {
    this.server = null;
    this.setupServer();
  }

  setupServer() {
    this.server = http.createServer((req, res) => {
      if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(this.getOverlayHTML());
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    this.server.listen(HMR_CONFIG.errorOverlayPort, () => {
      console.log(`🚨 Error overlay server running on port ${HMR_CONFIG.errorOverlayPort}`);
    });
  }

  getOverlayHTML() {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Development Error</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: rgba(220, 53, 69, 0.95);
      color: white;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .error-container {
      max-width: 800px;
      width: 90%;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .error-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #ff6b6b;
    }
    .error-message {
      font-size: 16px;
      margin-bottom: 20px;
      white-space: pre-wrap;
    }
    .error-location {
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 14px;
      background: rgba(0, 0, 0, 0.3);
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 20px;
    }
    .close-button {
      background: #dc3545;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .close-button:hover {
      background: #c82333;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <div class="error-title">⚠️ Build Error</div>
    <div class="error-message" id="errorMessage">Waiting for error details...</div>
    <div class="error-location" id="errorLocation"></div>
    <button class="close-button" onclick="window.close()">Close</button>
  </div>

  <script>
    let ws;

    function connectWebSocket() {
      ws = new WebSocket('ws://localhost:3001');

      ws.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.type === 'error') {
          const error = data.data;
          document.getElementById('errorMessage').textContent = error.message;
          document.getElementById('errorLocation').textContent =
            error.file ? \`File: \${error.file}:\${error.line ? ':' + error.line : ''}\` : '';
        }
      };

      ws.onclose = function() {
        setTimeout(connectWebSocket, 1000);
      };

      ws.onerror = function() {
        setTimeout(connectWebSocket, 5000);
      };
    }

    connectWebSocket();

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (document.visibilityState === 'visible') {
        window.close();
      }
    }, 10000);
  </script>
</body>
</html>`;
  }

  showError(error) {
    // Error overlay will receive this via WebSocket
    console.error('🚨 Build error:', error.message);
  }

  stop() {
    if (this.server) {
      this.server.close();
    }
  }
}

// ============================================================================
// Development Server
// ============================================================================

class DevServer {
  constructor() {
    this.hmrEngine = new HMREngine();
    this.fileWatcher = null;
    this.errorOverlay = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      console.log('⚠️ Development server is already running');
      return;
    }

    console.log('🚀 Starting enhanced development server...');

    try {
      // Start HMR engine
      this.hmrEngine.startTime = Date.now();

      // Start file watchers
      this.fileWatcher = new FileWatcher(this.hmrEngine);
      this.fileWatcher.startWatching();

      // Start error overlay if enabled
      if (HMR_CONFIG.enableErrorOverlay) {
        this.errorOverlay = new ErrorOverlayServer();
      }

      // Generate HMR client script
      this.generateHMRClient();

      this.isRunning = true;
      console.log('✅ Enhanced development server started successfully');
      console.log(`📊 Status: ${JSON.stringify(this.hmrEngine.getStatus(), null, 2)}`);

    } catch (error) {
      console.error('❌ Failed to start development server:', error);
      this.stop();
      process.exit(1);
    }
  }

  stop() {
    if (!this.isRunning) {
      return;
    }

    console.log('🛑 Stopping development server...');

    if (this.fileWatcher) {
      this.fileWatcher.stop();
    }

    if (this.errorOverlay) {
      this.errorOverlay.stop();
    }

    if (this.hmrEngine.wss) {
      this.hmrEngine.wss.close();
    }

    this.isRunning = false;
    console.log('✅ Development server stopped');
  }

  generateHMRClient() {
    const hmrClient = `
// HMR Client Script
(function() {
  let socket;
  let reconnectTimer;

  function connect() {
    socket = new WebSocket('ws://localhost:${HMR_CONFIG.wsPort}');

    socket.onopen = function() {
      console.log('🔌 Connected to HMR server');
      socket.send(JSON.stringify({ type: 'connected' }));
    };

    socket.onmessage = function(event) {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'update':
          handleUpdate(data.data);
          break;
        case 'css-update':
          handleCSSUpdate(data.data);
          break;
        case 'build-start':
          console.log('🔄 Build started...');
          break;
        case 'build-complete':
          console.log('✅ Build completed');
          break;
        case 'file-change':
          console.log('📝 File changed:', data.data.path);
          break;
        case 'error':
          handleError(data.data);
          break;
      }
    };

    socket.onclose = function() {
      console.log('🔌 HMR connection lost, reconnecting...');
      reconnectTimer = setTimeout(connect, 1000);
    };

    socket.onerror = function() {
      console.error('🔌 HMR connection error');
    };
  }

  function handleUpdate(update) {
    if (update.files && update.files.includes('main.js')) {
      console.log('🔄 Hot reloading application...');
      setTimeout(() => {
        window.location.reload();
      }, ${HMR_CONFIG.reloadDelay});
    }
  }

  function handleCSSUpdate(update) {
    if (update.css) {
      // Remove existing style tags for this file
      const existingStyles = document.querySelectorAll('style[data-hmr]');
      existingStyles.forEach(style => style.remove());

      // Add new CSS
      const style = document.createElement('style');
      style.setAttribute('data-hmr', 'true');
      style.textContent = update.css;
      document.head.appendChild(style);

      console.log('🎨 CSS hot updated');
    }
  }

  function handleError(error) {
    console.error('❌ Build error:', error.message);

    // Show error overlay
    if (${HMR_CONFIG.enableErrorOverlay}) {
      const overlay = window.open('', 'error', 'width=600,height=400');
      if (overlay) {
        overlay.focus();
      }
    }
  }

  // Start connection
  connect();

  // Cleanup on page unload
  window.addEventListener('beforeunload', function() {
    if (socket) {
      socket.close();
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }
  });
})();
`;

    // Write HMR client to a temporary file that can be loaded
    const hmrClientPath = 'hmr-client.js';
    fs.writeFileSync(hmrClientPath, hmrClient);
    console.log('📝 HMR client script generated');
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      hmr: this.hmrEngine.getStatus(),
      config: HMR_CONFIG
    };
  }
}

// ============================================================================
// CLI Interface
// ============================================================================

function showHelp() {
  console.log('🚀 Enhanced Development Server');
  console.log('\nUsage: node scripts/dev-server.js [command]\n');
  console.log('Commands:');
  console.log('  start     Start the development server (default)');
  console.log('  stop      Stop the development server');
  console.log('  status    Show server status');
  console.log('  help      Show this help message');
}

function main() {
  const command = process.argv[2] || 'start';

  if (command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  const devServer = new DevServer();

  switch (command) {
    case 'start':
      devServer.start();
      break;
    case 'stop':
      devServer.stop();
      break;
    case 'status':
      console.log('📊 Server Status:');
      console.log(JSON.stringify(devServer.getStatus(), null, 2));
      break;
    default:
      console.error(`❌ Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development server...');
    devServer.stop();
    process.exit(0);
  });
}

// Run the server
if (require.main === module) {
  main();
}

module.exports = { DevServer, HMR_CONFIG };