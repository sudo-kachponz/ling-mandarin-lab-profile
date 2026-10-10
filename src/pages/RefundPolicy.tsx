import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalPoliciesSection from "@/components/home/LegalPoliciesSection";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background w-full flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 pt-8 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-maroon">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium">Kebijakan Pengembalian Dana (Refund)</span>
          </nav>
        </div>
        <LegalPoliciesSection />
      </main>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
