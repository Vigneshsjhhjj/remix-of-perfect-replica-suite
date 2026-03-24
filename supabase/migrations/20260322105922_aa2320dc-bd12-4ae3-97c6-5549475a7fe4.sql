
ALTER TABLE public.parcels 
ADD COLUMN IF NOT EXISTS patta_number text,
ADD COLUMN IF NOT EXISTS subdivision text,
ADD COLUMN IF NOT EXISTS land_type text DEFAULT 'private',
ADD COLUMN IF NOT EXISTS total_extent_sqft numeric,
ADD COLUMN IF NOT EXISTS patta_holder text;
