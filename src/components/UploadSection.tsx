import React, { useRef } from 'react';
import { Upload, Film, Music } from 'lucide-react';

interface UploadSectionProps {
  onFileUpload: (file: File, type: 'video' | 'audio') => void;
  isDarkMode?: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onFileUpload, isDarkMode = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const getFileType = (file: File): 'video' | 'audio' => {
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    
    // Fallback to extension check
    const extension = file.name.split('.').pop()?.toLowerCase();
    const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'];
    return audioExtensions.includes(extension || '') ? 'audio' : 'video';
  };

  const handleFileSelect = (file: File) => {
    if (file && (file.type.startsWith('video/') || file.type.startsWith('audio/'))) {
      setSelectedFile(file);
      const fileType = getFileType(file);
      onFileUpload(file, fileType);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const bgClass = isDarkMode ? 'bg-gray-800/60' : 'bg-white/60';
  const textClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const subtextClass = isDarkMode ? 'text-gray-300' : 'text-gray-600';
  const borderClass = isDragOver 
    ? 'border-purple-400 bg-purple-50/50 dark:bg-purple-900/20' 
    : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/30 dark:hover:bg-purple-900/10';

  return (
    <div className={`${bgClass} backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
          <Upload className="w-4 h-4 text-white" />
        </div>
        <h3 className={`text-lg font-semibold ${textClass}`}>Upload Media</h3>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${borderClass}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,audio/*"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-3">
          <div className="flex space-x-2">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
              <Film className="w-6 h-6 text-purple-500" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-pink-500" />
            </div>
          </div>
          
          {selectedFile ? (
            <div className={`text-sm ${subtextClass}`}>
              <p className="font-medium text-purple-600 dark:text-purple-400">{selectedFile.name}</p>
              <p className="text-xs mt-1">
                {getFileType(selectedFile) === 'audio' ? '🎵 Audio file' : '🎬 Video file'} • Click to change
              </p>
            </div>
          ) : (
            <div className={`text-sm ${subtextClass}`}>
              <p className="font-medium">Drop your media here</p>
              <p className="text-xs mt-1">or click to browse</p>
            </div>
          )}
        </div>
      </div>

      <p className={`text-xs ${subtextClass} mt-3 text-center`}>
        Supports MP4, WebM, MP3, WAV, and other media formats
      </p>
    </div>
  );
};

export default UploadSection;