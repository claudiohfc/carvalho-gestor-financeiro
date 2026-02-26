

# Integração Completa com Lovable Cloud - Plano Faseado

## Pré-requisitos

Antes de iniciar, é necessário **habilitar o Lovable Cloud** nas configurações do projeto (aba Cloud). Sem isso, não é possível criar tabelas, autenticação ou edge functions.

## Nota sobre IDs

- `user_id` será **UUID** (obrigatório para referenciar `auth.users`)
- Demais PKs serão **bigint auto-incremental** conforme solicitado

## Fase 1 — Autenticação + Módulo Financeiro + Departamento Pessoal

### 1.1 Autenticação
- Criar páginas Login, Cadastro, Reset de Senha
- Configurar Supabase Auth com email/senha
- Sessão persistente via `onAuthStateChange`
- Rota protegida: redirecionar para `/login` se não autenticado
- Sidebar exibe nome do usuário logado

### 1.2 Tabelas (migrations)

```sql
-- transactions
CREATE TABLE transactions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('entrada','saida')) NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  subcategory text,
  amount numeric NOT NULL,
  cost_center text,
  client_or_supplier text,
  payment_method text,
  tags text[],
  recurring boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- people
CREATE TABLE people (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('socio','funcionario','colaborador','terceiro')) NOT NULL,
  name text NOT NULL,
  cpf text,
  email text,
  phone text,
  start_date date,
  end_date date,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- payroll_records
CREATE TABLE payroll_records (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  person_id bigint REFERENCES people(id) ON DELETE CASCADE NOT NULL,
  reference_month date NOT NULL,
  pro_labore numeric DEFAULT 0,
  salary numeric DEFAULT 0,
  commissions numeric DEFAULT 0,
  reimbursements numeric DEFAULT 0,
  vale_transporte numeric DEFAULT 0,
  vale_alimentacao numeric DEFAULT 0,
  benefits numeric DEFAULT 0,
  decimo_terceiro_1 numeric DEFAULT 0,
  decimo_terceiro_2 numeric DEFAULT 0,
  ferias numeric DEFAULT 0,
  fgts numeric DEFAULT 0,
  inss numeric DEFAULT 0,
  ir numeric DEFAULT 0,
  total_cost numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

### 1.3 RLS em todas as tabelas
```sql
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own data" ON transactions
  FOR ALL USING (user_id = auth.uid());
-- Repetir para people, payroll_records
```

### 1.4 Índices
```sql
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_people_user ON people(user_id);
CREATE INDEX idx_payroll_user ON payroll_records(user_id);
CREATE INDEX idx_payroll_person ON payroll_records(person_id);
```

### 1.5 Integração Frontend
- Criar `src/integrations/supabase/` com client e tipos
- Substituir mock data por queries Supabase em:
  - `MeusRegistros.tsx` — CRUD transactions
  - `DepartamentoPessoal.tsx` — CRUD people + payroll
  - `Home.tsx` — queries agregadas
  - `DashboardFinanceiro.tsx` — métricas calculadas
- Seed inicial: inserir dados mockados na primeira vez (ou manter fallback)

### 1.6 Edge Functions — Agregações Financeiras
- `financial-metrics`: total entradas, saídas, resultado líquido, total por categoria, média diária, maior gasto

---

## Fase 2 — Precificação + Simulador + Conciliação Bancária

### 2.1 Tabelas
```sql
-- products_services
CREATE TABLE products_services (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('produto','servico')) NOT NULL,
  code text, category text, name text NOT NULL,
  description text, unit_measure text,
  fixed_costs numeric DEFAULT 0, variable_costs numeric DEFAULT 0,
  preparation_time numeric DEFAULT 0, preparation_hour_value numeric DEFAULT 0,
  labor_percent numeric DEFAULT 0, labor_value numeric DEFAULT 0,
  profit_margin numeric DEFAULT 0, markup numeric DEFAULT 0,
  base_cost numeric DEFAULT 0, tax_type text, tax_value numeric DEFAULT 0,
  final_price numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- scenario_simulations
CREATE TABLE scenario_simulations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  description text,
  input_data jsonb, result_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- bank_accounts
CREATE TABLE bank_accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bank_name text NOT NULL,
  account_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- bank_statements
CREATE TABLE bank_statements (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bank_account_id bigint REFERENCES bank_accounts(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  description text, amount numeric NOT NULL,
  reconciled boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```

### 2.2 RLS + Índices (mesmo padrão)

### 2.3 Edge Functions
- `recalculate-pricing`: recalcula base_cost, markup, impostos, final_price
- `simulate-scenario`: lógica de simulação RH, preços
- `auto-reconcile`: reconciliação automática banco ↔ transactions

### 2.4 Frontend
- `Precificacao.tsx` → CRUD products_services
- `SimuladorCenarios.tsx` → salvar/carregar simulações
- `ConciliacaoBancaria.tsx` → CRUD bank_accounts/statements

---

## Fase 3 — Insights + Exportação/Importação

### 3.1 Edge Function `generate-insights`
- Analisa variação mensal de receita/despesa
- Detecta crescimento de folha
- Retorna textos simples de insight (lógica condicional)

### 3.2 Exportação/Importação
- Edge function `export-user-data`: exporta JSON completo do usuário
- Edge function `import-user-data`: valida e importa, vincula ao user_id
- `Importacao.tsx` → conectar ao backend real

### 3.3 Dashboard e Home
- Conectar todos os dashboards (Financeiro, Fiscal, Administrativo, Analítico, DRE) às queries reais
- Home → queries agregadas em tempo real

---

## Arquivos Novos (estimativa)
```
src/pages/Login.tsx
src/pages/Cadastro.tsx
src/pages/ResetPassword.tsx
src/integrations/supabase/client.ts
src/integrations/supabase/types.ts
src/hooks/useAuth.ts
src/hooks/useTransactions.ts
src/hooks/usePeople.ts
src/hooks/usePayroll.ts
src/hooks/usePricing.ts
src/hooks/useSimulations.ts
src/hooks/useBankReconciliation.ts
src/components/auth/ProtectedRoute.tsx
supabase/functions/financial-metrics/index.ts
supabase/functions/recalculate-pricing/index.ts
supabase/functions/simulate-scenario/index.ts
supabase/functions/auto-reconcile/index.ts
supabase/functions/generate-insights/index.ts
supabase/functions/export-user-data/index.ts
supabase/functions/import-user-data/index.ts
```

## Arquivos Modificados
```
src/App.tsx (rotas auth + ProtectedRoute)
src/components/layout/Sidebar.tsx (user dinâmico)
src/pages/MeusRegistros.tsx (Supabase CRUD)
src/pages/DepartamentoPessoal.tsx (Supabase CRUD)
src/pages/Precificacao.tsx (Supabase CRUD)
src/pages/SimuladorCenarios.tsx (salvar simulações)
src/pages/ConciliacaoBancaria.tsx (Supabase CRUD)
src/pages/Home.tsx (queries reais)
src/pages/DashboardFinanceiro.tsx (queries reais)
src/pages/Importacao.tsx (backend real)
```

## Restrição
- **Nenhuma alteração visual** — apenas substituição de data sources e adição de auth
- UI existente permanece 100% intacta

## Próximo Passo
**Habilite o Lovable Cloud** na aba Cloud das configurações do projeto. Depois aprove este plano para iniciar pela Fase 1.

