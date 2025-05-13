// Question status enum
export enum QuestionStatus {
  UNANSWERED = "unanswered",
  CORRECT = "correct",
  WRONG = "wrong",
  SKIPPED = "skipped"
}

// Game question type
export interface GameQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  status: QuestionStatus;
} 