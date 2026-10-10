import React, { useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

interface OrderStatus {
  status: string;
  paymentMethod: string | null;
  expiresAt: string | null;
  finalAmount: number | null;
}

const FIVE_MINUTES = 5 * 60 * 1000;

export default function PaymentPending() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderRef = searchParams.get('orderRef');
  const startRef = useRef(Date.now());

  const { data, isLoading } = useQuery<OrderStatus>({
    queryKey: ['order-status', orderRef],
    enabled: !!orderRef,
    queryFn: async () => {
      const res = await fetch(`/api/order-status?orderRef=${orderRef}`);
      if (!res.ok) throw new Error('Gagal memeriksa status');
      return res.json();
    },
    // Poll every 3s for the first 5 minutes, then 15s; stop once final.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'paid' || status === 'failed' || status === 'expired') {
        return false;
      }
      return Date.now() - startRef.current < FIVE_MINUTES ? 3000 : 15000;
    },
  });

  if (!orderRef) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-ink">
        <p>Referensi Order tidak ditemukan.</p>
        <Button className="mt-4 rounded-full bg-maroon text-white hover:bg-maroon-deep" onClick={() => navigate('/store')}>
          Kembali ke Store
        </Button>
      </div>
    );
  }

  const status = data?.status ?? 'pending';

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div aria-hidden className="paper-dots absolute inset-0 -z-10" />
      <div className="panel w-full max-w-md p-8 text-center md:p-12">
        {(isLoading || status === 'pending') && (
          <div className="flex flex-col items-center">
            <div className="mizige w-20 h-20 rounded-2xl border border-hsk/25 flex items-center justify-center mb-6">
              <Loader2 className="relative w-9 h-9 text-maroon animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Menunggu Pembayaran</h2>
            <p className="text-muted-foreground mb-8">
              Selesaikan pembayaran Anda di halaman iPaymu. Begitu berhasil, akses e-book
              terbuka otomatis di halaman ini.
            </p>
            <div className="flex items-center gap-2 rounded-full bg-gold/20 px-4 py-2 text-sm text-maroon">
              <Clock className="w-4 h-4" />
              <span>Memeriksa status secara otomatis...</span>
            </div>
          </div>
        )}

        {status === 'paid' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-maroon/[0.07] rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-maroon" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Pembayaran Berhasil!</h2>
            <p className="text-muted-foreground mb-8">
              Terima kasih. Akses E-Book Anda telah ditambahkan ke Library.
            </p>
            <Button
              className="h-12 w-full rounded-full bg-maroon font-bold text-white hover:bg-maroon-deep"
              onClick={() => navigate('/library')}
            >
              Buka E-Book Saya
            </Button>
          </div>
        )}

        {(status === 'failed' || status === 'expired') && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-hsk-soft rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-10 h-10 text-hsk" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Pembayaran Gagal / Kedaluwarsa</h2>
            <p className="text-muted-foreground mb-8">
              Waktu pembayaran telah habis atau pembayaran dibatalkan.
            </p>
            <Button
              variant="outline"
              className="h-12 w-full rounded-full border-maroon/30 font-bold text-maroon hover:bg-maroon/5 hover:text-maroon"
              onClick={() => navigate('/store')}
            >
              Coba Lagi
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
