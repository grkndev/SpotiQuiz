-- user_badges tablosunu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    badge_id UUID NOT NULL,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, badge_id)
);

-- Foreign key ilişkilerini düzelt
ALTER TABLE public.user_badges
  DROP CONSTRAINT IF EXISTS user_badges_badge_id_fkey,
  ADD CONSTRAINT user_badges_badge_id_fkey 
  FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE;

-- Profiles tablosu ile ilişki
ALTER TABLE public.user_badges
  DROP CONSTRAINT IF EXISTS user_badges_user_id_fkey,
  ADD CONSTRAINT user_badges_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- RLS'i etkinleştir
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS politikalarını düzenle
DROP POLICY IF EXISTS "User badges are viewable by everyone" ON public.user_badges;
DROP POLICY IF EXISTS "Only admins can insert badges" ON public.user_badges;
DROP POLICY IF EXISTS "Anyone can insert user_badges" ON public.user_badges;

-- Herkes user_badges görüntüleyebilir
CREATE POLICY "User badges are viewable by everyone"
    ON public.user_badges FOR SELECT
    USING (true);

-- Herkes badge ekleyebilir (test için)
CREATE POLICY "Anyone can insert user_badges"
    ON public.user_badges FOR INSERT
    WITH CHECK (true); 