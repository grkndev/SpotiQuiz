-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    bio TEXT,
    image TEXT,
    total_games INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    spoticoin INTEGER DEFAULT 0,
    admin BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create badges table
CREATE TABLE public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_badges junction table
CREATE TABLE public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- Create game_logs table
CREATE TABLE public.game_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    quiz_id TEXT NOT NULL,
    score INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    spoticoin_earned INTEGER NOT NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create some initial badges
INSERT INTO public.badges (name, description, icon) VALUES
('Verified', 'Verified user', 'badge-check'),
('TopPlayer', 'Top ranked player', 'trophy'),
('NewUser', 'New user', 'user'),
('Expert', 'Expert music knowledge', 'music');

-- Create Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid()::text = user_id);

-- Badges policies (badges are public)
CREATE POLICY "Badges are viewable by everyone"
    ON public.badges FOR SELECT
    USING (true);

-- User badges policies
CREATE POLICY "User badges are viewable by everyone"
    ON public.user_badges FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert badges"
    ON public.user_badges FOR INSERT
    WITH CHECK (auth.uid()::text IN (SELECT user_id FROM profiles WHERE admin = true));

-- Game logs policies
CREATE POLICY "Users can view their own game logs"
    ON public.game_logs FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Public game logs for leaderboards"
    ON public.game_logs FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own game logs"
    ON public.game_logs FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();