ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT false;

NOTIFY pgrst, 'reload schema';
