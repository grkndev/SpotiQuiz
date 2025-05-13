-- 1. user_badges tablosunun mevcut RLS politikalarını kaldıralım
DROP POLICY IF EXISTS "User badges are viewable by everyone" ON public.user_badges;
DROP POLICY IF EXISTS "Only admins can insert badges" ON public.user_badges;

-- 2. Yeni politikalar ekleyelim
-- Herkes user_badges kayıtlarını görüntüleyebilir
CREATE POLICY "User badges are viewable by everyone"
    ON public.user_badges FOR SELECT
    USING (true);

-- Herkes badge ekleyebilir (OAuth flow için gerekli)
CREATE POLICY "Anyone can insert user_badges"
    ON public.user_badges FOR INSERT
    WITH CHECK (true);

-- Kullanıcılar sadece kendi badge'lerini silebilir
CREATE POLICY "Users can delete their own badges"
    ON public.user_badges FOR DELETE
    USING (auth.uid()::text = user_id);

-- 3. Eğer gerekirse RLS'i tamamen kapatma seçeneği (test için iyi, üretimde yapma)
-- ALTER TABLE public.user_badges DISABLE ROW LEVEL SECURITY; 