import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { GameQuestion } from "@/types/game";
import { SpotifyPlayer } from "./SpotifyPlayer";

interface QuestionCardProps {
  question: GameQuestion;
  onAnswer: (optionIndex: number) => void;
  onSkip: () => void;
  currentIndex: number;
  currentTrack: string;
  totalQuestions: number;
}

export function QuestionCard({
  question,
  onAnswer,
  onSkip,
  currentIndex,
  totalQuestions,
  currentTrack,
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number>(10);
  const [timerEnded, setTimerEnded] = useState(false);
  const trackUriRef = useRef<string>(currentTrack);
  const [formattedTrackUri, setFormattedTrackUri] = useState<string>("");

  // Format the track URI properly for Spotify
  useEffect(() => {
    if (!currentTrack) {
      setFormattedTrackUri("");
      return;
    }

    // Check if it's already a properly formatted Spotify URI
    if (currentTrack.startsWith('spotify:track:') || 
        currentTrack.startsWith('spotify:album:') || 
        currentTrack.startsWith('spotify:playlist:')) {
      setFormattedTrackUri(currentTrack);
    } else {
      // Try to convert it to a proper Spotify URI
      // Extract what might be a track ID from various formats
      const possibleId = currentTrack.trim().split('/').pop() || currentTrack.trim();
      console.log("Extracted possible ID:", possibleId);
      setFormattedTrackUri(`spotify:track:${possibleId}`);
    }
  }, [currentTrack]);

  // Debug log the current track
  useEffect(() => {
    console.log("Current track in QuestionCard:", currentTrack);
    console.log("Formatted track URI:", formattedTrackUri);
    console.log("Question track URI:", question.track?.uri);
    
    // Update our ref when the track changes
    if (currentTrack !== trackUriRef.current) {
      trackUriRef.current = currentTrack;
      console.log("Track URI changed to:", currentTrack);
    }
  }, [currentTrack, formattedTrackUri, question.track?.uri]);

  // Reset states when question changes
  useEffect(() => {
    // Always stop any existing playback first
    setIsPlaying(false);
    
    // Reset states for new question
    setSelectedOption(null);
    setTimerEnded(false);
    setRemainingTime(10);
    
    // Start playing after a delay if we have a track
    if (formattedTrackUri) {
      const timer = setTimeout(() => {
        console.log("Starting playback of track:", formattedTrackUri);
        setIsPlaying(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [formattedTrackUri]); // Only run when track URI changes
  
  // Handle toggle playback callback
  const togglePlayback = useCallback(() => {
    console.log("Toggle playback called, current state:", { isPlaying, timerEnded });
    
    if (timerEnded) {
      // If timer ended, clicking will restart from beginning
      setTimerEnded(false);
      setRemainingTime(10);
      setIsPlaying(true);
    } else {
      // Normal toggle during playback
      setIsPlaying(prevState => !prevState);
    }
  }, [isPlaying, timerEnded]);
  
  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && remainingTime > 0) {
      console.log("Timer running, isPlaying:", isPlaying, "remainingTime:", remainingTime);
      interval = setInterval(() => {
        setRemainingTime((prevTime) => {
          const newTime = Math.max(0, prevTime - 1);
          // When timer reaches zero, stop playback
          if (newTime === 0) {
            console.log("Timer reached zero, stopping playback");
            setIsPlaying(false);
            setTimerEnded(true);
          }
          return newTime;
        });
      }, 1000);
    } else if (!isPlaying && !timerEnded) {
      setRemainingTime(10);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, remainingTime, timerEnded]);

  // Debugging useEffect
  useEffect(() => {
    console.log("Current state:", { 
      isPlaying, 
      remainingTime, 
      timerEnded, 
      currentTrack,
      formattedTrackUri,
      questionTrack: question.track?.uri
    });
  }, [isPlaying, remainingTime, timerEnded, currentTrack, formattedTrackUri, question.track?.uri]);
  
  const handleOptionClick = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setIsPlaying(false);
    
    // Delay answer processing to show selection animation
    setTimeout(() => {
      onAnswer(optionIndex);
      setSelectedOption(null);
    }, 400);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">
        {question.question}
      </h2>
      
      {/* Spotify Player */}
      {question.track && formattedTrackUri && (
        <div className="mb-6">
          <SpotifyPlayer 
            uris={[formattedTrackUri]} 
            isPlaying={isPlaying}
            onTogglePlay={togglePlayback}
          />
          
          <div className="mt-3 flex flex-col items-center gap-2">
            {/* Timer display - always show it when there's a track */}
            <div className="mb-2 text-lg font-semibold">
              {isPlaying 
                ? `Kalan Süre: ${remainingTime} saniye` 
                : (timerEnded ? "Süre doldu!" : "Oynatmak için tıklayın")}
            </div>
            
            <button 
              onClick={togglePlayback}
              className={`px-4 py-2 text-white rounded-md transition-colors flex items-center gap-2 ${
                timerEnded 
                  ? "bg-blue-500 hover:bg-blue-600" 
                  : "bg-green-500 hover:bg-green-600"
              }`}
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
              {timerEnded ? "Tekrar Oynat" : (isPlaying ? "Duraklat" : "Çal")}
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