import { supabase } from "./supabase";

export type User = {
  user_id: string;
  username: string;
  spoticoin: number;
  total_games: number;
  correct_answers: number;
  total_questions: number;

};


// Function to get ranked leaderboard data (sorted by SpotiCoins)
export async function getRankedLeaderboardData(): Promise<User[]> {
  const { data: leaderboardData, error } = await supabase
    .from('profiles')
    .select('user_id, spoticoin, username, total_games, correct_answers, total_questions')
    .order('spoticoin', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }

  return leaderboardData


  // return leaderboardData
  //   .sort((a, b) => b.spotiCoins - a.spotiCoins)
  //   .map((user, index) => ({
  //     ...user,
  //     rank: index + 1,
  //   }));
} 