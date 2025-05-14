"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Share2, Music, BadgeCheck, Trophy } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getUserGameLogs, getUserProfile } from "@/lib/db";
import { GameLog, UserProfile } from "@/lib/types";
import { toast } from "sonner";

function ProfileContent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const refreshParam = searchParams.get('refresh');

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefreshTime, setLastRefreshTime] = useState<string | null>(null);

    // Fetch data function
    const fetchUserData = useCallback(async () => {
        if (!session?.user?.id || status !== "authenticated") {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            // Fetch user profile directly from database for most updated data
            const freshProfile = await getUserProfile(session.user.id);
            if (freshProfile) {
                setUserProfile(freshProfile);
            }

            // Fetch user's game logs
            const logs = await getUserGameLogs(session.user.id);
            setGameLogs(logs);

            // Update last refresh time
            setLastRefreshTime(new Date().toISOString());
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [session?.user?.id, status]);

    // Only fetch data when needed: on initial load, when refresh param changes, or when session changes
    useEffect(() => {
        // If this is the first load or refresh param has changed, fetch data
        if (lastRefreshTime === null || refreshParam) {
            fetchUserData();
        }
    }, [fetchUserData, refreshParam, lastRefreshTime]);

    // Redirect once session status is determined
    useEffect(() => {
        if (status === "authenticated" && session?.user?.id) {
            // If user is logged in, redirect to their specific profile page
            router.push(`/profile/${session.user.id}`);
        } else if (status === "unauthenticated") {
            // User is not logged in, we'll show the "login required" UI
            // The UI will be rendered below
        }
    }, [router, session, status]);

    // Copy profile URL to clipboard
    const shareProfile = () => {
        if (session?.user?.id) {
            const url = `${window.location.origin}/profile/${session.user.id}`;
            navigator.clipboard.writeText(url)
                .then(() => {
                    toast.success("Profil bağlantısı panoya kopyalandı!");
                })
                .catch(() => {
                    toast.error("Profil bağlantısı kopyalanırken bir hata oluştu.");
                });
        }
    };

    // Profile editing function
    const editProfile = () => {
        router.push("/profile/edit");
    };

    // Loading state
    if (status === "loading" || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Use profile data
    const profile = userProfile || {
        username: session?.user?.username || session?.user?.name,
        bio: session?.user?.bio,
        badges: session?.user?.badges || [],
        total_games: session?.user?.stats?.totalGames || 0,
        correct_answers: session?.user?.stats?.correctAnswers || 0,
        spoticoin: session?.user?.spoticoin || 0
    };

    // Not logged in state - this shows while the redirect is happening or if user isn't authenticated
    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Giriş Gerekli</CardTitle>
                        <CardDescription>
                            Kendi profilinizi görüntülemek için giriş yapmalısınız,
                            ama diğer kullanıcıların profillerini misafir olarak görüntüleyebilirsiniz.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center gap-4">
                        <Button
                            onClick={() => router.push("/")}
                            variant="outline"
                        >
                            Ana Sayfaya Dön
                        </Button>
                        <Button
                            onClick={() => router.push("/leaderboard")}
                            className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                            Liderlik Tablosuna Git
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-4xl mx-auto py-12">
            {/* Cover Photo and Profile Section */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm">
                {/* Cover Photo */}
                <div className="h-48 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 relative">

                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6 relative">
                    {/* Profile Avatar */}
                    <div className="absolute -top-16 left-6 border-4 border-white rounded-full">
                        <Avatar className="h-32 w-32 shadow-md">
                            <AvatarFallback className="bg-green-100 text-green-600 text-4xl">
                                {profile.username?.[0]?.toUpperCase() || "K"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end items-center mt-4 gap-2">
                        <Button variant="outline" size="sm" className="rounded-full text-sm" onClick={shareProfile}>
                            <Share2 className="h-4 w-4 mr-1" />
                            Profili Paylaş
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full text-sm"
                            onClick={editProfile}
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Profili Düzenle
                        </Button>
                    </div>

                    {/* Name and Title */}
                    <div className="mt-16">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">{profile.username || "Kullanıcı Adı"}</h1>
                            {profile.badges?.some(badge => badge.name === "Verified") && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <BadgeCheck className="h-5 w-5 text-green-600" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Onaylanmış Kullanıcı</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            {profile.badges?.some(badge => badge.name === "TopPlayer") && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Trophy className="h-5 w-5 text-green-600" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>En iyi #1</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        <p className="text-gray-600 mt-1">{profile.bio || "Müzik Tutukunu | SpotiQuiz Oyuncusu | Spotify Kullanıcısı"}</p>
                    </div>
                </div>
            </div>

            {/* Game Stats Card */}
            <div className="mt-6 rounded-xl overflow-hidden bg-white shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Oyun İstatistikleri</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg bg-green-50 text-center">
                        <p className="text-sm text-gray-500">Toplam Oyun</p>
                        <p className="text-xl font-bold text-green-600">{profile.total_games || 0}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50 text-center">
                        <p className="text-sm text-gray-500">Doğru Cevap</p>
                        <p className="text-xl font-bold text-blue-600">{profile.correct_answers || 0}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-purple-50 text-center">
                        <p className="text-sm text-gray-500">SpotiCoin</p>
                        <p className="text-xl font-bold text-purple-600">{profile.spoticoin || 0}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-orange-50 text-center">
                        <p className="text-sm text-gray-500">Sıralama</p>
                        <p className="text-xl font-bold text-orange-600">#--</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 rounded-xl overflow-hidden bg-white shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Son Aktiviteler</h2>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        Tümünü Gör
                    </Button>
                </div>

                <div className="space-y-4">
                    {gameLogs.length > 0 ? (
                        gameLogs.slice(0, 3).map((log) => (
                            <div key={log.id} className="flex items-center p-3 border rounded-lg">
                                <div className="flex-shrink-0 mr-3">
                                    <div className="bg-green-100 p-2 rounded-full">
                                        <Music className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-medium">
                                        {'Oyun Tamamlandı'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Skor: {log.score} - {`${log.correct_answers}/${log.total_questions} doğru cevap`}
                                    </p>
                                </div>
                                <div className="text-xs text-gray-400">
                                    {new Date(log.played_at).toLocaleDateString('tr-TR')}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">Henüz hiç oyun oynamadınız.</p>
                            <Button
                                className="mt-2 bg-gradient-to-r from-green-500 to-green-600"
                                size="sm"
                                onClick={() => router.push('/play')}
                            >
                                Hemen Oyna
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Badges Section */}
            <div className="mt-6 rounded-xl overflow-hidden bg-white shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Rozetler</h2>
                </div>

                {profile.badges && profile.badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {profile.badges.map((badge, index) => (
                            <div key={index} className="p-4 border rounded-lg bg-yellow-50 text-center">
                                <div className="flex justify-center mb-2">
                                    {badge.name === 'Verified' ? (
                                        <BadgeCheck className="h-8 w-8 text-green-600" />
                                    ) : badge.name === 'TopPlayer' ? (
                                        <Trophy className="h-8 w-8 text-yellow-600" />
                                    ) : (
                                        <Music className="h-8 w-8 text-blue-600" />
                                    )}
                                </div>
                                <p className="font-medium">{badge.name}</p>
                                <p className="text-xs text-gray-500">{badge.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Henüz hiç rozet kazanmadınız.</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Oyunlar oynayarak ve etkinliklere katılarak rozetler kazanabilirsiniz.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Profile() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}
