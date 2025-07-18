const fs = require('fs');
const path = require('path');

// Simulate the exact same logic as the main process
async function testReadDirectory(folderPath) {
  console.log('=== Testing read-directory logic ===');
  console.log('Folder path:', folderPath);
  
  try {
    const files = await fs.promises.readdir(folderPath);
    console.log('All files in directory:', files.length);
    
    const mediaFiles = [];
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await fs.promises.stat(filePath);
      
      if (stats.isFile()) {
        const ext = path.extname(file).toLowerCase();
        
        const mediaExtensions = [
          '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.3gp', '.ts', '.mts', '.m2ts',
          '.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a', '.wma', '.opus'
        ];
        
        if (mediaExtensions.includes(ext)) {
          console.log('Found media file:', file);
          mediaFiles.push(filePath);
        }
      }
    }
    
    console.log('Total media files found:', mediaFiles.length);
    return mediaFiles;
    
  } catch (error) {
    console.error('Error reading directory:', error);
    throw error;
  }
}

// Test with the actual folder path
const testFolder = 'E:\\Videos\\Whats My Line';
testReadDirectory(testFolder).then(files => {
  console.log('Test completed successfully');
  console.log('Files returned:', files.length);
}).catch(error => {
  console.error('Test failed:', error);
}); 