
-- Drop old tables
DROP TABLE IF EXISTS public.payroll_records CASCADE;
DROP TABLE IF EXISTS public.bank_statements CASCADE;
DROP TABLE IF EXISTS public.bank_accounts CASCADE;
DROP TABLE IF EXISTS public.people CASCADE;
DROP TABLE IF EXISTS public.products_services CASCADE;
DROP TABLE IF EXISTS public.scenario_simulations CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1. lancamentos
CREATE TABLE public.lancamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada','saida')),
  data DATE NOT NULL,
  data_vencimento DATE,
  descricao TEXT NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  subcategoria VARCHAR(100),
  valor NUMERIC(15,2) NOT NULL,
  centro_custo VARCHAR(100),
  cliente_fornecedor VARCHAR(200),
  forma_pagamento VARCHAR(50),
  num_documento VARCHAR(50),
  observacoes TEXT,
  origem VARCHAR(30) DEFAULT 'manual' CHECK (origem IN ('manual','importacao','extrato')),
  conciliado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lancamentos TO authenticated;
GRANT ALL ON public.lancamentos TO service_role;
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lancamentos_select_own" ON public.lancamentos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "lancamentos_insert_own" ON public.lancamentos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lancamentos_update_own" ON public.lancamentos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lancamentos_delete_own" ON public.lancamentos FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_lancamentos_updated_at BEFORE UPDATE ON public.lancamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. cadastros
CREATE TABLE public.cadastros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome VARCHAR(200) NOT NULL,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('cliente','fornecedor')),
  categoria VARCHAR(100),
  status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo','inativo')),
  email VARCHAR(200),
  telefone VARCHAR(30),
  cpf_cnpj VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cadastros TO authenticated;
GRANT ALL ON public.cadastros TO service_role;
ALTER TABLE public.cadastros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cadastros_select_own" ON public.cadastros FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "cadastros_insert_own" ON public.cadastros FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cadastros_update_own" ON public.cadastros FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "cadastros_delete_own" ON public.cadastros FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. extratos
CREATE TABLE public.extratos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  banco VARCHAR(100),
  nome_conta VARCHAR(100),
  data_importacao TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_registros INTEGER DEFAULT 0,
  total_conciliados INTEGER DEFAULT 0,
  arquivo_nome VARCHAR(200),
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente','processado','erro'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.extratos TO authenticated;
GRANT ALL ON public.extratos TO service_role;
ALTER TABLE public.extratos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "extratos_select_own" ON public.extratos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "extratos_insert_own" ON public.extratos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "extratos_update_own" ON public.extratos FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "extratos_delete_own" ON public.extratos FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 4. extrato_linhas
CREATE TABLE public.extrato_linhas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  extrato_id UUID REFERENCES public.extratos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  data DATE NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC(15,2) NOT NULL,
  tipo VARCHAR(10) CHECK (tipo IN ('credito','debito')),
  categoria_sugerida VARCHAR(100),
  subcategoria_sugerida VARCHAR(100),
  cliente_fornecedor_sugerido VARCHAR(200),
  confianca_classificacao INTEGER DEFAULT 0,
  conciliado BOOLEAN DEFAULT false,
  lancamento_id UUID REFERENCES public.lancamentos(id) ON DELETE SET NULL,
  divergencia_motivo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.extrato_linhas TO authenticated;
GRANT ALL ON public.extrato_linhas TO service_role;
ALTER TABLE public.extrato_linhas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "extrato_linhas_select_own" ON public.extrato_linhas FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "extrato_linhas_insert_own" ON public.extrato_linhas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "extrato_linhas_update_own" ON public.extrato_linhas FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "extrato_linhas_delete_own" ON public.extrato_linhas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 5. regras_classificacao
CREATE TABLE public.regras_classificacao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  palavra_chave VARCHAR(200) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  subcategoria VARCHAR(100),
  cliente_fornecedor VARCHAR(200),
  tipo VARCHAR(10) CHECK (tipo IN ('entrada','saida','ambos')),
  prioridade INTEGER DEFAULT 1,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.regras_classificacao TO authenticated;
GRANT ALL ON public.regras_classificacao TO service_role;
ALTER TABLE public.regras_classificacao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "regras_select_own" ON public.regras_classificacao FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "regras_insert_own" ON public.regras_classificacao FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "regras_update_own" ON public.regras_classificacao FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "regras_delete_own" ON public.regras_classificacao FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 6. simulacoes
CREATE TABLE public.simulacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  descricao TEXT,
  input_data JSONB,
  result_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.simulacoes TO authenticated;
GRANT ALL ON public.simulacoes TO service_role;
ALTER TABLE public.simulacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "simulacoes_select_own" ON public.simulacoes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "simulacoes_insert_own" ON public.simulacoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "simulacoes_update_own" ON public.simulacoes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "simulacoes_delete_own" ON public.simulacoes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 7. conciliacoes
CREATE TABLE public.conciliacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  banco VARCHAR(100),
  nome_conta VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conciliacoes TO authenticated;
GRANT ALL ON public.conciliacoes TO service_role;
ALTER TABLE public.conciliacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conciliacoes_select_own" ON public.conciliacoes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "conciliacoes_insert_own" ON public.conciliacoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "conciliacoes_update_own" ON public.conciliacoes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "conciliacoes_delete_own" ON public.conciliacoes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Indices
CREATE INDEX idx_lancamentos_user_data ON public.lancamentos(user_id, data);
CREATE INDEX idx_lancamentos_categoria ON public.lancamentos(user_id, categoria);
CREATE INDEX idx_extrato_linhas_extrato ON public.extrato_linhas(extrato_id);
CREATE INDEX idx_regras_user ON public.regras_classificacao(user_id, ativo);
