# SpotiQuiz Supabase Setup Guide

This guide will help you set up Supabase for the SpotiQuiz application.

## Prerequisites

- Supabase account (create one at [supabase.com](https://supabase.com))
- Spotify Developer account for OAuth (create one at [developer.spotify.com](https://developer.spotify.com))

## Step 1: Create a new Supabase project

1. Log in to your Supabase account
2. Create a new project by clicking "New Project"
3. Enter a name for your project (e.g., "spotiquiz")
4. Choose a database password (store it securely)
5. Select a region closest to your target audience
6. Click "Create new project"

## Step 2: Set up database schema

1. In your Supabase project, navigate to the SQL Editor
2. Copy the contents of `supabase/migrations/create_tables.sql` from this repository
3. Paste and run the SQL in the Supabase SQL Editor

## Step 3: Configure authentication

### Set up Spotify OAuth provider:

1. Go to the Authentication > Providers section in your Supabase dashboard
2. Enable the Spotify provider
3. Enter your Spotify Client ID and Client Secret from your Spotify Developer account
4. Set the redirect URL to `https://YOUR_VERCEL_URL/api/auth/callback/spotify` (replace with your actual Vercel URL)
5. Save the settings

## Step 4: Configure environment variables

Add the following environment variables to your Vercel project:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# NextAuth
NEXTAUTH_URL=https://your-vercel-url
NEXTAUTH_SECRET=your-nextauth-secret

# Spotify
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

## Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure the environment variables in Vercel
4. Deploy your application

## Row Level Security (RLS) Policies

The database schema includes RLS policies to secure your data:

- Profiles:
  - Anyone can view profiles
  - Users can only update their own profiles
  - Users can only insert their own profile

- Badges:
  - Anyone can view badges
  - Only admins can create badges

- User Badges:
  - Anyone can view user badges
  - Only admins can assign badges to users

- Game Logs:
  - Users can view their own game logs
  - Users can only insert their own game logs
  - Game logs are publicly viewable for leaderboards

## Database Schema Overview

1. **profiles**: Stores user profile information
   - user_id: Linked to auth.users
   - username, email, bio
   - stats (total_games, correct_answers, etc.)
   - spoticoin balance

2. **badges**: Stores available badges
   - name, description, icon

3. **user_badges**: Junction table linking users to their badges
   - user_id, badge_id

4. **game_logs**: Records of games played
   - user_id, quiz_id
   - score, correct_answers, total_questions
   - spoticoin_earned