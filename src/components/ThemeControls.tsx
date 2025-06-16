import React from 'react';
import { Moon, Sun, Palette, Sparkles } from 'lucide-react';

interface ThemeControlsProps {
  isDarkMode: boolean;
  backgroundType: 'animated' | 'static';
  onToggleDarkMode: () => void;
  onToggleBackground: () => void;
}

const ThemeControls: React.FC<ThemeControlsProps> = ({
  isDarkMode,
  backgroundType,
  onToggleDarkMode,
  onToggleBackground
}) => {
  const bgClass = isDarkMode ? 'bg-gray-800/60' : 'bg-white/60';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const subtextClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div className={`${bgClass} backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
          <Palette className="w-4 h-4 text-white" />
        </div>
        <h3 className={`text-lg font-semibold ${textClass}`}>Theme</h3>
      </div>

      <div className="space-y-3">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-white" />
              ) : (
                <Sun className="w-4 h-4 text-white" />
              )}
            </div>
            <span className={`text-sm font-medium ${textClass}`}>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          
          <button
            onClick={onToggleDarkMode}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              isDarkMode ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Background Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className={`text-sm font-medium ${textClass}`}>
              {backgroundType === 'animated' ? 'Animated' : 'Static'} Background
            </span>
          </div>
          
          <button
            onClick={onToggleBackground}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
              backgroundType === 'animated' ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                backgroundType === 'animated' ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      <p className={`text-xs ${subtextClass} mt-4 text-center`}>
        Customize your viewing experience
      </p>
    </div>
  );
};

export default ThemeControls;