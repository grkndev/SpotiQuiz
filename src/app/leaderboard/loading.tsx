import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Users } from "lucide-react";

export default function LeaderboardLoading() {
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
            {/* Top Players Skeletons */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl p-6 border shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                  <div className="flex items-center space-x-3 mb-3">
                    <Skeleton className="w-14 h-14 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
            
            {/* Table Skeleton */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold">Tüm Oyuncular</h2>
              </div>
              <div className="rounded-md border overflow-hidden">
                <div className="bg-gray-50 p-4">
                  <div className="grid grid-cols-5 gap-4">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <div className="divide-y">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-4">
                      <div className="grid grid-cols-5 gap-4 items-center">
                        <Skeleton className="h-6 w-6 rounded-full mx-auto" />
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-5 w-24" />
                        </div>
                        <Skeleton className="h-5 w-16 mx-auto" />
                        <Skeleton className="h-5 w-12 mx-auto" />
                        <Skeleton className="h-5 w-12 mx-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 