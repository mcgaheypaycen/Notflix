import React, { useState } from 'react';
import { MediaFile } from './types/media';
import CompactFolderSelector from './components/CompactFolderSelector';
import FolderCarousel from './components/FolderCarousel';
import MediaPlayer from './components/MediaPlayer';
import UserGuideModal from './components/UserGuideModal';
import { MediaProvider } from './context/MediaContext';
import logoImage from './assets/Notflix Logo.png';

function App() {
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [showUserGuide, setShowUserGuide] = useState(false);

  // Listen for user guide open request from menu
  React.useEffect(() => {
    if (window.electronAPI?.onOpenUserGuide) {
      window.electronAPI.onOpenUserGuide(() => {
        setShowUserGuide(true);
      });
    }
  }, []);

  const handleMediaSelect = (media: MediaFile) => {
    setSelectedMedia(media);
    setShowPlayer(true);
  };

  const handlePlayFromStart = (media: MediaFile) => {
    setSelectedMedia(media);
    setStartTime(0);
    setShowPlayer(true);
  };

  const handleResume = (media: MediaFile) => {
    const saved = localStorage.getItem('netflix-clone-progress');
    const progress = saved ? JSON.parse(saved) : {};
    const resumeTime = progress[media.id] || 0;
    
    setSelectedMedia(media);
    setStartTime(resumeTime);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
    setSelectedMedia(null);
    setStartTime(0);
  };

  const handleOpenUserGuide = () => {
    setShowUserGuide(true);
  };

  const handleCloseUserGuide = () => {
    setShowUserGuide(false);
  };

  return (
    <MediaProvider>
      <div className="min-h-screen bg-netflix-black">
        {showPlayer && selectedMedia ? (
          <MediaPlayer 
            media={selectedMedia} 
            onClose={handleClosePlayer}
            startTime={startTime}
          />
        ) : (
          <div className="min-h-screen bg-netflix-black">
            {/* Netflix-style Header with integrated folder selector */}
            <header className="bg-netflix-dark text-white px-8 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={logoImage} alt="Notflix" className="h-20 w-auto" />
              </div>
              <CompactFolderSelector />
            </header>

            {/* Main Content */}
            <main className="pt-20 min-h-screen">
              <div className="px-8">
                <FolderCarousel 
                  onMediaSelect={handleMediaSelect}
                  onPlayFromStart={handlePlayFromStart}
                  onResume={handleResume}
                />
              </div>
            </main>
          </div>
        )}

        {/* User Guide Modal */}
        <UserGuideModal 
          isOpen={showUserGuide}
          onClose={handleCloseUserGuide}
        />
      </div>
    </MediaProvider>
  );
}

export default App; 