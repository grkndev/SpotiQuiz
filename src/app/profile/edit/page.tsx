"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile } from "@/lib/db";
import { UserProfile } from "@/lib/types";
import { toast } from "sonner";

export default function EditProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");

    useEffect(() => {
        async function fetchUserData() {
            if (session?.user?.id) {
                try {
                    // Fetch user profile
                    const userProfile = await getUserProfile(session.user.id);
                    setProfile(userProfile);
                    
                    // Initialize form fields
                    if (userProfile) {
                        setUsername(userProfile.username || "");
                        setBio(userProfile.bio || "");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    toast.error("Profil bilgileri yüklenirken bir hata oluştu.");
                } finally {
                    setIsLoading(false);
                }
            } else if (status !== "loading") {
                setIsLoading(false);
            }
        }

        fetchUserData();
    }, [session, status]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!session?.user?.id) {
            toast.error("Oturum bilgilerinize erişilemiyor.");
            return;
        }
        
        try {
            setIsSaving(true);
            
            // Update profile
            await updateUserProfile(session.user.id, {
                username,
                bio
            });
            
            toast.success("Profil başarıyla güncellendi!");
            
            // Redirect back to profile page
            router.push("/profile");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Profil güncellenirken bir hata oluştu.");
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (status === "loading" || isLoading) {
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
                        <CardDescription>Profilinizi düzenlemek için giriş yapmalısınız.</CardDescription>
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
        <div className="container max-w-2xl mx-auto py-12">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Profil Düzenle</CardTitle>
                    <CardDescription>Profil bilgilerinizi güncelleyin</CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {/* Avatar */}
                        <div className="flex justify-center mb-4">
                            <Avatar className="h-24 w-24 shadow-md">
                                <AvatarFallback className="bg-green-100 text-green-600 text-3xl">
                                    {username?.[0]?.toUpperCase() || "K"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        
                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username">Kullanıcı Adı</Label>
                            <Input 
                                id="username" 
                                value={username} 
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                placeholder="Kullanıcı adınız"
                                required
                            />
                        </div>
                        
                        {/* Bio */}
                        <div className="space-y-2">
                            <Label htmlFor="bio">Hakkında</Label>
                            <Textarea 
                                id="bio" 
                                value={bio} 
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBio(e.target.value)}
                                placeholder="Kendiniz hakkında kısa bir bilgi yazın. Bu bilgi profilinizde gösterilecektir."
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-xs text-gray-500">Profilinizde görünecek kısa bir açıklama. Boş bırakırsanız varsayılan bir metin gösterilecektir.</p>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => router.push("/profile")}
                        >
                            İptal
                        </Button>
                        <Button 
                            type="submit"
                            className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            disabled={isSaving}
                        >
                            {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
} 