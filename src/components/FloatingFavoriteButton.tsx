import React, { useState } from 'react';
import { Heart, X } from 'lucide-react';
import { MediaFile, FavoriteItem } from '../types';

interface FloatingFavoriteButtonProps {
  currentMedia: MediaFile | null;
  favorites: FavoriteItem[];
  onAddToFavorites: (media: MediaFile) => void;
  onRemoveFromFavorites: (url: string) => void;
  isDarkMode?: boolean;
}

const FloatingFavoriteButton: React.FC<FloatingFavoriteButtonProps> = ({
  currentMedia,
  favorites,
  onAddToFavorites,
  onRemoveFromFavorites,
  isDarkMode = false
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!currentMedia) return null;

  const isFavorite = favorites.some(fav => fav.url === currentMedia.url);

  const handleToggleFavorite = () => {
    setIsAnimating(true);
    
    if (isFavorite) {
      onRemoveFromFavorites(currentMedia.url);
    } else {
      onAddToFavorites(currentMedia);
    }

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <div className={`absolute bottom-16 right-0 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-300 ${
          isDarkMode 
            ? 'bg-gray-800/95 text-white border border-gray-700' 
            : 'bg-white/95 text-gray-800 border border-gray-200'
        } backdrop-blur-md shadow-lg`}>
          {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          <div className={`absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            isDarkMode ? 'border-t-gray-800/95' : 'border-t-white/95'
          }`} />
        </div>
      )}

      {/* Floating Heart Button */}
      <button
        onClick={handleToggleFavorite}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`w-14 h-14 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isFavorite 
            ? 'bg-red-500/90 hover:bg-red-600/90' 
            : isDarkMode 
              ? 'bg-gray-800/80 hover:bg-gray-700/90 border border-gray-600' 
              : 'bg-white/80 hover:bg-white/90 border border-gray-200'
        } ${isAnimating ? 'animate-pulse scale-125' : ''}`}
      >
        <Heart 
          className={`w-6 h-6 mx-auto transition-all duration-300 ${
            isFavorite 
              ? 'text-white fill-current' 
              : isDarkMode 
                ? 'text-gray-300 hover:text-red-400' 
                : 'text-gray-600 hover:text-red-500'
          } ${isAnimating ? 'scale-125' : ''}`} 
        />
      </button>

      {/* Floating animation particles when favorited */}
      {isAnimating && isFavorite && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-400 rounded-full animate-ping"
              style={{
                top: `${20 + Math.random() * 20}px`,
                left: `${20 + Math.random() * 20}px`,
                animationDelay: `${i * 100}ms`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FloatingFavoriteButton;