export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'audio';
  duration?: number;
}

export interface PlayerState {
  currentMedia: string;
  isMinimized: boolean;
  volume: number;
  isMuted: boolean;
  lastPosition: number;
  isDarkMode: boolean;
  backgroundType: 'animated' | 'static';
}

export interface FavoriteItem {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'audio';
  addedAt: number;
}