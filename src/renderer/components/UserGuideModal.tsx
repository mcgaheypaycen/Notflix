import React from 'react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  // Embedded user guide content
  const guideContent = `# Notflix
## Complete User Guide

Welcome to Notflix, a Netflix-style desktop media player for your local video files! This application provides a beautiful, intuitive interface for browsing and playing your media collection with a familiar Netflix-like experience.

---

## Table of Contents
1. [Getting Started](#getting-started)
2. [Main Interface](#main-interface)
3. [Media Player](#media-player)
4. [Navigation & Controls](#navigation--controls)
5. [Keyboard Shortcuts](#keyboard-shortcuts)
6. [Features Overview](#features-overview)
7. [Supported File Formats](#supported-file-formats)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Launch
1. **Launch the Application**: Double-click the Notflix executable or run it from your applications folder
2. **Select Media Folder**: Click the "Select Folder" button in the top-right corner of the header
3. **Choose Your Media Directory**: Use the folder picker to select a directory containing your video files
4. **Wait for Processing**: The app will scan your folder and generate thumbnails for all video files (this may take a moment for large collections)

### Loading Previous Folders
- If you've used the app before, you'll see a "Load Last Folder" button that will automatically load your previously selected media folder

---

## Main Interface

### Header Section
- **Notflix Logo**: Displays the application branding
- **Folder Selector**: Shows current folder path and provides options to change folders
- **Current Folder Display**: Shows the currently loaded media folder path
- **Change Button**: Allows you to select a different media folder

### Featured Video Section
- **Large Hero Display**: The currently selected video appears in a large featured section
- **Video Information**: Shows title, duration, file size, and metadata
- **Action Buttons**: 
  - **Play**: Start the video from the beginning
  - **Resume**: Continue from where you left off (if available)
- **Progress Indicator**: Shows how much of the video you've already watched

### Media Carousels
- **Folder Organization**: Videos are organized by their containing folders
- **Horizontal Scrolling**: Each folder's videos are displayed in scrollable horizontal rows
- **Thumbnail Display**: Each video shows a generated thumbnail with hover effects
- **Progress Bars**: Red progress bars indicate how much of each video you've watched
- **Metadata Display**: Shows video title, duration, file size, and other details

---

## Media Player

### Player Interface
- **Full-Screen Experience**: The media player takes over the entire screen
- **Loading Animation**: A Netflix-style loading animation plays before your video starts
- **Video Display**: Your video plays with proper aspect ratio and scaling

### Player Controls
The player controls appear at the bottom of the screen and auto-hide when not in use:

#### Playback Controls
- **Play/Pause Button**: Large circular button to start or pause playback
- **Progress Bar**: Click or drag to seek to any position in the video
- **Time Display**: Shows current time and total duration

#### Audio Controls
- **Mute Button**: Toggle audio on/off
- **Volume Slider**: Adjust volume level from 0 to 100%

#### Display Controls
- **Fullscreen Toggle**: Enter or exit fullscreen mode
- **Close Button**: Return to the main interface

### Auto-Hide Controls
- Controls automatically hide after 3 seconds of inactivity when playing
- Move your mouse to reveal controls again
- Controls remain visible when video is paused

---

## Navigation & Controls

### Mouse Navigation
- **Click on Videos**: Select any video to make it the featured video
- **Hover Effects**: Videos scale up slightly when you hover over them
- **Scroll**: Use mouse wheel or drag to scroll through video carousels
- **Click to Play**: Click the Play or Resume buttons to start playback

### Folder Navigation
- **Folder Selection**: The app automatically detects subfolders in your selected directory
- **Parent Folder Indicator**: The main folder you selected is marked with a "PARENT" badge
- **Subfolder Organization**: Videos in subfolders are displayed in separate carousels

---

## Keyboard Shortcuts

### Main Interface Navigation
| Key | Action |
|-----|--------|
| **↑** | Navigate to previous folder |
| **↓** | Navigate to next folder |
| **←** | Navigate to previous video in current folder |
| **→** | Navigate to next video in current folder |
| **Enter** | Play the currently selected video |

### Media Player Controls
| Key | Action |
|-----|--------|
| **Spacebar** | Play/Pause video |
| **F** | Toggle fullscreen mode |
| **M** | Mute/Unmute audio |
| **Escape** | Exit fullscreen or close player |

### Additional Features
- **Auto-Scroll**: The interface automatically scrolls to keep selected items visible
- **Smooth Transitions**: All navigation includes smooth animations and transitions
- **Progress Saving**: Your viewing progress is automatically saved every 15 seconds

---

## Features Overview

### Smart Media Detection
- **Automatic Scanning**: Detects all supported video files in selected folders
- **Metadata Extraction**: Extracts video information including duration, resolution, codec, and more
- **Thumbnail Generation**: Automatically generates thumbnails for all video files
- **Progress Tracking**: Remembers where you left off in each video

### Netflix-Style Experience
- **Dark Theme**: Beautiful dark interface matching Netflix's aesthetic
- **Hover Effects**: Smooth scaling and visual feedback on interaction
- **Responsive Design**: Adapts to different window sizes and screen resolutions
- **Loading Animations**: Professional loading screens and transitions

### Advanced Features
- **Resume Playback**: Continue watching from where you left off
- **Progress Indicators**: Visual progress bars on video thumbnails
- **File Information**: Detailed metadata display including file size, duration, and format
- **Cross-Platform**: Works on Windows, macOS, and Linux

---

## Supported File Formats

### Video Formats
The application supports the following video file formats:
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

### Metadata Support
For each video file, the app extracts:
- **Duration**: Video length in seconds
- **Resolution**: Width and height in pixels
- **Bitrate**: Video quality information
- **Codec**: Video and audio codec details
- **Frame Rate**: Frames per second
- **Title**: Video title from metadata tags
- **Authors**: Creator information from metadata tags

---

## Troubleshooting

### Common Issues

#### Videos Not Playing
- **Check File Format**: Ensure your video file is in a supported format
- **File Corruption**: Try playing the file in another media player to verify it's not corrupted
- **Codec Issues**: Some videos may have unsupported codecs - try converting to MP4 format

#### Thumbnails Not Generating
- **Wait for Processing**: Thumbnail generation may take time for large folders
- **Check File Permissions**: Ensure the app has permission to read your video files
- **Restart Application**: Close and reopen the app if thumbnails fail to generate

#### App Not Starting
- **Check Dependencies**: Ensure all required system libraries are installed
- **Update Application**: Try downloading the latest version
- **Check System Requirements**: Verify your system meets minimum requirements

#### Performance Issues
- **Large Folders**: Processing very large media collections may take time
- **System Resources**: Close other applications to free up memory
- **Hardware Acceleration**: Ensure your graphics drivers are up to date

### Getting Help
- **Console Logs**: Check the application console for detailed error messages
- **File Permissions**: Ensure the app has access to your media folders
- **System Compatibility**: Verify your operating system is supported

---

## Tips & Best Practices

### Organizing Your Media
- **Use Descriptive Folders**: Organize videos in meaningful folder structures
- **Consistent Naming**: Use clear, descriptive file names
- **Regular Backups**: Keep backups of your media collection

### Performance Optimization
- **Limit Folder Size**: Very large folders may slow down the application
- **Regular Cleanup**: Remove unwanted or duplicate files
- **SSD Storage**: Using solid-state drives can improve loading times

### User Experience
- **Keyboard Navigation**: Use arrow keys for quick navigation
- **Progress Tracking**: The app remembers your progress across sessions
- **Fullscreen Mode**: Use F key for immersive viewing experience

---

## System Requirements

### Minimum Requirements
- **Operating System**: Windows 10, macOS 10.14, or Linux (Ubuntu 18.04+)
- **Memory**: 4GB RAM
- **Storage**: 100MB free space for application
- **Graphics**: Basic graphics support

### Recommended Requirements
- **Operating System**: Latest version of Windows, macOS, or Linux
- **Memory**: 8GB RAM or more
- **Storage**: SSD with 500MB+ free space
- **Graphics**: Hardware acceleration support

---

*Notflix - Bringing the Netflix experience to your local media collection*

**Version**: 1.0.0  
**Last Updated**: 2025  
**License**: MIT`;

  // Convert markdown to HTML (simple conversion for basic formatting)
  const convertMarkdownToHTML = (markdown: string): string => {
    let html = markdown;
    
    // Tables - handle them first to avoid conflicts
    const tableRegex = /\|(.+)\|\n\|(.+)\|\n((?:\|.+\|\n?)+)/g;
    html = html.replace(tableRegex, (match, headerRow, separatorRow, dataRows) => {
      const headers = headerRow.split('|').map((h: string) => h.trim()).filter((h: string) => h);
      const data = dataRows.split('\n').map((row: string) => 
        row.split('|').map((cell: string) => cell.trim()).filter((cell: string) => cell)
      ).filter((row: string[]) => row.length > 0);
      
      let tableHTML = '<table class="border-collapse border border-netflix-gray mb-6 w-full">';
      
      // Header row
      tableHTML += '<thead><tr>';
      headers.forEach((header: string) => {
        tableHTML += `<th class="border border-netflix-gray px-3 py-2 text-left font-semibold text-white">${header}</th>`;
      });
      tableHTML += '</tr></thead>';
      
      // Data rows
      tableHTML += '<tbody>';
      data.forEach((row: string[]) => {
        tableHTML += '<tr>';
        row.forEach((cell: string) => {
          tableHTML += `<td class="border border-netflix-gray px-3 py-2 text-netflix-light-gray">${cell}</td>`;
        });
        tableHTML += '</tr>';
      });
      tableHTML += '</tbody></table>';
      
      return tableHTML;
    });
    
    // Headers
    html = html
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mb-3 mt-6">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mb-4 mt-8">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mb-6">$1</h1>');
    
    // Bold and italic
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Code
    html = html.replace(/`(.*?)`/g, '<code class="bg-netflix-gray px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Lists
    html = html
      .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-2 text-netflix-light-gray">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2 text-netflix-light-gray">$1</li>');
    
    // Wrap lists in ul tags
    html = html.replace(/(<li.*<\/li>)/gs, '<ul class="mb-4">$1</ul>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-netflix-red hover:underline">$1</a>');
    
    // Line breaks and paragraphs
    html = html
      .replace(/\n\n/g, '</p><p class="mb-4 text-netflix-light-gray leading-relaxed">')
      .replace(/\n/g, '<br>');
    
    // Wrap remaining text in paragraphs
    html = html.replace(/^(?!<[h|p|u|o|t|d|b])(.*)/gim, '<p class="mb-4 text-netflix-light-gray leading-relaxed">$1</p>');
    
    // Clean up empty paragraphs
    html = html.replace(/<p class="mb-4 text-netflix-light-gray leading-relaxed"><\/p>/g, '');
    
    return html;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-netflix-dark max-w-4xl w-full max-h-[90vh] rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-netflix-black px-6 py-4 border-b border-netflix-gray flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">User Guide</h1>
          <button
            onClick={onClose}
            className="text-netflix-light-gray hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: convertMarkdownToHTML(guideContent) 
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserGuideModal; 