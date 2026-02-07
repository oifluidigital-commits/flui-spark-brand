
# Plano: Fluxo de Autenticacao com Coleta de Nome e Route Guards Estritos

## Problema Atual

1. O `ProtectedRoute` verifica apenas autenticacao, mas NAO bloqueia acesso a `/dashboard`, `/strategy`, `/content-lab` etc. quando `onboarding_status !== 'completed'`
2. Nao existe tela de coleta de nome para usuarios Google OAuth que nao possuem `full_name`
3. A `TopNavigation` e exibida mesmo durante o onboarding, permitindo navegacao lateral

---

## Alteracoes por Arquivo

### 1. `src/App.tsx`

**O que muda:**
- Criar um novo componente `OnboardingGuardedRoute` que:
  - Verifica `isAuthenticated` (senao, redireciona para `/login`)
  - Verifica `profile.name` (se vazio/null, redireciona para `/complete-profile`)
  - Verifica `profile.onboarding_status === 'completed'` (senao, redireciona para `/onboarding`)
  - Somente se todas as condicoes forem satisfeitas, renderiza `children`
- Aplicar `OnboardingGuardedRoute` em todas as rotas protegidas (`/dashboard`, `/strategy`, `/brand`, `/content-lab/*`, `/profile`, `/pricing`)
- Adicionar rota `/complete-profile` com `ProtectedRoute` (requer auth, mas nao onboarding)
- Manter `/onboarding` com `ProtectedRoute` simples (requer auth, mas nao onboarding completo)

### 2. `src/pages/CompleteProfile.tsx` (NOVO)

**O que faz:**
- Tela minimalista de coleta de nome
- Campo unico: nome completo
- Validacao: minimo 2 caracteres
- CTA: "Continuar diagnostico"
- Ao submeter:
  1. Atualiza `profiles.name` no banco via Supabase
  2. Atualiza `user.name` no AppContext
  3. Chama `refreshProfile()`
  4. Redireciona para `/onboarding`
- Layout: centrado, sem navegacao, usando `AuthLayout`
- Mostra email do usuario como texto informativo (read-only)

### 3. `src/components/layout/MainLayout.tsx`

**O que muda:**
- Receber prop opcional `hideNavigation?: boolean`
- Quando `hideNavigation` e `true`, nao renderizar `TopNavigation`
- Alternativa: verificar `user.onboardingStatus` internamente e esconder a navegacao se nao for `completed`

### 4. `src/components/layout/TopNavigation.tsx`

**O que muda:**
- Adicionar verificacao de `user.onboardingStatus`
- Se `onboardingStatus !== 'completed'`, desabilitar todos os links de navegacao (opacity reduzida, sem click handlers, cursor-not-allowed)
- Manter apenas o logo e o menu do usuario (para permitir logout)

### 5. `src/hooks/useAuth.ts`

**O que muda:**
- Na funcao `handleSession`, apos carregar o profile, verificar se `profile.name` esta vazio/null
- Expor um novo campo `needsNameCollection: boolean` que indica se o usuario precisa preencher o nome
- Isso e derivado de: `isAuthenticated && profile && (!profile.name || profile.name.trim() === '')`

### 6. `src/contexts/AppContext.tsx`

**O que muda:**
- Expor `needsNameCollection` derivado do auth state
- Adicionar ao contexto para que route guards possam consumir

---

## Fluxo Completo

```text
Login/Signup
  -> Google OAuth sucesso
  -> Supabase cria sessao
  -> fetchProfile() carrega perfil
  -> profile.name vazio?
     -> SIM: redireciona para /complete-profile
       -> Usuario preenche nome
       -> Salva no DB
       -> Redireciona para /onboarding
     -> NAO: profile.onboarding_status?
       -> "completed": redireciona para /dashboard
       -> outro: redireciona para /onboarding
```

---

## Logica de Route Guards

| Rota | Guard | Comportamento |
|------|-------|---------------|
| `/login`, `/signup` | PublicRoute | Se autenticado, redireciona conforme status |
| `/complete-profile` | ProtectedRoute | Requer auth, sem verificacao de onboarding |
| `/onboarding` | ProtectedRoute | Requer auth, sem verificacao de onboarding |
| `/dashboard` | OnboardingGuardedRoute | Requer auth + nome + onboarding completo |
| `/strategy` | OnboardingGuardedRoute | Requer auth + nome + onboarding completo |
| `/brand` | OnboardingGuardedRoute | Requer auth + nome + onboarding completo |
| `/content-lab/*` | OnboardingGuardedRoute | Requer auth + nome + onboarding completo |
| `/profile` | OnboardingGuardedRoute | Requer auth + nome + onboarding completo |
| `/pricing` | ProtectedRoute | Requer auth apenas (acessivel sem onboarding) |
| `/privacy-policy` | ProtectedRoute | Requer auth apenas |

---

## Secao Tecnica

### Componente OnboardingGuardedRoute

```typescript
function OnboardingGuardedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthLoading, profile, user } = useApp();

  if (isAuthLoading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (profile && (!profile.name || profile.name.trim() === '')) {
    return <Navigate to="/complete-profile" replace />;
  }
  if (profile && profile.onboarding_status !== 'completed') {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
```

### CompleteProfile Page (estrutura)

- `AuthLayout` wrapper (sem navegacao)
- `Card` com:
  - Titulo: "Qual e o seu nome?"
  - Descricao: "Precisamos do seu nome para personalizar sua experiencia"
  - Email do usuario exibido como texto informativo
  - Input de nome com validacao zod
  - Button: "Continuar diagnostico" (disabled ate nome valido)
  - Loader state durante persistencia

### Desabilitar navegacao no TopNavigation

- Envolver os botoes de menu em condicional:
  ```typescript
  const isOnboardingComplete = user.onboardingStatus === 'completed';
  // Menu items: pointer-events-none opacity-50 quando !isOnboardingComplete
  ```
- Manter funcional: logo, avatar/logout

### Arquivos afetados

| Arquivo | Acao |
|---------|------|
| `src/App.tsx` | Novo guard + rota /complete-profile |
| `src/pages/CompleteProfile.tsx` | NOVO - tela de coleta de nome |
| `src/components/layout/TopNavigation.tsx` | Desabilitar menus se onboarding incompleto |
| `src/contexts/AppContext.tsx` | Expor needsNameCollection |
| `src/hooks/useAuth.ts` | Adicionar needsNameCollection |

### Ordem de execucao

1. Atualizar `useAuth.ts` com `needsNameCollection`
2. Atualizar `AppContext.tsx` para expor o novo campo
3. Criar `CompleteProfile.tsx`
4. Atualizar `App.tsx` com `OnboardingGuardedRoute` e nova rota
5. Atualizar `TopNavigation.tsx` para desabilitar menus
