import { MediaFile, MediaMetadata, FileInfo, VIDEO_EXTENSIONS } from '../types/media';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function getMediaType(extension: string): 'video' {
  return 'video'; // All supported files are video files
}

export function createMediaFile(fileInfo: FileInfo & { metadata?: any; thumbnail?: string }): MediaFile {
  return {
    id: generateId(),
    name: fileInfo.name,
    path: fileInfo.path,
    size: fileInfo.size,
    created: fileInfo.created,
    modified: fileInfo.modified,
    extension: fileInfo.extension,
    type: getMediaType(fileInfo.extension),
    metadata: fileInfo.metadata,
    thumbnail: fileInfo.thumbnail,
  };
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getDefaultThumbnail(type: 'video'): string {
  // Return a data URL for a simple colored rectangle
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = '#E50914';
    ctx.fillRect(0, 0, 300, 200);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('VIDEO', 150, 100);
  }
  
  return canvas.toDataURL();
}

export function extractFileName(path: string): string {
  return path.split(/[\\/]/).pop() || '';
}

export function getFileExtension(path: string): string {
  return path.substring(path.lastIndexOf('.')).toLowerCase();
} 