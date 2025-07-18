import React from 'react';
import { MediaFile } from '../types/media';
import { useMediaFiles } from '../context/MediaContext';
import MediaCard from './MediaCard';

interface MediaGridProps {
  onMediaSelect: (media: MediaFile) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ onMediaSelect }) => {
  const { mediaFiles, selectedFolder } = useMediaFiles();

  console.log('MediaGrid render - selectedFolder:', selectedFolder);
  console.log('MediaGrid render - mediaFiles:', mediaFiles);

  if (!selectedFolder) {
    console.log('MediaGrid: No selected folder, returning null');
    return null;
  }

  if (mediaFiles.length === 0) {
    return (
      <div className="px-8 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-netflix-dark rounded-lg p-8 border border-netflix-gray">
            <h3 className="text-xl font-semibold text-white mb-4">
              No Media Files Found
            </h3>
            <p className="text-netflix-light-gray">
              The selected folder doesn't contain any supported media files.
            </p>
            <p className="text-netflix-gray text-sm mt-2">
              Supported formats: MP4, AVI, MKV, MOV, WMV, FLV, WebM, M4V, MP3, WAV, FLAC, AAC, OGG, M4A
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Your Media Library
          </h2>
          <p className="text-netflix-light-gray">
            {mediaFiles.length} media file{mediaFiles.length !== 1 ? 's' : ''} found
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {mediaFiles.map((media) => (
            <MediaCard
              key={media.id}
              media={media}
              onClick={onMediaSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaGrid; 