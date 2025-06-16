import React from 'react';

interface FloatingShapesProps {
  backgroundType: 'animated' | 'static';
  isDarkMode: boolean;
}

const FloatingShapes: React.FC<FloatingShapesProps> = ({ backgroundType, isDarkMode }) => {
  if (backgroundType === 'static') {
    return (
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100'
      }`} />
    );
  }

  const shapeColors = isDarkMode 
    ? {
        primary: 'from-purple-600/20 to-pink-600/20',
        secondary: 'from-indigo-600/20 to-purple-600/20',
        accent: 'from-pink-700/20 to-rose-700/20',
        highlight: 'from-blue-600/20 to-indigo-600/20'
      }
    : {
        primary: 'from-pink-200/40 to-purple-200/40',
        secondary: 'from-purple-200/40 to-indigo-200/40',
        accent: 'from-pink-300/40 to-rose-300/40',
        highlight: 'from-indigo-200/40 to-blue-200/40'
      };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20' 
          : 'bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100'
      }`} />
      
      {/* Floating Circles */}
      <div className={`absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br ${shapeColors.primary} rounded-full blur-xl animate-float-slow`} />
      <div className={`absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br ${shapeColors.secondary} rounded-full blur-xl animate-float-medium`} />
      <div className={`absolute top-1/2 left-1/6 w-16 h-16 bg-gradient-to-br ${shapeColors.accent} rounded-full blur-lg animate-float-fast`} />
      <div className={`absolute bottom-1/4 right-1/3 w-20 h-20 bg-gradient-to-br ${shapeColors.highlight} rounded-full blur-lg animate-float-slow`} />
      
      {/* Floating Squares */}
      <div className={`absolute top-1/6 right-1/6 w-12 h-12 bg-gradient-to-br ${shapeColors.accent} rotate-45 blur-sm animate-float-medium`} />
      <div className={`absolute bottom-1/3 left-1/3 w-8 h-8 bg-gradient-to-br ${shapeColors.secondary} rotate-12 blur-sm animate-float-fast`} />
    </div>
  );
};

export default FloatingShapes;