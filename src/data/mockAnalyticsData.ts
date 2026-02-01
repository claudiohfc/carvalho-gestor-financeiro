// Mock data for Analytics, DRE, and Scenario Simulator

// ==================== ANALYTICS & KPIs ====================

export interface KPIData {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  target?: number;
  unit: 'currency' | 'percentage' | 'number' | 'days';
  description: string;
  formula?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DRELine {
  id: string;
  description: string;
  currentMonth: number;
  previousMonth: number;
  planned: number;
  category: 'receita' | 'deducao' | 'custo' | 'despesa' | 'resultado';
  level: 1 | 2 | 3;
  isTotal?: boolean;
}

export interface ServiceLine {
  id: string;
  name: string;
  revenue: number;
  cost: number;
  margin: number;
  clients: number;
}

export interface EmployeeRevenue {
  id: string;
  name: string;
  role: string;
  revenue: number;
  cost: number;
  productivity: number;
}

export interface ClientRevenue {
  id: string;
  name: string;
  revenue: number;
  cost: number;
  margin: number;
  lifetime: number;
}

// KPIs analíticos
export const analyticsKPIs: KPIData[] = [
  {
    id: 'ebitda',
    name: 'EBITDA',
    value: 89500,
    previousValue: 78200,
    target: 95000,
    unit: 'currency',
    description: 'Lucro antes de juros, impostos, depreciação e amortização. Indica a capacidade de geração de caixa operacional.',
    formula: 'Receita Líquida - Custos - Despesas Operacionais',
    priority: 'high',
  },
  {
    id: 'margem-liquida',
    name: 'Margem de Lucro Líquida',
    value: 18.5,
    previousValue: 15.2,
    target: 20,
    unit: 'percentage',
    description: 'Percentual do faturamento que se converte em lucro líquido após todos os custos.',
    formula: '(Lucro Líquido / Receita Bruta) × 100',
    priority: 'high',
  },
  {
    id: 'crescimento-yoy',
    name: 'Crescimento de Receita YoY',
    value: 24.3,
    previousValue: 18.7,
    target: 30,
    unit: 'percentage',
    description: 'Variação percentual da receita comparada ao mesmo período do ano anterior.',
    formula: '((Receita Atual - Receita Ano Anterior) / Receita Ano Anterior) × 100',
    priority: 'medium',
  },
  {
    id: 'ccc',
    name: 'Ciclo de Conversão de Caixa',
    value: 45,
    previousValue: 52,
    target: 30,
    unit: 'days',
    description: 'Tempo médio para converter investimentos em caixa. Menor é melhor.',
    formula: 'PMR + PME - PMP',
    priority: 'medium',
  },
  {
    id: 'cac',
    name: 'Custo de Aquisição de Cliente',
    value: 2850,
    previousValue: 3200,
    target: 2500,
    unit: 'currency',
    description: 'Investimento médio necessário para conquistar um novo cliente.',
    formula: '(Marketing + Vendas) / Novos Clientes',
    priority: 'high',
  },
  {
    id: 'cps',
    name: 'Custo da Prestação de Serviços',
    value: 42.5,
    previousValue: 45.8,
    target: 40,
    unit: 'percentage',
    description: 'Percentual da receita consumido para entregar os serviços.',
    formula: '(Custos Diretos / Receita de Serviços) × 100',
    priority: 'high',
  },
  {
    id: 'receita-funcionario',
    name: 'Receita por Funcionário',
    value: 28500,
    previousValue: 25200,
    target: 32000,
    unit: 'currency',
    description: 'Faturamento médio gerado por cada colaborador.',
    formula: 'Receita Total / Número de Funcionários',
    priority: 'medium',
  },
  {
    id: 'receita-cliente',
    name: 'Receita por Cliente',
    value: 15800,
    previousValue: 14200,
    target: 18000,
    unit: 'currency',
    description: 'Faturamento médio por cliente ativo.',
    formula: 'Receita Total / Clientes Ativos',
    priority: 'medium',
  },
  {
    id: 'real-vs-orcado',
    name: 'Real vs Orçado',
    value: 94.5,
    previousValue: 88.2,
    target: 100,
    unit: 'percentage',
    description: 'Aderência entre o resultado realizado e o planejado.',
    formula: '(Realizado / Orçado) × 100',
    priority: 'high',
  },
];

// Receita por linha de serviço
export const serviceLines: ServiceLine[] = [
  { id: 'sl-1', name: 'Consultoria Estratégica', revenue: 145000, cost: 58000, margin: 60, clients: 8 },
  { id: 'sl-2', name: 'Treinamentos In-Company', revenue: 98000, cost: 35000, margin: 64.3, clients: 12 },
  { id: 'sl-3', name: 'Assessoria Mensal', revenue: 72000, cost: 28000, margin: 61.1, clients: 6 },
  { id: 'sl-4', name: 'Workshops', revenue: 45000, cost: 15000, margin: 66.7, clients: 15 },
  { id: 'sl-5', name: 'Palestras', revenue: 38000, cost: 12000, margin: 68.4, clients: 10 },
  { id: 'sl-6', name: 'Diagnósticos', revenue: 32000, cost: 14000, margin: 56.3, clients: 4 },
];

// Receita por funcionário
export const employeeRevenues: EmployeeRevenue[] = [
  { id: 'emp-1', name: 'Carlos Carvalho', role: 'Diretor', revenue: 95000, cost: 18000, productivity: 120 },
  { id: 'emp-2', name: 'Ana Silva', role: 'Consultora Sênior', revenue: 68000, cost: 12000, productivity: 115 },
  { id: 'emp-3', name: 'Pedro Santos', role: 'Consultor Pleno', revenue: 52000, cost: 9500, productivity: 105 },
  { id: 'emp-4', name: 'Maria Oliveira', role: 'Consultora Pleno', revenue: 48000, cost: 9500, productivity: 98 },
  { id: 'emp-5', name: 'João Costa', role: 'Consultor Jr', revenue: 32000, cost: 7000, productivity: 92 },
  { id: 'emp-6', name: 'Lucia Ferreira', role: 'Administrativa', revenue: 15000, cost: 5500, productivity: 85 },
];

// Receita por cliente
export const clientRevenues: ClientRevenue[] = [
  { id: 'cli-1', name: 'Tech Solutions Ltda', revenue: 45000, cost: 18000, margin: 60, lifetime: 24 },
  { id: 'cli-2', name: 'Grupo Inovação', revenue: 38000, cost: 14000, margin: 63.2, lifetime: 18 },
  { id: 'cli-3', name: 'Empresa ABC', revenue: 35000, cost: 15000, margin: 57.1, lifetime: 36 },
  { id: 'cli-4', name: 'StartUp X', revenue: 28000, cost: 10000, margin: 64.3, lifetime: 12 },
  { id: 'cli-5', name: 'Digital Corp', revenue: 25000, cost: 9500, margin: 62, lifetime: 8 },
  { id: 'cli-6', name: 'Indústria Nacional', revenue: 22000, cost: 9000, margin: 59.1, lifetime: 30 },
];

// ==================== DRE GERENCIAL ====================

export const dreData: DRELine[] = [
  // Receitas
  { id: 'dre-1', description: 'RECEITA BRUTA', currentMonth: 485000, previousMonth: 420000, planned: 500000, category: 'receita', level: 1, isTotal: true },
  { id: 'dre-2', description: 'Receita de Serviços', currentMonth: 430000, previousMonth: 375000, planned: 450000, category: 'receita', level: 2 },
  { id: 'dre-3', description: 'Outras Receitas', currentMonth: 55000, previousMonth: 45000, planned: 50000, category: 'receita', level: 2 },
  
  // Deduções
  { id: 'dre-4', description: 'DEDUÇÕES DA RECEITA', currentMonth: -48500, previousMonth: -42000, planned: -50000, category: 'deducao', level: 1, isTotal: true },
  { id: 'dre-5', description: 'Impostos sobre Serviços (ISS)', currentMonth: -24250, previousMonth: -21000, planned: -25000, category: 'deducao', level: 2 },
  { id: 'dre-6', description: 'PIS/COFINS', currentMonth: -24250, previousMonth: -21000, planned: -25000, category: 'deducao', level: 2 },
  
  // Receita Líquida
  { id: 'dre-7', description: 'RECEITA LÍQUIDA', currentMonth: 436500, previousMonth: 378000, planned: 450000, category: 'resultado', level: 1, isTotal: true },
  
  // Custos
  { id: 'dre-8', description: 'CUSTOS DOS SERVIÇOS', currentMonth: -178000, previousMonth: -162000, planned: -180000, category: 'custo', level: 1, isTotal: true },
  { id: 'dre-9', description: 'Mão de Obra Direta', currentMonth: -125000, previousMonth: -115000, planned: -130000, category: 'custo', level: 2 },
  { id: 'dre-10', description: 'Materiais e Insumos', currentMonth: -28000, previousMonth: -25000, planned: -28000, category: 'custo', level: 2 },
  { id: 'dre-11', description: 'Outros Custos Diretos', currentMonth: -25000, previousMonth: -22000, planned: -22000, category: 'custo', level: 2 },
  
  // Lucro Bruto
  { id: 'dre-12', description: 'LUCRO BRUTO', currentMonth: 258500, previousMonth: 216000, planned: 270000, category: 'resultado', level: 1, isTotal: true },
  
  // Despesas Operacionais
  { id: 'dre-13', description: 'DESPESAS OPERACIONAIS', currentMonth: -169000, previousMonth: -152000, planned: -165000, category: 'despesa', level: 1, isTotal: true },
  { id: 'dre-14', description: 'Despesas com Pessoal', currentMonth: -85000, previousMonth: -78000, planned: -82000, category: 'despesa', level: 2 },
  { id: 'dre-15', description: 'Pró-labore', currentMonth: -25000, previousMonth: -25000, planned: -25000, category: 'despesa', level: 3 },
  { id: 'dre-16', description: 'Salários', currentMonth: -45000, previousMonth: -42000, planned: -45000, category: 'despesa', level: 3 },
  { id: 'dre-17', description: 'Benefícios', currentMonth: -15000, previousMonth: -11000, planned: -12000, category: 'despesa', level: 3 },
  { id: 'dre-18', description: 'Despesas Administrativas', currentMonth: -42000, previousMonth: -38000, planned: -40000, category: 'despesa', level: 2 },
  { id: 'dre-19', description: 'Aluguel', currentMonth: -12000, previousMonth: -12000, planned: -12000, category: 'despesa', level: 3 },
  { id: 'dre-20', description: 'Energia e Utilities', currentMonth: -3500, previousMonth: -3200, planned: -3500, category: 'despesa', level: 3 },
  { id: 'dre-21', description: 'Tecnologia', currentMonth: -8500, previousMonth: -7800, planned: -8000, category: 'despesa', level: 3 },
  { id: 'dre-22', description: 'Outras Despesas Admin', currentMonth: -18000, previousMonth: -15000, planned: -16500, category: 'despesa', level: 3 },
  { id: 'dre-23', description: 'Despesas Comerciais', currentMonth: -28000, previousMonth: -24000, planned: -30000, category: 'despesa', level: 2 },
  { id: 'dre-24', description: 'Marketing', currentMonth: -18000, previousMonth: -15000, planned: -20000, category: 'despesa', level: 3 },
  { id: 'dre-25', description: 'Comissões', currentMonth: -10000, previousMonth: -9000, planned: -10000, category: 'despesa', level: 3 },
  { id: 'dre-26', description: 'Outras Despesas', currentMonth: -14000, previousMonth: -12000, planned: -13000, category: 'despesa', level: 2 },
  
  // EBITDA
  { id: 'dre-27', description: 'EBITDA', currentMonth: 89500, previousMonth: 64000, planned: 105000, category: 'resultado', level: 1, isTotal: true },
  
  // Depreciação e Amortização
  { id: 'dre-28', description: 'Depreciação e Amortização', currentMonth: -5500, previousMonth: -5500, planned: -5500, category: 'despesa', level: 2 },
  
  // EBIT
  { id: 'dre-29', description: 'EBIT (Lucro Operacional)', currentMonth: 84000, previousMonth: 58500, planned: 99500, category: 'resultado', level: 1, isTotal: true },
  
  // Resultado Financeiro
  { id: 'dre-30', description: 'Resultado Financeiro', currentMonth: -2500, previousMonth: -3200, planned: -2000, category: 'despesa', level: 2 },
  
  // Lucro Antes IR
  { id: 'dre-31', description: 'LUCRO ANTES DO IR', currentMonth: 81500, previousMonth: 55300, planned: 97500, category: 'resultado', level: 1, isTotal: true },
  
  // IR/CSLL
  { id: 'dre-32', description: 'IR e CSLL', currentMonth: -19560, previousMonth: -13272, planned: -23400, category: 'despesa', level: 2 },
  
  // Lucro Líquido
  { id: 'dre-33', description: 'LUCRO LÍQUIDO', currentMonth: 61940, previousMonth: 42028, planned: 74100, category: 'resultado', level: 1, isTotal: true },
];

// Insights automáticos para DRE
export interface DREInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'warning' | 'info';
  metric: string;
  value: number;
}

export const generateDREInsights = (data: DRELine[]): DREInsight[] => {
  const insights: DREInsight[] = [];
  
  const receitaBruta = data.find(d => d.id === 'dre-1');
  const lucroLiquido = data.find(d => d.id === 'dre-33');
  const lucroBruto = data.find(d => d.id === 'dre-12');
  const ebitda = data.find(d => d.id === 'dre-27');
  const despesasPessoal = data.find(d => d.id === 'dre-14');
  
  if (receitaBruta) {
    const crescimento = ((receitaBruta.currentMonth - receitaBruta.previousMonth) / receitaBruta.previousMonth) * 100;
    insights.push({
      id: 'insight-receita',
      title: crescimento > 0 ? 'Receita em Crescimento' : 'Receita em Queda',
      description: `A receita bruta ${crescimento > 0 ? 'cresceu' : 'caiu'} ${Math.abs(crescimento).toFixed(1)}% em relação ao mês anterior.`,
      type: crescimento > 0 ? 'positive' : 'negative',
      metric: 'Receita Bruta',
      value: crescimento,
    });
  }
  
  if (lucroLiquido && receitaBruta) {
    const margemLiquida = (lucroLiquido.currentMonth / receitaBruta.currentMonth) * 100;
    const aderencia = (lucroLiquido.currentMonth / lucroLiquido.planned) * 100;
    
    insights.push({
      id: 'insight-margem',
      title: margemLiquida >= 15 ? 'Margem Líquida Saudável' : 'Margem Líquida Baixa',
      description: `A margem líquida atual é de ${margemLiquida.toFixed(1)}%. ${margemLiquida >= 15 ? 'Resultado positivo.' : 'Considere revisar custos.'}`,
      type: margemLiquida >= 15 ? 'positive' : 'warning',
      metric: 'Margem Líquida',
      value: margemLiquida,
    });
    
    insights.push({
      id: 'insight-aderencia',
      title: aderencia >= 90 ? 'Boa Aderência ao Orçamento' : 'Desvio do Orçamento',
      description: `Resultado representa ${aderencia.toFixed(1)}% do planejado. ${aderencia < 90 ? 'Atenção aos desvios.' : ''}`,
      type: aderencia >= 90 ? 'positive' : 'warning',
      metric: 'Aderência',
      value: aderencia,
    });
  }
  
  if (despesasPessoal && receitaBruta) {
    const pessoalSobreReceita = (Math.abs(despesasPessoal.currentMonth) / receitaBruta.currentMonth) * 100;
    insights.push({
      id: 'insight-pessoal',
      title: pessoalSobreReceita <= 20 ? 'Custo de Pessoal Controlado' : 'Alto Custo de Pessoal',
      description: `Despesas com pessoal representam ${pessoalSobreReceita.toFixed(1)}% da receita. ${pessoalSobreReceita > 20 ? 'Avaliar produtividade.' : ''}`,
      type: pessoalSobreReceita <= 20 ? 'info' : 'warning',
      metric: 'Pessoal/Receita',
      value: pessoalSobreReceita,
    });
  }
  
  return insights;
};

// ==================== SIMULADOR DE CENÁRIOS ====================

export interface ScenarioInput {
  type: 'contratacao' | 'preco' | 'cliente';
  value: number;
  period: number;
}

export interface ScenarioResult {
  cashImpact: number;
  profitImpact: number;
  marginImpact: number;
  breakeven?: number;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  type: 'contratacao' | 'preco' | 'cliente';
  inputs: {
    label: string;
    key: string;
    type: 'currency' | 'percentage' | 'number';
    defaultValue: number;
    min?: number;
    max?: number;
  }[];
}

export const scenarioTemplates: Scenario[] = [
  {
    id: 'scenario-1',
    name: 'Contratar Novo Colaborador',
    description: 'Simule o impacto de uma nova contratação no seu resultado',
    type: 'contratacao',
    inputs: [
      { label: 'Salário Mensal', key: 'salary', type: 'currency', defaultValue: 5000, min: 2000, max: 30000 },
      { label: 'Encargos (%)', key: 'charges', type: 'percentage', defaultValue: 68, min: 50, max: 100 },
      { label: 'Benefícios Mensais', key: 'benefits', type: 'currency', defaultValue: 1200, min: 0, max: 5000 },
      { label: 'Receita Esperada/Mês', key: 'expectedRevenue', type: 'currency', defaultValue: 15000, min: 0, max: 100000 },
      { label: 'Meses para Análise', key: 'months', type: 'number', defaultValue: 12, min: 1, max: 36 },
    ],
  },
  {
    id: 'scenario-2',
    name: 'Aumentar Preços',
    description: 'Simule o impacto de um aumento de preços nos serviços',
    type: 'preco',
    inputs: [
      { label: 'Aumento (%)', key: 'increase', type: 'percentage', defaultValue: 10, min: 1, max: 100 },
      { label: 'Receita Atual Mensal', key: 'currentRevenue', type: 'currency', defaultValue: 430000, min: 0, max: 10000000 },
      { label: 'Perda Estimada de Clientes (%)', key: 'churn', type: 'percentage', defaultValue: 5, min: 0, max: 50 },
      { label: 'Meses para Análise', key: 'months', type: 'number', defaultValue: 12, min: 1, max: 36 },
    ],
  },
  {
    id: 'scenario-3',
    name: 'Perder Cliente',
    description: 'Simule o impacto da perda de um cliente importante',
    type: 'cliente',
    inputs: [
      { label: 'Receita Mensal do Cliente', key: 'clientRevenue', type: 'currency', defaultValue: 25000, min: 0, max: 500000 },
      { label: 'Custo Direto Associado', key: 'directCost', type: 'currency', defaultValue: 8000, min: 0, max: 200000 },
      { label: 'Custo de Prospecção (Novo)', key: 'prospectionCost', type: 'currency', defaultValue: 5000, min: 0, max: 50000 },
      { label: 'Meses p/ Substituir', key: 'monthsToReplace', type: 'number', defaultValue: 3, min: 1, max: 12 },
    ],
  },
];

export const calculateScenario = (
  scenario: Scenario,
  inputs: Record<string, number>
): ScenarioResult => {
  const baseProfit = 61940; // Lucro líquido base
  const baseMargin = 18.5; // Margem base
  const baseCash = 45230; // Caixa base
  
  switch (scenario.type) {
    case 'contratacao': {
      const monthlyCost = inputs.salary * (1 + inputs.charges / 100) + inputs.benefits;
      const monthlyProfit = inputs.expectedRevenue - monthlyCost;
      const totalImpact = monthlyProfit * inputs.months;
      const breakeven = monthlyCost > 0 ? Math.ceil(monthlyCost / (inputs.expectedRevenue - monthlyCost * 0.3)) : 0;
      
      return {
        cashImpact: totalImpact,
        profitImpact: monthlyProfit,
        marginImpact: (inputs.expectedRevenue > 0 ? (monthlyProfit / inputs.expectedRevenue) * 100 : 0) - baseMargin,
        breakeven: breakeven > 0 ? breakeven : undefined,
      };
    }
    
    case 'preco': {
      const newRevenue = inputs.currentRevenue * (1 + inputs.increase / 100);
      const lostRevenue = newRevenue * (inputs.churn / 100);
      const netRevenue = newRevenue - lostRevenue;
      const monthlyGain = netRevenue - inputs.currentRevenue;
      const totalImpact = monthlyGain * inputs.months;
      
      return {
        cashImpact: totalImpact,
        profitImpact: monthlyGain * 0.65, // Assumindo margem de 65%
        marginImpact: inputs.increase * (1 - inputs.churn / 100) * 0.8,
      };
    }
    
    case 'cliente': {
      const monthlyLoss = inputs.clientRevenue - inputs.directCost;
      const totalLoss = monthlyLoss * inputs.monthsToReplace;
      const acquisitionCost = inputs.prospectionCost;
      
      return {
        cashImpact: -(totalLoss + acquisitionCost),
        profitImpact: -monthlyLoss,
        marginImpact: -(inputs.clientRevenue / 430000) * 100, // Impacto proporcional
      };
    }
    
    default:
      return { cashImpact: 0, profitImpact: 0, marginImpact: 0 };
  }
};

// ==================== DASHBOARD ADMINISTRATIVO ====================

export interface OperationalCost {
  id: string;
  category: string;
  value: number;
  previousValue: number;
  budget: number;
}

export interface PeopleMetric {
  id: string;
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
}

export interface EfficiencyMetric {
  id: string;
  metric: string;
  value: number;
  target: number;
  unit: string;
}

export const operationalCosts: OperationalCost[] = [
  { id: 'oc-1', category: 'Infraestrutura', value: 15500, previousValue: 14800, budget: 16000 },
  { id: 'oc-2', category: 'Tecnologia', value: 8500, previousValue: 7800, budget: 9000 },
  { id: 'oc-3', category: 'Utilities', value: 4200, previousValue: 4000, budget: 4500 },
  { id: 'oc-4', category: 'Manutenção', value: 2800, previousValue: 3200, budget: 3000 },
  { id: 'oc-5', category: 'Seguros', value: 2100, previousValue: 2100, budget: 2100 },
  { id: 'oc-6', category: 'Outros', value: 3900, previousValue: 3500, budget: 4000 },
];

export const peopleMetrics: PeopleMetric[] = [
  { id: 'pm-1', metric: 'Total de Colaboradores', value: 12, unit: 'pessoas', trend: 'stable' },
  { id: 'pm-2', metric: 'Turnover Mensal', value: 2.5, unit: '%', trend: 'down' },
  { id: 'pm-3', metric: 'Absenteísmo', value: 3.2, unit: '%', trend: 'up' },
  { id: 'pm-4', metric: 'Horas Extras Médias', value: 12, unit: 'h/mês', trend: 'down' },
  { id: 'pm-5', metric: 'Custo Médio por Colaborador', value: 8500, unit: 'R$', trend: 'up' },
  { id: 'pm-6', metric: 'Satisfação (NPS Interno)', value: 72, unit: 'pontos', trend: 'up' },
];

export const efficiencyMetrics: EfficiencyMetric[] = [
  { id: 'ef-1', metric: 'Taxa de Utilização', value: 78, target: 85, unit: '%' },
  { id: 'ef-2', metric: 'Produtividade Média', value: 92, target: 100, unit: '%' },
  { id: 'ef-3', metric: 'SLA Cumprido', value: 94.5, target: 98, unit: '%' },
  { id: 'ef-4', metric: 'Tempo Médio de Entrega', value: 8.5, target: 7, unit: 'dias' },
  { id: 'ef-5', metric: 'Retrabalho', value: 4.2, target: 3, unit: '%' },
  { id: 'ef-6', metric: 'Satisfação do Cliente', value: 4.3, target: 4.5, unit: '/5' },
];

// ==================== DASHBOARD FINANCEIRO EXPANDIDO ====================

export interface PayrollItem {
  id: string;
  name: string;
  category: 'prolabore' | 'distribuicao' | 'comissao' | 'salario' | 'vt' | 'decimo' | 'ferias';
  value: number;
  person?: string;
  period: string;
}

export const payrollData: PayrollItem[] = [
  // Pró-labore
  { id: 'pay-1', name: 'Pró-labore', category: 'prolabore', value: 15000, person: 'Carlos Carvalho', period: 'Jan/2026' },
  { id: 'pay-2', name: 'Pró-labore', category: 'prolabore', value: 10000, person: 'Maria Carvalho', period: 'Jan/2026' },
  
  // Distribuição de lucros
  { id: 'pay-3', name: 'Distribuição de Lucros', category: 'distribuicao', value: 35000, person: 'Sócios', period: 'Dez/2025' },
  
  // Comissões
  { id: 'pay-4', name: 'Comissão Vendas', category: 'comissao', value: 5500, person: 'Ana Silva', period: 'Jan/2026' },
  { id: 'pay-5', name: 'Comissão Vendas', category: 'comissao', value: 4500, person: 'Pedro Santos', period: 'Jan/2026' },
  
  // Salários
  { id: 'pay-6', name: 'Salário', category: 'salario', value: 8500, person: 'Ana Silva', period: 'Jan/2026' },
  { id: 'pay-7', name: 'Salário', category: 'salario', value: 6500, person: 'Pedro Santos', period: 'Jan/2026' },
  { id: 'pay-8', name: 'Salário', category: 'salario', value: 6500, person: 'Maria Oliveira', period: 'Jan/2026' },
  { id: 'pay-9', name: 'Salário', category: 'salario', value: 4500, person: 'João Costa', period: 'Jan/2026' },
  { id: 'pay-10', name: 'Salário', category: 'salario', value: 3800, person: 'Lucia Ferreira', period: 'Jan/2026' },
  
  // Vale Transporte
  { id: 'pay-11', name: 'Vale Transporte', category: 'vt', value: 450, person: 'Ana Silva', period: 'Jan/2026' },
  { id: 'pay-12', name: 'Vale Transporte', category: 'vt', value: 450, person: 'Pedro Santos', period: 'Jan/2026' },
  { id: 'pay-13', name: 'Vale Transporte', category: 'vt', value: 450, person: 'Maria Oliveira', period: 'Jan/2026' },
  { id: 'pay-14', name: 'Vale Transporte', category: 'vt', value: 380, person: 'João Costa', period: 'Jan/2026' },
  { id: 'pay-15', name: 'Vale Transporte', category: 'vt', value: 380, person: 'Lucia Ferreira', period: 'Jan/2026' },
  
  // 13º Salário (provisionado)
  { id: 'pay-16', name: '13º Salário (Provisão)', category: 'decimo', value: 2475, person: 'Equipe', period: 'Jan/2026' },
  
  // Férias (provisionado)
  { id: 'pay-17', name: 'Férias (Provisão)', category: 'ferias', value: 3300, person: 'Equipe', period: 'Jan/2026' },
];

export const getPayrollSummary = () => {
  const summary = {
    prolabore: 0,
    distribuicao: 0,
    comissoes: 0,
    salarios: 0,
    vt: 0,
    decimo: 0,
    ferias: 0,
  };
  
  payrollData.forEach(item => {
    switch (item.category) {
      case 'prolabore': summary.prolabore += item.value; break;
      case 'distribuicao': summary.distribuicao += item.value; break;
      case 'comissao': summary.comissoes += item.value; break;
      case 'salario': summary.salarios += item.value; break;
      case 'vt': summary.vt += item.value; break;
      case 'decimo': summary.decimo += item.value; break;
      case 'ferias': summary.ferias += item.value; break;
    }
  });
  
  return summary;
};

// Formatação de moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatCompact = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
