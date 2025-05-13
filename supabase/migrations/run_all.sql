-- Supabase SQL ayarları
BEGIN;

------------------------------------------------------
-- 1. Profil tablosu ve ayarları
------------------------------------------------------

-- Profillerden kullanılmayan sütunları kaldır
ALTER TABLE public.profiles DROP COLUMN IF EXISTS badges;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS image;

-- Admin sütunu kontrolü ve ekleme
DO $$
BEGIN
  -- admin sütunu yoksa ekle
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'admin'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN admin BOOLEAN DEFAULT false;
  END IF;
END
$$;

-- RLS politikalarını düzenle
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;

-- Politikaları yeniden oluştur
-- Herkes profilleri görüntüleyebilir
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Herkes profil ekleyebilir (NextAuth OAuth flow için gerekli)
CREATE POLICY "Anyone can insert profiles"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

-- Kullanıcılar sadece kendi profillerini güncelleyebilir
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid()::text = user_id);

------------------------------------------------------
-- 2. Badges tablosu ve ayarları
------------------------------------------------------

-- Badges tablosu varsa oluştur
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bazı örnek badge'ler ekle
INSERT INTO public.badges (name, description, icon)
SELECT 'Verified', 'Verified user', 'badge-check'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Verified');

INSERT INTO public.badges (name, description, icon)
SELECT 'TopPlayer', 'Top ranked player', 'trophy'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'TopPlayer');

INSERT INTO public.badges (name, description, icon)
SELECT 'NewUser', 'New user', 'user'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'NewUser');

INSERT INTO public.badges (name, description, icon)
SELECT 'Expert', 'Expert music knowledge', 'music'
WHERE NOT EXISTS (SELECT 1 FROM public.badges WHERE name = 'Expert');

-- Badges RLS politikalarını düzenle
DROP POLICY IF EXISTS "Badges are viewable by everyone" ON public.badges;

-- Badges tablosunu RLS için etkinleştir
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

-- Herkes badge'leri görüntüleyebilir
CREATE POLICY "Badges are viewable by everyone"
    ON public.badges FOR SELECT
    USING (true);

------------------------------------------------------
-- 3. user_badges tablosu ve ayarları
------------------------------------------------------

-- user_badges tablosunu oluştur
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

-- İşlemleri tamamla
COMMIT; 