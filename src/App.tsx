import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardFinanceiro from "./pages/DashboardFinanceiro";
import DashboardFiscal from "./pages/DashboardFiscal";
import MeusRegistros from "./pages/MeusRegistros";
import Lancamentos from "./pages/Lancamentos";
import Cadastros from "./pages/Cadastros";
import Importacao from "./pages/Importacao";
import ConciliacaoBancaria from "./pages/ConciliacaoBancaria";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardFinanceiro />} />
          <Route path="/fiscal" element={<DashboardFiscal />} />
          <Route path="/registros" element={<MeusRegistros />} />
          <Route path="/lancamentos" element={<Lancamentos />} />
          <Route path="/cadastros" element={<Cadastros />} />
          <Route path="/importacao" element={<Importacao />} />
          <Route path="/conciliacao" element={<ConciliacaoBancaria />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
