
-- Create the images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Allow anyone to view/read images (public bucket)
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Only admins can upload images
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can update images
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'images'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can delete images
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND has_role(auth.uid(), 'admin'::app_role)
);
