"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Share2, Music, BadgeCheck, Trophy, LogIn } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getUserProfile, getUserGameLogs } from "@/lib/db";
import { UserProfile, GameLog } from "@/lib/types";
import { toast } from "sonner";

export default function UserProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const userId = params.userId as string;
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        async function fetchProfileData() {
            try {
                // Fetch user profile
                const userProfile = await getUserProfile(userId);
                setProfile(userProfile);
                
                // Fetch user's game logs
                const logs = await getUserGameLogs(userId);
                setGameLogs(logs);
                
                // Check if current user is the profile owner
                if (status === "authenticated" && session?.user?.id === userId) {
                    setIsOwner(true);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
                toast.error("Profil bilgileri yüklenirken bir hata oluştu.");
            } finally {
                setIsLoading(false);
            }
        }

        if (userId) {
            fetchProfileData();
        }
    }, [userId, session, status]);

    // Copy profile URL to clipboard
    const shareProfile = () => {
        const url = `${window.location.origin}/profile/${userId}`;
        navigator.clipboard.writeText(url)
            .then(() => {
                toast.success("Profil bağlantısı panoya kopyalandı!");
            })
            .catch(() => {
                toast.error("Profil bağlantısı kopyalanırken bir hata oluştu.");
            });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Profile not found state
    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Profil Bulunamadı</CardTitle>
                        <CardDescription>Aradığınız kullanıcı profili mevcut değil veya erişiminiz yok.</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button
                            onClick={() => router.push("/")}
                            className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                            Ana Sayfaya Dön
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
                                {profile?.username?.[0]?.toUpperCase() || "K"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end items-center mt-4 gap-2">
                        {/* Guest login prompt */}
                        {status === "unauthenticated" && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full text-sm"
                                onClick={() => router.push("/")}
                            >
                                <LogIn className="h-4 w-4 mr-1" />
                                Giriş Yap
                            </Button>
                        )}
                        
                        {/* Share profile button */}
                        <Button variant="outline" size="sm" className="rounded-full text-sm" onClick={shareProfile}>
                            <Share2 className="h-4 w-4 mr-1" />
                            Profili Paylaş
                        </Button>
                        
                        {/* Edit profile button - only shown to profile owner */}
                        {isOwner && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full text-sm"
                                onClick={() => router.push("/profile/edit")}
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                Profili Düzenle
                            </Button>
                        )}
                    </div>

                    {/* Name and Title */}
                    <div className="mt-16">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">{profile?.username || "Kullanıcı Adı"}</h1>
                            {profile?.badges?.some(badge => badge.name === "Verified") && (
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
                            {profile?.badges?.some(badge => badge.name === "TopPlayer") && (
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
                        <p className="text-gray-600 mt-1">{profile?.bio || "Müzik Tutukunu | SpotiQuiz Oyuncusu"}</p>
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
                        <p className="text-xl font-bold text-green-600">{profile?.total_games || 0}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50 text-center">
                        <p className="text-sm text-gray-500">Doğru Cevap</p>
                        <p className="text-xl font-bold text-blue-600">{profile?.correct_answers || 0}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-purple-50 text-center">
                        <p className="text-sm text-gray-500">SpotiCoin</p>
                        <p className="text-xl font-bold text-purple-600">{profile?.spoticoin || 0}</p>
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
                </div>

                <div className="space-y-4">
                    {gameLogs.length > 0 ? (
                        gameLogs.slice(0, 3).map((log) => (
                            <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white">
                                            <Music className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-medium">{`Quiz #${log.quiz_id} oynadı`}</p>
                                        <p className="text-sm text-gray-500">{`${log.correct_answers}/${log.total_questions} doğru cevap • ${log.spoticoin_earned} SpotiCoin kazandı`}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(log.played_at).toLocaleDateString('tr-TR')}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>Henüz oyun kaydı bulunmamaktadır.</p>
                            {isOwner && (
                                <Button 
                                    onClick={() => router.push('/quiz')}
                                    className="mt-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                >
                                    Quiz Oyna
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 