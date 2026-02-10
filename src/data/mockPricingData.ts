export interface PricingItem {
  id: string;
  type: 'produto' | 'servico';
  code: string;
  category: string;
  name: string;
  description: string;
  unit: string;
  fixedCosts: number;
  variableCosts: number;
  prepTime: number; // hours
  hourRate: number;
  laborPercent: number;
  laborValue: number;
  profitMargin: number;
  markup: number;
  baseValue: number;
  taxes: { type: string; value: number }[];
  totalTax: number;
  finalPrice: number;
}

function calc(base: number, marginPct: number, taxes: { type: string; value: number }[]): { markup: number; totalTax: number; finalPrice: number } {
  const totalTax = taxes.reduce((s, t) => s + t.value, 0);
  const finalPrice = base * (1 + marginPct / 100) + totalTax;
  const markup = base > 0 ? ((finalPrice - base) / base) * 100 : 0;
  return { markup: Math.round(markup * 100) / 100, totalTax, finalPrice: Math.round(finalPrice * 100) / 100 };
}

function createItem(partial: Omit<PricingItem, 'markup' | 'totalTax' | 'finalPrice'>): PricingItem {
  const { markup, totalTax, finalPrice } = calc(partial.baseValue, partial.profitMargin, partial.taxes);
  return { ...partial, markup, totalTax, finalPrice };
}

export const mockServices: PricingItem[] = [
  createItem({
    id: 's1', type: 'servico', code: 'SRV-001', category: 'Consultoria',
    name: 'Consultoria Financeira', description: 'Análise e planejamento financeiro completo',
    unit: 'Hora', fixedCosts: 120, variableCosts: 80, prepTime: 2, hourRate: 150,
    laborPercent: 35, laborValue: 210, profitMargin: 40,
    baseValue: 710, taxes: [{ type: 'ISS', value: 35.50 }, { type: 'PIS/COFINS', value: 26.18 }],
  }),
  createItem({
    id: 's2', type: 'servico', code: 'SRV-002', category: 'Contabilidade',
    name: 'Assessoria Contábil Mensal', description: 'Escrituração e obrigações acessórias',
    unit: 'Mês', fixedCosts: 800, variableCosts: 200, prepTime: 8, hourRate: 120,
    laborPercent: 40, laborValue: 960, profitMargin: 35,
    baseValue: 2920, taxes: [{ type: 'ISS', value: 146.00 }, { type: 'PIS/COFINS', value: 107.60 }],
  }),
  createItem({
    id: 's3', type: 'servico', code: 'SRV-003', category: 'Treinamento',
    name: 'Treinamento Gestão Financeira', description: 'Capacitação presencial de equipes',
    unit: 'Turma', fixedCosts: 500, variableCosts: 300, prepTime: 16, hourRate: 180,
    laborPercent: 30, laborValue: 864, profitMargin: 50,
    baseValue: 4544, taxes: [{ type: 'ISS', value: 227.20 }, { type: 'PIS/COFINS', value: 167.36 }],
  }),
  createItem({
    id: 's4', type: 'servico', code: 'SRV-004', category: 'Auditoria',
    name: 'Auditoria Interna', description: 'Revisão de processos e controles internos',
    unit: 'Projeto', fixedCosts: 1500, variableCosts: 500, prepTime: 24, hourRate: 200,
    laborPercent: 25, laborValue: 1200, profitMargin: 45,
    baseValue: 8000, taxes: [{ type: 'ISS', value: 400.00 }, { type: 'PIS/COFINS', value: 296.00 }],
  }),
];

export const mockProducts: PricingItem[] = [
  createItem({
    id: 'p1', type: 'produto', code: 'PRD-001', category: 'Software',
    name: 'Sistema ERP Básico', description: 'Licença anual do sistema de gestão',
    unit: 'Licença', fixedCosts: 2000, variableCosts: 500, prepTime: 40, hourRate: 100,
    laborPercent: 20, laborValue: 800, profitMargin: 60,
    baseValue: 7300, taxes: [{ type: 'ICMS', value: 1314.00 }, { type: 'PIS/COFINS', value: 672.60 }],
  }),
  createItem({
    id: 'p2', type: 'produto', code: 'PRD-002', category: 'Relatórios',
    name: 'Relatório Personalizado', description: 'Relatório gerencial sob demanda',
    unit: 'Unidade', fixedCosts: 200, variableCosts: 100, prepTime: 4, hourRate: 130,
    laborPercent: 30, laborValue: 156, profitMargin: 45,
    baseValue: 976, taxes: [{ type: 'ISS', value: 48.80 }, { type: 'PIS/COFINS', value: 35.96 }],
  }),
  createItem({
    id: 'p3', type: 'produto', code: 'PRD-003', category: 'Planilhas',
    name: 'Kit de Planilhas Financeiras', description: 'Pacote completo de controle financeiro',
    unit: 'Pacote', fixedCosts: 150, variableCosts: 50, prepTime: 8, hourRate: 110,
    laborPercent: 25, laborValue: 220, profitMargin: 55,
    baseValue: 1300, taxes: [{ type: 'ICMS', value: 234.00 }, { type: 'PIS/COFINS', value: 119.86 }],
  }),
  createItem({
    id: 'p4', type: 'produto', code: 'PRD-004', category: 'Cursos',
    name: 'Curso Online de Finanças', description: 'Acesso vitalício ao conteúdo digital',
    unit: 'Acesso', fixedCosts: 3000, variableCosts: 200, prepTime: 60, hourRate: 90,
    laborPercent: 15, laborValue: 810, profitMargin: 70,
    baseValue: 9410, taxes: [{ type: 'ISS', value: 470.50 }, { type: 'PIS/COFINS', value: 346.93 }],
  }),
];

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
