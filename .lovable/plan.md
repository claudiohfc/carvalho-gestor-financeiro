

# Plano de Alteracoes - 4 Modulos

## 1. Dashboard Administrativo - Remover Metricas de Eficiencia

**Arquivo:** `src/pages/DashboardAdministrativo.tsx`

- Remover o card "Metricas de Eficiencia" (linhas 145-179) com as progress bars
- Remover o KPI "Taxa de Utilizacao" (linhas 69-84) que depende de `efficiencyMetrics`
- Alterar grid do topo de `grid-cols-3` para `grid-cols-2` (manter apenas Custo Operacional Total e Orcamento Disponivel)
- Alterar o grid de graficos de `grid-cols-2` para coluna unica (o grafico de custos ocupa largura total)
- Remover imports nao utilizados: `Gauge`, `efficiencyMetrics`, `TrendingUp`, `TrendingDown`, `Minus`

## 2. Simulador de Cenarios - Expandir Precos e Remover Perda de Cliente

**Arquivo:** `src/pages/SimuladorCenarios.tsx`

### Remover Perda de Cliente
- Remover tab trigger "Perda de Cliente" (linha 165)
- Remover todo o TabsContent value="cliente" (linhas 328-393)
- Remover interface `ClientLossInputs`, estado `clientLoss`, calculo `lossResult`, default `defaultClientLoss`
- Remover import `UserMinus`
- Alterar `grid-cols-3` do TabsList para `grid-cols-2`

### Expandir Simulacao de Precos
No painel lateral de indices (linhas 262-276), adicionar:

**Novos indices de mercado:**
- INPC (input %)
- IGP-DI (input %)
- Selic (input %)
- CDI (input %)

**Opcao de Valores Aleatorios:**
- Input "Minimo %" e "Maximo %"
- Botao "Aplicar Aleatorio" que gera percentual random entre min e max para cada produto

**Formulario de Indice Personalizado:**
- Card separado com titulo "Criar Indice Personalizado"
- Campos: Nome do Indice (Input text), Percentual (Input number %)
- Botao "Adicionar Indice"
- Lista dos indices personalizados criados com botao "Aplicar" e "Excluir"
- Estado local: `customIndices: { id: string; name: string; value: number }[]`

**Novos botoes de aplicacao:**
- Aplicar INPC, Aplicar IGP-DI, Aplicar Selic, Aplicar CDI
- Aplicar Aleatorio

## 3. Precificacao - Todos os Campos Visiveis na Tabela

**Arquivo:** `src/pages/Precificacao.tsx`

Alterar `renderTable` para exibir TODAS as colunas diretamente na tabela, sem depender de expansao:

**Colunas completas:**
Codigo | Categoria | Nome | Descricao | Unidade | Custos Fixos | Custos Variaveis | Tempo Prep. | Valor Hora | Mao de Obra (%) | Mao de Obra (R$) | Margem | Markup | Custo Base | Impostos | Valor Imposto | Preco Final | Acoes

- Tabela com `overflow-x-auto` para scroll horizontal
- Manter a funcionalidade de expandir para ver composicao visual com chips coloridos
- Coluna Impostos mostra tipo concatenado, coluna Valor Imposto mostra total

## 4. Meus Registros - Verificar e Corrigir Formulario

**Arquivo:** `src/components/registros/RegistroFormDialog.tsx` e `src/pages/MeusRegistros.tsx`

O componente `RegistroFormDialog` ja existe e esta importado na pagina (linha 141). Verificar se ha algum problema de renderizacao. O componente ja possui:
- Tabs Entrada (Nota Fiscal) / Saida (Pagamento)
- Todos os campos especificados no plano
- Validacao visual e calculo automatico do valor liquido

Se o botao "Incluir Registro" nao esta visivel ou funcional, garantir que:
- O componente esta renderizando corretamente na linha 141
- O Dialog abre ao clicar
- Nenhum erro de runtime impede a renderizacao

## Arquivos Modificados

```text
src/pages/DashboardAdministrativo.tsx   (remover eficiencia)
src/pages/SimuladorCenarios.tsx         (expandir precos, remover perda)
src/pages/Precificacao.tsx              (tabela completa com todas colunas)
src/components/registros/RegistroFormDialog.tsx  (verificar/corrigir se necessario)
```

## Ordem de Implementacao

1. DashboardAdministrativo - remover metricas de eficiencia
2. SimuladorCenarios - remover perda de cliente, expandir indices
3. Precificacao - expandir colunas da tabela
4. MeusRegistros - verificar e garantir funcionamento do formulario

