import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QuestionStatus } from "@/types/game";

interface QuestionIndicatorsProps {
  questions: Array<{
    id: number | string;
    status: QuestionStatus;
  }>;
  currentQuestionIndex: number;
  onNavigate: (index: number) => void;
}

export function QuestionIndicators({
  questions,
  currentQuestionIndex
}: QuestionIndicatorsProps) {
  return (
    <div className="flex justify-center mb-6 flex-wrap gap-2">
      {questions.map((question, index) => {
        // Determine status color
        let bgColor = "bg-gray-300"; // Unanswered
        
        if (question.status === QuestionStatus.CORRECT) {
          bgColor = "bg-green-500";
        } else if (question.status === QuestionStatus.WRONG) {
          bgColor = "bg-red-500";
        } else if (question.status === QuestionStatus.SKIPPED) {
          bgColor = "bg-yellow-500";
        }
        
        return (
          <motion.button
            key={index}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              "text-sm font-medium transition-all duration-300",
              
              bgColor,
              index === currentQuestionIndex && "ring-2 ring-blue-500 ring-offset-2"
            )}
            // onClick={() => onNavigate(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {index + 1}
          </motion.button>
        );
      })}
    </div>
  );
} 