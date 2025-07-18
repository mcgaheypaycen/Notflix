import React from 'react';
import { MediaFile } from '../types/media';
import { formatFileSize, formatDuration, getDefaultThumbnail } from '../utils/mediaUtils';

interface FeaturedVideoProps {
  media: MediaFile;
  onPlayFromStart: (media: MediaFile) => void;
  onResume: (media: MediaFile) => void;
  playbackProgress?: number;
}

const FeaturedVideo: React.FC<FeaturedVideoProps> = ({
  media,
  onPlayFromStart,
  onResume,
  playbackProgress = 0
}) => {
  const hasProgress = playbackProgress > 0;

  return (
    <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {!media.thumbnail ? (
          <div className="w-full h-full flex items-center justify-center bg-netflix-dark">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
              <p className="text-netflix-light-gray text-lg">Generating thumbnail...</p>
            </div>
          </div>
        ) : (
          <img
            src={media.thumbnail}
            alt={media.metadata?.title || media.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getDefaultThumbnail('video');
            }}
          />
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-4xl">
          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-4">
            {media.metadata?.title || media.name}
          </h1>

          {/* Metadata */}
          <div className="flex items-center space-x-4 text-sm text-netflix-light-gray mb-6">
            <span className="text-green-400 font-semibold">98% Match</span>
            <span>{media.type.toUpperCase()}</span>
            {media.metadata?.duration && (
              <span>{formatDuration(media.metadata.duration)}</span>
            )}
            <span className="border border-gray-400 px-1">TV-MA</span>
            <span>{formatFileSize(media.size)}</span>
          </div>

          {/* Description */}
          {media.metadata?.authors && (
            <p className="text-white text-lg mb-6 max-w-2xl">
              {Array.isArray(media.metadata.authors) 
                ? media.metadata.authors.join(', ')
                : media.metadata.authors}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onPlayFromStart(media)}
              className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded font-semibold flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>Play</span>
            </button>

            {hasProgress && (
              <button
                onClick={() => onResume(media)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-8 py-3 rounded font-semibold flex items-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Resume</span>
              </button>
            )}


          </div>

          {/* Progress Bar */}
          {hasProgress && (
            <div className="mt-4">
              <div className="w-full bg-gray-600 rounded-full h-1">
                <div 
                  className="bg-netflix-red h-1 rounded-full transition-all duration-300"
                  style={{ width: `${(playbackProgress / (media.metadata?.duration || 1)) * 100}%` }}
                />
              </div>
              <p className="text-netflix-light-gray text-sm mt-2">
                {formatDuration(playbackProgress)} of {formatDuration(media.metadata?.duration || 0)} watched
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedVideo; 