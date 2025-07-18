const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Notflix build integrity...\n');

const requiredFiles = [
  'dist/main/index.js',
  'dist/renderer/index.html',
  'dist/renderer/assets',
  'build/icons/icon.ico',
  'USER_GUIDE.md'
];

const requiredDirs = [
  'dist/main',
  'dist/renderer',
  'node_modules'
];

let allGood = true;

// Check required files
console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    allGood = false;
  }
});

// Check required directories
console.log('\n📂 Checking required directories:');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
    console.log(`  ✅ ${dir}`);
  } else {
    console.log(`  ❌ ${dir} - MISSING`);
    allGood = false;
  }
});

// Check FFmpeg dependencies
console.log('\n🎬 Checking FFmpeg dependencies:');
const ffmpegDeps = [
  'node_modules/@ffmpeg-installer/ffmpeg',
  'node_modules/@ffprobe-installer/ffprobe',
  'node_modules/fluent-ffmpeg'
];

ffmpegDeps.forEach(dep => {
  if (fs.existsSync(dep)) {
    console.log(`  ✅ ${dep}`);
  } else {
    console.log(`  ❌ ${dep} - MISSING`);
    allGood = false;
  }
});

// Check file sizes
console.log('\n📊 Checking critical file sizes:');
const criticalFiles = [
  { path: 'dist/main/index.js', minSize: 1000 },
  { path: 'dist/renderer/index.html', minSize: 100 },
  { path: 'build/icons/icon.ico', minSize: 1000 }
];

criticalFiles.forEach(({ path: filePath, minSize }) => {
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    if (stats.size >= minSize) {
      console.log(`  ✅ ${filePath} (${stats.size} bytes)`);
    } else {
      console.log(`  ⚠️  ${filePath} (${stats.size} bytes) - SUSPICIOUSLY SMALL`);
      allGood = false;
    }
  } else {
    console.log(`  ❌ ${filePath} - MISSING`);
    allGood = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 Build verification PASSED! Ready for distribution.');
  console.log('\n💡 Tips for antivirus compatibility:');
  console.log('   • The app uses legitimate FFmpeg binaries for video processing');
  console.log('   • All dependencies are from trusted npm packages');
  console.log('   • The app only accesses local video files selected by the user');
  console.log('   • No network communication or data collection');
  process.exit(0);
} else {
  console.log('❌ Build verification FAILED! Please fix the issues above.');
  process.exit(1);
} 