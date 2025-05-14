import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";
import { User } from "@/lib/leaderboard-data";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
          {users.map((user, index) => (
            <TableRow key={user.user_id} className={cn(
              index === 0 ? "bg-yellow-50" :
                index === 1 ? "bg-gray-50" :
                  index === 2 ? "bg-amber-50" : ""
            )}>
              <TableCell className="text-center">
                {index + 1 && getRankIcon(index + 1)}
              </TableCell>
              <TableCell>
                <Link
                  href={`/profile/${user.user_id}`}
                  className="flex items-center space-x-3 hover:underline-offset-2 hover:underline transition-all"
                >
                  <Avatar>
                    <AvatarImage src={"http://github.com/shadcn.png"} alt={user.username} />
                    <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.username}</div>
                  </div>
                </Link>

              </TableCell>
              <TableCell className="text-center font-medium">{user.spoticoin.toLocaleString()}</TableCell>
              <TableCell className="hidden md:table-cell text-center">{user.total_games}</TableCell>
              <TableCell className="hidden md:table-cell text-center">{isNaN(user.correct_answers / user.total_questions * 100) ? "0" : Math.round(user.correct_answers / user.total_questions * 100)}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 