"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
// import { supabase } from "@/lib/supabase";
import { UserProfile, GameLog, Badge } from "@/lib/types";
import { getUserProfile, getUserGameLogs, getUserBadges } from "@/lib/db";

type SupabaseContextType = {
  userProfile: UserProfile | null;
  gameLogs: GameLog[];
  badges: Badge[];
  loading: boolean;
  refreshUserProfile: () => Promise<void>;
  refreshGameLogs: () => Promise<void>;
  refreshBadges: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    if (session?.user?.id) {
      try {
        const profile = await getUserProfile(session.user.id);
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
  };

  const refreshGameLogs = async () => {
    if (session?.user?.id) {
      try {
        const logs = await getUserGameLogs(session.user.id);
        setGameLogs(logs);
      } catch (error) {
        console.error("Error fetching game logs:", error);
      }
    }
  };

  const refreshBadges = async () => {
    if (session?.user?.id) {
      try {
        const userBadges = await getUserBadges(session.user.id);
        setBadges(userBadges);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (status === "loading") {
        return;
      }

      setLoading(true);

      if (status === "authenticated" && session?.user?.id) {
        try {
          await Promise.all([
            refreshUserProfile(),
            refreshGameLogs(),
            refreshBadges(),
          ]);
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      }

      setLoading(false);
    };

    loadUserData();
  }, [session, status]);

  const value = {
    userProfile,
    gameLogs,
    badges,
    loading,
    refreshUserProfile,
    refreshGameLogs,
    refreshBadges,
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}