-- Önce badges tablosunun var olup olmadığını kontrol edelim
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Eğer badges tablosunda hiç kayıt yoksa, bazı örnek badge'ler ekleyelim
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

-- Badges tablosunda RLS politikalarını düzenleyelim
DROP POLICY IF EXISTS "Badges are viewable by everyone" ON public.badges;

-- Herkes badge'leri görüntüleyebilir
CREATE POLICY "Badges are viewable by everyone"
    ON public.badges FOR SELECT
    USING (true);

-- Badges tablosunu RLS için etkinleştir (eğer henüz yapılmadıysa)
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY; 