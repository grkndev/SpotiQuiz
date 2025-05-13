-- Remove image column if it exists
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS image; 