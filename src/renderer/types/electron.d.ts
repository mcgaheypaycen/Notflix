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

export {}; 