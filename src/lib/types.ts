export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type GameLog = {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  spoticoin_earned: number;
  played_at: string;
};

export type UserProfile = {
  id: string;
  user_id: string;
  username: string;
  email: string;
  bio: string | null;
  badges?: Badge[];
  total_games: number;
  correct_answers: number;
  total_questions: number;
  spoticoin: number;
  created_at: string;
  updated_at: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  featured: boolean;
  created_by: string;
  image_url?: string;
  spotify_playlist_id?: string;
  questions?: QuizQuestion[];
  created_at: string;
  updated_at: string;
};

export type QuizQuestion = {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  spotify_track_id?: string;
  points: number;
  order: number;
  image_url?: string;
  question_type: 'multiple_choice' | 'true_false' | 'audio' | 'image';
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
      badges: {
        Row: Badge;
        Insert: Omit<Badge, 'id'>;
        Update: Partial<Omit<Badge, 'id'>>;
      };
      game_logs: {
        Row: GameLog;
        Insert: Omit<GameLog, 'id'>;
        Update: Partial<Omit<GameLog, 'id'>>;
      };
      quizzes: {
        Row: Quiz;
        Insert: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Quiz, 'id' | 'created_at' | 'updated_at'>>;
      };
      quiz_questions: {
        Row: QuizQuestion;
        Insert: Omit<QuizQuestion, 'id'>;
        Update: Partial<Omit<QuizQuestion, 'id'>>;
      };
    };
  };
};