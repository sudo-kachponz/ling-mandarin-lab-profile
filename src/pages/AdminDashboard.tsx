import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RefreshCw, ExternalLink, MessageCircle, Search, ShieldCheck, Pencil, Trash2 } from 'lucide-react';
import { waPhone } from '@/lib/phone';
import PhoneField from '@/components/PhoneField';

type Order = {
  orderRef: string;
  buyerEmail: string;
  buyerName: string;
  buyerWhatsapp: string;
  amount: number;
  uniqueCode: number | null;
  status: string;
  paymentMethod: string | null;
  productTitle: string;
  proofUrl: string | null;
  createdAt: string;
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

function deliveryMessage(o: Order, accessUrl: string) {
  return (
    `Halo ${o.buyerName}!\n\n` +
    `Pembayaran Anda untuk ${o.productTitle} sudah kami verifikasi.\n\n` +
    `Ini link pribadi untuk membaca e-book Anda (langsung buka, tanpa login):\n${accessUrl}\n\n` +
    `Ketentuan Akses & Hak Cipta:\n` +
    `- Link ini aktif untuk maksimal 3 perangkat (mis. HP & laptop) - mohon tidak dibagikan.\n` +
    `- Masing-masing e-book dilengkapi watermark kode unik pembeli serta proteksi anti-screenshot / perekaman layar untuk melindungi hak cipta.\n\n` +
    `Kode pesanan: ${o.orderRef}\n\n` +
    `Selamat belajar & terima kasih banyak!`
  );
}

const STATUS_STYLE: Record<string, string> = {
  paid: 'bg-green-100 text-green-700 border-green-200',
  awaiting_verification: 'bg-amber-100 text-amber-700 border-amber-200',
  rejected: 'bg-red-100 text-red-600 border-red-200',
};
const STATUS_LABEL: Record<string, string> = {
  paid: 'Lunas',
  awaiting_verification: 'Menunggu verifikasi',
  rejected: 'Ditolak',
};

export default function AdminDashboard() {
  // Credentials are kept only in this tab's sessionStorage.
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [authed, setAuthed] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [today, setToday] = useState({ qris: 0, bca: 0, qrisCount: 0, bcaCount: 0 });
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState('');
  const [busyRef, setBusyRef] = useState<string | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editPhone, setEditPhone] = useState('');
  // Manual sale: buyer paid but proof upload failed — admin records name + WA +
  // nominal + method, we settle it and hand back the access link to send.
  const [genName, setGenName] = useState('');
  const [genPhone, setGenPhone] = useState('');
  const [genAmount, setGenAmount] = useState('');
  const [genMethod, setGenMethod] = useState<'qris' | 'bca'>('qris');
  const [genProof, setGenProof] = useState<File | null>(null);
  const [genLink, setGenLink] = useState<string | null>(null);
  const [genBusy, setGenBusy] = useState(false);

  async function approveManual() {
    const name = genName.trim();
    const phone = (genPhone || '').replace(/\D/g, '');
    const amount = parseInt(genAmount.replace(/\D/g, ''), 10);
    if (name.length < 2) return toast.error('Isi nama pembeli');
    if (phone.length < 9) return toast.error('Nomor WhatsApp tidak valid (angka saja, min. 9 digit)');
    if (!amount || amount <= 0) return toast.error('Isi nominal pembayaran');
    setGenBusy(true);
    try {
      const res = await fetch('/api/admin/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-user': user, 'x-admin-password': pass },
        body: JSON.stringify({ action: 'manual_create', buyerName: name, buyerWhatsapp: phone, amount, method: genMethod, hasProof: !!genProof }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses');
      // Optional proof — upload straight to storage via the signed URL if picked.
      if (genProof && data.uploadUrl) {
        const up = await fetch(data.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': genProof.type || 'application/octet-stream' },
          body: genProof,
        });
        if (!up.ok) toast.error(`Pesanan tercatat, tapi upload bukti gagal (${up.status}).`);
      }
      // Nominal & method stay OUT of the buyer message — only the access link.
      const msg =
        `Halo ${name}!\n\n` +
        `Pembayaran Anda sudah kami verifikasi. Berikut link pribadi untuk membaca e-book Anda (langsung buka, tanpa login):\n${data.accessUrl}\n\n` +
        `- Link aktif untuk maksimal 3 perangkat (mis. HP & laptop) — mohon tidak dibagikan.\n\n` +
        `Selamat belajar & terima kasih!`;
      const link = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      setGenLink(link);
      window.open(link, '_blank', 'noopener,noreferrer');
      await navigator.clipboard.writeText(data.accessUrl).catch(() => {});
      toast.success('Pesanan dicatat & WhatsApp terbuka dengan link akses — tinggal kirim.');
      setGenProof(null);
      await load(user, pass);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal');
    } finally {
      setGenBusy(false);
    }
  }

  const load = useCallback(
    async (u: string, p: string) => {
      setFetching(true);
      try {
        const res = await fetch('/api/admin/dashboard', {
          headers: { 'x-admin-user': u, 'x-admin-password': p },
        });
        // Server may return non-JSON on a crash (e.g. missing env) — read text
        // first so the real message shows instead of "Unexpected token".
        const raw = await res.text();
        let data: { error?: string; orders?: Order[]; today?: typeof today } = {};
        try {
          data = raw ? JSON.parse(raw) : {};
        } catch {
          throw new Error(raw.slice(0, 200) || `Server error (${res.status})`);
        }
        if (res.status === 401) {
          setAuthed(false);
          sessionStorage.removeItem('admin_dash');
          throw new Error(data.error || 'Login gagal');
        }
        if (!res.ok) throw new Error(data.error || 'Gagal memuat data');
        setOrders(data.orders || []);
        if (data.today) setToday(data.today);
        setAuthed(true);
        sessionStorage.setItem('admin_dash', JSON.stringify({ u, p }));
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Gagal');
      } finally {
        setFetching(false);
      }
    },
    []
  );

  async function act(o: Order, action: 'approve' | 'reject', note?: string) {
    setBusyRef(o.orderRef);
    try {
      const res = await fetch('/api/admin/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-user': user, 'x-admin-password': pass },
        body: JSON.stringify({ orderRef: o.orderRef, action, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memproses');

      if (action === 'approve' && data.accessUrl) {
        window.open(`https://wa.me/${waPhone(o.buyerWhatsapp)}?text=${encodeURIComponent(deliveryMessage(o, data.accessUrl))}`, '_blank', 'noopener,noreferrer');
        await navigator.clipboard.writeText(data.accessUrl).catch(() => {});
        toast.success('Disetujui. WhatsApp terbuka dengan link akses — tinggal kirim. Link juga tersalin.');
      } else {
        toast.success('Pesanan ditolak.');
      }
      await load(user, pass);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal');
    } finally {
      setBusyRef(null);
    }
  }

  async function savePhone(o: Order, phone: string) {
    setBusyRef(o.orderRef);
    try {
      const res = await fetch('/api/admin/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-user': user, 'x-admin-password': pass },
        body: JSON.stringify({ orderRef: o.orderRef, action: 'update_phone', phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      setEditingOrder(null);
      toast.success('Nomor WA diperbarui. Kirim ulang link ke nomor baru.');
      await load(user, pass);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal');
    } finally {
      setBusyRef(null);
    }
  }

  async function removeOrder(o: Order) {
    setBusyRef(o.orderRef);
    try {
      const res = await fetch('/api/admin/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-user': user, 'x-admin-password': pass },
        body: JSON.stringify({ orderRef: o.orderRef, action: 'delete' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus');
      toast.success('Pesanan dihapus dari database.');
      await load(user, pass);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Gagal');
    } finally {
      setBusyRef(null);
    }
  }

  // Restore a session if the tab was reloaded.
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_dash');
    if (saved) {
      const { u, p } = JSON.parse(saved);
      setUser(u);
      setPass(p);
      load(u, p);
    }
  }, [load]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(user, pass);
          }}
          className="bg-white p-8 rounded-2xl shadow-soft max-w-sm w-full space-y-4"
        >
          <h1 className="text-2xl font-bold text-[#6A2B2B] text-center">Dashboard Admin</h1>
          <Input placeholder="Username" value={user} onChange={(e) => setUser(e.target.value)} className="h-12 bg-sand/30" autoComplete="username" />
          <Input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} className="h-12 bg-sand/30" autoComplete="current-password" />
          <Button type="submit" disabled={fetching} className="w-full h-12 bg-[#6A2B2B] hover:bg-[#6A2B2B]/90">
            {fetching ? 'Memuat…' : 'Masuk'}
          </Button>
        </form>
      </div>
    );
  }

  const q = search.trim().toLowerCase();
  const filtered = q
    ? orders.filter(
        (o) =>
          o.buyerName.toLowerCase().includes(q) ||
          o.buyerEmail.toLowerCase().includes(q) ||
          o.buyerWhatsapp.includes(q.replace(/\D/g, '')) ||
          String(o.amount).includes(q.replace(/\D/g, '')) ||
          o.orderRef.toLowerCase().includes(q)
      )
    : orders;

  return (
    <div className="min-h-screen bg-sand py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#6A2B2B]">Rekap Pesanan</h1>
          <Button variant="outline" size="sm" onClick={() => load(user, pass)} disabled={fetching}>
            <RefreshCw className={`w-4 h-4 mr-2 ${fetching ? 'animate-spin' : ''}`} /> Muat Ulang
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl shadow-soft p-4">
            <p className="text-xs text-muted-foreground">QRIS masuk hari ini</p>
            <p className="text-2xl font-extrabold text-[#6A2B2B]">{formatPrice(today.qris)}</p>
            <p className="text-xs text-muted-foreground">{today.qrisCount} pesanan</p>
          </div>
          <div className="bg-white rounded-2xl shadow-soft p-4">
            <p className="text-xs text-muted-foreground">Transfer BCA hari ini</p>
            <p className="text-2xl font-extrabold text-[#6A2B2B]">{formatPrice(today.bca)}</p>
            <p className="text-xs text-muted-foreground">{today.bcaCount} pesanan</p>
          </div>
          <div className="bg-[#6A2B2B] rounded-2xl shadow-soft p-4 text-white">
            <p className="text-xs text-white/80">Total masuk hari ini</p>
            <p className="text-2xl font-extrabold">{formatPrice(today.qris + today.bca)}</p>
            <p className="text-xs text-white/80">{today.qrisCount + today.bcaCount} pesanan disetujui</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-5 mb-6">
          <h2 className="font-bold text-[#6A2B2B]">Catat Pesanan Manual &amp; Kirim Link</h2>
          <p className="text-xs text-muted-foreground mb-3">
            Untuk pembeli yang sudah bayar tapi gagal mengunggah bukti foto — isi data, klik Approve untuk mencatat ke database &amp; buat link akses, lalu kirim via WhatsApp.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input
              placeholder="Nama pembeli"
              value={genName}
              onChange={(e) => { setGenName(e.target.value); setGenLink(null); }}
              className="bg-sand/10"
            />
            <PhoneField
              placeholder="Nomor WhatsApp (mis. 0821 2213 8498)"
              value={genPhone}
              onChange={(v) => { setGenPhone(v); setGenLink(null); }}
              className="wa-phone-input flex h-10 items-center rounded-md border border-input bg-sand/10 px-3 text-sm focus-within:ring-2 focus-within:ring-ring"
            />
            <Input
              placeholder="Nominal (mis. 60831)"
              inputMode="numeric"
              value={genAmount}
              onChange={(e) => { setGenAmount(e.target.value.replace(/\D/g, '')); setGenLink(null); }}
              className="bg-sand/10"
            />
            <div className="flex items-center gap-5 h-10">
              {(['qris', 'bca'] as const).map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                  <Checkbox
                    checked={genMethod === m}
                    onCheckedChange={() => { setGenMethod(m); setGenLink(null); }}
                  />
                  {m === 'qris' ? 'QRIS' : 'Transfer BCA'}
                </label>
              ))}
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground">Bukti pembayaran (opsional)</label>
              <Input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setGenProof(e.target.files?.[0] ?? null)}
                className="bg-sand/10 cursor-pointer"
              />
            </div>
          </div>
          <div className="pt-3 flex flex-wrap gap-2">
            <Button onClick={approveManual} disabled={genBusy} className="bg-green-600 hover:bg-green-700 text-white">
              <ShieldCheck className="w-4 h-4 mr-1" /> {genBusy ? 'Memproses…' : 'Approve'}
            </Button>
            {genLink && (
              <>
                <a href={genLink} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <MessageCircle className="w-4 h-4 mr-1" /> Kirim ke WA
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => { navigator.clipboard.writeText(genLink).catch(() => {}); toast.success('Link tersalin'); }}
                >
                  Salin Link
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, no. WA, nominal, atau kode pesanan…"
            className="pl-9 bg-white"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-soft text-center text-muted-foreground">
            Belum ada pesanan.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((o) => (
              <div key={o.orderRef} className="bg-white rounded-2xl shadow-soft p-5 grid md:grid-cols-[140px_1fr] gap-5">
                <div>
                  {o.proofUrl ? (
                    <a href={o.proofUrl} target="_blank" rel="noopener noreferrer" className="block group">
                      <img
                        src={o.proofUrl}
                        alt="Bukti transfer"
                        className="w-full h-36 object-cover rounded-lg border group-hover:opacity-90"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <span className="text-xs text-primary flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" /> Perbesar / PDF
                      </span>
                    </a>
                  ) : (
                    <div className="w-full h-36 bg-muted rounded-lg border flex items-center justify-center text-xs text-muted-foreground text-center p-2">
                      Tanpa bukti
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-2xl font-extrabold text-[#6A2B2B] leading-none">{formatPrice(o.amount)}</span>
                    <span className={`text-xs font-semibold rounded-full px-2 py-0.5 border ${STATUS_STYLE[o.status] || 'bg-muted text-muted-foreground'}`}>
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{o.orderRef}</span>
                  <h3 className="font-bold text-foreground">{o.productTitle}</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>{o.buyerName} — {o.buyerEmail}</p>
                    <p>WA: {o.buyerWhatsapp} · {o.paymentMethod?.toUpperCase() || '—'}</p>
                    <p>{new Date(o.createdAt).toLocaleString('id-ID')}</p>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2">
                    {o.status === 'awaiting_verification' && (
                      <>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" disabled={busyRef === o.orderRef} className="bg-green-600 hover:bg-green-700 text-white">
                              <ShieldCheck className="w-4 h-4 mr-1" /> Setujui &amp; kirim link
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Setujui pembayaran {o.buyerName} ({formatPrice(o.amount)})?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Akses ke <strong>{o.productTitle}</strong> akan diberikan ke{' '}
                                <strong>{o.buyerEmail}</strong> dan link akses akan dikirim via WhatsApp. Tindakan ini <strong>tidak bisa dibatalkan</strong>.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => act(o, 'approve')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Ya, setujui
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyRef === o.orderRef}
                          onClick={() => {
                            setRejectingOrder(o);
                            setRejectionNote('');
                          }}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Tolak
                        </Button>
                      </>
                    )}
                    {o.status === 'paid' && (
                      <Button size="sm" disabled={busyRef === o.orderRef} onClick={() => act(o, 'approve')} className="bg-green-600 hover:bg-green-700 text-white">
                        <ShieldCheck className="w-4 h-4 mr-1" /> Kirim ulang link
                      </Button>
                    )}
                    <a href={`https://wa.me/${waPhone(o.buyerWhatsapp)}`} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-1" /> Chat WA
                      </Button>
                    </a>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyRef === o.orderRef}
                      onClick={() => { setEditingOrder(o); setEditPhone(o.buyerWhatsapp); }}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit WA
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" disabled={busyRef === o.orderRef} className="border-red-200 text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4 mr-1" /> Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus pesanan {o.buyerName} ({formatPrice(o.amount)})?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Pesanan <strong>{o.orderRef}</strong> akan dihapus permanen dari database beserta akses pembeli. Tindakan ini <strong>tidak bisa dibatalkan</strong>.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeOrder(o)} className="bg-red-600 hover:bg-red-700 text-white">
                            Ya, hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={editingOrder !== null} onOpenChange={(open) => { if (!open) setEditingOrder(null); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Nomor WhatsApp</DialogTitle>
            <DialogDescription>
              Perbaiki nomor WA untuk <strong>{editingOrder?.buyerName}</strong>, lalu kirim ulang link akses ke nomor yang benar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              placeholder="Format internasional, mis. 6281.. / 60.. / 886.."
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              inputMode="tel"
              className="w-full bg-sand/10"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Tulis dengan kode negara di depan (Indonesia 62, Malaysia 60, Taiwan 886), tanpa tanda +.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditingOrder(null)}>
              Batal
            </Button>
            <Button
              disabled={busyRef === editingOrder?.orderRef}
              onClick={() => { if (editingOrder) savePhone(editingOrder, waPhone(editPhone)); }}
              className="bg-[#6A2B2B] hover:bg-[#6A2B2B]/90 text-white"
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectingOrder !== null} onOpenChange={(open) => { if (!open) setRejectingOrder(null); }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tolak Pembayaran</DialogTitle>
            <DialogDescription>
              Berikan alasan penolakan pembayaran untuk <strong>{rejectingOrder?.buyerName}</strong>. Alasan ini bersifat opsional.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              placeholder="Alasan penolakan (opsional), mis. nominal tidak sesuai"
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              className="w-full bg-sand/10"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRejectingOrder(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!rejectingOrder) return;
                const order = rejectingOrder;
                setRejectingOrder(null);
                await act(order, 'reject', rejectionNote || undefined);
              }}
            >
              Ya, Tolak Pesanan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
