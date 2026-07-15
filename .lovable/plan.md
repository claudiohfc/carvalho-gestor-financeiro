## Objetivo
Migrar hooks e páginas dos stubs atuais para as 7 novas tabelas (`lancamentos`, `cadastros`, `extratos`, `extrato_linhas`, `regras_classificacao`, `simulacoes`, `conciliacoes`), restaurando persistência real de dados.

## Escopo grande — proponho executar em 4 fases, uma por resposta

Cada fase é aprovada/entregue separadamente para você validar antes de seguir. Assim evitamos um PR gigante impossível de revisar.

### Fase 1 — Núcleo transacional (`lancamentos` + `cadastros`)
Impacto: página **Meus Registros**, **Lançamentos**, formulário `RegistroFormDialog`, e a página **Cadastros**.

- Criar `src/hooks/useLancamentos.ts` (CRUD com filtros por data/tipo/categoria).
- Criar `src/hooks/useCadastros.ts` (CRUD clientes/fornecedores/sócios/funcionários).
- Refatorar `MeusRegistros.tsx` e `RegistroFormDialog.tsx` para usar `useLancamentos` + `useCadastros` (campos: `tipo`, `data`, `data_vencimento`, `descricao`, `categoria`, `subcategoria`, `valor`, `centro_custo`, `cliente_fornecedor`, `forma_pagamento`, `origem`, `num_documento`, `observacoes`, `status`, `conciliado`).
- Refatorar `Lancamentos.tsx` e `Cadastros.tsx` para persistir no backend.
- Remover o stub `useTransactions.ts` (e o `usePeople.ts`) após portar as chamadas.

### Fase 2 — Conciliação bancária (`extratos`, `extrato_linhas`, `conciliacoes`, `regras_classificacao`)
Impacto: página **Conciliação**, importação de extratos.

- Criar `useExtratos`, `useExtratoLinhas`, `useConciliacoes`, `useRegrasClassificacao`.
- Refatorar `ConciliacaoBancaria.tsx` e `Importacao.tsx` (para OFX/CSV → `extrato_linhas`).
- Auto-match linha↔lançamento por valor + data aproximada, gravando `lancamento_id` e `conciliado=true`.
- Remover stub `useBankReconciliation.ts`.

### Fase 3 — Simulações (`simulacoes`)
- Criar `useSimulacoesDB` real (salvar/listar/apagar cenários com `input_data`/`result_data` JSONB).
- Refatorar `SimuladorCenarios.tsx` para persistir.
- Remover stub `useSimulations.ts`.

### Fase 4 — Dashboards + limpeza
- Trocar `mockData` por agregações reais em `Home`, `DashboardFinanceiro`, `DashboardAnalitico`, `DREGerencial`, `DashboardFiscal`, `DashboardAdministrativo` (queries agregadas sobre `lancamentos`).
- Remover stubs restantes (`usePayroll.ts`, `usePricing.ts` — se decidirmos manter fora do escopo do novo schema, viram flag "sem persistência" explícita).
- Ajustar tipos/labels e remover mocks obsoletos.

## O que decidir agora
Confirma que começo pela **Fase 1** já nesta próxima resposta? Se preferir outra ordem (ex.: começar pela Conciliação, já que você está nessa tela agora — rota `/conciliacao`), é só dizer.
