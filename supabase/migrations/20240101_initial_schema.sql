-- 1. Tabel products
CREATE TABLE public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  price integer NOT NULL,
  cover_url text,
  pdf_path text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Tabel orders
CREATE TABLE public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_ref text UNIQUE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE RESTRICT,
  buyer_email text NOT NULL,
  buyer_name text NOT NULL,
  buyer_whatsapp text NOT NULL,
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- 'pending' | 'paid' | 'failed' | 'expired'
  midtrans_transaction_id text,
  snap_token text,
  paid_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Tabel entitlements
CREATE TABLE public.entitlements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id), -- Boleh null jika identifikasi hanya by email
  buyer_email text NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  granted_at timestamp with time zone DEFAULT now(),
  UNIQUE(buyer_email, product_id)
);

-- Mengaktifkan Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

-- RLS untuk Products: Semua orang boleh membaca produk yang is_active = true
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.products FOR SELECT
  USING (is_active = true);

-- RLS untuk Orders:
-- Tidak ada akses langsung untuk public. Semua update dilakukan oleh service role key di backend.

-- RLS untuk Entitlements:
-- Hanya bisa diakses oleh authenticated users berdasarkan email mereka.
CREATE POLICY "Users can see their own entitlements"
  ON public.entitlements FOR SELECT
  TO authenticated
  USING (buyer_email = auth.email());

-- Membuat Storage Bucket untuk PDFs (Private)
INSERT INTO storage.buckets (id, name, public) VALUES ('ebooks', 'ebooks', false);

-- RLS untuk Storage Bucket 'ebooks':
-- Tidak ada select policy untuk anon/authenticated langsung.
-- File dibaca melalui Signed URLs yang digenerate dengan service_role key dari backend.
