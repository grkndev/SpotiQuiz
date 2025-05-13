import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { supabase, supabaseAdmin } from "@/lib/supabase"
import { createUserProfile, getUserProfile, updateUserProfile, addBadgeToUser } from "@/lib/db"

const handler = NextAuth({
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,

            authorization: {
                params: {
                    scope: "user-read-email playlist-read-private user-read-private user-top-read",
                    redirect_uri: "http://127.0.0.1:3000/api/auth/callback/spotify"
                    
                }
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (user && account && profile) {
                    // Check if user already exists in our database
                    const { data: existingProfile, error } = await supabaseAdmin
                        .from('profiles')
                        .select('*')
                        .eq('user_id', user.id)
                        .single();
                    
                    if (error && error.code === 'PGRST116') {
                        // User doesn't exist, create new profile
                        // Create new user profile in Supabase using admin privileges
                        const { data: newProfile, error: insertError } = await supabaseAdmin
                            .from('profiles')
                            .insert({
                                user_id: user.id,
                                email: user.email || '',
                                username: profile.display_name || user.name || user.email?.split('@')[0] || `user_${Date.now()}`,
                                bio: null,
                                total_games: 0,
                                correct_answers: 0,
                                total_questions: 0,
                                spoticoin: 0,
                            })
                            .select()
                            .single();
                        
                        if (insertError) {
                            console.error("Error creating profile:", insertError);
                        } else {
                            // Add "NewUser" badge to new users
                            try {
                                // Fetch the "NewUser" badge ID
                                const { data: badgeData, error: badgeError } = await supabaseAdmin
                                    .from('badges')
                                    .select('id')
                                    .eq('name', 'NewUser')
                                    .single();
                                    
                                if (!badgeError && badgeData) {
                                    // Kullanıcıya badge eklerken de admin kullan
                                    const { data: badgeResult, error: addBadgeError } = await supabaseAdmin
                                        .from('user_badges')
                                        .insert({
                                            user_id: user.id,
                                            badge_id: badgeData.id
                                        })
                                        .select()
                                        .single();
                                    
                                    if (addBadgeError) {
                                        console.error("Error adding badge:", addBadgeError);
                                    }
                                }
                            } catch (badgeError) {
                                console.error('Error adding NewUser badge:', badgeError);
                            }
                        }
                    }
                }
                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return true; // Still allow sign in even if profile creation fails
            }
        },
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = account.expires_at
                token.id = profile?.id || token.sub
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            if (token.id && session.user) {
                session.user.id = token.id as string;
                
                // Get user profile data from Supabase
                try {
                    const userProfile = await getUserProfile(token.id as string);
                    if (userProfile) {
                        session.user.username = userProfile.username;
                        session.user.bio = userProfile.bio;
                        session.user.spoticoin = userProfile.spoticoin;
                        session.user.badges = userProfile.badges;
                        session.user.stats = {
                            totalGames: userProfile.total_games,
                            correctAnswers: userProfile.correct_answers,
                            totalQuestions: userProfile.total_questions,
                        };
                    }
                } catch (error) {
                    console.error('Error fetching user profile in session callback:', error);
                }
            }
            return session
        }
    },
    pages: {
        signIn: '/'
    }
})

export { handler as GET, handler as POST }