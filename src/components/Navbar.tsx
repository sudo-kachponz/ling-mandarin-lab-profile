import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logoPandaOnly from "@/assets/logoPandaOnly.png";

const navItems = [
  { name: "Beranda", path: "/" },
  { name: "Tentang", path: "/tentang" },
  { name: "E-Book", path: "/store" },
  { name: "FAQ", path: "/faq" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsOpen(false), [location.pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || isOpen
          ? "border-border/80 bg-[hsl(var(--paper)/0.92)] backdrop-blur-md"
          : "border-transparent bg-[hsl(var(--paper)/0.6)] backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-[4.5rem]">
          <Link to="/" className="flex items-center gap-3 rounded-lg" aria-label="Ling Chinese Lab — Beranda">
            <img src={logoPandaOnly} alt="Ling Chinese Lab" className="h-10 w-auto md:h-11" />
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`rounded-full px-5 py-2 text-[0.95rem] font-semibold transition-colors ${
                  isActive(item.path)
                    ? "bg-maroon text-white shadow-sm"
                    : "text-foreground/80 hover:bg-secondary hover:text-ink"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full border border-border bg-card p-2.5 text-ink transition-colors hover:bg-secondary md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-border/70 pb-5 pt-3 md:hidden">
            <div className="grid gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={`rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                    isActive(item.path) ? "bg-maroon text-white" : "text-ink hover:bg-secondary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
