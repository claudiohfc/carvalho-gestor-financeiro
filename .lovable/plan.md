Verificar as seis correções solicitadas e confirmar que já estão aplicadas no repositório, validando a consistência com uma build.

Todas as alterações solicitadas já foram encontradas no estado atual do código:

1. src/App.tsx — import de `Lancamentos` e rota `/lancamentos` já estão presentes.
2. src/App.css — contém apenas o comentário limpo, sem `max-width` ou `text-align` no `#root`.
3. src/pages/Perfil.tsx — já importa `useNavigate` e `useAuth`, e `handleLogout` chama `signOut()` + `navigate('/login')` com tratamento de erro.
4. src/components/layout/MainLayout.tsx — já usa `ml-[260px]` sincronizado com a largura da sidebar expandida.
5. src/vite-env.d.ts — já existe com o conteúdo correto; `src/viteenvd.ts` não existe mais.
6. src/components/ui/sonner.tsx — já usa apenas `sonner`, sem dependência de `next-themes`.

Em build mode:
- Revisar rapidamente cada um dos seis arquivos.
- Rodar a build/typecheck para garantir que não há erros de compilação.
- Aplicar apenas correções mínimas caso alguma inconsistência apareça durante a validação.
- Confirmar ao usuário quais arquivos foram verificados e que a build passou.