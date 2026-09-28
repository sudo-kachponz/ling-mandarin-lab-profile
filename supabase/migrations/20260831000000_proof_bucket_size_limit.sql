-- Pin the payment-proofs bucket size limit explicitly so buyers can upload big
-- phone photos / multi-page PDF scans (the client caps at 25 MB and downscales
-- large images before upload). Without this the bucket relies on whatever the
-- project's global default happens to be, which a dashboard change could lower
-- and silently start 413-ing proof uploads. allowed_mime_types left NULL on
-- purpose: some phones report an empty/generic MIME, and the app already
-- validates format client-side — a storage-level allowlist would re-introduce
-- the "can't submit proof" rejection for those devices.
UPDATE storage.buckets
  SET file_size_limit = 31457280 -- 30 MB (headroom above the 25 MB client cap)
  WHERE id = 'payment-proofs';
