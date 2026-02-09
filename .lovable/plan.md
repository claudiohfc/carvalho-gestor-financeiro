
# Plano de Refino - Navegacao, Layout e Funcionalidades

## Resumo

Este plano aplica melhorias de navegacao, cria a aba Departamento Pessoal, adiciona cards expansiveis com explicacoes em todo o app, ajusta o Dashboard Administrativo e Analitico, e expande o Simulador de Cenarios. Nenhum fluxo existente sera quebrado.

---

## 1. Menu Lateral - Agrupamento de Dashboards

### Arquivo: `src/components/layout/Sidebar.tsx`

**Alteracoes:**
- Substituir a lista plana de navegacao por uma estrutura com grupo colapsavel "Dashboards"
- O grupo contera: Financeiro, Fiscal, Administrativo, Analitico
- Usar Collapsible do radix-ui (ja instalado) para expandir/recolher
- Adicionar item "Departamento Pessoal" com icone `Users` logo abaixo do grupo Dashboards
- Adicionar rota `/departamento-pessoal`
- O grupo inicia expandido se a rota ativa pertence ao grupo

**Estrutura final do menu:**
```text
Home
Dashboards (colapsavel)
  Financeiro
  Fiscal
  Administrativo
  Analitico
Departamento Pessoal     <- NOVO
DRE Gerencial
Simulador de Cenarios
Conciliacao Bancaria
Meus Registros
Lancamentos
Clientes e Fornecedores
Importacao de Dados
```

---

## 2. Cards - Ajuste Visual Global

### Arquivos afetados:
- `src/components/dashboard/KPICard.tsx`
- `src/components/home/SummaryCard.tsx`
- `src/components/home/BalanceCard.tsx`
- `src/components/home/ExecutivePanel.tsx`
- `src/index.css` (classes globais kpi-card)

**Alteracoes:**
- Reduzir padding de p-6 para p-4 nos cards
- Reduzir font-size dos valores de text-2xl/text-3xl para text-xl/text-2xl
- Reduzir font-size dos titulos de text-sm para text-xs
- Remover abreviacoes de texto (ex: "Dist. Lucros" -> "Distribuicao de Lucros")
- Ajustar gap entre cards de gap-4 para gap-3
- Reduzir tamanho dos icones de h-10 w-10 para h-8 w-8

---

## 3. Nova Aba - Departamento Pessoal

### Novos arquivos:
- `src/pages/DepartamentoPessoal.tsx`
- `src/data/mockPeopleData.ts`
- `src/components/people/PeopleSummaryCards.tsx`
- `src/components/people/PeopleTable.tsx`
- `src/components/people/FinancialTable.tsx`
- `src/components/people/PersonFormDialog.tsx`

### Arquivo modificado:
- `src/App.tsx` - Adicionar rota `/departamento-pessoal`

### 3.1 Dados Mockados (`mockPeopleData.ts`)

Interfaces:
- `Partner`: id, name, cpf, email, phone, startDate, endDate, prolabore, comissoes, reembolsos
- `Employee`: id, name, cpf, email, phone, startDate, endDate, salario, vt, va, beneficios, decimo1, decimo2, ferias, fgts, inss, ir
- `Contractor`: id, name, cpf, email, phone, startDate, endDate, retiradas, comissoes

Dados: 3 socios, 5 funcionarios, 3 terceiros com valores mensais e anuais.

Funcoes auxiliares:
- `getTotalPartnerCosts(period)` - Total gastos com socios
- `getTotalEmployeeCosts(period)` - Total gastos com funcionarios
- `getTotalContractorCosts(period)` - Total gastos com terceiros

### 3.2 Pagina Principal (`DepartamentoPessoal.tsx`)

Layout:
```text
+----------------------------------------------------------+
| Departamento Pessoal                                      |
| "Gestao de pessoas e custos com pessoal"                 |
+----------------------------------------------------------+
| Filtros: [Mes] [Ano]                                      |
+----------------------------------------------------------+
| [Total Socios] [Total Funcionarios] [Total Terceiros]    |
+----------------------------------------------------------+
| Quadro Socios        | Quadro Financeiro Socios          |
+----------------------------------------------------------+
| Quadro Funcionarios  | Quadro Financeiro Funcionarios    |
+----------------------------------------------------------+
| Quadro Terceiros     | Quadro Financeiro Terceiros       |
+----------------------------------------------------------+
```

### 3.3 Cards Resumo (Topo)
- 3 cards com totais de gastos por categoria
- Filtros por Mes e Ano (Select do shadcn)

### 3.4 Quadros de Cadastro
Tabelas com colunas: Nome, CPF, Email, Telefone, Data Inicio, Data Saida, Acoes
- Botao "+ Adicionar" abre Dialog com formulario
- Botao editar/excluir em cada linha
- Dialog de confirmacao para exclusao

### 3.5 Quadros Financeiros

**Socios:** Tabela com Nome, Pro-labore, Comissoes, Reembolsos, Total
- Filtros: Total, Mes, Ano

**Funcionarios:** Tabela com Nome, Salario, VT, VA, Beneficios, 13o (1a parcela), 13o (2a parcela), Ferias, FGTS, INSS, IR, Total
- Filtros: Total, Mes, Ano

**Terceiros:** Tabela com Nome, Retiradas, Comissoes, Total
- Filtros: Total, Mes, Ano

---

## 4. Home - Cards Expansiveis com Explicacao

### Arquivos afetados:
- `src/components/home/SummaryCard.tsx`
- `src/components/home/BalanceCard.tsx`
- `src/components/home/ExecutivePanel.tsx`
- `src/components/dashboard/KPICard.tsx`
- `src/pages/DashboardFinanceiro.tsx`

**Alteracao:**
- Adicionar prop `explanation?: string` a todos os componentes de card
- Usar Collapsible do radix-ui para expandir/recolher explicacao
- Botao discreto (ChevronDown/ChevronUp) no canto do card
- Ao expandir, mostrar texto explicativo em fundo sutil (bg-muted/30)
- Seguir o mesmo padrao de drill-down do Dashboard Analitico

**Explicacoes para cada card da Home:**
- Contas a Receber: "Total de valores a serem recebidos de clientes no periodo selecionado."
- Contas a Receber em Atraso: "Valores que ja ultrapassaram a data de vencimento e ainda nao foram recebidos."
- Contas a Pagar no Mes: "Soma de todos os compromissos financeiros com vencimento no mes vigente."
- Contas a Pagar em Atraso: "Compromissos financeiros que ja venceram e ainda nao foram pagos."
- Saldo em Conta: "Saldo disponivel na conta bancaria principal da empresa."
- Despesas a Pagar: "Total de despesas com vencimento previsto para o mes corrente."
- Cards do Painel Executivo: Explicacoes para Caixa Atual, Caixa Projetado, Lucro, Margem

**Aplicar em todos os dashboards:** O mesmo comportamento sera replicado nos KPIs do Dashboard Financeiro, Fiscal, Administrativo e Analitico.

---

## 5. Dashboard Financeiro - Ajustes de Layout

### Arquivo: `src/pages/DashboardFinanceiro.tsx`

**Alteracoes:**
- Secao "Despesas com Pessoal": trocar grid de 7 colunas para 4 colunas (lg:grid-cols-4)
- Aumentar padding interno dos cards de pessoal
- Remover abreviacoes: "Dist. Lucros" -> "Distribuicao de Lucros"
- Melhorar espacamento entre icone e texto
- Garantir que valores nao fiquem comprimidos

---

## 6. Dashboard Administrativo - Remover Pessoas, Expandir Custos

### Arquivo: `src/pages/DashboardAdministrativo.tsx`

**Alteracoes:**
- Remover completamente a secao "Indicadores de Pessoas" (linhas 232-274)
- Remover cards de "Total de Colaboradores" e "Custo por Colaborador" dos KPIs do topo
- Substituir por novos cards de custos operacionais detalhados:
  - Aluguel e Infraestrutura
  - Tecnologia e Software
  - Energia, Agua e Utilities
  - Material de Escritorio
  - Manutencao e Conservacao
  - Seguros
  - Servicos Contabeis
  - Marketing e Publicidade
  - Telefonia e Internet
  - Transporte e Logistica

### Arquivo: `src/data/mockAnalyticsData.ts`
- Expandir `operationalCosts` com as novas categorias detalhadas
- Remover ou mover `peopleMetrics` (mover para mockPeopleData se necessario)

---

## 7. Dashboard Analitico - Padronizacao e Ajustes

### Arquivo: `src/pages/DashboardAnalitico.tsx`

**Alteracoes:**
- Unificar todos os KPIs no mesmo formato visual (remover separacao entre "Prioritarios" e "Outros KPIs")
- Todos os cards usam o mesmo layout com Collapsible para explicacao
- Remover secao "Receita por Funcionario" (tabela de funcionarios, linhas 364-398)
- Adicionar secao "Receita por Produto" no lugar

### Arquivo: `src/data/mockAnalyticsData.ts`
- Adicionar dados de `productRevenues` (interface similar a `ServiceLine`)
- Produtos mockados: Consultoria, Treinamento, Assessoria, Software, Diagnostico, etc.

**Receita por Cliente e Receita por Produto:**
- Remover limitacao de "Top 10" (exibir todos os dados)
- Remover "Top clientes por faturamento" da descricao
- Alterar para "Todos os clientes do periodo" e "Todos os produtos do periodo"

---

## 8. Simulador de Cenarios - Expansao

### Arquivo: `src/pages/SimuladorCenarios.tsx`
### Arquivo: `src/data/mockAnalyticsData.ts`

### 8.1 Simulacao de Pessoas (Expandir aba "Contratar Novo Colaborador")

Dividir em 3 sub-abas:
- **Novo Socio:** Pro-labore, Comissoes, Reembolsos
- **Novo Funcionario:** Salario, VT, VA, Beneficios, 13o (1a e 2a parcela), Ferias, FGTS (% sobre salario), INSS (% sobre salario), IR (% sobre salario)
  - Cada item com campo de valor e percentual sobre o salario
  - Receita esperada por mes
- **Novo Terceiro:** Retiradas, Comissoes

### 8.2 Simulacao de Precos (Expandir aba "Aumentar Precos")

Adicionar lista de produtos com:
- Nome do produto
- Valor atual
- Percentual de reajuste (input)
- Valor final (calculado automaticamente)

Campo de indices de reajuste:
- IGPM (input %)
- IPCA (input %)
- Indice personalizado (input %)

Botao "Aplicar indice" que preenche automaticamente o percentual de reajuste de todos os produtos.

### 8.3 Simulacao de Perda de Cliente (Expandir aba existente)

Adicionar detalhamento de impactos:
- Impacto na Receita mensal e anual
- Impacto na Margem de Contribuicao
- Impacto no Caixa em 3, 6 e 12 meses
- Resultado Final projetado (antes e depois)

Adicionar linguagem orientada ao gestor:
- "Ao perder este cliente, sua receita mensal cairia X%"
- "Voce precisaria de Y novos clientes para compensar"
- "O tempo estimado para recuperacao e de Z meses"

---

## 9. Estrutura de Arquivos

### Novos Arquivos
```text
src/
  pages/
    DepartamentoPessoal.tsx
  data/
    mockPeopleData.ts
  components/
    people/
      PeopleSummaryCards.tsx
      PeopleTable.tsx
      FinancialTable.tsx
      PersonFormDialog.tsx
```

### Arquivos Modificados
```text
src/
  App.tsx                            (nova rota)
  components/
    layout/Sidebar.tsx               (grupo colapsavel + nova aba)
    dashboard/KPICard.tsx            (reducao visual + explicacao)
    home/SummaryCard.tsx             (reducao visual + explicacao)
    home/BalanceCard.tsx             (reducao visual + explicacao)
    home/ExecutivePanel.tsx          (reducao visual + explicacao)
  pages/
    Home.tsx                         (ajustes de gap)
    DashboardFinanceiro.tsx          (layout pessoal + explicacoes)
    DashboardAdministrativo.tsx      (remover pessoas + expandir custos)
    DashboardAnalitico.tsx           (padronizar + produto + sem limite)
    SimuladorCenarios.tsx            (expansao completa)
  data/
    mockAnalyticsData.ts             (novos dados operacionais + produtos)
  index.css                          (ajustes globais de cards)
```

---

## 10. Ordem de Implementacao

1. **Sidebar.tsx** - Grupo colapsavel de dashboards + item Departamento Pessoal
2. **App.tsx** - Nova rota
3. **index.css + KPICard + SummaryCard + BalanceCard** - Ajuste visual global de cards
4. **Cards expansiveis** - Adicionar explicacoes a todos os cards (Home, Dashboards)
5. **mockPeopleData.ts** - Dados mockados de pessoas
6. **Componentes people/** - Cards, tabelas, formularios
7. **DepartamentoPessoal.tsx** - Pagina completa
8. **DashboardFinanceiro.tsx** - Ajustes de layout pessoal
9. **DashboardAdministrativo.tsx** - Remover pessoas, expandir custos
10. **DashboardAnalitico.tsx** - Padronizar cards, trocar funcionario por produto
11. **SimuladorCenarios.tsx** - Expansao de simulacoes
12. **mockAnalyticsData.ts** - Novos dados operacionais e produtos
