"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createQuiz } from "@/lib/db";
import { toast } from "sonner";

export default function CreateQuizPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
    const [spotifyPlaylistId, setSpotifyPlaylistId] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!session?.user?.id) {
            toast.error("Oturum bilgilerinize erişilemiyor.");
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            const newQuiz = await createQuiz({
                title,
                description,
                category,
                difficulty,
                featured: false,
                created_by: session.user.id,
                spotify_playlist_id: spotifyPlaylistId || undefined,
                image_url: imageUrl || undefined,
            });
            
            toast.success("Quiz başarıyla oluşturuldu!");
            
            // Redirect to edit questions page
            router.push(`/quiz/${newQuiz.id}/edit`);
        } catch (error) {
            console.error("Error creating quiz:", error);
            toast.error("Quiz oluşturulurken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <CardDescription>Quiz oluşturmak için giriş yapmalısınız.</CardDescription>
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
                    <CardTitle className="text-xl">Yeni Quiz Oluştur</CardTitle>
                    <CardDescription>
                        Quiz detaylarını doldurarak kendi müzik quizini oluştur.
                        Oluşturduktan sonra sorularını ekleyebilirsin.
                    </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Quiz Başlığı</Label>
                            <Input 
                                id="title" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Quizin için çekici bir başlık"
                                required
                            />
                        </div>
                        
                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Açıklama</Label>
                            <Textarea 
                                id="description" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Quizin hakkında kısa bir açıklama"
                                rows={3}
                                required
                            />
                        </div>
                        
                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <Input 
                                id="category" 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Örn: Rock, Pop, 90'lar, Türkçe Pop vb."
                                required
                            />
                        </div>
                        
                        {/* Difficulty */}
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Zorluk</Label>
                            <Select
                                value={difficulty}
                                onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}
                            >
                                <SelectTrigger id="difficulty">
                                    <SelectValue placeholder="Zorluk seçin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="easy">Kolay</SelectItem>
                                    <SelectItem value="medium">Orta</SelectItem>
                                    <SelectItem value="hard">Zor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Spotify Playlist ID */}
                        <div className="space-y-2">
                            <Label htmlFor="spotifyPlaylistId">Spotify Çalma Listesi ID (Opsiyonel)</Label>
                            <Input 
                                id="spotifyPlaylistId" 
                                value={spotifyPlaylistId} 
                                onChange={(e) => setSpotifyPlaylistId(e.target.value)}
                                placeholder="Spotify çalma listesi ID"
                            />
                            <p className="text-xs text-gray-500">
                                Quizinle ilişkili bir Spotify çalma listesi varsa, ID'sini buraya ekleyebilirsin.
                            </p>
                        </div>
                        
                        {/* Image URL */}
                        <div className="space-y-2">
                            <Label htmlFor="imageUrl">Kapak Resmi URL (Opsiyonel)</Label>
                            <Input 
                                id="imageUrl" 
                                value={imageUrl} 
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => router.push("/")}
                        >
                            İptal
                        </Button>
                        <Button 
                            type="submit"
                            className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Oluşturuluyor..." : "Quiz Oluştur"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
} 