// Tauri API wrapper for easier usage in the frontend

// Extend Window interface to include __TAURI__
declare global {
  interface Window {
    __TAURI__?: any;
  }
}

// Check if we're running in Tauri
export const isTauri = typeof window !== 'undefined' && window.__TAURI__ !== undefined;

// Lazy import Tauri APIs only when needed
let tauriImports: {
  invoke?: any;
  getCurrentWindow?: () => any;
  getAllWindows?: () => any;
} = {};

// Initialize Tauri imports
const initTauriImports = async () => {
  if (isTauri && Object.keys(tauriImports).length === 0) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const { getCurrentWindow, getAllWindows } = await import('@tauri-apps/api/window');
      
      tauriImports = {
        invoke,
        getCurrentWindow,
        getAllWindows,
      };
    } catch (error) {
      console.warn('Failed to import Tauri APIs:', error);
    }
  }
};

// Window management utilities
export const windowUtils = {
  async minimize() {
    if (!isTauri) return;
    await initTauriImports();
    const window = tauriImports.getCurrentWindow?.();
    await window?.minimize();
  },

  async maximize() {
    if (!isTauri) return;
    await initTauriImports();
    const window = tauriImports.getCurrentWindow?.();
    await window?.maximize();
  },

  async close() {
    if (!isTauri) return;
    await initTauriImports();
    const window = tauriImports.getCurrentWindow?.();
    await window?.close();
  },

  async setTitle(title: string) {
    if (!isTauri) return;
    await initTauriImports();
    const window = tauriImports.getCurrentWindow?.();
    await window?.setTitle(title);
  }
};

// Invoke Tauri commands
export const tauriInvoke = async <T>(command: string, args?: Record<string, any>): Promise<T | null> => {
  if (!isTauri) {
    console.warn('Tauri invoke called in non-Tauri environment');
    return null;
  }
  
  await initTauriImports();
  if (!tauriImports.invoke) {
    console.warn('Tauri invoke not available');
    return null;
  }

  try {
    return await tauriImports.invoke(command, args);
  } catch (error) {
    console.error(`Failed to invoke Tauri command ${command}:`, error);
    return null;
  }
};

// Helper to check if running in development mode
export const isDev = process.env.NODE_ENV === 'development';

// Platform detection
export const platform = {
  get isMac() {
    return typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  },
  
  get isWindows() {
    return typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('WIN') >= 0;
  },
  
  get isLinux() {
    return typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('LINUX') >= 0;
  }
}; 