import React, { useState, useRef, useEffect } from 'react';
import { MediaFile } from '../types/media';
import { formatFileSize, formatDuration, getDefaultThumbnail } from '../utils/mediaUtils';
import { useMediaFiles } from '../context/MediaContext';

interface MediaCarouselProps {
  onMediaSelect: (media: MediaFile) => void;
  onPlayFromStart: (media: MediaFile) => void;
  onResume: (media: MediaFile) => void;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  onMediaSelect,
  onPlayFromStart,
  onResume
}) => {
  const { mediaFiles } = useMediaFiles();
  
  console.log('MediaCarousel: mediaFiles length:', mediaFiles.length);
  console.log('MediaCarousel: mediaFiles:', mediaFiles);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [playbackProgress, setPlaybackProgress] = useState<Record<string, number>>({});

  const selectedMedia = mediaFiles[selectedIndex];

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

  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= mediaFiles.length) return;
    
    setIsScrolling(true);
    setSelectedIndex(index);
    
    if (carouselRef.current) {
      const cardWidth = 300; // Approximate card width
      const scrollPosition = index * cardWidth - carouselRef.current.clientWidth / 2 + cardWidth / 2;
      carouselRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
    
    setTimeout(() => setIsScrolling(false), 500);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isScrolling) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        scrollToIndex(selectedIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        scrollToIndex(selectedIndex + 1);
        break;
      case 'Enter':
        e.preventDefault();
        onMediaSelect(selectedMedia);
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, isScrolling, selectedMedia]);

  if (mediaFiles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-netflix-light-gray text-lg">No media files found</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Featured Media Display */}
      <div className="relative h-96 mb-8 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        
        {selectedMedia && (
          <>
            {/* Background Image/Video */}
            <div className="absolute inset-0">
                               <img
                   src={selectedMedia.thumbnail || getDefaultThumbnail(selectedMedia.type)}
                   alt={selectedMedia.name}
                   className="w-full h-full object-cover"
                   onError={(e) => {
                     // Fallback to default thumbnail
                     const target = e.target as HTMLImageElement;
                     target.src = getDefaultThumbnail(selectedMedia.type);
                   }}
                 />
            </div>

            {/* Metadata Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
              <div className="max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4 animate-fade-in">
                  {selectedMedia.metadata?.title || selectedMedia.name}
                </h1>
                {selectedMedia.metadata?.authors && (
                  <div className="text-lg text-netflix-light-gray mb-2">
                    {Array.isArray(selectedMedia.metadata.authors) ? selectedMedia.metadata.authors.join(', ') : selectedMedia.metadata.authors}
                  </div>
                )}
                <div className="flex items-center space-x-4 mb-6 text-netflix-light-gray">
                  <span className="text-sm">{selectedMedia.type.toUpperCase()}</span>
                  {selectedMedia.metadata?.duration && (
                    <span className="text-sm">{formatDuration(selectedMedia.metadata.duration)}</span>
                  )}
                  <span className="text-sm">{formatFileSize(selectedMedia.size)}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onPlayFromStart(selectedMedia)}
                    className="bg-netflix-red hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Play from Start</span>
                  </button>

                  {playbackProgress[selectedMedia.id] && playbackProgress[selectedMedia.id] > 0 && (
                    <button
                      onClick={() => onResume(selectedMedia)}
                      className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      <span>Resume</span>
                    </button>
                  )}

                  <button
                    onClick={() => onMediaSelect(selectedMedia)}
                    className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>More Info</span>
                  </button>
                </div>

                {/* Progress Bar for Resume */}
                {playbackProgress[selectedMedia.id] && playbackProgress[selectedMedia.id] > 0 && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-600 rounded-full h-1">
                      <div 
                        className="bg-netflix-red h-1 rounded-full transition-all duration-300"
                        style={{ width: `${(playbackProgress[selectedMedia.id] / (selectedMedia.metadata?.duration || 1)) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-netflix-light-gray mt-1">
                      {formatDuration(playbackProgress[selectedMedia.id])} watched
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Carousel Navigation */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Your Media</h2>
          <div className="flex items-center space-x-2 text-netflix-light-gray">
            <span>Use arrow keys or scroll to navigate</span>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Left Arrow */}
          {selectedIndex > 0 && (
            <button
              onClick={() => scrollToIndex(selectedIndex - 1)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {selectedIndex < mediaFiles.length - 1 && (
            <button
              onClick={() => scrollToIndex(selectedIndex + 1)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          {/* Carousel Items */}
          <div
            ref={carouselRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {mediaFiles.map((media, index) => (
              <div
                key={media.id}
                className={`flex-shrink-0 w-72 transition-all duration-300 cursor-pointer ${
                  index === selectedIndex 
                    ? 'transform scale-110 z-20' 
                    : 'transform scale-100 hover:scale-105'
                }`}
                onClick={() => scrollToIndex(index)}
              >
                <div className="relative aspect-video bg-netflix-dark rounded-lg overflow-hidden">
                                     <img
                     src={media.thumbnail || getDefaultThumbnail(media.type)}
                     alt={media.name}
                     className="w-full h-full object-cover"
                     onError={(e) => {
                       const target = e.target as HTMLImageElement;
                       target.src = getDefaultThumbnail(media.type);
                     }}
                   />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-netflix-red text-white rounded-full p-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  {playbackProgress[media.id] && playbackProgress[media.id] > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                      <div 
                        className="h-full bg-netflix-red transition-all duration-300"
                        style={{ width: `${(playbackProgress[media.id] / (media.metadata?.duration || 1)) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* Media Type Badge */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs font-medium">
                    {media.type.toUpperCase()}
                  </div>
                </div>

                {/* Media Info */}
                <div className="mt-3 px-1">
                  <h3 className="text-white font-medium text-sm truncate">
                    {media.name}
                  </h3>
                  <p className="text-netflix-gray text-xs mt-1">
                    {formatFileSize(media.size)}
                  </p>
                  {media.metadata?.duration && (
                    <p className="text-netflix-gray text-xs">
                      {formatDuration(media.metadata.duration)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCarousel; 