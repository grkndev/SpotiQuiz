import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GameQuestion } from "@/types/game";
import { SpotifyPlayer } from "./SpotifyPlayer";

interface QuestionCardProps {
  question: GameQuestion;
  onAnswer: (optionIndex: number) => void;
  onSkip: () => void;
  currentIndex: number;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  onAnswer,
  onSkip,
  currentIndex,
  totalQuestions,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string[]>([question.track?.uri || ""]);

  // Start playing when a new question is shown
  useEffect(() => {
    if (question.track && (question.track.previewUrl || question.track.uri)) {
      // Short delay to ensure UI is ready
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [question]);
  
  const handleOptionClick = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setIsPlaying(false);
    
    // Delay answer processing to show selection animation
    setTimeout(() => {
      onAnswer(optionIndex);
      setSelectedOption(null);
    }, 400);
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">
        {question.question}
      </h2>
      
      {/* Spotify Player */}
      {question.track && (
        <div className="mb-6">
          <SpotifyPlayer 
            uris={currentTrack}
            isPlaying={isPlaying}
            onTogglePlay={togglePlayback}
          />
          
          <div className="mt-3 flex justify-center">
            <button 
              onClick={togglePlayback}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
              disabled={!question.track.previewUrl && !question.track.uri}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                {isPlaying ? (
                  // Pause icon
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1H7zm4 0a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V9a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                ) : (
                  // Play icon
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                )}
              </svg>
              {isPlaying ? "Duraklat" : "Çal"}
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {question.options.map((option, optionIndex) => (
          <motion.button
            key={optionIndex}
            onClick={() => handleOptionClick(optionIndex)}
            className={`w-full p-4 rounded-md text-left transition-colors ${
              selectedOption === optionIndex 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={selectedOption !== null}
          >
            {option}
          </motion.button>
        ))}
      </div>
      
      <div className="mt-6 flex justify-between">
        <motion.button
          onClick={onSkip}
          className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={selectedOption !== null}
        >
          Pas Geç
        </motion.button>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-500">
            {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>
    </div>
  );
} 