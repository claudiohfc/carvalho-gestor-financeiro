
-- products_services table
CREATE TABLE public.products_services (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('produto','servico')) NOT NULL,
  code text,
  category text,
  name text NOT NULL,
  description text,
  unit_measure text,
  fixed_costs numeric DEFAULT 0,
  variable_costs numeric DEFAULT 0,
  preparation_time numeric DEFAULT 0,
  preparation_hour_value numeric DEFAULT 0,
  labor_percent numeric DEFAULT 0,
  labor_value numeric DEFAULT 0,
  profit_margin numeric DEFAULT 0,
  markup numeric DEFAULT 0,
  base_cost numeric DEFAULT 0,
  tax_type text,
  tax_value numeric DEFAULT 0,
  final_price numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.products_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own products_services" ON public.products_services FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own products_services" ON public.products_services FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own products_services" ON public.products_services FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own products_services" ON public.products_services FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_products_services_user ON public.products_services(user_id);

-- scenario_simulations table
CREATE TABLE public.scenario_simulations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  description text,
  input_data jsonb,
  result_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.scenario_simulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own simulations" ON public.scenario_simulations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own simulations" ON public.scenario_simulations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own simulations" ON public.scenario_simulations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own simulations" ON public.scenario_simulations FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_simulations_user ON public.scenario_simulations(user_id);

-- bank_accounts table
CREATE TABLE public.bank_accounts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bank_name text NOT NULL,
  account_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bank_accounts" ON public.bank_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bank_accounts" ON public.bank_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bank_accounts" ON public.bank_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bank_accounts" ON public.bank_accounts FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_bank_accounts_user ON public.bank_accounts(user_id);

-- bank_statements table
CREATE TABLE public.bank_statements (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bank_account_id bigint REFERENCES public.bank_accounts(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  description text,
  amount numeric NOT NULL,
  type text CHECK (type IN ('credito','debito')) DEFAULT 'debito',
  reconciled boolean DEFAULT false,
  matched_transaction_id bigint,
  divergence_reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.bank_statements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bank_statements" ON public.bank_statements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bank_statements" ON public.bank_statements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bank_statements" ON public.bank_statements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bank_statements" ON public.bank_statements FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_bank_statements_user ON public.bank_statements(user_id);
CREATE INDEX idx_bank_statements_account ON public.bank_statements(bank_account_id);
CREATE INDEX idx_bank_statements_date ON public.bank_statements(date);
