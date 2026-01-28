import * as XLSX from 'xlsx';

// Gera modelo de planilha para download
export function generateExcelTemplate() {
  const workbook = XLSX.utils.book_new();

  // Aba de Receitas
  const receitasData = [
    ['MODELO DE IMPORTAÇÃO - RECEITAS'],
    ['Preencha os dados abaixo seguindo o formato indicado. Remova esta linha de instrução antes de importar.'],
    [''],
    ['Data', 'Descrição', 'Categoria', 'Subcategoria', 'Valor', 'Cliente', 'Observações'],
    ['15/01/2025', 'Consultoria Estratégica - Cliente ABC', 'Consultoria', 'Projetos', 45000, 'Empresa ABC S.A.', 'Contrato anual'],
    ['20/01/2025', 'Treinamento Liderança', 'Treinamentos', 'In-company', 28000, 'Grupo XYZ Ltda', 'Turma 1'],
    ['25/01/2025', 'Workshop Gestão Financeira', 'Workshops', 'Finanças', 15000, 'Múltiplos', ''],
  ];
  const receitasSheet = XLSX.utils.aoa_to_sheet(receitasData);
  receitasSheet['!cols'] = [
    { wch: 12 }, { wch: 40 }, { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 25 }, { wch: 30 }
  ];
  XLSX.utils.book_append_sheet(workbook, receitasSheet, 'Receitas');

  // Aba de Despesas
  const despesasData = [
    ['MODELO DE IMPORTAÇÃO - DESPESAS'],
    ['Preencha os dados abaixo seguindo o formato indicado. Remova esta linha de instrução antes de importar.'],
    [''],
    ['Data', 'Descrição', 'Categoria', 'Subcategoria', 'Valor', 'Centro de Custo', 'Fornecedor'],
    ['05/01/2025', 'Aluguel Escritório', 'Despesas Administrativas', 'Aluguel', 8500, 'Administrativo', 'Imobiliária Central'],
    ['10/01/2025', 'Salários Equipe', 'Despesas com Pessoal', 'Salários', 45000, 'RH', ''],
    ['15/01/2025', 'Software e Licenças', 'Tecnologia', 'Licenças', 2800, 'TI', 'TechSoft Sistemas'],
    ['20/01/2025', 'Marketing Digital', 'Marketing', 'Digital', 5500, 'Marketing', 'Agência Digital Plus'],
  ];
  const despesasSheet = XLSX.utils.aoa_to_sheet(despesasData);
  despesasSheet['!cols'] = [
    { wch: 12 }, { wch: 40 }, { wch: 25 }, { wch: 20 }, { wch: 12 }, { wch: 18 }, { wch: 25 }
  ];
  XLSX.utils.book_append_sheet(workbook, despesasSheet, 'Despesas');

  // Aba de Fornecedores
  const fornecedoresData = [
    ['MODELO DE IMPORTAÇÃO - FORNECEDORES'],
    ['Preencha os dados abaixo seguindo o formato indicado. Remova esta linha de instrução antes de importar.'],
    [''],
    ['Nome', 'Tipo', 'Categoria', 'Status', 'Email', 'Telefone'],
    ['TechSoft Sistemas', 'Fornecedor', 'Tecnologia', 'Ativo', 'vendas@techsoft.com.br', '(11) 4567-8901'],
    ['Imobiliária Central', 'Fornecedor', 'Imobiliário', 'Ativo', 'locacao@imobcentral.com.br', '(11) 3456-7892'],
    ['Papelaria Express', 'Fornecedor', 'Suprimentos', 'Ativo', 'pedidos@papelariaexpress.com.br', '(11) 2345-6780'],
  ];
  const fornecedoresSheet = XLSX.utils.aoa_to_sheet(fornecedoresData);
  fornecedoresSheet['!cols'] = [
    { wch: 25 }, { wch: 12 }, { wch: 15 }, { wch: 10 }, { wch: 30 }, { wch: 18 }
  ];
  XLSX.utils.book_append_sheet(workbook, fornecedoresSheet, 'Fornecedores');

  // Aba de Clientes
  const clientesData = [
    ['MODELO DE IMPORTAÇÃO - CLIENTES'],
    ['Preencha os dados abaixo seguindo o formato indicado. Remova esta linha de instrução antes de importar.'],
    [''],
    ['Nome', 'Tipo', 'Categoria', 'Status', 'Email', 'Telefone'],
    ['Empresa ABC S.A.', 'Cliente', 'Grandes Empresas', 'Ativo', 'contato@empresaabc.com.br', '(11) 3456-7890'],
    ['Grupo XYZ Ltda', 'Cliente', 'Médias Empresas', 'Ativo', 'comercial@grupoxyz.com.br', '(11) 2345-6789'],
    ['Premium Corp', 'Cliente', 'Grandes Empresas', 'Ativo', 'financeiro@premiumcorp.com.br', '(21) 3456-7890'],
  ];
  const clientesSheet = XLSX.utils.aoa_to_sheet(clientesData);
  clientesSheet['!cols'] = [
    { wch: 25 }, { wch: 12 }, { wch: 18 }, { wch: 10 }, { wch: 30 }, { wch: 18 }
  ];
  XLSX.utils.book_append_sheet(workbook, clientesSheet, 'Clientes');

  // Gerar e baixar arquivo
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'modelo_importacao_carvalho.xlsx';
  link.click();
  
  URL.revokeObjectURL(url);
}

// Gera modelo de balancete para download
export function generateBalanceteTemplate() {
  const workbook = XLSX.utils.book_new();

  const balanceteData = [
    ['MODELO DE IMPORTAÇÃO - BALANCETE ANUAL'],
    ['Preencha os valores do balancete. Remova esta linha de instrução antes de importar.'],
    [''],
    ['Conta', 'Descrição', 'Saldo Anterior', 'Débito', 'Crédito', 'Saldo Atual'],
    ['1.1.01', 'Caixa', 50000, 120000, 95000, 75000],
    ['1.1.02', 'Bancos', 150000, 450000, 380000, 220000],
    ['1.2.01', 'Clientes a Receber', 85000, 180000, 165000, 100000],
    ['2.1.01', 'Fornecedores a Pagar', 45000, 60000, 75000, 60000],
    ['3.1.01', 'Receita de Serviços', 0, 0, 850000, 850000],
    ['4.1.01', 'Despesas Operacionais', 0, 520000, 0, 520000],
    ['4.1.02', 'Despesas Administrativas', 0, 180000, 0, 180000],
    ['4.1.03', 'Impostos e Taxas', 0, 95000, 0, 95000],
  ];
  
  const sheet = XLSX.utils.aoa_to_sheet(balanceteData);
  sheet['!cols'] = [
    { wch: 10 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
  ];
  XLSX.utils.book_append_sheet(workbook, sheet, 'Balancete');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'modelo_balancete_carvalho.xlsx';
  link.click();
  
  URL.revokeObjectURL(url);
}
