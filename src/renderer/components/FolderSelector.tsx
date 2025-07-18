import React from 'react';
import { useMediaFiles } from '../context/MediaContext';

const FolderSelector: React.FC = () => {
  const { selectedFolder, loading, error, selectFolder, loadLastFolder, clearMediaFiles } = useMediaFiles();

  return (
    <div className="px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to Netflix Clone Media Player
          </h2>
          <p className="text-netflix-light-gray text-lg mb-8">
            Select a folder containing your media files to get started
          </p>
          
          {!selectedFolder ? (
            <div className="flex flex-col space-y-4">
              <button
                onClick={selectFolder}
                disabled={loading}
                className="bg-netflix-red hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Select Media Folder'}
              </button>
              {localStorage.getItem('netflix-clone-last-folder') && (
                <button
                  onClick={loadLastFolder}
                  disabled={loading}
                  className="bg-netflix-gray hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load Last Folder'}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-netflix-dark rounded-lg p-6 border border-netflix-gray">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Selected Folder</h3>
                <button
                  onClick={clearMediaFiles}
                  className="text-netflix-light-gray hover:text-white transition-colors"
                >
                  Change Folder
                </button>
              </div>
              <p className="text-netflix-light-gray break-all">{selectedFolder}</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-red-200">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderSelector; 