import { whatsappUrl } from "@/data/stats";
import whatsappIcon from "@/assets/Medsos/wa.svg";
import igIcon from "@/assets/Medsos/ig.svg";
import tiktokIcon from "@/assets/Medsos/tiktok.svg";
import { Link } from "react-router-dom";

import logo from "@/assets/LOGO.svg";

const linkClass = "text-sm text-muted-foreground transition-colors hover:text-maroon";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-border bg-paper">
      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1.2fr_1.2fr]">
          <div className="space-y-4">
            <img src={logo} alt="Ling Chinese Lab" className="h-auto w-44" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Membawa bahasa Mandarin jadi dekat dan menyenangkan untuk semua.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold">Produk</h3>
            <ul className="space-y-2.5">
              <li><Link to="/store" className={linkClass}>E-Book</Link></li>
              <li><Link to="/faq" className={linkClass}>FAQ</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold">Kebijakan & Syarat</h3>
            <ul className="space-y-2.5">
              <li><Link to="/terms" className={linkClass}>Syarat & Ketentuan Layanan</Link></li>
              <li><Link to="/refund-policy" className={linkClass}>Kebijakan Pengembalian (Refund)</Link></li>
              <li><a href="/#terms-and-policies" className={linkClass}>Keamanan Pembayaran & Privasi</a></li>
            </ul>
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="text-sm font-bold">Hubungi Kami</h3>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-maroon py-2.5 pl-3 pr-5 text-sm font-semibold text-white transition-colors hover:bg-maroon-deep"
              >
                <img src={whatsappIcon} alt="" className="size-6" />
                Whatsapp
              </a>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-bold">Follow Kami</h3>
              <div className="flex flex-wrap gap-2">
                <a href="https://www.instagram.com/lingchineselab?igsh=MXNmMnBscmR6aHFlaw==" target="_blank" rel="noopener noreferrer" className="chip">
                  <img src={igIcon} alt="Instagram" className="h-4 w-4" />
                  <span>@lingchineselab</span>
                </a>
                <a href="https://www.tiktok.com/@lingchineselab?_r=1&_t=ZS-93rcJMWKTLg" target="_blank" rel="noopener noreferrer" className="chip">
                  <img src={tiktokIcon} alt="TikTok" className="h-4 w-4" />
                  <span>@lingchineselab</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            © {new Date().getFullYear()} Ling Chinese Lab – All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link to="/terms" className="hover:text-maroon">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-maroon">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
