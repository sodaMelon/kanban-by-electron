const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn, execSync } = require('child_process');

const isDev = !app.isPackaged;
let nextServer = null;
let mainWindow = null;

function getNodePath() {
  // Windows에서는 그냥 'node'만 써도 PATH에서 찾음
  if (process.platform === 'win32') {
    return 'node';
  }
  
  // Mac/Linux
  try {
    return execSync('which node', { encoding: 'utf8' }).trim();
  } catch {
    return '/usr/local/bin/node';
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 15, y: 15 },
  });

  const url = 'http://localhost:3000';

  const loadApp = () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.loadURL(url).catch(() => {
        setTimeout(loadApp, 1000);
      });
    }
  };

  if (isDev) {
    loadApp();
    mainWindow.webContents.openDevTools();
  } else {
    startNextServer().then(() => {
      setTimeout(loadApp, 1500);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startNextServer() {
  return new Promise((resolve) => {
    let standaloneDir;

    if (app.isPackaged) {
      standaloneDir = path.join(process.resourcesPath, 'app', '.next', 'standalone');
    } else {
      standaloneDir = path.join(__dirname, '..', '.next', 'standalone');
    }

    const serverScript = path.join(standaloneDir, 'server.js');
    const nodePath = getNodePath();

    nextServer = spawn(nodePath, [serverScript], {
      cwd: standaloneDir,
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: '3000',
        HOSTNAME: 'localhost'
      },
      stdio: ['ignore', 'pipe', 'pipe'],
      detached: false
    });

    let resolved = false;

    const safeResolve = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    if (nextServer.stdout) {
      nextServer.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Ready') || output.includes('started') || output.includes('3000')) {
          safeResolve();
        }
      });

      nextServer.stdout.on('error', () => {});
    }

    if (nextServer.stderr) {
      nextServer.stderr.on('data', () => {});
      nextServer.stderr.on('error', () => {});
    }

    nextServer.on('error', () => {
      safeResolve();
    });

    nextServer.on('close', () => {});

    setTimeout(safeResolve, 3000);
  });
}

function killNextServer() {
  if (nextServer) {
    try {
      nextServer.kill('SIGTERM');
    } catch (e) {
      // Ignore errors when killing
    }
    nextServer = null;
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  killNextServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  killNextServer();
});

app.on('will-quit', () => {
  killNextServer();
});

process.on('uncaughtException', (error) => {
  if (error.code === 'EPIPE') {
    return;
  }
  console.error('Uncaught exception:', error);
});
