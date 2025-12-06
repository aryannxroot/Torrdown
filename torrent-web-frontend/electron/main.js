const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

// Keep a global reference of the window object and python process
let mainWindow = null;
let pythonProcess = null;

// Determine if we're in development or production
// Check multiple indicators since app.isPackaged can be unreliable
const isDev = !app.isPackaged && !process.resourcesPath.includes('resources');

// Get the path to the Python backend executable
function getPythonBackendPath() {
  const platform = process.platform;
  const execName = platform === 'win32' ? 'torrent_server.exe' : 'torrent_server';
  
  // Try production path first (bundled executable)
  const prodPath = path.join(process.resourcesPath, 'python-backend', execName);
  const fs = require('fs');
  
  console.log('Checking for backend at:', prodPath);
  console.log('app.isPackaged:', app.isPackaged);
  console.log('resourcesPath:', process.resourcesPath);
  
  if (fs.existsSync(prodPath)) {
    console.log('Using bundled backend:', prodPath);
    return prodPath;
  }
  
  if (isDev) {
    // In development, run the Python script directly
    console.log('Using development mode (venv python)');
    return null; // Will use python command
  }
  
  console.error('Backend executable not found at:', prodPath);
  return null;
}

// Start the Python backend
function startPythonBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = getPythonBackendPath();
    
    if (backendPath) {
      // Use bundled executable (production)
      console.log('Spawning backend from:', backendPath);
      pythonProcess = spawn(backendPath, [], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONUNBUFFERED: '1' }
      });
    } else {
      // Development mode - run with python from virtual environment
      const backendDir = path.join(__dirname, '..', '..', 'backend');
      const venvPython = process.platform === 'win32' 
        ? path.join(backendDir, 'venv', 'Scripts', 'python.exe')
        : path.join(backendDir, 'venv', 'bin', 'python');
      
      console.log('Spawning backend in dev mode from:', backendDir);
      pythonProcess = spawn(venvPython, ['-m', 'uvicorn', 'main:app', '--host', '127.0.0.1', '--port', '8000'], {
        cwd: backendDir,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONUNBUFFERED: '1' }
      });
    }

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start backend:', err);
      reject(err);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Backend process exited with code ${code}`);
      pythonProcess = null;
    });

    // Wait for the backend to be ready
    waitForBackend(resolve, reject);
  });
}

// Wait for the backend to respond
function waitForBackend(resolve, reject, attempts = 0) {
  const maxAttempts = 30; // 30 seconds timeout
  
  if (attempts >= maxAttempts) {
    reject(new Error('Backend failed to start within timeout'));
    return;
  }

  const req = http.request({
    hostname: '127.0.0.1',
    port: 8000,
    path: '/health',
    method: 'GET',
    timeout: 1000
  }, (res) => {
    console.log('Backend is ready!');
    resolve();
  });

  req.on('error', () => {
    // Backend not ready yet, retry
    setTimeout(() => waitForBackend(resolve, reject, attempts + 1), 1000);
  });

  req.on('timeout', () => {
    req.destroy();
    setTimeout(() => waitForBackend(resolve, reject, attempts + 1), 1000);
  });

  req.end();
}

// Stop the Python backend
function stopPythonBackend() {
  if (pythonProcess) {
    console.log('Stopping Python backend...');
    
    if (process.platform === 'win32') {
      // On Windows, use taskkill to ensure child processes are killed
      spawn('taskkill', ['/pid', pythonProcess.pid, '/f', '/t']);
    } else {
      // On Unix, send SIGTERM
      pythonProcess.kill('SIGTERM');
    }
    
    pythonProcess = null;
  }
}

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#050505',
    titleBarStyle: 'hiddenInset',
    frame: process.platform === 'darwin' ? true : true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    icon: path.join(__dirname, '..', 'public', 'icon.png')
  });

  // Load the app
  if (isDev) {
    // In development, load from Next.js dev server
    mainWindow.loadURL('http://localhost:3000');
    // Open DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from the exported static files
    const indexPath = path.join(__dirname, '..', 'out', 'index.html');
    console.log('Loading frontend from:', indexPath);
    
    mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load frontend:', err);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {
  console.log('Starting Torrdown...');
  
  try {
    // Start the Python backend first
    console.log('Starting Python backend...');
    await startPythonBackend();
    console.log('Python backend started successfully');
    
    // Create the main window
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }

  app.on('activate', () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Stop the backend when all windows are closed
  stopPythonBackend();
  
  // On macOS, apps typically stay open until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopPythonBackend();
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  stopPythonBackend();
});

