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
  const [playerState, setPlayerState] = useLocalStorage<PlayerState>('playerState', defaultPlayerState);
  const [favorites, setFavorites] = useLocalStorage<FavoriteItem[]>('favorites', []);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('playHistory', []);
  const [currentMediaInfo, setCurrentMediaInfo] = useState<MediaFile | null>(null);
  const [mediaKey, setMediaKey] = useState(0);

  // Initialize with saved state or default
  useEffect(() => {
    if (!playerState.currentMedia && defaultMedia.length > 0) {
      setPlayerState(prev => ({ ...prev, currentMedia: defaultMedia[0].url }));
    }
  }, [defaultMedia, playerState.currentMedia, setPlayerState]);

  // Update current media info when URL changes
  useEffect(() => {
    const mediaInfo = defaultMedia.find(media => media.url === playerState.currentMedia) ||
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
                     playerState.currentMedia.match(/\.(mp3|wav|ogg|m4a)$/i);
      setCurrentMediaInfo({
        id: 'uploaded',
        name: 'Uploaded File',
        url: playerState.currentMedia,
        type: isAudio ? 'audio' : 'video'
      });
    }
  }, [playerState.currentMedia, defaultMedia, favorites, history]);

  const updatePlayerState = useCallback((updates: Partial<PlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...updates }));
  }, [setPlayerState]);

  const changeMedia = useCallback((mediaUrl: string, mediaType?: 'video' | 'audio') => {
    updatePlayerState({ currentMedia: mediaUrl });
    setMediaKey(prev => prev + 1);
    
    // Add to history
    const mediaInfo = defaultMedia.find(m => m.url === mediaUrl) ||
                     favorites.find(f => f.url === mediaUrl);
    
    if (mediaInfo) {
      addToHistory(mediaInfo);
    } else {
      // For uploaded files
      const isAudio = mediaType === 'audio' || mediaUrl.match(/\.(mp3|wav|ogg|m4a)$/i);
      addToHistory({
        id: `uploaded-${Date.now()}`,
        name: 'Uploaded File',
        url: mediaUrl,
        type: isAudio ? 'audio' : 'video'
      });
    }
    
    // Auto-minimize for audio files on mobile
    if (mediaType === 'audio' && window.innerWidth < 768) {
      updatePlayerState({ isMinimized: true });
    }
  }, [updatePlayerState, defaultMedia, favorites]);

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
      return [...prev, newFavorite];
    });
  }, [setFavorites]);

  const removeFromFavorites = useCallback((mediaUrl: string) => {
    setFavorites(prev => prev.filter(fav => fav.url !== mediaUrl));
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
      return [historyItem, ...filtered].slice(0, 10);
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