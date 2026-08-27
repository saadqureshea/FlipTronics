-- Storage policies for the listing-photos bucket.
-- Making a bucket "Public" in the dashboard only allows public READS.
-- It does NOT grant upload/update/delete permission — that still needs
-- explicit policies on storage.objects, which is what this script adds.
--
-- Run this in Supabase: Project -> SQL Editor -> New query -> paste -> Run.
-- (Run this in addition to schema.sql, not instead of it.)

create policy "Public can view listing photos"
  on storage.objects for select
  using (bucket_id = 'listing-photos');

create policy "Authenticated users can upload listing photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listing-photos');

create policy "Authenticated users can update listing photos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'listing-photos')
  with check (bucket_id = 'listing-photos');

create policy "Authenticated users can delete listing photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listing-photos');
