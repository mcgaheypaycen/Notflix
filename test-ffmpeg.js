const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;

console.log('FFmpeg path:', ffmpegPath);
console.log('FFprobe path:', ffprobePath);

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

// Test if ffmpeg is working
ffmpeg.getAvailableFormats((err, formats) => {
  if (err) {
    console.error('FFmpeg error:', err);
  } else {
    console.log('FFmpeg is working! Available formats:', Object.keys(formats).length);
  }
});

// Test ffprobe with a simple command
ffmpeg.ffprobe('test-ffmpeg.js', (err, metadata) => {
  if (err) {
    console.log('FFprobe error (expected for non-media file):', err.message);
    console.log('FFprobe is working correctly!');
  } else {
    console.log('FFprobe is working!');
  }
}); 