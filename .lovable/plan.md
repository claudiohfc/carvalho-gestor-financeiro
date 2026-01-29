

# Plano de Implementacao - Pagina Home (Centro Operacional)

## Resumo Executivo

Este plano cria a pagina **Home** como o centro operacional do sistema financeiro, com visao consolidada de contas a receber, contas a pagar, projecao financeira e inadimplencia de clientes e fornecedores. A rota atual "/" sera redirecionada para a nova Home, e o Dashboard Financeiro sera movido para "/financeiro".

---

## 1. Alteracoes na Navegacao

### 1.1 Atualizacao do Menu Lateral

**Sidebar.tsx - Nova estrutura de navegacao:**

```text
- Home (novo) -> /
- Dashboard Financeiro -> /financeiro (renomeado de /)
- Dashboard Fiscal -> /fiscal
- Conciliacao Bancaria -> /conciliacao
- Meus Registros -> /registros
- Lancamentos -> /lancamentos
- Clientes e Fornecedores -> /cadastros
- Importacao de Dados -> /importacao
```

**Icone da Home:** `Home` do lucide-react

### 1.2 Atualizacao das Rotas

**App.tsx - Novas rotas:**
- `/` -> Home (nova pagina)
- `/financeiro` -> DashboardFinanceiro (movido)

---

## 2. Estrutura de Dados - Novo Arquivo

### 2.1 mockHomeData.ts

Novo arquivo com dados mockados especificos para a Home:

**Interfaces:**
```text
- Receivable: id, clientName, value, dueDate, status (em_aberto | proximo_vencer | vencido)
- Payable: id, supplierName, value, dueDate, status (em_aberto | proximo_vencer | vencido)
- AccountBalance: bankName, balance, lastUpdate
```

**Dados gerados:**
- 15-20 contas a receber com datas variadas
- 15-20 contas a pagar com datas variadas
- Saldo de conta bancaria simulado

**Funcoes auxiliares:**
- `getReceivablesByStatus()` - Filtra contas a receber por status
- `getPayablesByStatus()` - Filtra contas a pagar por status
- `calculateProjection()` - Gera dados para grafico de projecao
- `getTotalsByPeriod()` - Calcula totais com filtro de periodo

---

## 3. Componentes da Pagina Home

### 3.1 Layout Geral

```text
+----------------------------------------------------------+
| Home                                                      |
| "Bem-vindo ao seu sistema financeiro"                    |
+----------------------------------------------------------+
| [Contas a Receber] [A Receber Atraso] [Pagar Mes] [Atraso]|
+----------------------------------------------------------+
| [Saldo em Conta]        [Despesas a Pagar no Mes]        |
+----------------------------------------------------------+
| [Grafico de Projecao Financeira - Linha]                 |
| Filtros: 15 dias | 30 dias | 45 dias                     |
+----------------------------------------------------------+
| [Inadimplencia Clientes]    [Inadimplencia Fornecedores] |
| Abas: Em Aberto | Prox. | Vencidos | Abas: Prox. | Venc. |
+----------------------------------------------------------+
```

### 3.2 Cards de Resumo Financeiro (Linha 1)

**4 cards principais com layout semelhante ao KPICard existente:**

| Card | Titulo | Cor Destaque | Icone |
|------|--------|--------------|-------|
| 1 | Contas a Receber | Verde (success) | ArrowDownCircle |
| 2 | Contas a Receber em Atraso | Vermelho (destructive) | AlertCircle |
| 3 | Contas a Pagar no Mes | Amarelo (warning) | ArrowUpCircle |
| 4 | Contas a Pagar em Atraso | Vermelho (destructive) | AlertTriangle |

**Comportamento:**
- Cada card exibe valor total formatado em R$
- Filtro de periodo compartilhado no Header (Mes atual, 30 dias, 60 dias, 90 dias)
- Cards de atraso com borda vermelha e fundo sutil vermelho
- Animacao fade-in ao carregar

### 3.3 Cards de Caixa e Compromissos (Linha 2)

**2 cards maiores:**

| Card | Titulo | Informacao | Icone |
|------|--------|------------|-------|
| 1 | Saldo em Conta Atual | Saldo + nome do banco | Wallet |
| 2 | Despesas a Pagar no Mes | Total + contador de itens | CreditCard |

**Comportamento:**
- Filtro por mes (dropdown com meses do ano)
- Exibicao do mes selecionado
- Indicador visual se saldo for negativo

### 3.4 Grafico de Projecao Financeira

**Componente: ProjectionChart.tsx**

**Tipo:** Grafico de linhas horizontal (Recharts LineChart)

**Eixos:**
- X: Dias (1, 2, 3... ate 45)
- Y: Valores em R$

**Linhas:**
| Linha | Cor | Descricao |
|-------|-----|-----------|
| Contas a Receber | Verde (success) | Projecao de recebimentos |
| Contas a Pagar | Vermelho (destructive) | Projecao de pagamentos |
| Evolucao do Saldo | Azul (primary) | Saldo projetado dia a dia |

**Filtros de periodo (toggles):**
- 15 dias
- 30 dias (padrao)
- 45 dias

**Comportamento:**
- Atualizacao dinamica ao mudar filtro
- Tooltip mostrando valores de cada linha
- Legenda abaixo do grafico

### 3.5 Quadro de Inadimplencia de Clientes

**Componente: DelinquencyTable.tsx (reutilizavel)**

**Layout:**
```text
+----------------------------------------+
| Inadimplencia de Clientes              |
| [Em Aberto] [Prox. a Vencer] [Vencidos]|
+----------------------------------------+
| Cliente          | Valor    | Venc.    |
|------------------|----------|----------|
| Empresa ABC      | R$ 5.000 | 15/01/26 |
| Grupo XYZ        | R$ 3.200 | 10/01/26 |
+----------------------------------------+
| Total: R$ 8.200                        |
+----------------------------------------+
```

**Abas (Tabs do shadcn):**
1. Em Aberto - Contas nao vencidas
2. Proximos a Vencer - Vencimento em 7 dias
3. Vencidos - Contas ja vencidas

**Comportamento:**
- Ordenacao por data de vencimento
- Badge colorido por status
- Empty state quando nao houver dados
- Linha de total no rodape

### 3.6 Quadro de Inadimplencia por Fornecedor

**Mesmo componente DelinquencyTable.tsx com props diferentes**

**Abas:**
1. Proximos a Vencer
2. Vencidos

**Comportamento identico ao de clientes**

---

## 4. Estrutura de Arquivos

### Novos Arquivos
```text
src/
  pages/
    Home.tsx                     (pagina principal)
  data/
    mockHomeData.ts              (dados mockados)
  components/
    home/
      SummaryCard.tsx            (card de resumo)
      BalanceCard.tsx            (card de saldo/despesas)
      ProjectionChart.tsx        (grafico de projecao)
      DelinquencyTable.tsx       (tabela de inadimplencia)
```

### Arquivos Modificados
```text
src/
  App.tsx                        (novas rotas)
  components/
    layout/
      Sidebar.tsx                (novo item Home)
```

---

## 5. Detalhes de Implementacao

### 5.1 SummaryCard.tsx

**Props:**
```typescript
interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: 'default' | 'success' | 'warning' | 'danger';
  count?: number;
  isOverdue?: boolean;
}
```

**Comportamento visual:**
- Variante `danger` adiciona borda vermelha e fundo vermelho sutil
- Variante `success` adiciona borda verde
- Animacao de hover com scale sutil

### 5.2 ProjectionChart.tsx

**Props:**
```typescript
interface ProjectionChartProps {
  days: 15 | 30 | 45;
  onDaysChange: (days: 15 | 30 | 45) => void;
}
```

**Dados calculados:**
- Saldo inicial = saldo em conta atual
- Para cada dia, soma recebimentos e subtrai pagamentos
- Gera array de pontos para as 3 linhas

### 5.3 DelinquencyTable.tsx

**Props:**
```typescript
interface DelinquencyTableProps {
  type: 'cliente' | 'fornecedor';
  data: Array<{
    id: string;
    name: string;
    value: number;
    dueDate: string;
    status: string;
  }>;
}
```

---

## 6. Microinteracoes e UX

### Estados visuais:
- **Loading:** Skeleton em todos os cards enquanto simula carregamento inicial
- **Empty State:** Mensagem amigavel quando nao houver dados em cada aba
- **Hover:** Cards com elevacao sutil e mudanca de borda
- **Transicoes:** Fade-in suave ao trocar abas

### Feedback visual:
- Cores consistentes com o resto do sistema
- Badges coloridos por status (verde/amarelo/vermelho)
- Tooltips nos graficos com valores formatados

### Animacoes:
- Cards aparecem com stagger (um apos o outro)
- Grafico desenha linhas progressivamente
- Tabelas com transicao suave ao trocar aba

---

## 7. Ordem de Implementacao

1. **mockHomeData.ts** - Criar dados mockados e funcoes auxiliares
2. **SummaryCard.tsx** - Componente de card de resumo
3. **BalanceCard.tsx** - Componente de saldo e despesas
4. **ProjectionChart.tsx** - Grafico de projecao
5. **DelinquencyTable.tsx** - Tabela de inadimplencia
6. **Home.tsx** - Pagina completa integrando componentes
7. **Sidebar.tsx** - Adicionar item Home no menu
8. **App.tsx** - Atualizar rotas

---

## 8. Exemplo Visual dos Cards

### Card de Atraso (vermelho):
```text
+----------------------------------+
| [!] Contas a Receber em Atraso   |
|                                  |
|     R$ 15.420,00                 |
|     3 contas vencidas            |
|                                  |
| Borda vermelha sutil             |
+----------------------------------+
```

### Card de Saldo:
```text
+----------------------------------+
| [Wallet] Saldo em Conta Atual    |
|          Janeiro 2026            |
|                                  |
|     R$ 45.230,00                 |
|     Banco do Brasil              |
|                                  |
+----------------------------------+
```

---

## Detalhes Tecnicos

### Padroes a seguir:
- Usar mesma estrutura do MainLayout e Header
- Componentes shadcn/ui existentes (Card, Tabs, Badge, Select)
- Recharts para graficos (mesmo padrao do TrendChart)
- Formatacao de moeda com Intl.NumberFormat
- Classes CSS existentes (glass-card, kpi-card, etc.)

### Filtros globais:
- Header tera filtro de mes (Select com meses)
- Grafico tera filtros proprios de periodo (15/30/45 dias)

