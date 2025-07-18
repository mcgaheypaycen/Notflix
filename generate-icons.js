const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if icon.png exists
const iconPath = path.join(__dirname, 'build', 'icon.png');
if (!fs.existsSync(iconPath)) {
  console.error('Error: build/icon.png not found!');
  process.exit(1);
}

console.log('Generating icons from build/icon.png...');

try {
  // Generate icons using electron-icon-builder
  execSync('npx electron-icon-builder --input=build/icon.png --output=build --flatten', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  
  console.log('✅ Icons generated successfully!');
  console.log('Generated files:');
  
  const buildDir = path.join(__dirname, 'build');
  const files = fs.readdirSync(buildDir);
  files.forEach(file => {
    if (file.includes('icon')) {
      console.log(`  - ${file}`);
    }
  });
  
} catch (error) {
  console.error('Error generating icons:', error.message);
  process.exit(1);
} 