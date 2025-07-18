export interface FileInfo {
  name: string;
  path: string;
  size: number;
  created: Date;
  modified: Date;
  extension: string;
  metadata: any;
  thumbnail: string | null;
}

export interface MediaFile {
  id: string;
  name: string;
  path: string;
  size: number;
  created: Date;
  modified: Date;
  type: 'video' | 'audio';
  extension: string;
  metadata: {
    duration?: number;
    width?: number;
    height?: number;
    bitrate?: string;
    codec?: string;
    audioCodec?: string;
    videoCodec?: string;
    fps?: number;
    channels?: number;
    sampleRate?: number;
    title?: string;
    authors?: string | string[];
  } | null;
  thumbnail: string | null;
}

export interface MediaFolder {
  id: string;
  name: string;
  path: string;
  mediaFiles: MediaFile[];
  isParent: boolean; // true for the folder user selected, false for subfolders
}

export const VIDEO_EXTENSIONS = [
  '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.ts', '.mts', '.m2ts'
];

export const MEDIA_EXTENSIONS = [...VIDEO_EXTENSIONS]; 