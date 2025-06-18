import { useState, useEffect, useCallback } from 'react';
import { MediaFile, PlayerState, FavoriteItem, HistoryItem } from '../types';
import { useLocalStorage } from './useLocalStorage';

const defaultPlayerState: PlayerState = {
  currentMedia: '',
  isMinimized: false,
  volume: 1,
  isMuted: false,
  lastPosition: 0,
  isDarkMode: false,
  backgroundType: 'animated'
};

export function useMediaPlayer(defaultMedia: MediaFile[]) {
  const [playerState, setPlayerState] = useLocalStorage<PlayerState>('doro-player-state', defaultPlayerState);
  const [favorites, setFavorites] = useLocalStorage<FavoriteItem[]>('doro-player-favorites', []);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('doro-player-history', []);
  const [uploadedFiles, setUploadedFiles] = useLocalStorage<MediaFile[]>('doro-player-uploads', []);
  const [currentMediaInfo, setCurrentMediaInfo] = useState<MediaFile | null>(null);
  const [mediaKey, setMediaKey] = useState(0);

  // Combine all media sources
  const allMediaSources = [...defaultMedia, ...uploadedFiles];

  // Initialize with saved state or default
  useEffect(() => {
    if (!playerState.currentMedia && allMediaSources.length > 0) {
      setPlayerState(prev => ({ ...prev, currentMedia: allMediaSources[0].url }));
    }
  }, [allMediaSources, playerState.currentMedia, setPlayerState]);

  // Update current media info when URL changes
  useEffect(() => {
    const mediaInfo = allMediaSources.find(media => media.url === playerState.currentMedia) ||
                     favorites.find(fav => fav.url === playerState.currentMedia) ||
                     history.find(item => item.url === playerState.currentMedia);
    
    if (mediaInfo) {
      setCurrentMediaInfo({
        id: mediaInfo.id,
        name: mediaInfo.name,
        url: mediaInfo.url,
        type: mediaInfo.type || 'video'
      });
    } else if (playerState.currentMedia) {
      // For uploaded files, try to determine type from URL
      const isAudio = playerState.currentMedia.includes('audio') || 
                     playerState.currentMedia.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i);
      setCurrentMediaInfo({
        id: 'uploaded',
        name: 'Uploaded File',
        url: playerState.currentMedia,
        type: isAudio ? 'audio' : 'video'
      });
    }
  }, [playerState.currentMedia, allMediaSources, favorites, history]);

  // Save player state changes to localStorage
  useEffect(() => {
    const saveState = () => {
      try {
        localStorage.setItem('doro-player-state', JSON.stringify(playerState));
        localStorage.setItem('doro-player-favorites', JSON.stringify(favorites));
        localStorage.setItem('doro-player-history', JSON.stringify(history));
        localStorage.setItem('doro-player-uploads', JSON.stringify(uploadedFiles));
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    };

    saveState();
  }, [playerState, favorites, history, uploadedFiles]);

  const updatePlayerState = useCallback((updates: Partial<PlayerState>) => {
    setPlayerState(prev => {
      const newState = { ...prev, ...updates };
      // Immediately save to localStorage
      try {
        localStorage.setItem('doro-player-state', JSON.stringify(newState));
      } catch (error) {
        console.error('Failed to save player state:', error);
      }
      return newState;
    });
  }, [setPlayerState]);

  const changeMedia = useCallback((mediaUrl: string, mediaType?: 'video' | 'audio') => {
    updatePlayerState({ currentMedia: mediaUrl });
    setMediaKey(prev => prev + 1);
    
    // Add to history
    const mediaInfo = allMediaSources.find(m => m.url === mediaUrl) ||
                     favorites.find(f => f.url === mediaUrl);
    
    if (mediaInfo) {
      addToHistory(mediaInfo);
    } else {
      // For uploaded files
      const isAudio = mediaType === 'audio' || mediaUrl.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/i);
      const uploadedMedia: MediaFile = {
        id: `uploaded-${Date.now()}`,
        name: 'Uploaded File',
        url: mediaUrl,
        type: isAudio ? 'audio' : 'video'
      };
      
      // Add to uploaded files list
      setUploadedFiles(prev => {
        const exists = prev.find(file => file.url === mediaUrl);
        if (exists) return prev;
        const newUploads = [...prev, uploadedMedia];
        // Save immediately
        try {
          localStorage.setItem('doro-player-uploads', JSON.stringify(newUploads));
        } catch (error) {
          console.error('Failed to save uploaded files:', error);
        }
        return newUploads;
      });
      
      addToHistory(uploadedMedia);
    }
    
    // Auto-minimize for audio files on mobile
    if (mediaType === 'audio' && window.innerWidth < 768) {
      updatePlayerState({ isMinimized: true });
    }
  }, [updatePlayerState, allMediaSources, favorites, setUploadedFiles]);

  const toggleMinimized = useCallback(() => {
    updatePlayerState({ isMinimized: !playerState.isMinimized });
  }, [playerState.isMinimized, updatePlayerState]);

  const addToFavorites = useCallback((media: MediaFile) => {
    const newFavorite: FavoriteItem = {
      ...media,
      addedAt: Date.now()
    };
    setFavorites(prev => {
      const exists = prev.find(fav => fav.url === media.url);
      if (exists) return prev;
      const newFavorites = [...prev, newFavorite];
      // Save immediately
      try {
        localStorage.setItem('doro-player-favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
      return newFavorites;
    });
  }, [setFavorites]);

  const removeFromFavorites = useCallback((mediaUrl: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(fav => fav.url !== mediaUrl);
      // Save immediately
      try {
        localStorage.setItem('doro-player-favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
      return newFavorites;
    });
  }, [setFavorites]);

  const addToHistory = useCallback((media: MediaFile) => {
    const historyItem: HistoryItem = {
      ...media,
      playedAt: Date.now()
    };
    
    setHistory(prev => {
      // Remove existing entry if it exists
      const filtered = prev.filter(item => item.url !== media.url);
      // Add to beginning and keep only last 10 items
      const newHistory = [historyItem, ...filtered].slice(0, 10);
      // Save immediately
      try {
        localStorage.setItem('doro-player-history', JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save history:', error);
      }
      return newHistory;
    });
  }, [setHistory]);

  const toggleDarkMode = useCallback(() => {
    updatePlayerState({ isDarkMode: !playerState.isDarkMode });
  }, [playerState.isDarkMode, updatePlayerState]);

  const toggleBackground = useCallback(() => {
    updatePlayerState({ 
      backgroundType: playerState.backgroundType === 'animated' ? 'static' : 'animated' 
    });
  }, [playerState.backgroundType, updatePlayerState]);

  return {
    playerState,
    currentMediaInfo,
    favorites,
    history,
    uploadedFiles,
    allMediaSources,
    mediaKey,
    updatePlayerState,
    changeMedia,
    toggleMinimized,
    addToFavorites,
    removeFromFavorites,
    addToHistory,
    toggleDarkMode,
    toggleBackground
  };
}