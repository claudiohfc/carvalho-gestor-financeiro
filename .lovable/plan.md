
# Plano de Implementacao - Minha Empresa (Cadastros e Estrutura Base)

## Resumo Executivo

Este plano implementa a nova secao **Minha Empresa** como um modulo completo de cadastros organizacionais, com navegacao por abas internas para gerenciamento de dados da empresa, colaboradores, contas bancarias, plano de contas e metas de receita. Toda a implementacao segue os padroes ja existentes no projeto usando dados mockados e estado local.

---

## 1. Nova Entrada no Menu Lateral

### Alteracao na Sidebar

**Arquivo:** `src/components/layout/Sidebar.tsx`

**Modificacoes:**
- Adicionar novo item de navegacao "Minha Empresa" apos "Importacao de Dados"
- Icone: `Building` do lucide-react
- Rota: `/empresa`

**Posicao no menu:**
```text
- Home
- Minha Empresa  <- NOVA
- Dashboard Financeiro
- Dashboard Fiscal
- Conciliacao Bancaria
- Meus Registros
- Lancamentos
- Clientes e Fornecedores
- Importacao de Dados
- [Perfil no rodape]
```

---

## 2. Estrutura de Dados - Novo Arquivo

### mockCompanyData.ts

**Arquivo:** `src/data/mockCompanyData.ts`

**Interfaces a criar:**

```text
CompanyData:
  - name: string
  - cnpj: string
  - website: string
  - sector: string
  - productTypes: string
  - services: string
  - averageMonthlyRevenue: number

Partner:
  - id: string
  - name: string
  - role: string
  - phone: string
  - cpf: string

Employee:
  - id: string
  - name: string
  - role: string
  - phone: string
  - cpf: string

Contractor:
  - id: string
  - name: string
  - activities: string
  - phone: string
  - cpf: string

BankAccount:
  - id: string
  - bankName: string
  - accountNumber: string
  - currentBalance: number
  - totalEntries: number
  - totalExits: number
  - bankFees: number
  - paidTaxes: number
  - pendingTaxes: number

AccountCategory:
  - id: string
  - description: string
  - type: 'receita' | 'despesa'
  - dreRange: string

AccountSubcategory:
  - id: string
  - description: string
  - type: 'receita' | 'despesa'
  - dreRange: string
  - categoryId: string

RevenueGoal:
  - id: string
  - period: string
  - targetValue: number
  - currentValue: number
  - status: 'on_track' | 'at_risk' | 'achieved' | 'missed'
```

**Dados mockados iniciais:**
- 1 empresa (Carvalho Consultores)
- 3 socios
- 5 funcionarios
- 3 terceiros
- 3 contas bancarias
- 10 categorias do plano de contas
- 15 subcategorias
- 6 metas de receita (mensal e trimestral)

**Funcoes auxiliares:**
- `calculateSectorResult()` - Calculo de resultado do setor
- `calculateContributionMargin()` - Calculo de margem de contribuicao
- `calculateProfitability()` - Calculo de lucratividade
- `getGoalProgress()` - Porcentagem de progresso das metas

---

## 3. Componentes da Pagina Minha Empresa

### 3.1 Estrutura Principal com Abas

**Arquivo:** `src/pages/MinhaEmpresa.tsx`

**Layout com Tabs (shadcn/ui):**

```text
+----------------------------------------------------------+
| Minha Empresa                                             |
| "Configuracoes e cadastros da organizacao"                |
+----------------------------------------------------------+
| [Dados Gerais] [Pessoas] [Contas] [Categorias] [Sub] [Metas]|
+----------------------------------------------------------+
|                                                          |
|              [Conteudo da aba selecionada]               |
|                                                          |
+----------------------------------------------------------+
```

**Abas:**
1. Dados Gerais
2. Pessoas (Socios, Funcionarios, Terceiros)
3. Contas Bancarias
4. Categorias
5. Subcontas
6. Metas de Receita

---

### 3.2 Aba 1 - Dados Gerais da Empresa

**Componente:** `src/components/company/CompanyGeneralTab.tsx`

**Secao Empresa (Formulario):**
| Campo | Tipo | Placeholder |
|-------|------|-------------|
| Nome da empresa | Input text | Razao social |
| CNPJ | Input text | 00.000.000/0000-00 |
| Site | Input text | www.exemplo.com.br |
| Setor | Select | Selecione o setor |
| Produtos vendidos | Textarea | Descreva os produtos |
| Servicos prestados | Textarea | Descreva os servicos |
| Faturamento medio mensal | Input number | R$ 0,00 |

**Secao Pessoas (Visualizacao resumida):**
- Mini-tabela com socios (nome, cargo)
- Mini-tabela com funcionarios (nome, cargo)
- Mini-tabela com terceiros (nome, atividades)

**Cards de Metricas do Setor (ao final):**
| Card | Titulo | Calculo |
|------|--------|---------|
| 1 | Resultado do Setor | Receitas - Despesas do setor |
| 2 | Margem de Contribuicao | (Receita - Custos Variaveis) / Receita |
| 3 | Lucratividade Final | Lucro Liquido / Receita Total |

**Comportamento:**
- Botao "Salvar Alteracoes" com loading state
- Toast de sucesso ao salvar
- Cards com animacao fade-in

---

### 3.3 Aba 2 - Socios, Funcionarios e Terceiros

**Componente:** `src/components/company/PeopleTab.tsx`

**Sub-abas internas (Tabs aninhadas):**

```text
+-------------------------------------------------+
| [Socios] [Funcionarios] [Terceiros]             |
+-------------------------------------------------+
| Tabela + Formulario de adicao/edicao            |
+-------------------------------------------------+
```

**Estrutura para cada sub-aba:**

**Tabela:**
| Coluna | Socios | Funcionarios | Terceiros |
|--------|--------|--------------|-----------|
| Nome | X | X | X |
| Cargo/Atividades | X | X | X |
| Telefone | X | X | X |
| CPF | X | X | X |
| Acoes | X | X | X |

**Acoes por linha:**
- Editar (abre dialog)
- Remover (com confirmacao)

**Dialog de Adicao/Edicao:**
- Campos conforme tipo (socio/funcionario/terceiro)
- Botao Salvar com validacao
- Botao Cancelar

---

### 3.4 Aba 3 - Contas Bancarias

**Componente:** `src/components/company/BankAccountsTab.tsx`

**Layout:**

```text
+----------------------------------------------------------+
| Contas Bancarias                    [+ Nova Conta]        |
+----------------------------------------------------------+
| Banco     | Conta   | Saldo   | Entradas | Saidas | Acoes|
|-----------|---------|---------|----------|--------|------|
| BB        | 12345-6 | R$45k   | R$120k   | R$75k  | [E][X]|
| Itau      | 98765-4 | R$28k   | R$85k    | R$57k  | [E][X]|
+----------------------------------------------------------+
```

**Campos do formulario (Dialog):**
| Campo | Tipo |
|-------|------|
| Nome do Banco | Input text |
| Agencia do banco| Input Text |
| Numero da Conta | Input text |
| Saldo Atual | Input number |
| Total de Entradas | Input number |
| Total de Saidas | Input number |
| Tarifas Bancarias | Input number |
| Taxas Pagas | Input number |
| Taxas Devidas | Input number |

**Cards resumo no topo:**
- Saldo Total (soma de todas as contas)
- Total de Tarifas
- Taxas Pendentes

---

### 3.5 Aba 4 - Categorias do Plano de Contas

**Componente:** `src/components/company/CategoriesTab.tsx`

**Layout:**

```text
+----------------------------------------------------------+
| Categorias do Plano de Contas       [+ Nova Categoria]    |
+----------------------------------------------------------+
| Descricao              | Tipo     | Faixa DRE    | Acoes |
|------------------------|----------|--------------|-------|
| Receita de Servicos    | Receita  | 3.1          | [E][X]|
| Despesas Operacionais  | Despesa  | 4.2          | [E][X]|
+----------------------------------------------------------+
```

**Campos do formulario:**
| Campo | Tipo |
|-------|------|
| Descricao | Input text |
| Tipo | Select (Receita/Despesa) |
| Faixa no DRE | Input text |

---

### 3.6 Aba 5 - Subcontas do Plano de Contas

**Componente:** `src/components/company/SubcategoriesTab.tsx`

**Layout identico ao de Categorias, com adicao de:**
- Coluna "Categoria Pai" (Select vinculado)

**Campos do formulario:**
| Campo | Tipo |
|-------|------|
| Descricao | Input text |
| Tipo | Select (Receita/Despesa) |
| Categoria Pai | Select (lista de categorias) |
| Faixa no DRE | Input text |

---

### 3.7 Aba 6 - Metas de Receita

**Componente:** `src/components/company/RevenueGoalsTab.tsx`

**Layout:**

```text
+----------------------------------------------------------+
| Metas de Receita                    [+ Nova Meta]         |
+----------------------------------------------------------+
| [Card Meta Jan/2026]  [Card Meta Fev/2026]  [Card T1/2026]|
| R$ 150.000,00         R$ 180.000,00         R$ 500.000,00 |
| Realizado: R$ 142k    Realizado: R$ 95k     Realizado:R$380k|
| [========95%=====]    [====53%====       ]  [====76%===   ]|
| Status: On Track      Status: Em Risco      Status: Em Risco|
+----------------------------------------------------------+
```

**Estrutura do Card de Meta:**
- Titulo (periodo)
- Valor da Meta
- Valor Realizado
- Progress bar com porcentagem
- Badge de status (cores)
- Botoes Editar/Excluir

**Status e cores:**
| Status | Cor | Condicao |
|--------|-----|----------|
| Alcancada | Verde | >= 100% |
| On Track | Azul | >= 80% e < 100% |
| Em Risco | Amarelo | >= 50% e < 80% |
| Atrasada | Vermelho | < 50% |

**Dialog de Adicao/Edicao:**
| Campo | Tipo |
|-------|------|
| Periodo | Input text (ex: Jan/2026, T1/2026) |
| Valor da Meta | Input number |
| Valor Realizado | Input number |

---

## 4. Estrutura de Arquivos

### Novos Arquivos
```text
src/
  pages/
    MinhaEmpresa.tsx               (pagina principal com abas)
  data/
    mockCompanyData.ts             (dados mockados)
  components/
    company/
      CompanyGeneralTab.tsx        (aba dados gerais)
      PeopleTab.tsx                (aba pessoas)
      BankAccountsTab.tsx          (aba contas bancarias)
      CategoriesTab.tsx            (aba categorias)
      SubcategoriesTab.tsx         (aba subcontas)
      RevenueGoalsTab.tsx          (aba metas)
      SectorMetricCard.tsx         (card metricas setor)
      GoalCard.tsx                 (card de meta individual)
```

### Arquivos Modificados
```text
src/
  App.tsx                          (nova rota /empresa)
  components/
    layout/
      Sidebar.tsx                  (novo item menu)
```

---

## 5. Ordem de Implementacao

1. **mockCompanyData.ts** - Criar dados mockados e interfaces
2. **Sidebar.tsx** - Adicionar item de menu
3. **App.tsx** - Adicionar rota
4. **MinhaEmpresa.tsx** - Estrutura principal com Tabs
5. **CompanyGeneralTab.tsx** - Aba de dados gerais
6. **SectorMetricCard.tsx** - Cards de metricas do setor
7. **PeopleTab.tsx** - Aba de pessoas com sub-abas
8. **BankAccountsTab.tsx** - Aba de contas bancarias
9. **CategoriesTab.tsx** - Aba de categorias
10. **SubcategoriesTab.tsx** - Aba de subcontas
11. **GoalCard.tsx** - Card individual de meta
12. **RevenueGoalsTab.tsx** - Aba de metas de receita

---

## 6. Padroes Visuais e UX

### Consistencia com o projeto:
- Usar `MainLayout` e `Header` existentes
- Aplicar classes `glass-card`, `border-border`, `bg-card`
- Usar componentes shadcn/ui (Tabs, Dialog, Table, Input, Select, Badge, Progress)
- Icones lucide-react
- Animacoes `animate-fade-in`

### Microinteracoes:
- Loading states em todos os formularios
- Toast de sucesso/erro nas operacoes
- Empty states nas tabelas vazias
- Hover states nos cards e linhas da tabela
- Confirmacao ao deletar registros

### Validacoes:
- Campos obrigatorios marcados com *
- Formatacao de CNPJ e CPF
- Valores monetarios formatados
- Mensagens de erro em vermelho

---

## 7. Exemplo Visual - Aba de Metas

```text
+----------------------------------------+
| Jan/2026                    [Editar]   |
+----------------------------------------+
| Meta: R$ 150.000,00                    |
| Realizado: R$ 142.500,00               |
|                                        |
| [================95%================]  |
|                                        |
| [Badge: On Track - verde]              |
+----------------------------------------+
```

---

## 8. Detalhes Tecnicos

### Gerenciamento de Estado:
- useState para cada aba (dados locais)
- Estados separados para formularios de edicao/criacao
- Estados para controle de dialogs

### Formatacao:
- CNPJ: XX.XXX.XXX/XXXX-XX
- CPF: XXX.XXX.XXX-XX
- Telefone: (XX) XXXXX-XXXX
- Moeda: R$ XX.XXX,XX

### Calculo de Metricas do Setor:
- Resultado = Receitas Totais - Despesas Totais
- Margem de Contribuicao = (Receita - Custos Variaveis) / Receita * 100
- Lucratividade = Lucro Liquido / Receita Total * 100
