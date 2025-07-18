import { useState, useCallback } from 'react';
import { MediaFile, FileInfo } from '../types/media';
import { createMediaFile } from '../utils/mediaUtils';

export function useMediaFiles() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      
      // Read directory and get media files
      console.log('Reading directory:', folderPath);
      const filePaths = await window.electronAPI.readDirectory(folderPath);
      console.log('File paths found:', filePaths);
      
      // Get file info for each media file
      const fileInfos: FileInfo[] = [];
      for (const filePath of filePaths) {
        try {
          const fileInfo = await window.electronAPI.getFileInfo(filePath);
          fileInfos.push(fileInfo);
        } catch (err) {
          console.error(`Error getting file info for ${filePath}:`, err);
        }
      }
      
      console.log('File infos collected:', fileInfos);
      
      // Convert to MediaFile objects
      const files = fileInfos.map(createMediaFile);
      setMediaFiles(files);
      
    } catch (err) {
      console.error('Error selecting folder:', err);
      setError('Failed to load media files. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMediaFiles = useCallback(() => {
    setMediaFiles([]);
    setSelectedFolder(null);
    setError(null);
  }, []);

  return {
    mediaFiles,
    selectedFolder,
    loading,
    error,
    selectFolder,
    clearMediaFiles,
  };
} 