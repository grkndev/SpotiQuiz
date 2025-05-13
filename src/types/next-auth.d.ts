import "next-auth"
import { JWT } from "next-auth/jwt"
import { Badge } from "@/lib/types"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
      id?: string
      username?: string
      bio?: string | null
      spoticoin?: number
      badges?: Badge[]
      stats?: {
        totalGames: number
        correctAnswers: number
        totalQuestions: number
      }
    }
  }

  interface Profile {
    id?: string
    display_name?: string
    email?: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    id?: string
  }
}