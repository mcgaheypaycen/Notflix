# Notflix

A beautiful Netflix-style desktop media player for your local video files. Notflix transforms your personal video collection into a premium streaming experience with automatic thumbnail generation, metadata extraction, and a familiar Netflix-like interface.

Warning: This app was 100% pure vibecoded by some gay dude who hasn't written a line of code since Myspace. Use at your own risk.

## ✨ Features

### 🎬 Netflix-Style Experience
- **Dark Theme Interface**: Beautiful dark UI matching Netflix's aesthetic
- **Featured Video Display**: Large hero section showcasing selected content
- **Horizontal Carousels**: Smooth scrolling video rows organized by folders
- **Hover Effects**: Elegant scaling and visual feedback on interaction
- **Loading Animations**: Professional loading screens and transitions

### 🎥 Smart Media Management
- **Automatic Thumbnail Generation**: FFmpeg-powered thumbnail creation for all videos
- **Metadata Extraction**: Detailed video information (duration, resolution, codec, etc.)
- **Progress Tracking**: Remembers where you left off in each video
- **Resume Playback**: Continue watching from your last position
- **Folder Organization**: Videos automatically organized by their containing folders

### 🎮 Intuitive Controls
- **Keyboard Navigation**: Arrow keys for browsing, Enter to play
- **Media Player Controls**: Full playback controls with auto-hide
- **Fullscreen Support**: Immersive viewing experience
- **Volume Control**: Mute/unmute and volume adjustment
- **Progress Seeking**: Click or drag on progress bar to jump to any position

### 🛠️ Advanced Features
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Responsive Design**: Adapts to different window sizes
- **Help System**: Built-in user guide accessible via Help menu (Ctrl+H)
- **Custom Icon**: Professional application icon
- **Auto-Save Progress**: Automatically saves viewing progress every 15 seconds

## 📁 Supported File Formats

### Video Formats
- **MP4** (.mp4) - Most common format
- **AVI** (.avi) - Audio Video Interleave
- **MKV** (.mkv) - Matroska Video
- **MOV** (.mov) - QuickTime Movie
- **WMV** (.wmv) - Windows Media Video
- **FLV** (.flv) - Flash Video
- **WebM** (.webm) - Web Media
- **M4V** (.m4v) - iTunes Video
- **3GP** (.3gp) - Mobile Video
- **TS** (.ts) - Transport Stream
- **MTS** (.mts) - AVCHD Transport Stream
- **M2TS** (.m2ts) - Blu-ray Transport Stream

### Metadata Extraction
For each video file, Notflix extracts:
- Duration and file size
- Video resolution and bitrate
- Video and audio codec information
- Frame rate and audio channels
- Title and creator information from metadata tags

## 🚀 Quick Start

### Installation

1. **Download**: Get the latest release for your platform from the releases page
2. **Install**: Run the installer and follow the setup wizard
3. **Launch**: Start Notflix from your applications folder

### First Use

1. **Select Media Folder**: Click "Select Folder" in the top-right corner
2. **Choose Your Videos**: Pick a directory containing your video files
3. **Wait for Processing**: Notflix will scan and generate thumbnails (may take a moment)
4. **Start Watching**: Click on any video to begin playback

## ⌨️ Keyboard Shortcuts

### Main Interface
| Key | Action |
|-----|--------|
| **↑/↓** | Navigate between folders |
| **←/→** | Navigate between videos |
| **Enter** | Play selected video |
| **Ctrl+H** | Open user guide |

### Media Player
| Key | Action |
|-----|--------|
| **Spacebar** | Play/Pause |
| **F** | Toggle fullscreen |
| **M** | Mute/Unmute |
| **Escape** | Exit fullscreen/close player |
| **←/→** | Seek backward/forward |

## 🛠️ Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/mcgaheypaycen/Notflix.git
cd Notflix

# Install dependencies
npm install

# Generate icons (required for build)
npm run generate-icons

# Start development server
npm run dev

# Build for production
npm run build

# Create distributable
npm run dist
```

### Project Structure
```
src/
├── main/                 # Electron main process
│   ├── index.ts         # Main window and IPC handlers
│   ├── preload.ts       # Preload script for renderer
│   └── thumbnailService.ts # FFmpeg thumbnail generation
├── renderer/            # React frontend
│   ├── components/      # React components
│   │   ├── MediaPlayer.tsx      # Video player component
│   │   ├── FolderCarousel.tsx   # Video carousel display
│   │   ├── FeaturedVideo.tsx    # Hero video section
│   │   ├── UserGuideModal.tsx   # Help system
│   │   └── ...                 # Other UI components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript definitions
│   └── App.tsx         # Main React component
└── shared/             # Shared utilities

build/
├── icon.png            # Source icon (included in repo)
└── icons/              # Generated icons (excluded from repo)

dist/                   # Build output (excluded from repo)
dist-release/           # Distributables (excluded from repo)
```

### Repository Contents
This repository contains the source code for Notflix. Build outputs and dependencies are excluded via `.gitignore`:

**Included:**
- ✅ Source code (`src/`)
- ✅ Configuration files (`package.json`, `tsconfig.json`, etc.)
- ✅ Documentation (`README.md`, `USER_GUIDE.md`)
- ✅ Source assets (`build/icon.png`)
- ✅ Build scripts (`generate-icons.js`, `verify-build.js`)

**Excluded:**
- ❌ Build outputs (`dist/`, `dist-release/`)
- ❌ Dependencies (`node_modules/`)
- ❌ Generated icons (`build/icons/`)
- ❌ Cache files (`.vite/`, `electron-cache/`)

### Key Technologies
- **Electron**: Desktop application framework
- **React**: UI library with TypeScript
- **FFmpeg**: Video processing and thumbnail generation
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast build tool and dev server

### Available Scripts
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run dist`: Create platform-specific distributables
- `npm start`: Run the built application

## 📦 Building Distributables

### Windows
```bash
npm run dist
```
Creates a Windows installer (.exe) in the `release` folder.

### macOS
```bash
npm run dist
```
Creates a macOS app bundle (.dmg) in the `release` folder.

### Linux
```bash
npm run dist
```
Creates a Linux AppImage in the `release` folder.

## 🆘 Help & Support

### Built-in Help
- Press **Ctrl+H** or go to **Help → User Guide** in the menu bar
- Complete user guide with detailed instructions and troubleshooting

### Common Issues

**Videos Not Playing**
- Ensure the file format is supported
- Check if the file is corrupted by testing in another player
- Try converting unsupported formats to MP4

**Thumbnails Not Generating**
- Wait for processing to complete (may take time for large folders)
- Ensure the app has permission to read your video files
- Restart the application if thumbnails fail to generate

**App Not Starting**
- Verify your system meets minimum requirements
- Check that all dependencies are properly installed
- Try downloading the latest version

### Getting Help
1. Check the built-in user guide (Ctrl+H)
2. Look for error messages in the console
3. Ensure your video files are in supported formats
4. Try restarting the application

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Netflix**: For the inspiration and UI/UX design patterns
- **FFmpeg**: For powerful video processing capabilities
- **Electron**: For cross-platform desktop app framework
- **React**: For the component-based UI architecture

---

**Notflix** - Transform your video collection into a premium streaming experience! 🎬✨ 
