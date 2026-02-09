// Mock data for Departamento Pessoal

export interface Partner {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  startDate: string;
  endDate?: string;
  prolabore: number;
  comissoes: number;
  reembolsos: number;
}

export interface Employee {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  startDate: string;
  endDate?: string;
  salario: number;
  vt: number;
  va: number;
  beneficios: number;
  decimo1: number;
  decimo2: number;
  ferias: number;
  fgts: number;
  inss: number;
  ir: number;
}

export interface Contractor {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  startDate: string;
  endDate?: string;
  retiradas: number;
  comissoes: number;
}

export const partners: Partner[] = [
  {
    id: 'p-1',
    name: 'Carlos Carvalho',
    cpf: '123.456.789-00',
    email: 'carlos@carvalho.com',
    phone: '(11) 99999-0001',
    startDate: '2018-01-15',
    prolabore: 15000,
    comissoes: 3200,
    reembolsos: 850,
  },
  {
    id: 'p-2',
    name: 'Maria Carvalho',
    cpf: '234.567.890-11',
    email: 'maria@carvalho.com',
    phone: '(11) 99999-0002',
    startDate: '2018-01-15',
    prolabore: 10000,
    comissoes: 2100,
    reembolsos: 420,
  },
  {
    id: 'p-3',
    name: 'Roberto Mendes',
    cpf: '345.678.901-22',
    email: 'roberto@carvalho.com',
    phone: '(11) 99999-0003',
    startDate: '2020-06-01',
    prolabore: 8000,
    comissoes: 1800,
    reembolsos: 300,
  },
];

export const employees: Employee[] = [
  {
    id: 'e-1',
    name: 'Ana Silva',
    cpf: '456.789.012-33',
    email: 'ana@carvalho.com',
    phone: '(11) 98888-0001',
    startDate: '2019-03-10',
    salario: 8500,
    vt: 450,
    va: 600,
    beneficios: 350,
    decimo1: 4250,
    decimo2: 4250,
    ferias: 2833,
    fgts: 680,
    inss: 935,
    ir: 1275,
  },
  {
    id: 'e-2',
    name: 'Pedro Santos',
    cpf: '567.890.123-44',
    email: 'pedro@carvalho.com',
    phone: '(11) 98888-0002',
    startDate: '2020-01-20',
    salario: 6500,
    vt: 450,
    va: 600,
    beneficios: 350,
    decimo1: 3250,
    decimo2: 3250,
    ferias: 2167,
    fgts: 520,
    inss: 715,
    ir: 780,
  },
  {
    id: 'e-3',
    name: 'Maria Oliveira',
    cpf: '678.901.234-55',
    email: 'moliveira@carvalho.com',
    phone: '(11) 98888-0003',
    startDate: '2020-07-15',
    salario: 6500,
    vt: 450,
    va: 600,
    beneficios: 350,
    decimo1: 3250,
    decimo2: 3250,
    ferias: 2167,
    fgts: 520,
    inss: 715,
    ir: 780,
  },
  {
    id: 'e-4',
    name: 'João Costa',
    cpf: '789.012.345-66',
    email: 'joao@carvalho.com',
    phone: '(11) 98888-0004',
    startDate: '2021-05-03',
    salario: 4500,
    vt: 380,
    va: 500,
    beneficios: 250,
    decimo1: 2250,
    decimo2: 2250,
    ferias: 1500,
    fgts: 360,
    inss: 495,
    ir: 320,
  },
  {
    id: 'e-5',
    name: 'Lucia Ferreira',
    cpf: '890.123.456-77',
    email: 'lucia@carvalho.com',
    phone: '(11) 98888-0005',
    startDate: '2022-02-14',
    salario: 3800,
    vt: 380,
    va: 500,
    beneficios: 250,
    decimo1: 1900,
    decimo2: 1900,
    ferias: 1267,
    fgts: 304,
    inss: 418,
    ir: 180,
  },
];

export const contractors: Contractor[] = [
  {
    id: 'c-1',
    name: 'Fernando Lima',
    cpf: '901.234.567-88',
    email: 'fernando@email.com',
    phone: '(11) 97777-0001',
    startDate: '2023-01-10',
    retiradas: 5500,
    comissoes: 2200,
  },
  {
    id: 'c-2',
    name: 'Camila Rocha',
    cpf: '012.345.678-99',
    email: 'camila@email.com',
    phone: '(11) 97777-0002',
    startDate: '2023-06-15',
    retiradas: 4800,
    comissoes: 1900,
  },
  {
    id: 'c-3',
    name: 'Ricardo Alves',
    cpf: '112.233.445-00',
    email: 'ricardo@email.com',
    phone: '(11) 97777-0003',
    startDate: '2024-01-08',
    retiradas: 3500,
    comissoes: 1500,
  },
];

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const getTotalPartnerCosts = (): number => {
  return partners.reduce((sum, p) => sum + p.prolabore + p.comissoes + p.reembolsos, 0);
};

export const getTotalEmployeeCosts = (): number => {
  return employees.reduce(
    (sum, e) => sum + e.salario + e.vt + e.va + e.beneficios + e.fgts + e.inss + e.ir,
    0
  );
};

export const getTotalContractorCosts = (): number => {
  return contractors.reduce((sum, c) => sum + c.retiradas + c.comissoes, 0);
};

export const getPartnerTotal = (p: Partner): number => p.prolabore + p.comissoes + p.reembolsos;

export const getEmployeeTotal = (e: Employee): number =>
  e.salario + e.vt + e.va + e.beneficios + e.fgts + e.inss + e.ir;

export const getContractorTotal = (c: Contractor): number => c.retiradas + c.comissoes;
