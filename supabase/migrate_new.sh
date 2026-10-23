#!/usr/bin/env bash
# One-shot migration into a FRESH Supabase project.
# Usage:  ./supabase/migrate_new.sh "postgresql://postgres.<ref>:<pw>@aws-0-<region>.pooler.supabase.com:5432/postgres"
# Applies: full schema (+ quiz_results + storage buckets), then imports
# products -> orders -> entitlements (attendees intentionally skipped).
set -euo pipefail

DB_URL="${1:?Pass the new project's Postgres connection URI as arg 1}"
HERE="$(cd "$(dirname "$0")" && pwd)"
DL="/home/firania/Downloads"

echo "==> 1/2 schema"
psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$HERE/apply_all.sql"

echo "==> 2/2 data (products -> orders -> entitlements, single transaction)"
psql "$DB_URL" -v ON_ERROR_STOP=1 --single-transaction \
  -f "$DL/products_rows.sql" \
  -f "$DL/orders_rows.sql" \
  -f "$DL/entitlements_rows.sql"

echo "==> row counts"
psql "$DB_URL" -c "select
  (select count(*) from public.products)     as products,
  (select count(*) from public.orders)       as orders,
  (select count(*) from public.entitlements) as entitlements,
  (select count(*) from public.quiz_results) as quiz_results;"

echo "DONE. Next: upload ebook PDFs to the 'ebooks' bucket, then repoint Vercel env vars."
