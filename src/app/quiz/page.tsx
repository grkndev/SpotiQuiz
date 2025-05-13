"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getAllQuizzes, getFeaturedQuizzes } from "@/lib/db";
import { Quiz } from "@/lib/types";
import { Music, Plus, Filter } from "lucide-react";
import { toast } from "sonner";

export default function QuizzesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [featuredQuizzes, setFeaturedQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [difficultyFilter, setDifficultyFilter] = useState<string>("");
    
    // Load quizzes
    useEffect(() => {
        async function loadQuizzes() {
            try {
                setIsLoading(true);
                
                // Load all quizzes
                const allQuizzes = await getAllQuizzes(50);
                setQuizzes(allQuizzes);
                
                // Load featured quizzes
                const featured = await getFeaturedQuizzes();
                setFeaturedQuizzes(featured);
            } catch (error) {
                console.error("Error loading quizzes:", error);
                toast.error("Quizler yüklenirken bir hata oluştu.");
            } finally {
                setIsLoading(false);
            }
        }
        
        loadQuizzes();
    }, []);
    
    // Extract unique categories from quizzes
    const categories = [...new Set(quizzes.map(quiz => quiz.category))];
    
    // Filter quizzes based on search and filters
    const filteredQuizzes = quizzes.filter(quiz => {
        const matchesSearch = searchTerm === "" || 
            quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesCategory = categoryFilter === "" || quiz.category === categoryFilter;
        const matchesDifficulty = difficultyFilter === "" || quiz.difficulty === difficultyFilter;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
    });
    
    // Reset filters
    const resetFilters = () => {
        setSearchTerm("");
        setCategoryFilter("");
        setDifficultyFilter("");
    };
    
    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }
    
    return (
        <div className="container max-w-6xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Müzik Quizleri</h1>
                    <p className="text-gray-600 mt-1">Müzik bilgini test et, eğlen ve SpotiCoin kazan!</p>
                </div>
                
                {status === "authenticated" && (
                    <Button 
                        onClick={() => router.push("/quiz/create")}
                        className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Quiz Oluştur
                    </Button>
                )}
            </div>
            
            {/* Featured Quizzes */}
            {featuredQuizzes.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4">Öne Çıkan Quizler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredQuizzes.map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                </div>
            )}
            
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="search" className="text-sm text-gray-500 mb-1 block">Quiz Ara</label>
                        <Input
                            id="search"
                            placeholder="Quiz başlığı veya açıklaması ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="w-full md:w-40">
                        <label htmlFor="category" className="text-sm text-gray-500 mb-1 block">Kategori</label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Tümü</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="w-full md:w-40">
                        <label htmlFor="difficulty" className="text-sm text-gray-500 mb-1 block">Zorluk</label>
                        <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                            <SelectTrigger id="difficulty">
                                <SelectValue placeholder="Zorluk" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Tümü</SelectItem>
                                <SelectItem value="easy">Kolay</SelectItem>
                                <SelectItem value="medium">Orta</SelectItem>
                                <SelectItem value="hard">Zor</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <Button variant="outline" onClick={resetFilters} className="h-10">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtreleri Temizle
                    </Button>
                </div>
            </div>
            
            {/* All Quizzes */}
            <div>
                <h2 className="text-xl font-bold mb-4">Tüm Quizler</h2>
                
                {filteredQuizzes.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <Music className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-700">Hiç quiz bulunamadı</h3>
                        <p className="text-gray-500 mt-1">Farklı filtreler deneyebilir veya kendi quizini oluşturabilirsin.</p>
                        
                        {status === "authenticated" && (
                            <Button 
                                onClick={() => router.push("/quiz/create")}
                                className="mt-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Yeni Quiz Oluştur
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredQuizzes.map(quiz => (
                            <QuizCard key={quiz.id} quiz={quiz} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Quiz Card Component
function QuizCard({ quiz }: { quiz: Quiz }) {
    const difficultyColors = {
        easy: "bg-green-100 text-green-800",
        medium: "bg-blue-100 text-blue-800",
        hard: "bg-red-100 text-red-800"
    };
    
    const difficultyLabels = {
        easy: "Kolay",
        medium: "Orta",
        hard: "Zor"
    };
    
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <Badge className={difficultyColors[quiz.difficulty]}>
                        {difficultyLabels[quiz.difficulty]}
                    </Badge>
                </div>
                <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0 pb-2 flex-grow">
                <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-gray-50">
                        {quiz.category}
                    </Badge>
                </div>
            </CardContent>
            
            <CardFooter className="pt-2">
                <Link href={`/quiz/${quiz.id}`} className="w-full">
                    <Button className="w-full bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                        Şimdi Oyna
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
} 