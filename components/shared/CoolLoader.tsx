import React from "react";
import { FiZap, FiCode, FiDatabase } from "react-icons/fi";

interface CoolLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

const CoolLoader: React.FC<CoolLoaderProps> = ({ 
  message = "Loading awesome content...", 
  size = "md",
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: "h-20",
    md: "h-32", 
    lg: "h-48"
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 bg-white/80 dark:bg-secondary-dark/80 backdrop-blur-sm"
    : "";

  return (
    <div className={`flex flex-col items-center justify-center ${sizeClasses[size]} ${containerClasses}`}>
      {/* Animated Logo/Icon */}
      <div className="relative mb-6">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        
        {/* Animated gradient ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-spin"
             style={{
               background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
               borderRadius: "50%",
               mask: "radial-gradient(circle at center, transparent 50%, black 50%)",
               WebkitMask: "radial-gradient(circle at center, transparent 50%, black 50%)"
             }}>
        </div>
        
        {/* Inner pulsing circle */}
        <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
          <FiZap className="w-8 h-8 text-white animate-bounce" />
        </div>
      </div>

      {/* Floating icons */}
      <div className="relative mb-4">
        <div className="flex space-x-8">
          <div className="animate-bounce" style={{ animationDelay: "0ms", animationDuration: "2s" }}>
            <FiCode className={`${iconSizes[size]} text-blue-500 dark:text-blue-400`} />
          </div>
          <div className="animate-bounce" style={{ animationDelay: "200ms", animationDuration: "2s" }}>
            <FiDatabase className={`${iconSizes[size]} text-purple-500 dark:text-purple-400`} />
          </div>
          <div className="animate-bounce" style={{ animationDelay: "400ms", animationDuration: "2s" }}>
            <FiZap className={`${iconSizes[size]} text-pink-500 dark:text-pink-400`} />
          </div>
        </div>
      </div>

      {/* Loading text with typewriter effect */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-theme-title dark:text-theme-title-dark mb-2 animate-pulse">
          {message}
        </h3>
        
        {/* Animated dots */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
        
        {/* Progress bar animation */}
        <div className="mt-4 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse"
               style={{
                 width: "100%",
                 animation: "loading-progress 2s ease-in-out infinite"
               }}>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default CoolLoader; 