// Mock data for Carvalho Consultores financial management system

export interface Transaction {
  id: string;
  date: string;
  type: 'entrada' | 'saida';
  description: string;
  category: string;
  subcategory: string;
  value: number;
  costCenter: string;
  clientOrSupplier?: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  type: 'cliente' | 'fornecedor';
  category: string;
  status: 'ativo' | 'inativo';
  email?: string;
  phone?: string;
}

export interface TaxRecord {
  id: string;
  type: string;
  value: number;
  period: string;
  dueDate: string;
  status: 'pago' | 'pendente';
}

export const categories = [
  'Receita de Serviços',
  'Consultoria',
  'Treinamentos',
  'Workshops',
  'Palestras',
  'Despesas Administrativas',
  'Despesas com Pessoal',
  'Marketing',
  'Tecnologia',
  'Impostos',
  'Outros',
];

export const subcategories: Record<string, string[]> = {
  'Receita de Serviços': ['Consultoria Empresarial', 'Consultoria Financeira', 'Consultoria Tributária'],
  'Consultoria': ['Projetos', 'Assessoria Mensal', 'Diagnósticos'],
  'Treinamentos': ['In-company', 'Online', 'Presencial'],
  'Workshops': ['Gestão', 'Liderança', 'Finanças'],
  'Palestras': ['Eventos Corporativos', 'Congressos', 'Seminários'],
  'Despesas Administrativas': ['Aluguel', 'Energia', 'Água', 'Internet', 'Telefone', 'Material de Escritório'],
  'Despesas com Pessoal': ['Salários', 'Benefícios', 'FGTS', 'INSS', '13º Salário', 'Férias'],
  'Marketing': ['Publicidade', 'Eventos', 'Material Promocional', 'Digital'],
  'Tecnologia': ['Software', 'Hardware', 'Manutenção', 'Licenças'],
  'Impostos': ['ISS', 'IRPJ', 'CSLL', 'PIS', 'COFINS'],
  'Outros': ['Diversos'],
};

export const costCenters = [
  'Operacional',
  'Administrativo',
  'Comercial',
  'RH',
  'TI',
  'Marketing',
  'Diretoria',
];

// Generate realistic mock transactions
const generateTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  // Revenue entries
  const revenueItems = [
    { desc: 'Consultoria Estratégica - Empresa ABC', cat: 'Consultoria', sub: 'Projetos', value: 45000, client: 'Empresa ABC S.A.' },
    { desc: 'Treinamento Liderança - Grupo XYZ', cat: 'Treinamentos', sub: 'In-company', value: 28000, client: 'Grupo XYZ Ltda' },
    { desc: 'Workshop Gestão Financeira', cat: 'Workshops', sub: 'Finanças', value: 15000, client: 'Múltiplos Participantes' },
    { desc: 'Palestra Congresso Nacional', cat: 'Palestras', sub: 'Congressos', value: 12000, client: 'Associação Empresarial' },
    { desc: 'Assessoria Mensal - Cliente Premium', cat: 'Consultoria', sub: 'Assessoria Mensal', value: 18500, client: 'Premium Corp' },
    { desc: 'Diagnóstico Empresarial', cat: 'Consultoria', sub: 'Diagnósticos', value: 22000, client: 'Startup Tech' },
    { desc: 'Treinamento Online - Turma 1', cat: 'Treinamentos', sub: 'Online', value: 8500, client: 'Diversos' },
    { desc: 'Consultoria Tributária', cat: 'Receita de Serviços', sub: 'Consultoria Tributária', value: 35000, client: 'Indústria Nacional' },
  ];

  // Expense items
  const expenseItems = [
    { desc: 'Aluguel Escritório', cat: 'Despesas Administrativas', sub: 'Aluguel', value: 8500, center: 'Administrativo' },
    { desc: 'Salários Equipe', cat: 'Despesas com Pessoal', sub: 'Salários', value: 45000, center: 'RH' },
    { desc: 'Benefícios Funcionários', cat: 'Despesas com Pessoal', sub: 'Benefícios', value: 12000, center: 'RH' },
    { desc: 'Energia Elétrica', cat: 'Despesas Administrativas', sub: 'Energia', value: 850, center: 'Administrativo' },
    { desc: 'Internet e Telefonia', cat: 'Despesas Administrativas', sub: 'Internet', value: 650, center: 'TI' },
    { desc: 'Software e Licenças', cat: 'Tecnologia', sub: 'Licenças', value: 2800, center: 'TI' },
    { desc: 'Marketing Digital', cat: 'Marketing', sub: 'Digital', value: 5500, center: 'Marketing' },
    { desc: 'Material de Escritório', cat: 'Despesas Administrativas', sub: 'Material de Escritório', value: 450, center: 'Administrativo' },
    { desc: 'ISS sobre Serviços', cat: 'Impostos', sub: 'ISS', value: 4200, center: 'Administrativo' },
    { desc: 'IRPJ Trimestral', cat: 'Impostos', sub: 'IRPJ', value: 8900, center: 'Administrativo' },
    { desc: 'Manutenção Equipamentos', cat: 'Tecnologia', sub: 'Manutenção', value: 1200, center: 'TI' },
  ];

  // Generate 12 months of data
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - month, 1);
    
    // Add revenue entries (2-4 per month)
    const numRevenue = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numRevenue; i++) {
      const item = revenueItems[Math.floor(Math.random() * revenueItems.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      const variance = 0.8 + Math.random() * 0.4;
      
      transactions.push({
        id: `t-${month}-r-${i}`,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day).toISOString().split('T')[0],
        type: 'entrada',
        description: item.desc,
        category: item.cat,
        subcategory: item.sub,
        value: Math.round(item.value * variance),
        costCenter: 'Operacional',
        clientOrSupplier: item.client,
      });
    }

    // Add expense entries (5-8 per month)
    const numExpense = Math.floor(Math.random() * 4) + 5;
    for (let i = 0; i < numExpense; i++) {
      const item = expenseItems[Math.floor(Math.random() * expenseItems.length)];
      const day = Math.floor(Math.random() * 28) + 1;
      const variance = 0.9 + Math.random() * 0.2;
      
      transactions.push({
        id: `t-${month}-e-${i}`,
        date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day).toISOString().split('T')[0],
        type: 'saida',
        description: item.desc,
        category: item.cat,
        subcategory: item.sub,
        value: Math.round(item.value * variance),
        costCenter: item.center,
      });
    }
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const transactions = generateTransactions();

export const clients: Client[] = [
  { id: 'c1', name: 'Empresa ABC S.A.', type: 'cliente', category: 'Grandes Empresas', status: 'ativo', email: 'contato@empresaabc.com.br', phone: '(11) 3456-7890' },
  { id: 'c2', name: 'Grupo XYZ Ltda', type: 'cliente', category: 'Médias Empresas', status: 'ativo', email: 'comercial@grupoxyz.com.br', phone: '(11) 2345-6789' },
  { id: 'c3', name: 'Premium Corp', type: 'cliente', category: 'Grandes Empresas', status: 'ativo', email: 'financeiro@premiumcorp.com.br', phone: '(21) 3456-7890' },
  { id: 'c4', name: 'Startup Tech', type: 'cliente', category: 'Startups', status: 'ativo', email: 'hello@startuptech.io', phone: '(11) 98765-4321' },
  { id: 'c5', name: 'Indústria Nacional', type: 'cliente', category: 'Indústria', status: 'ativo', email: 'compras@industrianacional.com.br', phone: '(19) 3456-7890' },
  { id: 'c6', name: 'Associação Empresarial', type: 'cliente', category: 'Associações', status: 'ativo', email: 'eventos@associacao.org.br', phone: '(11) 3456-7891' },
  { id: 'f1', name: 'TechSoft Sistemas', type: 'fornecedor', category: 'Tecnologia', status: 'ativo', email: 'vendas@techsoft.com.br', phone: '(11) 4567-8901' },
  { id: 'f2', name: 'Imobiliária Central', type: 'fornecedor', category: 'Imobiliário', status: 'ativo', email: 'locacao@imobcentral.com.br', phone: '(11) 3456-7892' },
  { id: 'f3', name: 'Papelaria Express', type: 'fornecedor', category: 'Suprimentos', status: 'ativo', email: 'pedidos@papelariaexpress.com.br', phone: '(11) 2345-6780' },
  { id: 'f4', name: 'Agência Digital Plus', type: 'fornecedor', category: 'Marketing', status: 'ativo', email: 'projetos@digitalplus.com.br', phone: '(11) 98765-4322' },
  { id: 'f5', name: 'Contabilidade Exata', type: 'fornecedor', category: 'Serviços', status: 'inativo', email: 'contato@exata.com.br', phone: '(11) 3456-7893' },
];

export const taxRecords: TaxRecord[] = [
  { id: 'tax1', type: 'ISS', value: 4200, period: '01/2025', dueDate: '2025-02-10', status: 'pago' },
  { id: 'tax2', type: 'IRPJ', value: 8900, period: '4º Tri 2024', dueDate: '2025-01-31', status: 'pago' },
  { id: 'tax3', type: 'CSLL', value: 3200, period: '4º Tri 2024', dueDate: '2025-01-31', status: 'pago' },
  { id: 'tax4', type: 'PIS', value: 1850, period: '01/2025', dueDate: '2025-02-25', status: 'pendente' },
  { id: 'tax5', type: 'COFINS', value: 8520, period: '01/2025', dueDate: '2025-02-25', status: 'pendente' },
  { id: 'tax6', type: 'INSS', value: 12500, period: '01/2025', dueDate: '2025-02-20', status: 'pago' },
  { id: 'tax7', type: 'FGTS', value: 4800, period: '01/2025', dueDate: '2025-02-07', status: 'pago' },
];

// Calculate financial metrics
export const calculateMetrics = (data: Transaction[], periodDays: number = 30) => {
  const now = new Date();
  const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
  
  const filteredData = data.filter(t => new Date(t.date) >= startDate);
  
  const totalEntradas = filteredData.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.value, 0);
  const totalSaidas = filteredData.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.value, 0);
  const resultado = totalEntradas - totalSaidas;
  
  const dailyAvg = totalSaidas / periodDays;
  const monthlyAvg = dailyAvg * 30;
  const yearlyAvg = dailyAvg * 365;
  
  return {
    totalEntradas,
    totalSaidas,
    resultado,
    gastoMedioDiario: dailyAvg,
    gastoMedioMensal: monthlyAvg,
    gastoMedioAnual: yearlyAvg,
  };
};

// Get spending by category
export const getSpendingByCategory = (data: Transaction[]) => {
  const categoryTotals: Record<string, number> = {};
  
  data.filter(t => t.type === 'saida').forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.value;
  });
  
  return Object.entries(categoryTotals)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value);
};

// Get daily spending trend
export const getDailyTrend = (data: Transaction[], days: number = 30) => {
  const now = new Date();
  const result: { date: string; entradas: number; saidas: number }[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTransactions = data.filter(t => t.date === dateStr);
    const entradas = dayTransactions.filter(t => t.type === 'entrada').reduce((sum, t) => sum + t.value, 0);
    const saidas = dayTransactions.filter(t => t.type === 'saida').reduce((sum, t) => sum + t.value, 0);
    
    result.push({
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      entradas,
      saidas,
    });
  }
  
  return result;
};

// Generate insights
export const generateInsights = (data: Transaction[]) => {
  const metrics = calculateMetrics(data, 30);
  const prevMetrics = calculateMetrics(data.filter(t => {
    const date = new Date(t.date);
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    return date >= sixtyDaysAgo && date < thirtyDaysAgo;
  }), 30);
  
  const insights = [];
  
  const revenueChange = prevMetrics.totalEntradas > 0 
    ? ((metrics.totalEntradas - prevMetrics.totalEntradas) / prevMetrics.totalEntradas) * 100 
    : 0;
    
  if (revenueChange > 10) {
    insights.push({
      type: 'positive',
      title: 'Receita em Alta',
      description: `Suas entradas aumentaram ${revenueChange.toFixed(1)}% comparado ao mês anterior.`,
    });
  } else if (revenueChange < -10) {
    insights.push({
      type: 'warning',
      title: 'Receita em Queda',
      description: `Suas entradas diminuíram ${Math.abs(revenueChange).toFixed(1)}% comparado ao mês anterior.`,
    });
  }
  
  if (metrics.resultado > 0) {
    insights.push({
      type: 'positive',
      title: 'Resultado Positivo',
      description: `Você está com superávit de R$ ${metrics.resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} neste período.`,
    });
  } else {
    insights.push({
      type: 'negative',
      title: 'Resultado Negativo',
      description: `Atenção: déficit de R$ ${Math.abs(metrics.resultado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} neste período.`,
    });
  }
  
  const topCategory = getSpendingByCategory(data)[0];
  if (topCategory) {
    insights.push({
      type: 'info',
      title: 'Maior Centro de Custo',
      description: `${topCategory.category} representa a maior despesa: R$ ${topCategory.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
    });
  }
  
  return insights;
};

// Tax metrics
export const calculateTaxMetrics = (taxes: TaxRecord[], revenue: number) => {
  const totalPaid = taxes.filter(t => t.status === 'pago').reduce((sum, t) => sum + t.value, 0);
  const totalPending = taxes.filter(t => t.status === 'pendente').reduce((sum, t) => sum + t.value, 0);
  const percentOfRevenue = revenue > 0 ? (totalPaid / revenue) * 100 : 0;
  
  const byType: Record<string, number> = {};
  taxes.forEach(t => {
    byType[t.type] = (byType[t.type] || 0) + t.value;
  });
  
  const topTax = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
  
  return {
    totalPaid,
    totalPending,
    percentOfRevenue,
    byType: Object.entries(byType).map(([type, value]) => ({ type, value })),
    topTax: topTax ? { type: topTax[0], value: topTax[1] } : null,
  };
};
