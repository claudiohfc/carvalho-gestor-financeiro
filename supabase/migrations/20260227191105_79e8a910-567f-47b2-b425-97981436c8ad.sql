-- Create transactions table
CREATE TABLE public.transactions (
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

-- Create people table
CREATE TABLE public.people (
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

-- Create payroll_records table
CREATE TABLE public.payroll_records (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  person_id bigint REFERENCES public.people(id) ON DELETE CASCADE NOT NULL,
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

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies - transactions
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON public.transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON public.transactions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies - people
CREATE POLICY "Users can view own people" ON public.people FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own people" ON public.people FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own people" ON public.people FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own people" ON public.people FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies - payroll_records
CREATE POLICY "Users can view own payroll" ON public.payroll_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payroll" ON public.payroll_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payroll" ON public.payroll_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own payroll" ON public.payroll_records FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_transactions_date ON public.transactions(date);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_category ON public.transactions(category);
CREATE INDEX idx_people_user ON public.people(user_id);
CREATE INDEX idx_people_type ON public.people(type);
CREATE INDEX idx_payroll_user ON public.payroll_records(user_id);
CREATE INDEX idx_payroll_person ON public.payroll_records(person_id);
CREATE INDEX idx_payroll_month ON public.payroll_records(reference_month);