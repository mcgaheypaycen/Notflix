import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  selectFolder: () => {
    console.log('preload: selectFolder called');
    return ipcRenderer.invoke('select-folder');
  },
  readDirectory: (folderPath: string) => {
    console.log('preload: readDirectory called with:', folderPath);
    return ipcRenderer.invoke('read-directory', folderPath);
  },
  readSubfolder: (folderPath: string) => {
    console.log('preload: readSubfolder called with:', folderPath);
    return ipcRenderer.invoke('read-subfolder', folderPath);
  },
  getFileInfo: (filePath: string) => {
    console.log('preload: getFileInfo called with:', filePath);
    return ipcRenderer.invoke('get-file-info', filePath);
  },
  generateThumbnail: (filePath: string) => ipcRenderer.invoke('generate-thumbnail', filePath),
  getVideoMetadata: (filePath: string) => ipcRenderer.invoke('get-video-metadata', filePath),
  // Fullscreen controls
  toggleFullscreen: () => ipcRenderer.invoke('toggle-fullscreen'),
  enterFullscreen: () => ipcRenderer.invoke('enter-fullscreen'),
  exitFullscreen: () => ipcRenderer.invoke('exit-fullscreen'),
  isFullscreen: () => ipcRenderer.invoke('is-fullscreen'),
  // User guide listener
  onOpenUserGuide: (callback: () => void) => {
    ipcRenderer.on('open-user-guide', callback);
  },
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      selectFolder: () => Promise<string | null>;
      readDirectory: (folderPath: string) => Promise<{ mediaFiles: string[], subfolders: string[] }>;
      readSubfolder: (folderPath: string) => Promise<string[]>;
      getFileInfo: (filePath: string) => Promise<{
        name: string;
        path: string;
        size: number;
        created: Date;
        modified: Date;
        extension: string;
        metadata?: any;
        thumbnail?: string;
      }>;
      generateThumbnail: (filePath: string) => Promise<string>;
      getVideoMetadata: (filePath: string) => Promise<any>;
      // Fullscreen controls
      toggleFullscreen: () => Promise<boolean>;
      enterFullscreen: () => Promise<boolean>;
      exitFullscreen: () => Promise<boolean>;
      isFullscreen: () => Promise<boolean>;
      // User guide listener
      onOpenUserGuide: (callback: () => void) => void;
    };
  }
} 