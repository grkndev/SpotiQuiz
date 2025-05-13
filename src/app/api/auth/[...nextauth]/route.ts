import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

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
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = account.expires_at
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            return session
        }
    },
    pages: {
        signIn: '/'
    }
})

export { handler as GET, handler as POST }