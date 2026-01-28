
# Plano de Implementação - Alteracoes e Expansoes

## Resumo Executivo

Este plano detalha as alteracoes solicitadas para o aplicativo Carvalho Consultores, incluindo melhorias nos dashboards, nova funcionalidade de importacao com modelo Excel, e a criacao da tela de Conciliacao Bancaria.

---

## 1. Dashboard Financeiro - Melhorias

### 1.1 KPI de Resultado com Porcentagem

**O que muda:**
- O card "Resultado" passara a exibir duas informacoes:
  - Valor absoluto em R$ (atual)
  - Porcentagem do resultado sobre o total de entradas
- Indicacao visual clara de lucro (+) ou prejuizo (-)

**Exemplo visual:**
```text
+---------------------------+
| Resultado                 |
| R$ 45.230,00             |
| +18.5% de margem         |
|        [icone lucro]      |
+---------------------------+
```

### 1.2 Grafico de Despesas - Todas as Categorias

**O que muda:**
- O grafico de barras passara a exibir TODAS as categorias cadastradas
- Categorias sem despesas no periodo aparecerao com valor zero
- Mantendo consistencia do balanco contabil

**Arquivos afetados:**
- `src/data/mockData.ts` - Funcao `getSpendingByCategory()` sera modificada
- `src/components/dashboard/SpendingChart.tsx` - Ajuste para exibir todas categorias

---

## 2. Dashboard Fiscal - Cards Individuais por Imposto

### 2.1 Novos KPIs por Imposto

**O que sera criado:**
- Cards individuais para cada tipo de imposto:
  - ISS, ICMS, IRPJ, CSLL, PIS, COFINS

**Layout proposto:**
```text
+-------+-------+-------+-------+-------+-------+
|  ISS  | ICMS  | IRPJ  | CSLL  |  PIS  |COFINS |
| R$4.2k| R$0   | R$8.9k| R$3.2k| R$1.8k| R$8.5k|
+-------+-------+-------+-------+-------+-------+
```

### 2.2 Filtros por Periodo

**O que sera adicionado:**
- Filtro especifico na pagina fiscal para:
  - Dia
  - Mes
  - Ano
- Os filtros afetarao tanto os cards de impostos quanto os graficos

**Arquivos afetados:**
- `src/pages/DashboardFiscal.tsx` - Adicao de cards e filtros
- `src/data/mockData.ts` - Expansao dos dados de impostos com datas

---

## 3. Importacao de Dados - Modelo Excel e Balancetes

### 3.1 Planilha Modelo para Download

**O que sera criado:**
- Botao de download de planilha modelo (.xlsx)
- A planilha contera 4 abas:
  1. **Receitas** - Campos: Data, Descricao, Categoria, Subcategoria, Valor, Cliente, Observacoes
  2. **Despesas** - Campos: Data, Descricao, Categoria, Subcategoria, Valor, Centro de Custo, Fornecedor
  3. **Fornecedores** - Campos: Nome, Tipo, Categoria, Status, Email, Telefone
  4. **Clientes** - Campos: Nome, Tipo, Categoria, Status, Email, Telefone
- Cada aba tera cabecalhos claros, exemplos preenchidos e instrucoes

**Implementacao:**
- Uso da biblioteca `xlsx` para gerar o arquivo Excel
- Dados de exemplo ja preenchidos para facilitar o entendimento

### 3.2 Upload de Balancetes Anuais

**O que sera adicionado:**
- Nova secao para upload de balancetes
- Ao importar, os valores serao convertidos em historico de movimentacoes
- Animacoes de loading e mensagem de sucesso

**Arquivos afetados:**
- `src/pages/Importacao.tsx` - Nova estrutura com download e upload de balancetes
- Instalacao do pacote `xlsx`

---

## 4. Nova Tela - Conciliacao Bancaria

### 4.1 Menu Lateral

**O que sera adicionado:**
- Nova opcao "Conciliacao Bancaria" no menu lateral
- Icone: `Scale` ou `GitCompare` do lucide

### 4.2 Funcionalidades da Tela

**Importacao de Extratos:**
- Area de upload para extratos bancarios (simulado)
- Formatos aceitos: CSV, OFX, XLS

**Leitura e Exibicao:**
- Tabela com lancamentos do extrato importado
- Colunas: Data, Descricao, Valor, Status

**Cruzamento Automatico:**
- Sistema cruza lancamentos do extrato com pagamentos em aberto
- Identificacao automatica de correspondencias

**Status Visual:**
- **Conciliado** (verde) - Lancamento encontrado no sistema
- **Pendente** (amarelo) - Aguardando acao do usuario
- **Divergente** (vermelho) - Valores ou datas nao coincidem

**Acoes Manuais:**
- Botao "Conciliar" - Marca como conciliado
- Botao "Ignorar" - Remove da lista de pendencias
- Tooltips e toasts para feedback

**Layout proposto:**
```text
+----------------------------------------------------------+
| Conciliacao Bancaria                                     |
| Importe extratos e concilie com os lancamentos do sistema|
+----------------------------------------------------------+
| [Upload de Extrato]  [Resumo: 15 conciliados | 3 pend.]  |
+----------------------------------------------------------+
| Data     | Descricao          | Valor     | Status | Acao|
|----------|-------------------|-----------|--------|------|
| 15/01    | Pagto Fornec ABC  | R$ 850,00 | [Conc] |  -   |
| 16/01    | Transf PIX        | R$ 500,00 | [Pend] | [OK] |
| 18/01    | Debito Energia    | R$ 420,00 | [Div]  | [?]  |
+----------------------------------------------------------+
```

**Arquivos a criar:**
- `src/pages/ConciliacaoBancaria.tsx` - Pagina principal
- `src/data/mockBankData.ts` - Dados mockados de extratos

**Arquivos a modificar:**
- `src/components/layout/Sidebar.tsx` - Adicionar item de menu
- `src/App.tsx` - Adicionar rota

---

## 5. Estrutura de Arquivos

### Novos Arquivos
```text
src/
  pages/
    ConciliacaoBancaria.tsx   (nova pagina)
  data/
    mockBankData.ts           (dados de extratos)
  utils/
    excelGenerator.ts         (geracao do modelo Excel)
```

### Arquivos Modificados
```text
src/
  components/
    layout/
      Sidebar.tsx             (novo item de menu)
    dashboard/
      SpendingChart.tsx       (exibir todas categorias)
  data/
    mockData.ts               (expandir dados fiscais)
  pages/
    DashboardFinanceiro.tsx   (KPI com porcentagem)
    DashboardFiscal.tsx       (cards por imposto + filtros)
    Importacao.tsx            (download modelo + balancetes)
  App.tsx                     (nova rota)
  package.json                (dependencia xlsx)
```

---

## 6. Dependencias

### Nova dependencia a instalar:
- **xlsx** - Para geracao e leitura de arquivos Excel

---

## 7. Ordem de Implementacao

1. **Dashboard Financeiro** - KPI com porcentagem (rapido)
2. **Dashboard Financeiro** - Grafico com todas categorias
3. **Dashboard Fiscal** - Cards individuais por imposto
4. **Dashboard Fiscal** - Filtros por periodo
5. **Importacao** - Modelo Excel para download
6. **Importacao** - Upload de balancetes
7. **Sidebar** - Adicionar menu Conciliacao
8. **Conciliacao Bancaria** - Tela completa

---

## Detalhes Tecnicos

### Geracao do Modelo Excel
- Utilizacao da biblioteca `xlsx` (SheetJS)
- Arquivo gerado no cliente (sem backend)
- Download via Blob URL

### Dados Mockados Adicionais
- Expansao de `taxRecords` com datas completas
- Adicao de ICMS aos impostos
- Dados de extrato bancario para conciliacao

### Microinteracoes
- Loading states em todas importacoes
- Toasts de sucesso/erro
- Empty states quando nao houver dados
- Animacoes de transicao nos status de conciliacao
