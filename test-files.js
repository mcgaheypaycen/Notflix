const fs = require('fs');
const path = require('path');

const testFolder = 'E:\\Videos\\Whats My Line';

console.log('Testing folder:', testFolder);

try {
  const files = fs.readdirSync(testFolder);
  console.log('All files in directory:', files);
  
  const mediaFiles = [];
  
  for (const file of files) {
    const filePath = path.join(testFolder, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      const ext = path.extname(file).toLowerCase();
      console.log('File:', file, 'Extension:', ext, 'Size:', stats.size);
      
      const mediaExtensions = [
        '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.ts', '.mts', '.m2ts',
        '.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma', '.opus'
      ];
      
      if (mediaExtensions.includes(ext)) {
        mediaFiles.push(filePath);
      }
    }
  }
  
  console.log('Media files found:', mediaFiles.length);
  console.log('Media files:', mediaFiles);
  
} catch (error) {
  console.error('Error:', error);
} 