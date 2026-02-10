import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DashboardFinanceiro from "./pages/DashboardFinanceiro";
import DashboardFiscal from "./pages/DashboardFiscal";
import DashboardAdministrativo from "./pages/DashboardAdministrativo";
import DashboardAnalitico from "./pages/DashboardAnalitico";
import DREGerencial from "./pages/DREGerencial";
import SimuladorCenarios from "./pages/SimuladorCenarios";
import MeusRegistros from "./pages/MeusRegistros";
import Cadastros from "./pages/Cadastros";
import Precificacao from "./pages/Precificacao";
import AssistenteIA from "./pages/AssistenteIA";
import Importacao from "./pages/Importacao";
import ConciliacaoBancaria from "./pages/ConciliacaoBancaria";
import DepartamentoPessoal from "./pages/DepartamentoPessoal";
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
          <Route path="/" element={<Home />} />
          <Route path="/financeiro" element={<DashboardFinanceiro />} />
          <Route path="/fiscal" element={<DashboardFiscal />} />
          <Route path="/administrativo" element={<DashboardAdministrativo />} />
          <Route path="/analitico" element={<DashboardAnalitico />} />
          <Route path="/dre" element={<DREGerencial />} />
          <Route path="/simulador" element={<SimuladorCenarios />} />
          <Route path="/registros" element={<MeusRegistros />} />
          <Route path="/cadastros" element={<Cadastros />} />
          <Route path="/precificacao" element={<Precificacao />} />
          <Route path="/assistente-ia" element={<AssistenteIA />} />
          <Route path="/importacao" element={<Importacao />} />
          <Route path="/conciliacao" element={<ConciliacaoBancaria />} />
          <Route path="/departamento-pessoal" element={<DepartamentoPessoal />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
