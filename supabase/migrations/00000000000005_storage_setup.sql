-- =========================================
-- STORAGE: bucket + policies for venue/caterer/avatar images
-- =========================================

insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Public read — anyone can view listing images (they're shown on public pages)
create policy "Public can view listing images"
  on storage.objects for select
  using (bucket_id = 'listing-images');

-- Authenticated users can upload (the app scopes folder/filename by owner id
-- client-side; a stricter version could check the path prefix against
-- auth.uid(), but our vendor ids don't equal auth.uid() directly since
-- vendor.id != profiles.id, so we keep this permissive for authenticated
-- users only, not public)
create policy "Authenticated users can upload listing images"
  on storage.objects for insert
  with check (bucket_id = 'listing-images' and auth.role() = 'authenticated');

create policy "Authenticated users can update their uploaded images"
  on storage.objects for update
  using (bucket_id = 'listing-images' and auth.role() = 'authenticated');
