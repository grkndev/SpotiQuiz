import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { getRankedLeaderboardData } from "@/lib/leaderboard-data";
import { Trophy, Users, Sparkles } from "lucide-react";

export const metadata = {
  title: "SpotiQuiz - Leaderboard",
  description: "SpotiQuiz top players ranked by SpotiCoins",
};

export default function LeaderboardPage() {
  const leaderboardData = getRankedLeaderboardData();
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <section className="w-full py-8 md:py-16 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-8">
            <div className="rounded-full bg-green-100 p-3">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Liderlik Tablosu
              </h1>
              <p className="text-base max-w-[600px] text-gray-500 md:text-xl">
                En çok SpotiCoin'e sahip olan oyuncular. Sıralamalarda yerini al ve müzik bilgini herkese göster!
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {/* Top Players Stats Cards */}
              {leaderboardData.slice(0, 3).map((user) => (
                <div 
                  key={user.id} 
                  className={`
                    rounded-xl p-6 border shadow-sm
                    ${user.rank === 1 ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200' : 
                      user.rank === 2 ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200' : 
                      'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className={`
                          flex items-center justify-center w-8 h-8 rounded-full text-white
                          ${user.rank === 1 ? 'bg-yellow-400' : 
                            user.rank === 2 ? 'bg-gray-400' : 
                            'bg-amber-600'
                          }
                        `}
                      >
                        {user.rank}
                      </div>
                      <h3 className="font-bold text-lg">{user.username}</h3>
                    </div>
                    <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded-full shadow-sm">
                      <Sparkles className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {user.spotiCoins.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img 
                        src={user.avatarUrl} 
                        alt={user.username} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{Math.round(user.winRate * 100)}% Kazanma Oranı</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{user.totalGamesPlayed}</span> oyun oynandı
                  </div>
                </div>
              ))}
            </div>
            
            {/* Full Leaderboard Table */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold">Tüm Oyuncular</h2>
              </div>
              <LeaderboardTable users={leaderboardData} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
