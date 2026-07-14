
## Objetivo
Substituir o schema atual (transactions, people, bank_accounts, bank_statements, scenario_simulations, payroll_records, products_services) pelo novo schema em PT-BR solicitado, adaptado às regras do projeto (GRANTs, políticas SELECT/INSERT/UPDATE/DELETE separadas, trigger de updated_at).

## Aviso importante
- **Perda de dados:** DROP das tabelas antigas apaga todos os registros existentes. Não há backup automático.
- **Código quebrará temporariamente:** hooks e páginas usam as tabelas antigas (`useTransactions`, `usePeople`, `useBankReconciliation`, `usePayroll`, `usePricing`, `useSimulations`) — após a migração, o app não vai compilar/rodar até refatorarmos o código para as novas tabelas. Isso é um trabalho grande e será feito num próximo passo, não nesta migração.

## Migração (uma chamada única do supabase--migration)

1. **DROP** em cascata: `transactions`, `people`, `bank_accounts`, `bank_statements`, `scenario_simulations`, `payroll_records`, `products_services`.
2. **CREATE TABLE** conforme o SQL do usuário, com pequenas correções:
   - Adicionar `updated_at TIMESTAMPTZ` onde faltar (apenas em `lancamentos` conforme original).
   - `user_id UUID NOT NULL` (sem `ON DELETE CASCADE` para auth.users — segue convenção do projeto de não referenciar auth.users diretamente; usar apenas `NOT NULL` e validar via RLS).
3. **GRANT** para cada tabela pública:
   ```
   GRANT SELECT, INSERT, UPDATE, DELETE ON public.<t> TO authenticated;
   GRANT ALL ON public.<t> TO service_role;
   ```
4. **ENABLE RLS** em todas as 7 tabelas.
5. **Políticas** — trocar `FOR ALL` por 4 políticas separadas (SELECT, INSERT, UPDATE, DELETE) usando `auth.uid() = user_id`, conforme boas práticas do projeto.
6. **Índices** conforme solicitado.
7. **Trigger `update_updated_at_column()`** aplicado em `lancamentos`.

## Tabelas criadas
`lancamentos`, `cadastros`, `extratos`, `extrato_linhas`, `regras_classificacao`, `simulacoes`, `conciliacoes`.

## Fora do escopo desta etapa
- Refatorar hooks (`useTransactions` → `useLancamentos`, etc.) e páginas para o novo schema.
- Regenerar tipos: acontece automaticamente após aprovação da migração.

Depois de você aprovar e a migração rodar, te aviso o que quebrou no código e proponho um segundo plano para adaptar os hooks/páginas.
