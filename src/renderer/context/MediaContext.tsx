import React, { createContext, useContext, useState, useCallback } from 'react';
import { MediaFile, FileInfo, MediaFolder } from '../types/media';
import { createMediaFile } from '../utils/mediaUtils';

interface MediaContextType {
  mediaFolders: MediaFolder[];
  selectedFolder: string | null;
  loading: boolean;
  error: string | null;
  thumbnailProgress: { current: number; total: number };
  selectFolder: () => Promise<void>;
  loadLastFolder: () => Promise<void>;
  clearMediaFiles: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export const MediaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mediaFolders, setMediaFolders] = useState<MediaFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailProgress, setThumbnailProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });



  const selectFolder = useCallback(async () => {
    try {
      console.log('selectFolder called');
      setLoading(true);
      setError(null);
      
      console.log('Calling window.electronAPI.selectFolder()');
      const folderPath = await window.electronAPI.selectFolder();
      console.log('Folder path received:', folderPath);
      
      if (!folderPath) {
        console.log('No folder selected');
        setLoading(false);
        return;
      }
      
      setSelectedFolder(folderPath);
      
      // Save the selected folder to localStorage
      localStorage.setItem('netflix-clone-last-folder', folderPath);
      
      // Read directory and get media files and subfolders
      console.log('Reading directory:', folderPath);
      const result = await window.electronAPI.readDirectory(folderPath);
      console.log('Directory result:', result);
      
      // Handle both old and new return formats
      const parentMediaFiles = Array.isArray(result) ? result : (result as any).mediaFiles || [];
      const subfolders = Array.isArray(result) ? [] : (result as any).subfolders || [];
      
      // Count total media files for progress tracking
      let totalMediaFiles = parentMediaFiles.length;
      for (const subfolderPath of subfolders) {
        try {
          const subfolderMediaFiles = await (window.electronAPI as any).readSubfolder(subfolderPath);
          totalMediaFiles += subfolderMediaFiles.length;
        } catch (err) {
          console.error(`Error counting files in subfolder ${subfolderPath}:`, err);
        }
      }
      
      setThumbnailProgress({ current: 0, total: totalMediaFiles });
      
      // Process parent folder media files
      const parentFolder: MediaFolder = {
        id: `parent-${folderPath}`,
        name: folderPath.split(/[\\/]/).pop() || 'Selected Folder',
        path: folderPath,
        mediaFiles: [],
        isParent: true
      };

      // Get file info for parent folder media files
      for (const filePath of parentMediaFiles) {
        try {
          console.log('Getting file info for parent folder:', filePath);
          const fileInfo = await window.electronAPI.getFileInfo(filePath);
          console.log('Parent file info received:', fileInfo);
          const mediaFile = createMediaFile(fileInfo as any);
          parentFolder.mediaFiles.push(mediaFile);
          
          // Update progress
          setThumbnailProgress(prev => ({ 
            current: prev.current + 1, 
            total: prev.total 
          }));
        } catch (err) {
          console.error(`Error getting file info for ${filePath}:`, err);
          // Create a basic file info even if metadata extraction fails
          const fileName = filePath.split(/[\\/]/).pop() || 'Unknown';
          const basicFileInfo = {
            name: fileName,
            path: filePath,
            size: 0,
            created: new Date(),
            modified: new Date(),
            extension: filePath.substring(filePath.lastIndexOf('.')).toLowerCase(),
            metadata: null,
            thumbnail: null
          };
          console.log('Created basic file info for parent:', basicFileInfo);
          const mediaFile = createMediaFile(basicFileInfo as any);
          parentFolder.mediaFiles.push(mediaFile);
          
          // Update progress even for failed metadata extraction
          setThumbnailProgress(prev => ({ 
            current: prev.current + 1, 
            total: prev.total 
          }));
        }
      }

      // Process subfolders
      const subfolderFolders: MediaFolder[] = [];
      for (const subfolderPath of subfolders) {
        try {
          console.log('Reading subfolder:', subfolderPath);
          const subfolderMediaFiles = await (window.electronAPI as any).readSubfolder(subfolderPath);
          console.log('Subfolder media files:', subfolderMediaFiles);
          
          if (subfolderMediaFiles.length > 0) {
            const subfolder: MediaFolder = {
              id: `subfolder-${subfolderPath}`,
              name: subfolderPath.split(/[\\/]/).pop() || 'Subfolder',
              path: subfolderPath,
              mediaFiles: [],
              isParent: false
            };

            // Get file info for subfolder media files
            for (const filePath of subfolderMediaFiles) {
              try {
                console.log('Getting file info for subfolder:', filePath);
                const fileInfo = await window.electronAPI.getFileInfo(filePath);
                console.log('Subfolder file info received:', fileInfo);
                const mediaFile = createMediaFile(fileInfo as any);
                subfolder.mediaFiles.push(mediaFile);
                
                // Update progress
                setThumbnailProgress(prev => ({ 
                  current: prev.current + 1, 
                  total: prev.total 
                }));
              } catch (err) {
                console.error(`Error getting file info for ${filePath}:`, err);
                // Create a basic file info even if metadata extraction fails
                const fileName = filePath.split(/[\\/]/).pop() || 'Unknown';
                const basicFileInfo = {
                  name: fileName,
                  path: filePath,
                  size: 0,
                  created: new Date(),
                  modified: new Date(),
                  extension: filePath.substring(filePath.lastIndexOf('.')).toLowerCase(),
                  metadata: null,
                  thumbnail: null
                };
                console.log('Created basic file info for subfolder:', basicFileInfo);
                const mediaFile = createMediaFile(basicFileInfo as any);
                subfolder.mediaFiles.push(mediaFile);
                
                // Update progress even for failed metadata extraction
                setThumbnailProgress(prev => ({ 
                  current: prev.current + 1, 
                  total: prev.total 
                }));
              }
            }

            subfolderFolders.push(subfolder);
          }
        } catch (err) {
          console.error(`Error processing subfolder ${subfolderPath}:`, err);
        }
      }

      // Combine parent folder and subfolders
      const allFolders = [parentFolder, ...subfolderFolders];
      console.log('All folders created:', allFolders);
      setMediaFolders(allFolders);
      
    } catch (err) {
      console.error('Error selecting folder:', err);
      setError('Failed to load media files. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLastFolder = useCallback(async () => {
    const lastFolder = localStorage.getItem('netflix-clone-last-folder');
    if (!lastFolder) {
      setError('No previous folder found');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSelectedFolder(lastFolder);
      
      // Read directory and get media files and subfolders
      console.log('Loading last folder:', lastFolder);
      const result = await window.electronAPI.readDirectory(lastFolder);
      console.log('Directory result:', result);
      
      // Handle both old and new return formats
      const parentMediaFiles = Array.isArray(result) ? result : (result as any).mediaFiles || [];
      const subfolders = Array.isArray(result) ? [] : (result as any).subfolders || [];
      
      // Count total media files for progress tracking
      let totalMediaFiles = parentMediaFiles.length;
      for (const subfolderPath of subfolders) {
        try {
          const subfolderMediaFiles = await (window.electronAPI as any).readSubfolder(subfolderPath);
          totalMediaFiles += subfolderMediaFiles.length;
        } catch (err) {
          console.error(`Error counting files in subfolder ${subfolderPath}:`, err);
        }
      }
      
      setThumbnailProgress({ current: 0, total: totalMediaFiles });
      
      // Process parent folder media files
      const parentFolder: MediaFolder = {
        id: `parent-${lastFolder}`,
        name: lastFolder.split(/[\\/]/).pop() || 'Selected Folder',
        path: lastFolder,
        mediaFiles: [],
        isParent: true
      };

      // Get file info for parent folder media files
      for (const filePath of parentMediaFiles) {
        try {
          console.log('Getting file info for parent folder:', filePath);
          const fileInfo = await window.electronAPI.getFileInfo(filePath);
          console.log('Parent file info received:', fileInfo);
          const mediaFile = createMediaFile(fileInfo as any);
          parentFolder.mediaFiles.push(mediaFile);
          
          // Update progress
          setThumbnailProgress(prev => ({ 
            current: prev.current + 1, 
            total: prev.total 
          }));
        } catch (err) {
          console.error(`Error getting file info for ${filePath}:`, err);
          // Create a basic file info even if metadata extraction fails
          const fileName = filePath.split(/[\\/]/).pop() || 'Unknown';
          const basicFileInfo = {
            name: fileName,
            path: filePath,
            size: 0,
            created: new Date(),
            modified: new Date(),
            extension: filePath.substring(filePath.lastIndexOf('.')).toLowerCase(),
            metadata: null,
            thumbnail: null
          };
          console.log('Created basic file info for parent:', basicFileInfo);
          const mediaFile = createMediaFile(basicFileInfo as any);
          parentFolder.mediaFiles.push(mediaFile);
          
          // Update progress even for failed metadata extraction
          setThumbnailProgress(prev => ({ 
            current: prev.current + 1, 
            total: prev.total 
          }));
        }
      }

      // Process subfolders
      const subfolderFolders: MediaFolder[] = [];
      for (const subfolderPath of subfolders) {
        try {
          console.log('Reading subfolder:', subfolderPath);
          const subfolderMediaFiles = await (window.electronAPI as any).readSubfolder(subfolderPath);
          console.log('Subfolder media files:', subfolderMediaFiles);
          
          if (subfolderMediaFiles.length > 0) {
            const subfolder: MediaFolder = {
              id: `subfolder-${subfolderPath}`,
              name: subfolderPath.split(/[\\/]/).pop() || 'Subfolder',
              path: subfolderPath,
              mediaFiles: [],
              isParent: false
            };

            // Get file info for subfolder media files
            for (const filePath of subfolderMediaFiles) {
              try {
                console.log('Getting file info for subfolder:', filePath);
                const fileInfo = await window.electronAPI.getFileInfo(filePath);
                console.log('Subfolder file info received:', fileInfo);
                const mediaFile = createMediaFile(fileInfo as any);
                subfolder.mediaFiles.push(mediaFile);
                
                // Update progress
                setThumbnailProgress(prev => ({ 
                  current: prev.current + 1, 
                  total: prev.total 
                }));
              } catch (err) {
                console.error(`Error getting file info for ${filePath}:`, err);
                // Create a basic file info even if metadata extraction fails
                const fileName = filePath.split(/[\\/]/).pop() || 'Unknown';
                const basicFileInfo = {
                  name: fileName,
                  path: filePath,
                  size: 0,
                  created: new Date(),
                  modified: new Date(),
                  extension: filePath.substring(filePath.lastIndexOf('.')).toLowerCase(),
                  metadata: null,
                  thumbnail: null
                };
                console.log('Created basic file info for subfolder:', basicFileInfo);
                const mediaFile = createMediaFile(basicFileInfo as any);
                subfolder.mediaFiles.push(mediaFile);
                
                // Update progress even for failed metadata extraction
                setThumbnailProgress(prev => ({ 
                  current: prev.current + 1, 
                  total: prev.total 
                }));
              }
            }

            subfolderFolders.push(subfolder);
          }
        } catch (err) {
          console.error(`Error processing subfolder ${subfolderPath}:`, err);
        }
      }

      // Combine parent folder and subfolders
      const allFolders = [parentFolder, ...subfolderFolders];
      console.log('All folders created:', allFolders);
      setMediaFolders(allFolders);
      
    } catch (err) {
      console.error('Error loading last folder:', err);
      setError('Failed to load last folder. Please select a new folder.');
      // Clear the invalid last folder
      localStorage.removeItem('netflix-clone-last-folder');
      setSelectedFolder(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load last selected folder on app startup
  React.useEffect(() => {
    const lastFolder = localStorage.getItem('netflix-clone-last-folder');
    if (lastFolder) {
      console.log('Found last selected folder:', lastFolder);
      // Automatically load the last folder
      loadLastFolder();
    }
  }, [loadLastFolder]);

  const clearMediaFiles = useCallback(() => {
    setMediaFolders([]);
    setSelectedFolder(null);
    setError(null);
    setThumbnailProgress({ current: 0, total: 0 });
    // Also clear the saved last folder
    localStorage.removeItem('netflix-clone-last-folder');
  }, []);

  const value: MediaContextType = {
    mediaFolders,
    selectedFolder,
    loading,
    error,
    thumbnailProgress,
    selectFolder,
    loadLastFolder,
    clearMediaFiles,
  };

  return (
    <MediaContext.Provider value={value}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMediaFiles = (): MediaContextType => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMediaFiles must be used within a MediaProvider');
  }
  return context;
}; 