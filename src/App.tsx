import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tentang from "./pages/Tentang";
import NotFound from "./pages/NotFound";
import Read from "./pages/Read";
import Store from "./pages/Store";
import PaymentPending from "./pages/PaymentPending";
import Library from "./pages/Library";
import { AuthProvider } from "./hooks/useAuth";

import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import AdminVerify from "./pages/AdminVerify";
import AdminDashboard from "./pages/AdminDashboard";
import Faq from "./pages/Faq";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tentang" element={<Tentang />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/read/:slug" element={<Read />} />
            <Route path="/store" element={<Store />} />
            <Route path="/payment/pending" element={<PaymentPending />} />
            <Route path="/library" element={<Library />} />
            <Route path="/admin/verify" element={<AdminVerify />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/legal" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
