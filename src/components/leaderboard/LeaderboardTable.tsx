import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";
import { User } from "@/lib/leaderboard-data";
import { cn } from "@/lib/utils";

interface LeaderboardTableProps {
  users: User[];
}

export function LeaderboardTable({ users }: LeaderboardTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-yellow-400 rounded-full">
          <Trophy className="w-3.5 h-3.5 text-white" />
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-gray-300 rounded-full">
          <Trophy className="w-3.5 h-3.5 text-white" />
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-amber-700 rounded-full">
          <Trophy className="w-3.5 h-3.5 text-white" />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-gray-700 font-medium text-sm">
          {rank}
        </div>
      );
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">Sıra</TableHead>
            <TableHead>Kullanıcı</TableHead>
            <TableHead className="text-center">SpotiCoin</TableHead>
            <TableHead className="hidden md:table-cell text-center">Oyunlar</TableHead>
            <TableHead className="hidden md:table-cell text-center">Kazanma Oranı</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className={cn(
              user.rank === 1 ? "bg-yellow-50" : 
              user.rank === 2 ? "bg-gray-50" : 
              user.rank === 3 ? "bg-amber-50" : ""
            )}>
              <TableCell className="text-center">
                {user.rank && getRankIcon(user.rank)}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.username}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center font-medium">{user.spotiCoins.toLocaleString()}</TableCell>
              <TableCell className="hidden md:table-cell text-center">{user.totalGamesPlayed}</TableCell>
              <TableCell className="hidden md:table-cell text-center">{`${Math.round(user.winRate * 100)}%`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 