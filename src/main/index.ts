import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { ThumbnailService } from './thumbnailService';

let mainWindow: BrowserWindow | null = null;
const thumbnailService = new ThumbnailService();

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'default',
    backgroundColor: '#141414',
    show: false,
    title: 'Notflix',

  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Set app name
app.setName('Notflix');

// Create application menu
function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Help',
      submenu: [
        {
          label: 'User Guide',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            // Send IPC message to renderer to open user guide modal
            if (mainWindow) {
              mainWindow.webContents.send('open-user-guide');
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  try {
    createMenu();
    createWindow();
    console.log('Notflix application started successfully');
  } catch (error) {
    console.error('Failed to start Notflix application:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handler for fullscreen toggle
ipcMain.handle('toggle-fullscreen', () => {
  if (mainWindow) {
    if (mainWindow.isFullScreen()) {
      mainWindow.setFullScreen(false);
      // Show menu bar when exiting fullscreen
      mainWindow.setMenuBarVisibility(true);
    } else {
      // Hide menu bar when entering fullscreen
      mainWindow.setMenuBarVisibility(false);
      mainWindow.setFullScreen(true);
    }
    return mainWindow.isFullScreen();
  }
  return false;
});

// IPC handler for entering fullscreen
ipcMain.handle('enter-fullscreen', () => {
  if (mainWindow) {
    // Hide menu bar when entering fullscreen
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setFullScreen(true);
    return true;
  }
  return false;
});

// IPC handler for exiting fullscreen
ipcMain.handle('exit-fullscreen', () => {
  if (mainWindow) {
    mainWindow.setFullScreen(false);
    // Show menu bar when exiting fullscreen
    mainWindow.setMenuBarVisibility(true);
    return false;
  }
  return false;
});

// IPC handler for checking fullscreen state
ipcMain.handle('is-fullscreen', () => {
  return mainWindow ? mainWindow.isFullScreen() : false;
});

// IPC Handlers for folder selection and file operations
ipcMain.handle('select-folder', async () => {
  console.log('select-folder IPC handler called');
  if (!mainWindow) {
    console.log('No main window available');
    return null;
  }
  
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Media Folder'
    });
    
    console.log('Dialog result:', result);
    return result.canceled ? null : result.filePaths[0];
  } catch (error) {
    console.error('Error in select-folder handler:', error);
    throw error;
  }
});

ipcMain.handle('read-directory', async (event, folderPath: string) => {
  console.log('=== read-directory IPC handler called ===');
  console.log('Folder path received:', folderPath);
  console.log('Type of folderPath:', typeof folderPath);
  
  try {
    console.log('read-directory called with path:', folderPath);
    const files = await fs.promises.readdir(folderPath);
    console.log('All files in directory:', files);
    
    const mediaFiles: string[] = [];
    const subfolders: string[] = [];
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.promises.stat(filePath);
      
      if (stats.isFile()) {
        const ext = path.extname(file).toLowerCase();
        console.log('File:', file, 'Extension:', ext);
        
        const mediaExtensions = [
          // Video formats only
          '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.ts', '.mts', '.m2ts'
        ];
        
        if (mediaExtensions.includes(ext)) {
          console.log('Found media file:', filePath);
          mediaFiles.push(filePath);
        }
      } else if (stats.isDirectory()) {
        console.log('Found subfolder:', filePath);
        subfolders.push(filePath);
      }
    }
    
    console.log('Total media files found:', mediaFiles.length);
    console.log('Media files:', mediaFiles);
    console.log('Total subfolders found:', subfolders.length);
    console.log('Subfolders:', subfolders);
    
    // Return both media files and subfolders
    return {
      mediaFiles,
      subfolders
    };
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
});

ipcMain.handle('get-file-info', async (event, filePath: string) => {
  try {
    console.log('get-file-info called for:', filePath);
    const stats = await fs.promises.stat(filePath);
    const extension = path.extname(filePath).toLowerCase();
    
    let metadata: any = null;
    let thumbnail: string | null = null;
    
    // Get metadata and thumbnail for video files
    if (['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.ts', '.mts', '.m2ts'].includes(extension)) {
      try {
        console.log('Processing media file:', filePath);
        const mediaMetadata = await thumbnailService.getVideoMetadata(filePath);
        console.log('Media metadata received:', mediaMetadata);
        
        // Extract title and authors from tags if available
        const tags = mediaMetadata.format?.tags || {};
        const streamTags = (mediaMetadata.streams && mediaMetadata.streams[0]?.tags) || {};
        const title = tags.title || streamTags.title || null;
        const authors = tags.artist || tags.author || streamTags.artist || streamTags.author || null;
        
        // Handle video files
        metadata = {
          duration: mediaMetadata.format.duration,
          width: mediaMetadata.streams.find((s: any) => s.width)?.width,
          height: mediaMetadata.streams.find((s: any) => s.height)?.height,
          bitrate: mediaMetadata.format.bit_rate,
          codec: mediaMetadata.streams.find((s: any) => s.codec_type === 'video')?.codec_name,
          audioCodec: mediaMetadata.streams.find((s: any) => s.codec_type === 'audio')?.codec_name,
          videoCodec: mediaMetadata.streams.find((s: any) => s.codec_type === 'video')?.codec_name,
          fps: mediaMetadata.streams.find((s: any) => s.r_frame_rate)?.r_frame_rate?.split('/')[0] / mediaMetadata.streams.find((s: any) => s.r_frame_rate)?.r_frame_rate?.split('/')[1],
          channels: mediaMetadata.streams.find((s: any) => s.channels)?.channels,
          sampleRate: mediaMetadata.streams.find((s: any) => s.sample_rate)?.sample_rate,
          title,
          authors
        };
        
        // Generate thumbnail for video
        console.log('Generating thumbnail for:', filePath);
        const thumbnailPath = await thumbnailService.generateThumbnail(filePath);
        thumbnail = thumbnailService.getThumbnailUrl(thumbnailPath);
        console.log('Thumbnail generated:', thumbnail);
      } catch (error) {
        console.error('Error processing media file:', error);
        // If metadata extraction fails, still try to generate a thumbnail
        try {
          console.log('Trying to generate thumbnail after metadata failure for:', filePath);
          const thumbnailPath = await thumbnailService.generateThumbnail(filePath);
          thumbnail = thumbnailService.getThumbnailUrl(thumbnailPath);
          console.log('Thumbnail generated after retry:', thumbnail);
        } catch (thumbnailError) {
          console.error('Error generating thumbnail:', thumbnailError);
          // If thumbnail generation also fails, continue without it
          console.log('Continuing without thumbnail generation');
        }
      }
    }
    
    const result = {
      name: path.basename(filePath),
      path: filePath,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      extension: extension,
      metadata,
      thumbnail
    };
    
    console.log('Returning file info:', result);
    return result;
  } catch (error) {
    console.error('Error getting file info:', error);
    // Return basic file info even if everything fails
    const basicInfo = {
      name: path.basename(filePath),
      path: filePath,
      size: 0,
      created: new Date(),
      modified: new Date(),
      extension: path.extname(filePath).toLowerCase(),
      metadata: null,
      thumbnail: null
    };
    console.log('Returning basic file info due to error:', basicInfo);
    return basicInfo;
  }
});

ipcMain.handle('read-subfolder', async (event, folderPath: string) => {
  console.log('=== read-subfolder IPC handler called ===');
  console.log('Subfolder path received:', folderPath);
  
  try {
    console.log('read-subfolder called with path:', folderPath);
    const files = await fs.promises.readdir(folderPath);
    console.log('All files in subfolder:', files);
    
    const mediaFiles: string[] = [];
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.promises.stat(filePath);
      
      if (stats.isFile()) {
        const ext = path.extname(file).toLowerCase();
        console.log('File:', file, 'Extension:', ext);
        
        const mediaExtensions = [
          // Video formats only
          '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.ts', '.mts', '.m2ts'
        ];
        
        if (mediaExtensions.includes(ext)) {
          console.log('Found media file in subfolder:', filePath);
          mediaFiles.push(filePath);
        }
      }
    }
    
    console.log('Total media files found in subfolder:', mediaFiles.length);
    console.log('Media files in subfolder:', mediaFiles);
    return mediaFiles;
  } catch (error) {
    console.error('Error reading subfolder:', error);
    throw error;
  }
});

ipcMain.handle('generate-thumbnail', async (event, filePath: string) => {
  try {
    const thumbnailPath = await thumbnailService.generateThumbnail(filePath);
    return thumbnailService.getThumbnailUrl(thumbnailPath);
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
});

ipcMain.handle('get-video-metadata', async (event, filePath: string) => {
  try {
    const metadata = await thumbnailService.getVideoMetadata(filePath);
    const tags = metadata.format?.tags || {};
    const streamTags = (metadata.streams && metadata.streams[0]?.tags) || {};
    const title = tags.title || streamTags.title || null;
    const authors = tags.artist || tags.author || streamTags.artist || streamTags.author || null;
    return {
      duration: metadata.format.duration,
      width: metadata.streams.find((s: any) => s.width)?.width,
      height: metadata.streams.find((s: any) => s.height)?.height,
      bitrate: metadata.format.bit_rate,
      codec: metadata.streams.find((s: any) => s.codec_name)?.codec_name,
      fps: metadata.streams.find((s: any) => s.r_frame_rate)?.r_frame_rate,
      title,
      authors
    };
  } catch (error) {
    console.error('Error getting video metadata:', error);
    throw error;
  }
}); 