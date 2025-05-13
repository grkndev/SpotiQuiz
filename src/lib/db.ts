import { supabase, supabaseAdmin } from './supabase';
import { UserProfile, GameLog, Badge, Quiz, QuizQuestion } from './types';

// Profile functions
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  // Sonuçları UserProfile tipine uygun şekilde dönüştür
  const profile: UserProfile = {
    id: data.id,
    user_id: data.user_id,
    username: data.username,
    email: data.email,
    bio: data.bio,
    total_games: data.total_games || 0,
    correct_answers: data.correct_answers || 0,
    total_questions: data.total_questions || 0,
    spoticoin: data.spoticoin || 0,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
  
  // Badge'leri ayrı bir sorgu ile al
  try {
    const { data: badgeData, error: badgeError } = await supabase
      .from('user_badges')
      .select('badge_id, badges(*)')
      .eq('user_id', userId);
    
    if (!badgeError && badgeData && badgeData.length > 0) {
      profile.badges = badgeData
        .filter((b: any) => b.badges)
        .map((b: any) => b.badges);
    }
  } catch (badgeError) {
    console.error('Error fetching badges:', badgeError);
  }
  
  return profile;
}

export async function createUserProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
  
  return data;
}

export async function updateUserProfile(
  userId: string, 
  updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'admin'>>
) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  return data as UserProfile;
}

// Game log functions
export async function getUserGameLogs(userId: string): Promise<GameLog[]> {
  const { data, error } = await supabase
    .from('game_logs')
    .select('*')
    .eq('user_id', userId)
    .order('played_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching game logs:', error);
    return [];
  }
  
  return data || [];
}

export async function addGameLog(gameLog: Omit<GameLog, 'id'>) {
  const { data, error } = await supabase
    .from('game_logs')
    .insert(gameLog)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding game log:', error);
    throw error;
  }
  
  return data;
}

// Badge functions
export async function getUserBadges(userId: string): Promise<Badge[]> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_id, badges(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }
  
  // Badges verisini çıkart
  return data?.map((item: any) => item.badges) || [];
}

// Stats functions
export async function updateUserStats(
  userId: string, 
  stats: { 
    total_games?: number, 
    correct_answers?: number, 
    total_questions?: number,
    spoticoin?: number 
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(stats)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
  
  return data;
}

// Leaderboard
export async function getLeaderboard(limit = 10): Promise<Partial<UserProfile>[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, user_id, username, spoticoin, total_games, correct_answers, email, bio, image, total_questions, created_at, updated_at')
    .order('spoticoin', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  
  return data as Partial<UserProfile>[] || [];
}

// Add badge to user
export async function addBadgeToUser(userId: string, badgeId: string) {
  // Check if user already has this badge
  const { data: existingBadge, error: checkError } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId)
    .eq('badge_id', badgeId)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Error checking existing badge:', checkError);
    throw checkError;
  }
  
  // If user doesn't have the badge, add it
  if (!existingBadge) {
    const { data, error } = await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_id: badgeId
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding badge to user:', error);
      throw error;
    }
    
    return data;
  }
  
  return existingBadge;
}

// Quiz functions
export async function createQuiz(quiz: Omit<Quiz, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabaseAdmin
    .from('quizzes')
    .insert(quiz)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
  
  return data;
}

export async function getQuiz(quizId: string): Promise<Quiz | null> {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, questions(*)')
    .eq('id', quizId)
    .single();
  
  if (error) {
    console.error('Error fetching quiz:', error);
    return null;
  }
  
  return data;
}

export async function getFeaturedQuizzes(limit = 5): Promise<Quiz[]> {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching featured quizzes:', error);
    return [];
  }
  
  return data || [];
}

export async function getAllQuizzes(limit = 20, offset = 0): Promise<Quiz[]> {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
  
  return data || [];
}

export async function updateQuiz(
  quizId: string, 
  updates: Partial<Omit<Quiz, 'id' | 'created_at' | 'updated_at'>>
) {
  const { data, error } = await supabaseAdmin
    .from('quizzes')
    .update(updates)
    .eq('id', quizId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
  
  return data;
}

export async function addQuestionToQuiz(question: Omit<QuizQuestion, 'id'>) {
  const { data, error } = await supabaseAdmin
    .from('quiz_questions')
    .insert(question)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding question to quiz:', error);
    throw error;
  }
  
  return data;
}