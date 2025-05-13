export type User = {
  id: string;
  username: string;
  avatarUrl: string;
  spotiCoins: number;
  rank?: number; // Will be calculated
  totalGamesPlayed: number;
  winRate: number;
};

// Mock data for the leaderboard
export const leaderboardData: User[] = [
  {
    id: "1",
    username: "MusicMaster",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    spotiCoins: 3452,
    totalGamesPlayed: 145,
    winRate: 0.82,
  },
  {
    id: "2",
    username: "RhythmQueen",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    spotiCoins: 2890,
    totalGamesPlayed: 120,
    winRate: 0.75,
  },
  {
    id: "3",
    username: "BeatBoxer",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    spotiCoins: 4210,
    totalGamesPlayed: 180,
    winRate: 0.88,
  },
  {
    id: "4",
    username: "PopCultureWiz",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    spotiCoins: 3100,
    totalGamesPlayed: 135,
    winRate: 0.79,
  },
  {
    id: "5",
    username: "SongHunter",
    avatarUrl: "https://i.pravatar.cc/150?img=15",
    spotiCoins: 5200,
    totalGamesPlayed: 200,
    winRate: 0.91,
  },
  {
    id: "6",
    username: "MelodyFinder",
    avatarUrl: "https://i.pravatar.cc/150?img=20",
    spotiCoins: 2750,
    totalGamesPlayed: 98,
    winRate: 0.70,
  },
  {
    id: "7",
    username: "TuneTalent",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
    spotiCoins: 3750,
    totalGamesPlayed: 142,
    winRate: 0.84,
  },
  {
    id: "8",
    username: "ChartTopper",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    spotiCoins: 4100,
    totalGamesPlayed: 175,
    winRate: 0.87,
  },
  {
    id: "9",
    username: "SoundSavvy",
    avatarUrl: "https://i.pravatar.cc/150?img=40",
    spotiCoins: 2950,
    totalGamesPlayed: 110,
    winRate: 0.76,
  },
  {
    id: "10",
    username: "BassDropper",
    avatarUrl: "https://i.pravatar.cc/150?img=50",
    spotiCoins: 3600,
    totalGamesPlayed: 140,
    winRate: 0.82,
  },
];

// Function to get ranked leaderboard data (sorted by SpotiCoins)
export function getRankedLeaderboardData(): User[] {
  return leaderboardData
    .sort((a, b) => b.spotiCoins - a.spotiCoins)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
} 