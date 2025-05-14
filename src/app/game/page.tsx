"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GameQuestion, QuestionStatus } from "@/types/game";
import { QuestionIndicators } from "@/components/game/QuestionIndicators";
import { QuestionCard } from "@/components/game/QuestionCard";
import { GameSummary } from "@/components/game/GameSummary";

export default function GamePage() {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [gameComplete, setGameComplete] = useState(false);
  const [revisitingSkipped, setRevisitingSkipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch questions from API
  useEffect(() => {
    async function fetchQuizQuestions() {
      try {
        setLoading(true);
        const response = await fetch('/api/quiz/generate?count=10');
        
        if (!response.ok) {
          throw new Error('Failed to fetch quiz questions');
        }
        
        const data = await response.json();
        
        // Map API response to our GameQuestion format
        const mappedQuestions = data.quiz.questions.map((q: any) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: q.options.indexOf(q.correctAnswer),
          status: QuestionStatus.UNANSWERED,
          track: q.track ? {
            id: q.track.id,
            name: q.track.name,
            artist: q.track.artist,
            uri: q.track.uri,
            previewUrl: q.track.preview_url
          } : undefined
        }));

        // console.log(mappedQuestions)
        
        setQuestions(mappedQuestions);
      } catch (err) {
        console.error('Error fetching quiz questions:', err);
        setError('Failed to load quiz. Please try again later.');
       
      } finally {
        setLoading(false);
      }
    }
    
    fetchQuizQuestions();
  }, []);
  
  // Check if game is complete when questions change
  useEffect(() => {
    if (questions.length === 0) return;
    
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
    const resetQuestions: GameQuestion[] = questions.map(q => ({
      ...q,
      status: QuestionStatus.UNANSWERED
    }));
    
    setQuestions(resetQuestions);
    setCurrentQuestionIndex(0);
    setDirection(0);
    setGameComplete(false);
    setRevisitingSkipped(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Quiz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          <p className="font-bold">Hata!</p>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return null;
  }

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
      <div className="relative overflow-hidden h-screen  justify-center flex">
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
                currentTrack={questions[currentQuestionIndex].track?.uri as string}
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