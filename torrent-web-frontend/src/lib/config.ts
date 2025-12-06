// Configuration for the app

// Extend Window interface for Electron API
declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean;
      platform: string;
      getBackendUrl: () => string;
    };
  }
}

// Get the backend URL based on environment
export function getBackendUrl(): string {
  // Check if running in Electron
  if (typeof window !== 'undefined' && window.electronAPI?.isElectron) {
    return window.electronAPI.getBackendUrl();
  }
  
  // Default to localhost for development
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
}

// Get WebSocket URL
export function getWebSocketUrl(downloadId: string): string {
  const backendUrl = getBackendUrl();
  const wsUrl = backendUrl.replace('http://', 'ws://').replace('https://', 'wss://');
  return `${wsUrl}/ws/${downloadId}`;
}

// Check if running in Electron
export function isElectron(): boolean {
  if (typeof window !== 'undefined') {
    return window.electronAPI?.isElectron ?? false;
  }
  return false;
}

