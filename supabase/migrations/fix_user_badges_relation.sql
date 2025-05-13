-- Set the proper foreign key relationship for badge_id
ALTER TABLE public.user_badges
  DROP CONSTRAINT IF EXISTS user_badges_badge_id_fkey,
  ADD CONSTRAINT user_badges_badge_id_fkey 
  FOREIGN KEY (badge_id) REFERENCES public.badges(id) ON DELETE CASCADE; 