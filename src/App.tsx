import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import CadastroPage from "./pages/Cadastro";
import EsqueciSenha from "./pages/EsqueciSenha";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import DashboardFinanceiro from "./pages/DashboardFinanceiro";
import DashboardFiscal from "./pages/DashboardFiscal";
import DashboardAdministrativo from "./pages/DashboardAdministrativo";
import DashboardAnalitico from "./pages/DashboardAnalitico";
import DREGerencial from "./pages/DREGerencial";
import SimuladorCenarios from "./pages/SimuladorCenarios";
import MeusRegistros from "./pages/MeusRegistros";
import Lancamentos from "./pages/Lancamentos";
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
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/financeiro" element={<ProtectedRoute><DashboardFinanceiro /></ProtectedRoute>} />
          <Route path="/fiscal" element={<ProtectedRoute><DashboardFiscal /></ProtectedRoute>} />
          <Route path="/administrativo" element={<ProtectedRoute><DashboardAdministrativo /></ProtectedRoute>} />
          <Route path="/analitico" element={<ProtectedRoute><DashboardAnalitico /></ProtectedRoute>} />
          <Route path="/dre" element={<ProtectedRoute><DREGerencial /></ProtectedRoute>} />
          <Route path="/simulador" element={<ProtectedRoute><SimuladorCenarios /></ProtectedRoute>} />
          <Route path="/registros" element={<ProtectedRoute><MeusRegistros /></ProtectedRoute>} />
          <Route path="/lancamentos" element={<ProtectedRoute><Lancamentos /></ProtectedRoute>} />
          <Route path="/cadastros" element={<ProtectedRoute><Cadastros /></ProtectedRoute>} />
          <Route path="/precificacao" element={<ProtectedRoute><Precificacao /></ProtectedRoute>} />
          <Route path="/assistente-ia" element={<ProtectedRoute><AssistenteIA /></ProtectedRoute>} />
          <Route path="/importacao" element={<ProtectedRoute><Importacao /></ProtectedRoute>} />
          <Route path="/conciliacao" element={<ProtectedRoute><ConciliacaoBancaria /></ProtectedRoute>} />
          <Route path="/departamento-pessoal" element={<ProtectedRoute><DepartamentoPessoal /></ProtectedRoute>} />
          <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
