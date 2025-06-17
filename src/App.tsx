import React, { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import AudioPlayer from './components/AudioPlayer';
import UploadSection from './components/UploadSection';
import VideoSelector from './components/VideoSelector';
import ManualButton from './components/ManualButton';
import ThemeControls from './components/ThemeControls';
import CurrentMediaBanner from './components/CurrentMediaBanner';
import InstructionsModal from './components/InstructionsModal';
import FloatingShapes from './components/FloatingShapes';
import { useMediaPlayer } from './hooks/useMediaPlayer';
import { MediaFile } from './types';

const defaultVideos: MediaFile[] = [
  {
    id: 'ocean',
    name: 'Ocean Waves',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video'
  },
  {
    id: 'nature',
    name: 'Nature Scene',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    type: 'video'
  },
  {
    id: 'sunset',
    name: 'Sunset Timelapse',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    type: 'video'
  }
];

function App() {
  const {
    playerState,
    currentMediaInfo,
    favorites,
    history,
    mediaKey,
    updatePlayerState,
    changeMedia,
    toggleMinimized,
    addToFavorites,
    removeFromFavorites,
    toggleDarkMode,
    toggleBackground
  } = useMediaPlayer(defaultVideos);

  const [showInstructions, setShowInstructions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Apply dark mode to document
  useEffect(() => {
    if (playerState.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [playerState.isDarkMode]);

  // Auto-play last media on load
  useEffect(() => {
    if (playerState.currentMedia && currentMediaInfo) {
      // Auto-play the saved media
      setIsPlaying(true);
      
      // Auto-minimize for audio files
      if (currentMediaInfo.type === 'audio' && window.innerWidth < 768) {
        updatePlayerState({ isMinimized: true });
      }
    }
  }, [playerState.currentMedia, currentMediaInfo, updatePlayerState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'escape':
          if (showInstructions) {
            setShowInstructions(false);
          }
          break;
        case ' ':
          e.preventDefault();
          // Toggle play/pause logic would go here
          break;
        case 'm':
          updatePlayerState({ isMuted: !playerState.isMuted });
          break;
        case 'f':
          // Fullscreen logic would go here
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showInstructions, playerState.isMuted, updatePlayerState]);

  const handleFileUpload = (file: File, type: 'video' | 'audio') => {
    const fileUrl = URL.createObjectURL(file);
    changeMedia(fileUrl, type);
  };

  const handleVolumeChange = (volume: number) => {
    updatePlayerState({ volume });
  };

  const handleMuteChange = (isMuted: boolean) => {
    updatePlayerState({ isMuted });
  };

  const isAudioMode = currentMediaInfo?.type === 'audio';

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
      playerState.isDarkMode ? 'dark' : ''
    }`}>
      <FloatingShapes 
        backgroundType={playerState.backgroundType} 
        isDarkMode={playerState.isDarkMode}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <header className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Doro Player
            </span>
          </h1>
          <p className={`text-sm lg:text-base max-w-2xl mx-auto transition-colors duration-300 ${
            playerState.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your personal media center with persistent memory and advanced library features
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* Current Media Banner */}
          <CurrentMediaBanner 
            mediaInfo={currentMediaInfo}
            isPlaying={isPlaying}
            isDarkMode={playerState.isDarkMode}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Media Player - Takes full width on mobile, 2 columns on desktop */}
            <div className="lg:col-span-2 order-1">
              {isAudioMode ? (
                <AudioPlayer
                  src={playerState.currentMedia}
                  fileName={currentMediaInfo?.name || 'Audio File'}
                  key={mediaKey}
                  onVolumeChange={handleVolumeChange}
                  onMuteChange={handleMuteChange}
                  initialVolume={playerState.volume}
                  initialMuted={playerState.isMuted}
                  isDarkMode={playerState.isDarkMode}
                />
              ) : (
                <VideoPlayer 
                  src={playerState.currentMedia} 
                  key={mediaKey}
                  isMinimized={playerState.isMinimized}
                  onToggleMinimized={toggleMinimized}
                  onVolumeChange={handleVolumeChange}
                  onMuteChange={handleMuteChange}
                  initialVolume={playerState.volume}
                  initialMuted={playerState.isMuted}
                  isDarkMode={playerState.isDarkMode}
                />
              )}
            </div>

            {/* Controls Panel */}
            <div className="lg:col-span-1 order-2 space-y-6">
              <VideoSelector 
                videos={defaultVideos}
                favorites={favorites}
                history={history}
                onVideoSelect={changeMedia}
                onAddToFavorites={addToFavorites}
                onRemoveFromFavorites={removeFromFavorites}
                currentVideo={playerState.currentMedia}
                isDarkMode={playerState.isDarkMode}
              />
              
              <UploadSection 
                onFileUpload={handleFileUpload}
                isDarkMode={playerState.isDarkMode}
              />

              <ThemeControls
                isDarkMode={playerState.isDarkMode}
                backgroundType={playerState.backgroundType}
                onToggleDarkMode={toggleDarkMode}
                onToggleBackground={toggleBackground}
              />
              
              <ManualButton 
                onOpenInstructions={() => setShowInstructions(true)}
                isDarkMode={playerState.isDarkMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        isDarkMode={playerState.isDarkMode}
      />
    </div>
  );
}

export default App;