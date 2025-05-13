"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameQuestion, QuestionStatus } from "@/types/game";
import { QuestionIndicators } from "@/components/game/QuestionIndicators";
import { QuestionCard } from "@/components/game/QuestionCard";
import { GameSummary } from "@/components/game/GameSummary";

// Sample questions data structure
const dummyQuestions: GameQuestion[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  question: `Sample question ${i + 1}?`,
  options: [
    `Option A for question ${i + 1}`,
    `Option B for question ${i + 1}`,
    `Option C for question ${i + 1}`,
    `Option D for question ${i + 1}`,
  ],
  correctAnswer: 0,
  status: QuestionStatus.UNANSWERED
}));

export default function GamePage() {
  const [questions, setQuestions] = useState<GameQuestion[]>(dummyQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [gameComplete, setGameComplete] = useState(false);
  const [revisitingSkipped, setRevisitingSkipped] = useState(false);
  
  // Check if game is complete when questions change
  useEffect(() => {
    // If we're already in revisiting mode, check if all questions are answered
    if (revisitingSkipped) {
      const anySkipped = questions.some(q => q.status === QuestionStatus.SKIPPED);
      if (!anySkipped) {
        setGameComplete(true);
      }
      return;
    }
    
    // Check if all questions have been answered
    const allQuestionsAttempted = questions.every(
      q => q.status !== QuestionStatus.UNANSWERED
    );
    
    if (allQuestionsAttempted) {
      const anySkipped = questions.some(q => q.status === QuestionStatus.SKIPPED);
      
      if (anySkipped) {
        // Navigate to the first skipped question
        const firstSkippedIndex = questions.findIndex(q => q.status === QuestionStatus.SKIPPED);
        setDirection(firstSkippedIndex > currentQuestionIndex ? 1 : -1);
        setCurrentQuestionIndex(firstSkippedIndex);
        setRevisitingSkipped(true);
      } else {
        setGameComplete(true);
      }
    }
  }, [questions, currentQuestionIndex, revisitingSkipped]);
  
  const handleAnswer = (selectedOptionIndex: number) => {
    const updatedQuestions = [...questions];
    
    if (selectedOptionIndex === updatedQuestions[currentQuestionIndex].correctAnswer) {
      updatedQuestions[currentQuestionIndex].status = QuestionStatus.CORRECT;
    } else {
      updatedQuestions[currentQuestionIndex].status = QuestionStatus.WRONG;
    }
    
    setQuestions(updatedQuestions);
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (revisitingSkipped) {
        // Find next skipped question
        const nextSkippedIndex = updatedQuestions.findIndex(
          (q, index) => index > currentQuestionIndex && q.status === QuestionStatus.SKIPPED
        );
        
        if (nextSkippedIndex !== -1) {
          setDirection(1);
          setCurrentQuestionIndex(nextSkippedIndex);
        } else {
          // Check if there are any skipped questions from the beginning
          const firstSkippedIndex = updatedQuestions.findIndex(
            q => q.status === QuestionStatus.SKIPPED
          );
          
          if (firstSkippedIndex !== -1) {
            setDirection(-1);
            setCurrentQuestionIndex(firstSkippedIndex);
          } else {
            // No more skipped questions
            setGameComplete(true);
          }
        }
      } else if (currentQuestionIndex < questions.length - 1) {
        // Normal progression
        setDirection(1);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 500);
  };
  
  const handleSkip = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].status = QuestionStatus.SKIPPED;
    setQuestions(updatedQuestions);
    
    // Move to next question
    if (revisitingSkipped) {
      // Find next skipped question
      const nextSkippedIndex = updatedQuestions.findIndex(
        (q, index) => index > currentQuestionIndex && q.status === QuestionStatus.SKIPPED
      );
      
      if (nextSkippedIndex !== -1) {
        setDirection(1);
        setCurrentQuestionIndex(nextSkippedIndex);
      } else {
        // Check if there are any skipped questions from the beginning
        const firstSkippedIndex = updatedQuestions.findIndex(
          q => q.status === QuestionStatus.SKIPPED
        );
        
        if (firstSkippedIndex !== -1 && firstSkippedIndex !== currentQuestionIndex) {
          setDirection(-1);
          setCurrentQuestionIndex(firstSkippedIndex);
        }
        // If we're just skipping the same question again while revisiting, we stay on it
      }
    } else if (currentQuestionIndex < questions.length - 1) {
      // Normal progression
      setDirection(1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const navigateToQuestion = (index: number) => {
    if (index === currentQuestionIndex) return;
    
    setDirection(index > currentQuestionIndex ? 1 : -1);
    setCurrentQuestionIndex(index);
  };
  
  const handleRestartGame = () => {
    // Reset questions
    const resetQuestions = questions.map(q => ({
      ...q,
      status: QuestionStatus.UNANSWERED
    }));
    
    setQuestions(resetQuestions);
    setCurrentQuestionIndex(0);
    setDirection(0);
    setGameComplete(false);
    setRevisitingSkipped(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Question indicators */}
      <QuestionIndicators 
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        onNavigate={navigateToQuestion}
      />
      
      {/* Revisiting skipped mode indicator */}
      {revisitingSkipped && (
        <div className="text-center mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-md">
          Pas geçilen soruları cevaplıyorsunuz
        </div>
      )}
      
      {/* Question content with animation */}
      <div className="relative overflow-hidden min-h-[400px]">
        {gameComplete ? (
          <GameSummary 
            questions={questions} 
            onRestart={handleRestartGame} 
          />
        ) : (
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={currentQuestionIndex}
              custom={direction}
              initial={{ 
                x: direction * 300,
                opacity: 0 
              }}
              animate={{ 
                x: 0,
                opacity: 1 
              }}
              exit={{ 
                x: direction * -300,
                opacity: 0 
              }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full"
            >
              <QuestionCard
                question={questions[currentQuestionIndex]}
                onAnswer={handleAnswer}
                onSkip={handleSkip}
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
} 