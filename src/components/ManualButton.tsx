import React from 'react';
import { BookOpen, HelpCircle } from 'lucide-react';

interface ManualButtonProps {
  onOpenInstructions: () => void;
  isDarkMode?: boolean;
}

const ManualButton: React.FC<ManualButtonProps> = ({ onOpenInstructions, isDarkMode = false }) => {
  const bgClass = isDarkMode ? 'bg-gray-800/60' : 'bg-white/60';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const subtextClass = isDarkMode ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className={`${bgClass} backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <button
        onClick={onOpenInstructions}
        className="w-full bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-center space-x-3 group"
      >
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
          <BookOpen className="w-4 h-4" />
        </div>
        <span className="text-lg">View Instructions</span>
        <HelpCircle className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
      
      <p className={`text-xs ${subtextClass} mt-3 text-center`}>
        Learn how to use all features
      </p>
    </div>
  );
};

export default ManualButton;