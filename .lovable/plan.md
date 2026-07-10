# Plano de Correções Pontuais

## Objetivo
Aplicar seis correções específicas solicitadas sem alterar outras partes do projeto.

## Alterações

### 1. Registrar rota `/lancamentos` no `App.tsx`
- Adicionar import: `import Lancamentos from "./pages/Lancamentos";`
- Adicionar rota protegida: `<Route path="/lancamentos" element={<ProtectedRoute><Lancamentos /></ProtectedRoute>} />` logo após `/registros`.

### 2. Limpar o `src/App.css`
- Substituir todo o conteúdo por um comentário explicativo, removendo o `#root` com `max-width` e `text-align: center` que limitam o layout.

### 3. Corrigir logout funcional na página `Perfil.tsx`
- Adicionar imports: `useNavigate` e `useAuth`.
- Obter `navigate` e `signOut` dentro do componente.
- Substituir `handleLogout` por versão que chama `signOut()` e redireciona para `/login` ou exibe toast de erro.

### 4. Sincronizar margem do `MainLayout.tsx` com a Sidebar
- Ajustar o layout para que a margem esquerda do conteúdo principal acompanhe a largura real da Sidebar (260px expandida / 70px colapsada), eliminando o espaço excedente causado por `ml-[280px]` fixo.

### 5. Renomear `viteenvd.ts` para `vite-env.d.ts`
- Renomear o arquivo em `src/` mantendo o conteúdo `/// <reference types="vite/client" />`.

### 6. Remover dependência do `next-themes` no `sonner.tsx`
- Substituir o conteúdo de `src/components/ui/sonner.tsx` por uma versão compatível com Vite + React puro, importando `Toaster` e `toast` diretamente de `sonner`.

## Validação
- Verificar compilação/TypeScript após as alterações.
- Confirmar que a rota `/lancamentos` está acessível.
- Confirmar que o logout em Perfil redireciona para `/login`.
- Confirmar que o layout não apresenta barras de rolagem horizontais indesejadas.

## Arquivos que serão modificados
- `src/App.tsx`
- `src/App.css`
- `src/pages/Perfil.tsx`
- `src/components/layout/MainLayout.tsx`
- `src/viteenvd.ts` (renomeado para `src/vite-env.d.ts`)
- `src/components/ui/sonner.tsx`