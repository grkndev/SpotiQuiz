-- 1. Eğer daha önce eklenmeye çalışıldıysa badges sütununu kaldır
ALTER TABLE public.profiles DROP COLUMN IF EXISTS badges;

-- 2. Eğer daha önce eklenmeye çalışıldıysa image sütununu kaldır
ALTER TABLE public.profiles DROP COLUMN IF EXISTS image;

-- 3. user_badges tablosunda ilişkileri düzelt
ALTER TABLE public.user_badges
  DROP CONSTRAINT IF EXISTS user_badges_badge_id_fkey,
  ADD CONSTRAINT user_badges_badge_id_fkey 
  FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE;

-- 4. Sütunların varlığını kontrol edelim
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