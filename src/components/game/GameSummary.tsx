import { motion } from "framer-motion";
import { GameQuestion, QuestionStatus } from "@/types/game";
import Link from "next/link";

interface GameSummaryProps {
  questions: GameQuestion[];
  onRestart: () => void;
}

export function GameSummary({ questions, onRestart }: GameSummaryProps) {
  // Calculate statistics
  const correctCount = questions.filter(q => q.status === QuestionStatus.CORRECT).length;
  const wrongCount = questions.filter(q => q.status === QuestionStatus.WRONG).length;
  const skippedCount = questions.filter(q => q.status === QuestionStatus.SKIPPED).length;
  
  // Calculate score percentage
  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  
  // Determine message based on score
  const getMessage = () => {
    if (scorePercentage >= 90) return "Muhteşem!";
    if (scorePercentage >= 70) return "Harika!";
    if (scorePercentage >= 50) return "İyi!";
    if (scorePercentage >= 30) return "Fena Değil";
    return "Daha İyisini Yapabilirsin";
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-lg p-8 w-full text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeOut"
      }}
    >
      <motion.h2 
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Oyun Bitti
      </motion.h2>
      
      <motion.div 
        className="text-5xl font-bold mb-4 text-blue-600"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.4,
          type: "spring",
          stiffness: 500
        }}
      >
        {getMessage()}
      </motion.div>
      
      <motion.div 
        className="text-xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Skorun: <span className="font-bold">{scorePercentage}%</span>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-3 gap-4 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          className="bg-green-100 p-4 rounded-lg"
          variants={item}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-3xl font-bold text-green-600">{correctCount}</div>
          <div className="text-sm text-green-700">Doğru</div>
        </motion.div>
        <motion.div 
          className="bg-red-100 p-4 rounded-lg"
          variants={item}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-3xl font-bold text-red-600">{wrongCount}</div>
          <div className="text-sm text-red-700">Yanlış</div>
        </motion.div>
        <motion.div 
          className="bg-yellow-100 p-4 rounded-lg"
          variants={item}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-3xl font-bold text-yellow-600">{skippedCount}</div>
          <div className="text-sm text-yellow-700">Pas</div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="flex flex-col sm:flex-row justify-center gap-4 mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          onClick={onRestart}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Tekrar Oyna
        </motion.button>
        
        <Link href="/">
          <motion.div
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors inline-block cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ana Sayfaya Dön
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
} 