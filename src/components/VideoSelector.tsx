import React, { useState } from 'react';
import { ChevronDown, Video, Music, Heart, HeartOff, Clock, Star, Upload } from 'lucide-react';
import { MediaFile, FavoriteItem, HistoryItem } from '../types';

interface VideoSelectorProps {
  videos: MediaFile[];
  uploadedFiles: MediaFile[];
  favorites: FavoriteItem[];
  history: HistoryItem[];
  onVideoSelect: (url: string, type?: 'video' | 'audio') => void;
  onAddToFavorites: (media: MediaFile) => void;
  onRemoveFromFavorites: (url: string) => void;
  currentVideo: string;
  isDarkMode?: boolean;
}

const VideoSelector: React.FC<VideoSelectorProps> = ({ 
  videos, 
  uploadedFiles,
  favorites,
  history,
  onVideoSelect, 
  onAddToFavorites,
  onRemoveFromFavorites,
  currentVideo,
  isDarkMode = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'uploads' | 'favorites' | 'history'>('videos');
  
  const allMedia = [...videos, ...uploadedFiles, ...favorites, ...history];
  const currentMediaName = allMedia.find(media => media.url === currentVideo)?.name || 'Select Media';

  const handleMediaSelect = (media: MediaFile | FavoriteItem | HistoryItem) => {
    onVideoSelect(media.url, media.type);
    setIsOpen(false);
  };

  const handleFavoriteToggle = (media: MediaFile, e: React.MouseEvent) => {
    e.stopPropagation();
    const isFavorite = favorites.some(fav => fav.url === media.url);
    
    if (isFavorite) {
      onRemoveFromFavorites(media.url);
    } else {
      onAddToFavorites(media);
    }
  };

  const isFavorite = (url: string) => favorites.some(fav => fav.url === url);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const bgClass = isDarkMode ? 'bg-gray-800/60' : 'bg-white/60';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const subtextClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const dropdownBgClass = isDarkMode ? 'bg-gray-800/95' : 'bg-white/95';
  const hoverClass = isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-purple-50';
  const activeClass = isDarkMode ? 'bg-gray-700 text-purple-400' : 'bg-purple-100 text-purple-700';

  return (
    <div className={`${bgClass} backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
          <Video className="w-4 h-4 text-white" />
        </div>
        <h3 className={`text-lg font-semibold ${textClass}`}>Media Library</h3>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full ${isDarkMode ? 'bg-gray-700/70 hover:bg-gray-700/90 border-gray-600' : 'bg-white/70 hover:bg-white/90 border-gray-200'} border rounded-xl px-4 py-3 text-left flex items-center justify-between transition-all duration-300 hover:shadow-md`}
        >
          <span className={`${textClass} font-medium truncate`}>{currentMediaName}</span>
          <ChevronDown 
            className={`w-5 h-5 ${subtextClass} transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <div className={`absolute top-full left-0 right-0 mt-2 ${dropdownBgClass} backdrop-blur-md border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} rounded-xl shadow-xl z-50 overflow-hidden`}>
            {/* Tabs */}
            <div className="flex border-b border-gray-200/20">
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex-1 px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'videos' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : subtextClass
                }`}
              >
                Library ({videos.length})
              </button>
              <button
                onClick={() => setActiveTab('uploads')}
                className={`flex-1 px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'uploads' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : subtextClass
                }`}
              >
                Uploads ({uploadedFiles.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'favorites' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : subtextClass
                }`}
              >
                Favorites ({favorites.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === 'history' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : subtextClass
                }`}
              >
                Recent ({history.length})
              </button>
            </div>

            {/* Content */}
            <div className="max-h-64 overflow-y-auto">
              {activeTab === 'videos' && (
                <>
                  {videos.map((video, index) => (
                    <button
                      key={video.id}
                      onClick={() => handleMediaSelect(video)}
                      className={`w-full px-4 py-3 text-left ${hoverClass} transition-colors duration-200 ${
                        video.url === currentVideo ? activeClass : textClass
                      } ${index !== videos.length - 1 ? 'border-b border-gray-100/20' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60" />
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {video.type === 'audio' ? (
                              <Music className="w-4 h-4 text-pink-500 flex-shrink-0" />
                            ) : (
                              <Video className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            )}
                            <span className="truncate">{video.name}</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleFavoriteToggle(video, e)}
                          className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                        >
                          {isFavorite(video.url) ? (
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                          ) : (
                            <HeartOff className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </button>
                  ))}
                </>
              )}

              {activeTab === 'uploads' && (
                <>
                  {uploadedFiles.length === 0 ? (
                    <div className={`px-4 py-8 text-center ${subtextClass}`}>
                      <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No uploaded files</p>
                      <p className="text-xs mt-1">Upload media files to see them here</p>
                    </div>
                  ) : (
                    uploadedFiles.map((file, index) => (
                      <button
                        key={file.id}
                        onClick={() => handleMediaSelect(file)}
                        className={`w-full px-4 py-3 text-left ${hoverClass} transition-colors duration-200 ${
                          file.url === currentVideo ? activeClass : textClass
                        } ${index !== uploadedFiles.length - 1 ? 'border-b border-gray-100/20' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-60" />
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              {file.type === 'audio' ? (
                                <Music className="w-4 h-4 text-pink-500 flex-shrink-0" />
                              ) : (
                                <Video className="w-4 h-4 text-purple-500 flex-shrink-0" />
                              )}
                              <span className="truncate">{file.name}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => handleFavoriteToggle(file, e)}
                            className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                          >
                            {isFavorite(file.url) ? (
                              <Heart className="w-4 h-4 text-red-500 fill-current" />
                            ) : (
                              <HeartOff className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </button>
                    ))
                  )}
                </>
              )}

              {activeTab === 'favorites' && (
                <>
                  {favorites.length === 0 ? (
                    <div className={`px-4 py-8 text-center ${subtextClass}`}>
                      <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No favorites yet</p>
                      <p className="text-xs mt-1">Add media to favorites from other tabs</p>
                    </div>
                  ) : (
                    favorites.map((favorite, index) => (
                      <button
                        key={favorite.id}
                        onClick={() => handleMediaSelect(favorite)}
                        className={`w-full px-4 py-3 text-left ${hoverClass} transition-colors duration-200 ${
                          favorite.url === currentVideo ? activeClass : textClass
                        } ${index !== favorites.length - 1 ? 'border-b border-gray-100/20' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full" />
                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                              {favorite.type === 'audio' ? (
                                <Music className="w-4 h-4 text-pink-500 flex-shrink-0" />
                              ) : (
                                <Video className="w-4 h-4 text-purple-500 flex-shrink-0" />
                              )}
                              <span className="truncate">{favorite.name}</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveFromFavorites(favorite.url);
                            }}
                            className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
                          >
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                          </button>
                        </div>
                      </button>
                    ))
                  )}
                </>
              )}

              {activeTab === 'history' && (
                <>
                  {history.length === 0 ? (
                    <div className={`px-4 py-8 text-center ${subtextClass}`}>
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No recent media</p>
                      <p className="text-xs mt-1">Your recently played files will appear here</p>
                    </div>
                  ) : (
                    history.map((item, index) => (
                      <button
                        key={`${item.id}-${item.playedAt}`}
                        onClick={() => handleMediaSelect(item)}
                        className={`w-full px-4 py-3 text-left ${hoverClass} transition-colors duration-200 ${
                          item.url === currentVideo ? activeClass : textClass
                        } ${index !== history.length - 1 ? 'border-b border-gray-100/20' : ''}`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60" />
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {item.type === 'audio' ? (
                              <Music className="w-4 h-4 text-pink-500 flex-shrink-0" />
                            ) : (
                              <Video className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="truncate block">{item.name}</span>
                              <span className={`text-xs ${subtextClass}`}>
                                {formatTimeAgo(item.playedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default VideoSelector;