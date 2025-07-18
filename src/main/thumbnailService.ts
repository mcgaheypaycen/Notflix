import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

// Dynamic imports to handle potential module loading issues
let ffmpeg: any = null;
let ffmpegInstaller: any = null;
let ffprobeInstaller: any = null;

try {
  ffmpeg = require('fluent-ffmpeg');
  ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
  ffprobeInstaller = require('@ffprobe-installer/ffprobe');
  console.log('FFmpeg modules loaded successfully');
} catch (error) {
  console.error('Failed to load FFmpeg modules:', error);
  // Continue without FFmpeg - app will still work but without thumbnails
}

// Set ffmpeg and ffprobe paths with error handling
if (ffmpeg && ffmpegInstaller && ffprobeInstaller) {
  const ffmpegPath = ffmpegInstaller.path;
  const ffprobePath = ffprobeInstaller.path;

  try {
    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpeg.setFfprobePath(ffprobePath);
    console.log('FFmpeg path set successfully:', ffmpegPath);
    console.log('FFprobe path set successfully:', ffprobePath);
  } catch (error) {
    console.error('Failed to set FFmpeg paths:', error);
    // Try to use system FFmpeg as fallback
    try {
      const { execSync } = require('child_process');
      const ffmpegVersion = execSync('ffmpeg -version', { encoding: 'utf8' });
      console.log('Using system FFmpeg as fallback');
      ffmpeg.setFfmpegPath('ffmpeg');
      ffmpeg.setFfprobePath('ffprobe');
    } catch (fallbackError) {
      console.error('No system FFmpeg available, using bundled version');
    }
  }
} else {
  console.warn('FFmpeg modules not available - thumbnail generation will be disabled');
}

export class ThumbnailService {
  private thumbnailDir: string;

  constructor() {
    // Create thumbnails directory in temp folder
    this.thumbnailDir = path.join(os.tmpdir(), 'netflix-clone-thumbnails');
    this.ensureThumbnailDir();
  }

  private ensureThumbnailDir(): void {
    if (!fs.existsSync(this.thumbnailDir)) {
      fs.mkdirSync(this.thumbnailDir, { recursive: true });
    }
  }

  private getThumbnailPath(videoPath: string): string {
    const hash = this.generateHash(videoPath);
    return path.join(this.thumbnailDir, `${hash}.jpg`);
  }

  private generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private secondsToTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  public async generateThumbnail(filePath: string, timeOffset?: string): Promise<string> {
    const thumbnailPath = this.getThumbnailPath(filePath);
    const extension = path.extname(filePath).toLowerCase();

    // Check if thumbnail already exists
    if (fs.existsSync(thumbnailPath)) {
      return thumbnailPath;
    }

    // Add antivirus-friendly delay to prevent false positives
    await new Promise(resolve => setTimeout(resolve, 100));

    // If FFmpeg is not available, create a default thumbnail
    if (!ffmpeg) {
      console.warn('FFmpeg not available, creating default thumbnail');
      this.createDefaultVideoThumbnail(thumbnailPath);
      return thumbnailPath;
    }

    try {
      // For video files, calculate the middle timestamp if not provided
      if (['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.ts', '.mts', '.m2ts'].includes(extension)) {
        let calculatedTimeOffset = timeOffset;
        
        if (!calculatedTimeOffset) {
          // Get video duration and calculate middle timestamp
          try {
            const metadata = await this.getVideoMetadata(filePath);
            const duration = metadata.format?.duration;
            
            if (duration && duration > 0) {
              const middleTime = Math.floor(duration / 2);
              calculatedTimeOffset = this.secondsToTimestamp(middleTime);
              console.log(`Calculated middle timestamp for ${path.basename(filePath)}: ${calculatedTimeOffset} (duration: ${duration}s)`);
            } else {
              calculatedTimeOffset = '00:00:05'; // Fallback to 5 seconds
            }
          } catch (metadataError) {
            console.error('Error getting video duration, using fallback timestamp:', metadataError);
            calculatedTimeOffset = '00:00:05'; // Fallback to 5 seconds
          }
        }
        
        return await this.generateVideoThumbnail(filePath, thumbnailPath, calculatedTimeOffset || '00:00:05');
      } else {
        // Handle other file types (if any)
        return await this.generateVideoThumbnail(filePath, thumbnailPath, timeOffset || '00:00:05');
      }
    } catch (error) {
      console.error('Error generating thumbnail for:', filePath, error);
      // If all else fails, create a default video thumbnail
      this.createDefaultVideoThumbnail(thumbnailPath);
      return thumbnailPath;
    }
  }



  private async generateVideoThumbnail(videoPath: string, thumbnailPath: string, timeOffset: string): Promise<string> {
    if (!ffmpeg) {
      throw new Error('FFmpeg not available');
    }

    return new Promise((resolve, reject) => {
      // Add timeout to prevent hanging on corrupted files
      const timeout = setTimeout(() => {
        reject(new Error('Thumbnail generation timeout'));
      }, 60000); // 60 second timeout

      ffmpeg(videoPath)
        .screenshots({
          timestamps: [timeOffset],
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath),
          size: '400x225' // 16:9 aspect ratio
        })
        .on('end', () => {
          clearTimeout(timeout);
          console.log(`Thumbnail generated: ${thumbnailPath}`);
          resolve(thumbnailPath);
        })
        .on('error', (err: any) => {
          clearTimeout(timeout);
          console.error('Error generating thumbnail:', err);
          reject(err);
        });
    });
  }

  private createDefaultVideoThumbnail(thumbnailPath: string): void {
    try {
      // Create a simple 400x225 JPG with a dark background (16:9 aspect ratio for video)
      // For now, we'll create a minimal JPG file that will show as a dark rectangle
      const jpgBuffer = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
        0xFF, 0xDB, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0A, 0x0C,
        0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12, 0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29, 0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27,
        0x39, 0x3D, 0x38, 0x32, 0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x01, 0x90, 0x00, 0xE1, 0x01, 0x01,
        0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01, 0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C, 0x03, 0x01, 0x00, 0x02,
        0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0x00, 0xFF, 0xD9
      ]);
      
      fs.writeFileSync(thumbnailPath, jpgBuffer);
      console.log(`Default video thumbnail created: ${thumbnailPath}`);
    } catch (error) {
      console.error('Error creating default video thumbnail:', error);
      // If all else fails, just create an empty file
      fs.writeFileSync(thumbnailPath, '');
    }
  }

  public async getVideoMetadata(videoPath: string): Promise<any> {
    if (!ffmpeg) {
      throw new Error('FFmpeg not available');
    }

    return new Promise((resolve, reject) => {
      // Add timeout to prevent hanging on corrupted files
      const timeout = setTimeout(() => {
        reject(new Error('Metadata extraction timeout'));
      }, 30000); // 30 second timeout

      ffmpeg.ffprobe(videoPath, (err: any, metadata: any) => {
        clearTimeout(timeout);
        if (err) {
          console.error('Error getting video metadata:', err);
          reject(err);
        } else {
          resolve(metadata);
        }
      });
    });
  }

  public getThumbnailUrl(thumbnailPath: string): string {
    return `file://${thumbnailPath}`;
  }

  public cleanup(): void {
    // Clean up old thumbnails (optional)
    if (fs.existsSync(this.thumbnailDir)) {
      const files = fs.readdirSync(this.thumbnailDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      files.forEach(file => {
        const filePath = path.join(this.thumbnailDir, file);
        const stats = fs.statSync(filePath);
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
        }
      });
    }
  }
} 