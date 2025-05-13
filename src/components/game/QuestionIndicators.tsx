import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QuestionStatus } from "@/types/game";

interface QuestionIndicatorsProps {
  questions: Array<{
    id: number;
    status: QuestionStatus;
  }>;
  currentQuestionIndex: number;
  onNavigate: (index: number) => void;
}

export function QuestionIndicators({
  questions,
  currentQuestionIndex,
  onNavigate,
}: QuestionIndicatorsProps) {
  // Get status color class
  const getStatusColorClass = (status: QuestionStatus) => {
    switch (status) {
      case QuestionStatus.CORRECT:
        return "bg-green-500 text-white";
      case QuestionStatus.WRONG:
        return "bg-red-500 text-white";
      case QuestionStatus.SKIPPED:
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Container animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Child animation
  const item = {
    hidden: { y: -20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Pulse animation for active indicator using Tailwind classes
  const activeClassName = cn(
    "ring-2 ring-offset-2 ring-blue-600 animate-pulse",
    "transform scale-110"
  );

  return (
    <motion.div 
      className="flex justify-center flex-wrap gap-2 mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {questions.map((q, index) => {
        const isActive = currentQuestionIndex === index;
        
        return (
          <motion.button
            key={q.id}
            onClick={() => onNavigate(index)}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              "text-sm font-medium transition-all duration-300",
              getStatusColorClass(q.status),
              isActive ? activeClassName : "hover:scale-105"
            )}
            variants={item}
            whileHover={{ 
              scale: isActive ? 1.15 : 1.1,
              boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)" 
            }}
          >
            {q.id}
          </motion.button>
        );
      })}
    </motion.div>
  );
} 