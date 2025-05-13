# SpotiQuiz Setup Instructions

This guide will help you set up the SpotiQuiz application with Supabase integration.

## Prerequisites

1. Node.js (version 16.x or later)
2. Supabase account
3. Spotify Developer account

## Step 1: Clone the repository

```bash
git clone <repository-url>
cd spotiquiz
```

## Step 2: Install dependencies

```bash
npm install
```

## Step 3: Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Spotify
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

## Step 4: Set up Supabase

Follow the instructions in the `SUPABASE_SETUP.md` file to set up your Supabase project.

## Step 5: Run the development server

```bash
npm run dev
```

## Step 6: Access the application

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/`
  - `app/`: Next.js app directory with routes
  - `components/`: Reusable UI components
  - `lib/`: Utility functions and database interactions
    - `supabase.ts`: Supabase client configuration
    - `db.ts`: Database utility functions
    - `types.ts`: TypeScript type definitions
  - `providers/`: Context providers
    - `SupabaseProvider.tsx`: Supabase data context
  - `types/`: Global type definitions
    - `next-auth.d.ts`: NextAuth type extensions
- `supabase/`: Supabase configuration
  - `migrations/`: Database migrations
    - `create_tables.sql`: Initial schema setup

## Database Schema

The application uses the following tables:

1. `profiles`: User profile data
2. `badges`: Badge definitions
3. `user_badges`: Junction table for user badges
4. `game_logs`: Record of games played

## Authentication Flow

1. User signs in with Spotify OAuth
2. NextAuth creates a session
3. On first sign-in, a user profile is created in Supabase
4. User data is accessible via session and Supabase provider

## Next Steps

After setup, you may want to:

1. Create a custom profile page
2. Set up quiz functionality
3. Implement the SpotiCoin reward system
4. Build leaderboards