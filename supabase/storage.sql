-- 1. Create a "item_photo" bucket for food photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('item_photo', 'item_photo', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public to View Images (Read-only)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'item_photo');

-- 3. Allow Authenticated Admins to Upload/Update/Delete
CREATE POLICY "Admin All Access"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id = 'item_photo' 
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  bucket_id = 'item_photo' 
  AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

