"use client"
import Link from "next/link";
import { Button } from "./ui/button";
import { Music, Menu, Headphones, LogOut, UserRound, Loader2, Coins, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { cn } from "@/lib/utils";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
export default function Header() {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("/");
  const { data: session, status } = useSession();


  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
    const isActive = activeLink === href;
    return (
      <Link
        href={href}
        onClick={() => setActiveLink(href)}
        className={cn(
          "relative px-3 py-1.5 text-sm font-medium transition-colors",
          isActive
            ? "text-green-600"
            : "text-gray-600 hover:text-green-600"
        )}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-10 bg-white/30 backdrop-filter backdrop-blur-xl shadow-sm border-b border-gray-100">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm">
            <Headphones className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-green-500 to-green-700 inline-block text-transparent bg-clip-text tracking-tight">SpotiQuiz</h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href="/how-to-play">How to Play</NavLink>
          <NavLink href="/leaderboard">Leaderboard</NavLink>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/game" className="bg-green-300 py-1 px-4 rounded-md flex items-center gap-1 w-full">
                Oyna
              </Link>
              <div className="bg-zinc-200 py-1 px-2 rounded-full flex items-center gap-1 w-full">
                <span className="text-sm font-medium">
                  {session?.user?.spoticoin}
                </span>
                <Coins className="w-4 h-4" />
              </div>
              <DropdownMenu >
                <DropdownMenuTrigger>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-9 w-9 border border-gray-200">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{session.user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <UserRound className="h-4 w-4 mr-2" />
                    Profil</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} variant="destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>



            </div>
          ) : status === "loading" ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </span>
          ) : (
            <Button
              className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm text-sm rounded-full px-5"
              onClick={() => signIn('spotify')}
            >
              <img src="/SpotifyIconWhite.svg" alt="Spotify" className="w-4 h-4 mr-1.5" />
              Login with Spotify
            </Button>
          )}
        </div>


        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-2 ">
          {/* Spoticoin */}
          <div className="bg-zinc-200 py-1 px-2 rounded-full flex items-center gap-1 w-full">
            <span className="text-sm font-medium">
              {session?.user?.spoticoin}
            </span>
            <Coins className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <Link href="/game" className="bg-green-300 py-1 px-4 rounded-md flex items-center gap-1 w-full">
              Oyna
            </Link>
          </div>



          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-1 rounded-full hover:bg-gray-100">
                  <Menu className="h-5 w-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-l border-gray-100 backdrop-blur-lg bg-white/95 p-0">
                <SheetHeader className="px-6 pt-8 pb-6 border-b border-gray-100">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-sm">
                      <Headphones className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-br from-green-500 to-green-700 inline-block text-transparent bg-clip-text">SpotiQuiz</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-4 px-6">
                  <Link
                    href="/how-to-play"
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600 font-medium text-base py-4 border-b border-gray-100 transition-colors"
                  >
                    How to Play
                  </Link>
                  <Link
                    href="/leaderboard"
                    className="flex items-center gap-2 text-gray-700 hover:text-green-600 font-medium text-base py-4 border-b border-gray-100 transition-colors"
                  >
                    Leaderboard
                  </Link>
                  
                  <div className="mt-6">
                    {session ? (
                      <div className="flex flex-col gap-4">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 text-gray-700 hover:text-green-600 font-medium text-base py-4 border-b border-gray-100 transition-colors"
                        >
                          Profile
                        </Link>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-gray-200">
                            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                            <AvatarFallback className="bg-green-100 text-green-600">
                              {session.user?.name?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{session.user?.name}</div>
                            <div className="text-xs text-gray-500">{session.user?.email}</div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => signOut()}
                          className="mt-2 border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-sm w-full py-6 rounded-xl text-base"
                        onClick={() => signIn('spotify')}
                      >
                        <img src="/SpotifyIconWhite.svg" alt="Spotify" className="w-5 h-5 mr-2" />
                        Login with Spotify
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
