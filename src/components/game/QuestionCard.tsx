import { useState } from "react";
import { motion } from "framer-motion";
import { GameQuestion } from "@/types/game";

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
  
  const handleOptionClick = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    // Delay answer processing to show selection animation
    setTimeout(() => {
      onAnswer(optionIndex);
      setSelectedOption(null);
    }, 400);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-6">
        {question.question}
      </h2>
      
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