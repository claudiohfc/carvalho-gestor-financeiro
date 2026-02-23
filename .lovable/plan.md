

# Formulário de Inclusão - Meus Registros

## Arquivo Modificado

`src/pages/MeusRegistros.tsx`

## Alterações

### 1. Novo Dialog de Inclusão

Adicionar um `Dialog` controlado por estado `createDialogOpen` que abre ao clicar em um novo botão "+ Incluir Registro" (mantendo o botão existente "Novo Registro" que aponta para `/lancamentos`).

### 2. Seleção de Tipo via Tabs

No topo do formulário, usar `Tabs` com duas opções:
- **Entrada (Nota Fiscal)** - formulário para emissão de NF
- **Saída (Pagamento de Despesa)** - formulário para pagamento

### 3. Campos do Formulário - Entrada (Nota Fiscal)

| Campo | Componente | Obrigatório |
|-------|-----------|-------------|
| Número da Nota Fiscal | Input text | Sim |
| Série | Input text | Não |
| Data de Emissão | Input date | Sim |
| Data de Vencimento | Input date | Sim |
| Cliente | Select (clientes de `mockData`) | Sim |
| CNPJ/CPF do Cliente | Input text | Sim |
| Descrição do Serviço/Produto | Textarea | Sim |
| Categoria | Select (categorias de entrada) | Sim |
| Subcategoria | Select (dinâmico pela categoria) | Não |
| Valor Total | Input number | Sim |
| ISS (%) | Input number | Não |
| IRRF (%) | Input number | Não |
| Valor Líquido | Input readonly (calculado) | - |
| Centro de Custo | Select (`costCenters`) | Não |
| Observações | Textarea | Não |

Cálculo automático: `valorLiquido = valorTotal - (valorTotal * iss / 100) - (valorTotal * irrf / 100)`

### 4. Campos do Formulário - Saída (Pagamento de Despesa)

| Campo | Componente | Obrigatório |
|-------|-----------|-------------|
| Data do Pagamento | Input date | Sim |
| Data de Vencimento | Input date | Sim |
| Fornecedor | Select (fornecedores de `mockData`) | Sim |
| CNPJ/CPF do Fornecedor | Input text | Não |
| Descrição da Despesa | Textarea | Sim |
| Categoria | Select (categorias de despesa) | Sim |
| Subcategoria | Select (dinâmico) | Não |
| Valor | Input number | Sim |
| Forma de Pagamento | Select (Boleto, Transferência, PIX, Cartão, Débito Automático) | Sim |
| Número do Documento | Input text | Não |
| Centro de Custo | Select (`costCenters`) | Não |
| Observações | Textarea | Não |

### 5. Comportamento ao Submeter

- Validação visual dos campos obrigatórios (borda vermelha se vazio)
- Mapeia os dados do formulário para a interface `Transaction` existente
- Adiciona ao estado `data` via `setData`
- Toast de sucesso: "Registro incluído com sucesso"
- Fecha o Dialog e reseta o formulário
- O novo registro aparece na tabela imediatamente

### 6. Imports Adicionais

- `Tabs, TabsList, TabsTrigger, TabsContent` de `@/components/ui/tabs`
- `Label` de `@/components/ui/label`
- `Textarea` de `@/components/ui/textarea`
- `clients, subcategories, costCenters` de `@/data/mockData`
- `ScrollArea` de `@/components/ui/scroll-area`

### 7. UI/UX

- Dialog com `max-w-2xl` e `ScrollArea` para acomodar todos os campos
- Formulário em grid de 2 colunas para campos curtos, 1 coluna para textareas
- Valor Líquido calculado em tempo real com destaque visual (badge verde)
- Botões: "Cancelar" (outline) e "Salvar Registro" (primary)

