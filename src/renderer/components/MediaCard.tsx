import React from 'react';
import { MediaFile } from '../types/media';
import { formatFileSize, getDefaultThumbnail } from '../utils/mediaUtils';

interface MediaCardProps {
  media: MediaFile;
  onClick: (media: MediaFile) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick }) => {
  const thumbnail = media.thumbnail || getDefaultThumbnail(media.type);

  return (
    <div 
      className="media-card group"
      onClick={() => onClick(media)}
    >
      <div className="relative aspect-video bg-netflix-dark rounded-md overflow-hidden">
        <img 
          src={thumbnail} 
          alt={media.name}
          className="w-full h-full object-cover"
        />
        
        <div className="media-overlay">
          <div className="play-button">
            <svg 
              className="w-8 h-8" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        </div>
        
        {/* Media type indicator */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs font-medium">
          {media.type.toUpperCase()}
        </div>
      </div>
      
      {/* Media info */}
      <div className="mt-3 px-1">
        <h3 className="text-white font-medium text-sm truncate">
          {media.name}
        </h3>
        <p className="text-netflix-gray text-xs mt-1">
          {formatFileSize(media.size)}
        </p>
        {media.metadata?.duration && (
          <p className="text-netflix-gray text-xs">
            {Math.floor(media.metadata.duration / 60)}m {Math.floor(media.metadata.duration % 60)}s
          </p>
        )}
      </div>
    </div>
  );
};

export default MediaCard; 