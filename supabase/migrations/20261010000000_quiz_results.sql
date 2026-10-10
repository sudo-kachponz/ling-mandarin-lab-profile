-- Leaderboard: stores each buyer's best score per quiz.
-- Identity is bound to an order (via its access_token, verified server-side),
-- so results are traceable per buyer and can't be posted by outsiders.
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  order_ref text not null,
  buyer_name text,
  slug text not null,
  page_id integer not null,
  score integer not null default 0,
  total integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_ref, slug, page_id)
);

create index if not exists quiz_results_slug_idx on public.quiz_results (slug);
create index if not exists quiz_results_order_idx on public.quiz_results (order_ref);

-- Server-only: RLS on, no public policies → only the service role (our API
-- endpoints) can read/write. The anon key in the browser cannot touch it.
alter table public.quiz_results enable row level security;
