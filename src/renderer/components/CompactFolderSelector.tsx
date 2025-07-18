import React from 'react';
import { useMediaFiles } from '../context/MediaContext';

const CompactFolderSelector: React.FC = () => {
  const { selectedFolder, loading, error, selectFolder, loadLastFolder, clearMediaFiles } = useMediaFiles();

  const hasLastFolder = localStorage.getItem('netflix-clone-last-folder');

  return (
    <div className="flex items-center space-x-4">
      {!selectedFolder ? (
        <div className="flex items-center space-x-2">
          <button
            onClick={selectFolder}
            disabled={loading}
            className="bg-netflix-red hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Select Folder'}
          </button>
          {hasLastFolder && (
            <button
              onClick={loadLastFolder}
              disabled={loading}
              className="bg-netflix-gray hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load Last Folder'}
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-netflix-light-gray text-xs">Folder:</span>
            <span className="text-white text-xs max-w-48 truncate">{selectedFolder}</span>
          </div>
          <button
            onClick={clearMediaFiles}
            className="bg-netflix-red hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors duration-200"
          >
            Change
          </button>
        </div>
      )}
      
      {error && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-red-900 border border-red-700 rounded text-xs">
          <p className="text-red-200">{error}</p>
        </div>
      )}
    </div>
  );
};

export default CompactFolderSelector; 