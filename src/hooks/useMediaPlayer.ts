import { useState, useEffect, useCallback } from 'react';
import { MediaFile, PlayerState, FavoriteItem } from '../types';
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
                     favorites.find(fav => fav.url === playerState.currentMedia);
    
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
  }, [playerState.currentMedia, defaultMedia, favorites]);

  const updatePlayerState = useCallback((updates: Partial<PlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...updates }));
  }, [setPlayerState]);

  const changeMedia = useCallback((mediaUrl: string, mediaType?: 'video' | 'audio') => {
    updatePlayerState({ currentMedia: mediaUrl });
    setMediaKey(prev => prev + 1);
    
    // Auto-minimize for audio files on mobile
    if (mediaType === 'audio' && window.innerWidth < 768) {
      updatePlayerState({ isMinimized: true });
    }
  }, [updatePlayerState]);

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
    mediaKey,
    updatePlayerState,
    changeMedia,
    toggleMinimized,
    addToFavorites,
    removeFromFavorites,
    toggleDarkMode,
    toggleBackground
  };
}