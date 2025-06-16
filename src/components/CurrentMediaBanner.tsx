import React from 'react';
import { Music, Video, Play, Pause } from 'lucide-react';
import { MediaFile } from '../types';

interface CurrentMediaBannerProps {
  mediaInfo: MediaFile | null;
  isPlaying?: boolean;
  isDarkMode?: boolean;
}

const CurrentMediaBanner: React.FC<CurrentMediaBannerProps> = ({ 
  mediaInfo, 
  isPlaying = false,
  isDarkMode = false 
}) => {
  if (!mediaInfo) return null;

  const bgClass = isDarkMode 
    ? 'bg-gray-800/40 border-gray-700/50' 
    : 'bg-white/40 border-white/50';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const subtextClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`${bgClass} backdrop-blur-md border rounded-2xl p-4 mb-6 shadow-lg transition-all duration-300`}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
          {mediaInfo.type === 'audio' ? (
            <Music className="w-6 h-6 text-white" />
          ) : (
            <Video className="w-6 h-6 text-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className={`text-lg font-semibold ${textClass} truncate`}>
            {mediaInfo.name}
          </h2>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {isPlaying ? (
                <Play className="w-3 h-3 text-green-500 fill-current" />
              ) : (
                <Pause className="w-3 h-3 text-gray-400" />
              )}
              <span className={`text-sm ${subtextClass}`}>
                {isPlaying ? 'Now Playing' : 'Paused'}
              </span>
            </div>
            <span className={`text-sm ${subtextClass}`}>•</span>
            <span className={`text-sm ${subtextClass} capitalize`}>
              {mediaInfo.type}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        </div>
      </div>
    </div>
  );
};

export default CurrentMediaBanner;