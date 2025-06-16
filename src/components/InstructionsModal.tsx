import React from 'react';
import { X, Play, Upload, Music, Video, Heart, Palette, Moon } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const bgClass = isDarkMode ? 'bg-gray-900/95' : 'bg-white/95';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const subtextClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className={`${bgClass} backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100`}>
        <div className="sticky top-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-6 border-b border-gray-200/20">
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-bold ${textClass}`}>
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Media Player Guide
              </span>
            </h2>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-300"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Usage */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${textClass}`}>Basic Usage</h3>
            </div>
            <ul className={`space-y-2 ${subtextClass} ml-11`}>
              <li>• Click anywhere on the video/audio player to play/pause</li>
              <li>• Use the control buttons for play, pause, mute, and fullscreen</li>
              <li>• Videos automatically loop when finished</li>
              <li>• Your preferences are automatically saved</li>
            </ul>
          </section>

          {/* Upload Files */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${textClass}`}>Upload Files</h3>
            </div>
            <ul className={`space-y-2 ${subtextClass} ml-11`}>
              <li>• <strong>Drag & Drop:</strong> Simply drag video or audio files into the upload area</li>
              <li>• <strong>Click to Browse:</strong> Click the upload area to select files</li>
              <li>• <strong>Supported Formats:</strong> MP4, WebM, MP3, WAV, and more</li>
              <li>• Audio files automatically switch to audio mode</li>
            </ul>
          </section>

          {/* Audio Mode */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Music className="w-4 h-4 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${textClass}`}>Audio Mode</h3>
            </div>
            <ul className={`space-y-2 ${subtextClass} ml-11`}>
              <li>• Upload MP3 or other audio files for audio-only playback</li>
              <li>• Player automatically minimizes on mobile for audio files</li>
              <li>• Use the minimize button to collapse the video player</li>
              <li>• Audio continues playing when minimized</li>
            </ul>
          </section>

          {/* Video Selection */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${textClass}`}>Video Selection</h3>
            </div>
            <ul className={`space-y-2 ${subtextClass} ml-11`}>
              <li>• Use the dropdown menu to choose from pre-loaded videos</li>
              <li>• Click any video name to instantly switch</li>
              <li>• Your last selection is remembered for next visit</li>
            </ul>
          </section>

          {/* Favorites */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-400 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${textClass}`}>Favorites</h3>
            </div>
            <ul className={`space-y-2 ${subtextClass} ml-11`}>
              <li>• Click the heart icon to add media to your favorites</li>
              <li>• Access your favorite files from the favorites section</li>
              <li>• Favorites are saved locally on your device</li>
            </ul>
          </section>

          {/* Customization */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${textClass}`}>Customization</h3>
            </div>
            <ul className={`space-y-2 ${subtextClass} ml-11`}>
              <li>• Toggle between animated and static backgrounds</li>
              <li>• Switch between light and dark modes</li>
              <li>• All preferences are automatically saved</li>
            </ul>
          </section>

          {/* Keyboard Shortcuts */}
          <section>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
                <Moon className="w-4 h-4 text-white" />
              </div>
              <h3 className={`text-xl font-semibold ${textClass}`}>Keyboard Shortcuts</h3>
            </div>
            <ul className={`space-y-2 ${subtextClass} ml-11`}>
              <li>• <strong>Spacebar:</strong> Play/Pause</li>
              <li>• <strong>M:</strong> Mute/Unmute</li>
              <li>• <strong>F:</strong> Toggle Fullscreen</li>
              <li>• <strong>Escape:</strong> Close modals</li>
            </ul>
          </section>

          {/* Mobile Tips */}
          <section>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-4">
              <h4 className={`font-semibold ${textClass} mb-2`}>📱 Mobile Tips</h4>
              <ul className={`space-y-1 text-sm ${subtextClass}`}>
                <li>• Tap to play/pause on mobile devices</li>
                <li>• Audio files automatically minimize the player on small screens</li>
                <li>• All controls are touch-friendly and accessible</li>
                <li>• Swipe gestures work in fullscreen mode</li>
              </ul>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-gray-200/20">
          <p className={`text-center text-sm ${subtextClass}`}>
            Enjoy your beautiful media player experience! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;