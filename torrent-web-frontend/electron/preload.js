const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// specific Electron APIs without exposing the entire API
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  isElectron: true,
  platform: process.platform,
  
  // Backend URL - always localhost since backend runs locally
  getBackendUrl: () => 'http://127.0.0.1:8000',
  
  // IPC communication (if needed in the future)
  send: (channel, data) => {
    const validChannels = ['app-action'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  receive: (channel, func) => {
    const validChannels = ['app-response'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
});

// Log when preload script is loaded
console.log('Preload script loaded successfully');

