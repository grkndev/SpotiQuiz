"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Share2, MoreHorizontal, Music, BadgeCheck, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Profile() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Loading state
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    // Not logged in state
    if (status === "unauthenticated") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
                <Card className="max-w-md w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Giriş Gerekli</CardTitle>
                        <CardDescription>Profil sayfasını görüntülemek için giriş yapmalısınız.</CardDescription>
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
                            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "Kullanıcı"} />
                            <AvatarFallback className="bg-green-100 text-green-600 text-4xl">
                                {session?.user?.name?.[0]?.toUpperCase() || "K"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end items-center mt-4 gap-2">
                        <Button variant="outline" size="sm" className="rounded-full text-sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Profili Paylaş
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full text-sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Profili Düzenle
                        </Button>
                    </div>

                    {/* Name and Title */}
                    <div className="mt-16">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">{session?.user?.name || "Kullanıcı Adı"}</h1>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <BadgeCheck className="h-5 w-5 text-green-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Onaylanmış Kullanıcı</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Trophy className="h-5 w-5 text-green-600" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>En iyi #1</p>
                                    </TooltipContent>
                                </Tooltip>


                            </TooltipProvider>
                        </div>
                        <p className="text-gray-600">Müzik Tutukunu | SpotiQuiz Oyuncusu | Spotify Kullanıcısı</p>




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
                        <p className="text-xl font-bold text-green-600">47</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-blue-50 text-center">
                        <p className="text-sm text-gray-500">Doğru Cevap</p>
                        <p className="text-xl font-bold text-blue-600">253</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-purple-50 text-center">
                        <p className="text-sm text-gray-500">Toplam Puan</p>
                        <p className="text-xl font-bold text-purple-600">1280</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-orange-50 text-center">
                        <p className="text-sm text-gray-500">Sıralama</p>
                        <p className="text-xl font-bold text-orange-600">#15</p>
                    </div>
                </div>

                <div className="mt-4">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 mt-2">
                        Detaylı İstatistikleri Görüntüle
                    </Button>
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
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white">
                                        <Music className="h-5 w-5" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-medium">{`Pop Quiz #${Math.floor(Math.random() * 1000)} oynadı`}</p>
                                    <p className="text-sm text-gray-500">{`${Math.floor(Math.random() * 10)}/10 doğru cevap • ${Math.floor(Math.random() * 100)} puan kazandı`}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(Date.now() - item * 86400000).toLocaleDateString('tr-TR')}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
