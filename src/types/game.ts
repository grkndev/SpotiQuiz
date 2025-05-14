// Question status enum
export enum QuestionStatus {
  UNANSWERED = "unanswered",
  CORRECT = "correct",
  WRONG = "wrong",
  SKIPPED = "skipped"
}

// Track information
export interface Track {
  id: string;
  name: string;
  artist: string;
  uri: string;
  previewUrl?: string; 
}

// Game question type
export interface GameQuestion {
  id: number | string;
  question: string;
  options: string[];
  correctAnswer: number;
  status: QuestionStatus;
  track?: Track; // Optional track data for music questions
} 