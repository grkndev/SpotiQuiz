-- 1. Önce profiles tablosunun mevcut RLS politikalarını kaldıralım
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- 2. İzin veren yeni politikalar ekleyelim
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

-- 3. Eğer gerekirse RLS'i tamamen kapatma seçeneği (test için iyi, üretimde yapma)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY; 