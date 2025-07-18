import React, { useRef, useEffect, useState } from 'react';
import { MediaFile } from '../types/media';
import { formatDuration } from '../utils/mediaUtils';
import loadingVideo from '../assets/netflix-loading.mp4';

interface MediaPlayerProps {
  media: MediaFile;
  onClose: () => void;
  startTime?: number;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ media, onClose, startTime = 0 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Show loading screen first
  const [showMainVideo, setShowMainVideo] = useState(false); // Hide main video until loading completes


  useEffect(() => {
    const video = videoRef.current;
    if (!video || !showMainVideo) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      if (startTime > 0) {
        video.currentTime = startTime;
      }
      console.log('Video loaded, muted state:', video.muted);
      
      // Don't auto-play immediately - wait for loading screen to complete
      // Auto-play will be handled by handleLoadingComplete
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [startTime, showMainVideo]);

  // Check fullscreen state on mount
  useEffect(() => {
    const checkFullscreenState = async () => {
      try {
        const fullscreenState = await window.electronAPI.isFullscreen();
        setIsFullscreen(fullscreenState);
      } catch (error) {
        console.error('Error checking fullscreen state:', error);
      }
    };
    
    checkFullscreenState();
  }, []);

  // Auto-hide controls after inactivity - Optimized version
  useEffect(() => {
    let controlsTimeoutId: NodeJS.Timeout | null = null;
    let lastMouseMoveTime = 0;
    const THROTTLE_DELAY = 200; // Throttle mouse events to 200ms

    const resetControlsTimeout = () => {
      if (controlsTimeoutId) {
        clearTimeout(controlsTimeoutId);
      }
      
      controlsTimeoutId = setTimeout(() => {
        setShowControls(false);
      }, 3000); // Hide after 3 seconds of inactivity
    };

    const handleMouseMove = () => {
      const now = Date.now();
      
      // Throttle mouse movement events
      if (now - lastMouseMoveTime < THROTTLE_DELAY) {
        return;
      }
      lastMouseMoveTime = now;

      // Only update state if controls are not visible
      if (!showControls) {
        setShowControls(true);
      }
      
      resetControlsTimeout();
    };

    const handleMouseLeave = () => {
      if (controlsTimeoutId) {
        clearTimeout(controlsTimeoutId);
      }
    };

    // Only auto-hide controls when video is playing
    if (isPlaying) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
      resetControlsTimeout();

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        if (controlsTimeoutId) {
          clearTimeout(controlsTimeoutId);
        }
      };
    } else {
      // Always show controls when paused
      setShowControls(true);
      if (controlsTimeoutId) {
        clearTimeout(controlsTimeoutId);
      }
    }
  }, [isPlaying, showControls]);

  // Save progress periodically - Optimized
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const saved = localStorage.getItem('notflix-progress');
        const progress = saved ? JSON.parse(saved) : {};
        progress[media.id] = currentTime;
        localStorage.setItem('notflix-progress', JSON.stringify(progress));
      }, 15000); // Save every 15 seconds instead of 5

      setProgressInterval(interval);

      return () => {
        if (interval) clearInterval(interval);
      };
    } else {
      if (progressInterval) {
        clearInterval(progressInterval);
        setProgressInterval(null);
      }
    }
  }, [isPlaying, currentTime, media.id]);

  // Save progress when component unmounts
  useEffect(() => {
    return () => {
      const saved = localStorage.getItem('notflix-progress');
      const progress = saved ? JSON.parse(saved) : {};
      progress[media.id] = currentTime;
      localStorage.setItem('notflix-progress', JSON.stringify(progress));
    };
  }, [media.id, currentTime]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    
    // Unmute if volume is increased from 0
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setShowMainVideo(true);
    // Start the main video after a brief pause for dramatic effect
    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.play().catch((error) => {
          console.log('Auto-play failed:', error);
        });
      }
    }, 500);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) {
      console.log('Video element not found');
      return;
    }

    const newMutedState = !isMuted;
    console.log('Toggling mute from', isMuted, 'to', newMutedState);
    video.muted = newMutedState;
    setIsMuted(newMutedState);
    console.log('Video muted property set to:', video.muted);
  };

  const toggleFullscreen = async () => {
    try {
      const newFullscreenState = await window.electronAPI.toggleFullscreen();
      console.log('Fullscreen state changed to:', newFullscreenState);
      setIsFullscreen(newFullscreenState);
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlay();
        break;
      case 'Escape':
        if (isFullscreen) {
          toggleFullscreen();
        } else {
          onClose();
        }
        break;
      case 'KeyF':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'KeyM':
        e.preventDefault();
        toggleMute();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isMuted, isFullscreen]);

  // Check initial fullscreen state only once
  useEffect(() => {
    const checkInitialFullscreenState = async () => {
      try {
        const fullscreenState = await window.electronAPI.isFullscreen();
        setIsFullscreen(fullscreenState);
      } catch (error) {
        console.error('Error checking initial fullscreen state:', error);
      }
    };

    checkInitialFullscreenState();
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Loading Screen */}
      {isLoading && (
        <div className="relative w-full h-full">
                              <video
                      src={loadingVideo}
                      className="w-full h-full object-contain"
                      autoPlay
                      onEnded={handleLoadingComplete}
                    />
        </div>
      )}

      {/* Main Video Player */}
      {showMainVideo && (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={`file://${media.path}`}
            className="w-full h-full object-contain"
            onClick={() => {
              if (isPlaying) {
                setShowControls(!showControls);
              } else {
                togglePlay();
              }
            }}
          />

        {/* Controls Overlay */}
        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="max-w-4xl mx-auto">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-netflix-gray rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-netflix-light-gray mt-1">
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={togglePlay}
                    className="text-white hover:text-netflix-red transition-colors"
                  >
                    {isPlaying ? (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Mute button clicked');
                        toggleMute();
                      }}
                      className="text-netflix-light-gray hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-2.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.5l3.883-2.793a1 1 0 011.617.793z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-netflix-gray rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleFullscreen}
                    className="text-netflix-light-gray hover:text-white transition-colors"
                  >
                    {isFullscreen ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    className="text-netflix-light-gray hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Title Bar - Only show when not in fullscreen */}
        {showControls && !isFullscreen ? (
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-white font-semibold truncate">{media.name}</h1>
              <button
                onClick={onClose}
                className="text-netflix-light-gray hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ) : null}
        </div>
      )}
    </div>
  );
};

export default MediaPlayer; 