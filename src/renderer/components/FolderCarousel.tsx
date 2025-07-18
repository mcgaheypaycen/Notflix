import React, { useState, useRef, useEffect } from 'react';
import { MediaFile, MediaFolder } from '../types/media';
import { formatFileSize, formatDuration, getDefaultThumbnail } from '../utils/mediaUtils';
import { useMediaFiles } from '../context/MediaContext';
import FeaturedVideo from './FeaturedVideo';

interface FolderCarouselProps {
  onMediaSelect: (media: MediaFile) => void;
  onPlayFromStart: (media: MediaFile) => void;
  onResume: (media: MediaFile) => void;
}

const FolderCarousel: React.FC<FolderCarouselProps> = ({
  onMediaSelect,
  onPlayFromStart,
  onResume
}) => {
  const { mediaFolders, loading, thumbnailProgress } = useMediaFiles();
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(0);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [playbackProgress, setPlaybackProgress] = useState<Record<string, number>>({});
  const carouselRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // Load saved playback progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('netflix-clone-progress');
    if (saved) {
      try {
        setPlaybackProgress(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading playback progress:', error);
      }
    }
  }, []);

  // Save playback progress to localStorage
  const saveProgress = (mediaId: string, progress: number) => {
    const newProgress = { ...playbackProgress, [mediaId]: progress };
    setPlaybackProgress(newProgress);
    localStorage.setItem('netflix-clone-progress', JSON.stringify(newProgress));
  };

  // Auto-scroll to keep selected item visible
  const scrollToSelectedItem = (folderIndex: number, mediaIndex: number) => {
    const carouselRef = carouselRefs.current[folderIndex];
    if (carouselRef) {
      const container = carouselRef.querySelector('.flex.space-x-4') as HTMLElement;
      const items = container?.children;
      if (items && items[mediaIndex]) {
        const selectedItem = items[mediaIndex] as HTMLElement;
        const containerRect = container.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();
        
        // Calculate scroll position to center the item
        const scrollLeft = selectedItem.offsetLeft - (container.offsetWidth / 2) + (selectedItem.offsetWidth / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  // Auto-scroll to keep selected folder visible
  const scrollToSelectedFolder = (folderIndex: number) => {
    if (mainContainerRef.current) {
      const folderElements = mainContainerRef.current.querySelectorAll('.folder-container');
      if (folderElements[folderIndex]) {
        const selectedFolderElement = folderElements[folderIndex] as HTMLElement;
        selectedFolderElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle navigation between folders and media items
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (selectedFolderIndex > 0) {
          const newFolderIndex = selectedFolderIndex - 1;
          setSelectedFolderIndex(newFolderIndex);
          setSelectedMediaIndex(0);
          // Scroll to the new folder and its first item
          setTimeout(() => {
            scrollToSelectedFolder(newFolderIndex);
            scrollToSelectedItem(newFolderIndex, 0);
          }, 100);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (selectedFolderIndex < mediaFolders.length - 1) {
          const newFolderIndex = selectedFolderIndex + 1;
          setSelectedFolderIndex(newFolderIndex);
          setSelectedMediaIndex(0);
          // Scroll to the new folder and its first item
          setTimeout(() => {
            scrollToSelectedFolder(newFolderIndex);
            scrollToSelectedItem(newFolderIndex, 0);
          }, 100);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        const currentFolder = mediaFolders[selectedFolderIndex];
        if (selectedMediaIndex > 0) {
          const newMediaIndex = selectedMediaIndex - 1;
          setSelectedMediaIndex(newMediaIndex);
          scrollToSelectedItem(selectedFolderIndex, newMediaIndex);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        const currentFolderRight = mediaFolders[selectedFolderIndex];
        if (selectedMediaIndex < currentFolderRight.mediaFiles.length - 1) {
          const newMediaIndex = selectedMediaIndex + 1;
          setSelectedMediaIndex(newMediaIndex);
          scrollToSelectedItem(selectedFolderIndex, newMediaIndex);
        }
        break;
      case 'Enter':
        e.preventDefault();
        const selectedFolder = mediaFolders[selectedFolderIndex];
        const selectedMedia = selectedFolder.mediaFiles[selectedMediaIndex];
        if (selectedMedia) {
          onMediaSelect(selectedMedia);
        }
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedFolderIndex, selectedMediaIndex, mediaFolders]);

  // Initialize carousel refs array
  useEffect(() => {
    carouselRefs.current = carouselRefs.current.slice(0, mediaFolders.length);
  }, [mediaFolders.length]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
        <p className="text-netflix-light-gray text-lg">Loading media files and generating thumbnails...</p>
        {thumbnailProgress.total > 0 && (
          <div className="w-64 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-netflix-red h-2 rounded-full transition-all duration-300"
              style={{ width: `${(thumbnailProgress.current / thumbnailProgress.total) * 100}%` }}
            />
          </div>
        )}
        <p className="text-netflix-light-gray text-sm">
          {thumbnailProgress.total > 0 
            ? `${thumbnailProgress.current} of ${thumbnailProgress.total} thumbnails generated`
            : 'This may take a moment for large folders'
          }
        </p>
      </div>
    );
  }

  if (mediaFolders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-netflix-light-gray text-lg">No folders found</p>
      </div>
    );
  }

  // Get the currently selected media for the featured video
  const selectedFolder = mediaFolders[selectedFolderIndex];
  const featuredMedia = selectedFolder?.mediaFiles[selectedMediaIndex];
  const featuredProgress = featuredMedia ? playbackProgress[featuredMedia.id] || 0 : 0;

  return (
    <div className="space-y-8" ref={mainContainerRef}>
      {/* Featured Video Section */}
      {featuredMedia && (
        <FeaturedVideo
          media={featuredMedia}
          onPlayFromStart={onPlayFromStart}
          onResume={onResume}
          playbackProgress={featuredProgress}
        />
      )}

      {/* Media Folders */}
      {mediaFolders.map((folder, folderIndex) => (
        <div key={folder.id} className="space-y-4 folder-container">
          {/* Folder Title */}
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-white">{folder.name}</h2>
            {folder.isParent && (
              <span className="bg-netflix-red text-white px-2 py-1 text-xs rounded">PARENT</span>
            )}

          </div>

          {/* Media Carousel */}
          {folder.mediaFiles.length > 0 ? (
            <div className="relative" ref={(el) => carouselRefs.current[folderIndex] = el}>
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 pl-4 pr-4 scroll-smooth">
                {folder.mediaFiles.map((media, mediaIndex) => (
                  <div
                    key={media.id}
                    className={`flex-shrink-0 w-72 transition-all duration-300 cursor-pointer ${
                      folderIndex === selectedFolderIndex && mediaIndex === selectedMediaIndex
                        ? 'transform scale-110 z-20' 
                        : 'transform scale-100 hover:scale-105'
                    }`}
                    onClick={() => {
                      setSelectedFolderIndex(folderIndex);
                      setSelectedMediaIndex(mediaIndex);
                    }}
                  >
                    <div className="relative aspect-video bg-netflix-dark rounded-lg overflow-hidden">
                      {!media.thumbnail ? (
                        <div className="w-full h-full flex items-center justify-center bg-netflix-dark">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-netflix-red"></div>
                            <p className="text-netflix-light-gray text-xs">Generating thumbnail...</p>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={media.thumbnail}
                          alt={media.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getDefaultThumbnail('video');
                          }}
                        />
                      )}
                      
                      {/* Progress Overlay */}
                      {playbackProgress[media.id] && playbackProgress[media.id] > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                          <div className="w-full bg-gray-600 rounded-full h-1">
                            <div 
                              className="bg-netflix-red h-1 rounded-full transition-all duration-300"
                              style={{ width: `${(playbackProgress[media.id] / (media.metadata?.duration || 1)) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action Buttons Overlay */}
                      {folderIndex === selectedFolderIndex && mediaIndex === selectedMediaIndex && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPlayFromStart(media);
                            }}
                            className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors"
                          >
                            Play
                          </button>
                          
                          {playbackProgress[media.id] && playbackProgress[media.id] > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onResume(media);
                              }}
                              className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white px-4 py-2 rounded text-sm transition-colors"
                            >
                              Resume
                            </button>
                          )}
                        </div>
                      )}


                    </div>

                    {/* Media Info */}
                    <div className="mt-2">
                      <h3 className="text-white font-semibold truncate">{media.metadata?.title || media.name}</h3>
                      {media.metadata?.authors && (
                        <p className="text-netflix-light-gray text-sm truncate">
                          {Array.isArray(media.metadata.authors) ? media.metadata.authors.join(', ') : media.metadata.authors}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-netflix-light-gray mt-1">
                        <span>{media.type.toUpperCase()}</span>
                        {media.metadata?.duration && (
                          <span>{formatDuration(media.metadata.duration)}</span>
                        )}
                        <span>{formatFileSize(media.size)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-netflix-dark rounded-lg">
              <p className="text-netflix-light-gray">No media files in this folder</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FolderCarousel; 