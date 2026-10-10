import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import logoPandaOnly from '@/assets/logoPandaOnly.png';

type LibraryItem = {
  id: string;
  slug: string;
  title: string;
  cover_url: string;
  granted_at: string;
};

export default function Library() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithOtpEmail, verifyOtp, signOut } = useAuth();
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // OTP Login States
  const [emailInput, setEmailInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      toast.error('Masukkan email yang valid');
      return;
    }
    setIsAuthProcessing(true);
    const { error } = await signInWithOtpEmail(emailInput);
    setIsAuthProcessing(false);
    
    if (error) {
      toast.error('Gagal mengirim OTP: ' + error.message);
    } else {
      setIsOtpSent(true);
      toast.success('Kode OTP 6 digit telah dikirim ke email Anda!');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput.length !== 6) {
      toast.error('Kode OTP harus 6 digit angka');
      return;
    }
    setIsAuthProcessing(true);
    const { error } = await verifyOtp(emailInput, otpInput);
    setIsAuthProcessing(false);
    
    if (error) {
      toast.error('Kode OTP salah atau kadaluarsa');
    } else {
      toast.success('Berhasil masuk!');
    }
  };

  useEffect(() => {
    async function fetchLibrary() {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('entitlements')
          .select(`
            granted_at,
            product:products (
              id,
              slug,
              title,
              cover_url
            )
          `)
          .eq('buyer_email', user.email);

        if (error) {
          console.error("Error fetching library", error);
        }

        if (data && data.length > 0) {
          const formattedItems = data.map((item) => ({
            id: item.product.id,
            slug: item.product.slug,
            title: item.product.title,
            cover_url: item.product.cover_url,
            granted_at: item.granted_at
          }));
          setItems(formattedItems);
        } else {
          // Jika kosong, kita tetap tampilkan mock file Lingchinenese.pdf untuk demo di lokal
          // Memasukkan email asli user agar demo bekerja
          if (user.email === 'firaniaputri23@gmail.com' || user.email === 'firania@gmail.com' || user.email === 'firaniaputriharsanti23@gmail.com') {
             setItems([{
              id: 'mock-1',
              slug: 'test', 
              title: 'E-Book Ling Chinese Lab Volume I - Demo',
              cover_url: '/coverling.png',
              granted_at: new Date().toISOString()
            }]);
          } else {
            setItems([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLibrary();
  }, [user]);

  if (authLoading || (loading && user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background font-medium text-muted-foreground">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-maroon border-t-transparent" />
        Memuat Library...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
       <Navbar />
       <div className="relative flex flex-col items-center justify-center px-4 py-16">
         <div aria-hidden className="paper-dots absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
         <div className="panel w-full max-w-md p-8 text-center sm:p-10">
            <div className="mizige mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-hsk/25">
              <BookOpen className="relative h-7 w-7 text-maroon" />
            </div>
            <h2 className="mb-3 text-2xl font-bold">Masuk ke Library</h2>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              Masuk menggunakan email yang Anda gunakan saat membeli E-Book untuk mengakses koleksi rahasia Anda.
            </p>
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4 w-full">
                <Input 
                  type="email" 
                  placeholder="Masukkan email Anda" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  disabled={isAuthProcessing}
                  required
                  className="h-14 rounded-xl border-input bg-paper focus-visible:ring-maroon/30"
                />
                <Button type="submit" disabled={isAuthProcessing} className="h-14 w-full rounded-full bg-maroon text-base font-bold text-white shadow-soft hover:bg-maroon-deep">
                  {isAuthProcessing ? 'Mengirim...' : 'Kirim Kode OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 w-full">
                <div className="text-sm font-medium text-foreground text-left mb-2 px-1">
                  Kode 6 digit telah dikirim ke <span className="font-bold text-maroon">{emailInput}</span>
                </div>
                <Input 
                  type="text" 
                  placeholder="0 0 0 0 0 0" 
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={isAuthProcessing}
                  required
                  className="h-14 rounded-xl border-input bg-paper text-center font-mono text-2xl font-bold tracking-[0.5em] focus-visible:ring-maroon/30"
                  maxLength={6}
                />
                <Button type="submit" disabled={isAuthProcessing} className="h-14 w-full rounded-full bg-maroon text-base font-bold text-white shadow-soft hover:bg-maroon-deep">
                  {isAuthProcessing ? 'Memverifikasi...' : 'Verifikasi & Masuk'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsOtpSent(false)} className="w-full text-xs text-muted-foreground mt-2">
                  Ganti Alamat Email
                </Button>
              </form>
            )}
            <div className="mt-6 pt-6 border-t border-dashed">
               <p className="text-xs text-muted-foreground">Belum pernah berbelanja?</p>
               <Button variant="link" onClick={() => navigate('/store')} className="mt-1 text-maroon">Jelajahi Store</Button>
            </div>
         </div>
       </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative border-b border-border/70 px-4 py-10 md:px-8">
        <div aria-hidden className="paper-dots absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={logoPandaOnly} alt="" className="hidden h-14 w-auto sm:block" />
            <div>
            <h1 className="font-display text-3xl font-bold text-maroon">Library Anda</h1>
            <p className="text-muted-foreground mt-1.5">Selamat datang, <span className="font-semibold text-ink">{user.email}</span></p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="w-fit rounded-full border-border bg-card text-muted-foreground hover:border-hsk/40 hover:bg-hsk-soft hover:text-hsk">
            <LogOut className="w-4 h-4 mr-2" /> Keluar
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4 md:px-8">
        {items.length === 0 ? (
          <div className="panel mx-auto max-w-2xl p-10 text-center sm:p-12">
            <div className="mizige w-20 h-20 rounded-2xl border border-hsk/25 flex items-center justify-center mx-auto mb-6">
               <BookOpen className="relative w-9 h-9 text-maroon/60" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Koleksi Masih Kosong</h3>
            <p className="text-muted-foreground mb-8 text-lg">Anda belum memiliki E-Book di akun ini. Kunjungi Store untuk melihat koleksi materi terbaik kami.</p>
            <Button onClick={() => navigate('/store')} size="lg" className="h-12 rounded-full bg-maroon px-8 font-bold text-white hover:bg-maroon-deep">Jelajahi Store</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div key={item.id} className="panel flex flex-col p-5 transition-shadow hover:shadow-lift">
                <div className="relative mb-5 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl bg-secondary ring-1 ring-border">
                  <img 
                    src={item.cover_url || '/coverling.png'} 
                    alt={item.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <h3 className="mb-3 line-clamp-2 flex-1 text-lg font-bold leading-snug">{item.title}</h3>
                
                <p className="mb-5 w-fit rounded-md bg-paper px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  Diperoleh: {new Date(item.granted_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                
                <Button 
                  className="h-12 w-full rounded-full bg-maroon text-base font-bold text-white hover:bg-maroon-deep"
                  onClick={() => navigate(`/read/${item.slug}`)}
                >
                  Baca Sekarang
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
