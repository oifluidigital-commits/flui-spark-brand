
# Plano: Limpeza de Mock Data Apos Autenticacao

## Problema Atual

O `AppContext` inicializa todos os estados com mock data (`mockUser`, `mockBrand`, `mockSprints`, `mockIdeas`, `mockFrameworks`, `mockTrends`) independentemente do estado de autenticacao. Isso significa que usuarios autenticados veem dados falsos misturados com dados reais. Alem disso, paginas como `Profile.tsx` importam `mockActivities` diretamente.

---

## Solucao

Quando `isAuthenticated` muda de `false` para `true`, limpar todos os arrays e objetos mock, renderizando a UI exclusivamente com dados reais do usuario (vindos do perfil, diagnostico e estrategia).

---

## Alteracoes por Arquivo

### 1. `src/contexts/AppContext.tsx`

**O que muda:**
- Inicializar `sprints`, `ideas`, `frameworks`, `trends` como arrays vazios `[]`
- Inicializar `brand` como `null` (alterar tipo para `Brand | null`)
- Remover imports de mock data (exceto helpers como `getStatusLabel`, `formatDatePTBR`)
- Inicializar `user` com um objeto vazio padrao (sem dados de "Pedro Meira")
- Adicionar `useEffect` que, quando `auth.profile` e detectado, popula `user` exclusivamente com dados do perfil
- Quando `diagnosticResult` e `strategy` existem no contexto, derivar `brand` a partir da estrategia (tom de voz, pilares, posicionamento)

**Novo fluxo de estado:**
```text
Auth detectado
  -> Perfil carregado do Supabase
  -> user = dados do perfil
  -> sprints = [] (vazio ate carregar do DB)
  -> ideas = [] (vazio ate carregar do DB)
  -> brand = null (ate derivar da estrategia)
  -> strategy = carregada do cache/DB
```

### 2. `src/pages/Dashboard.tsx`

**O que muda:**
- Remover `suggestedIdeas` hardcoded
- Quando `sprints` esta vazio, mostrar empty state com CTA "Completar diagnostico" (se onboarding nao completo) ou "Criar Sprint" (se completo)
- Quando `ideas` esta vazio, mostrar empty state educativo
- Adicionar Skeleton loading state inicial (exibido enquanto `isAuthLoading` e `true`)

### 3. `src/pages/Brand.tsx`

**O que muda:**
- Verificar se `brand` e `null`
- Se `null` e onboarding nao completo: empty state com CTA "Completar diagnostico"
- Se `null` e onboarding completo mas estrategia nao gerada: empty state com CTA "Gerar estrategia"
- Se `brand` existe (derivado da estrategia): renderizar normalmente
- Adicionar Skeleton loading durante carregamento

### 4. `src/pages/Profile.tsx`

**O que muda:**
- Remover import direto de `mockActivities`
- Substituir secao de atividades por empty state: "Nenhuma atividade registrada ainda"
- Dados do perfil (nome, email, empresa, cargo) ja vem do `user` do contexto (que agora reflete o perfil real)

### 5. `src/pages/Strategy.tsx`

**O que muda:**
- Remover fallback para `mockStrategy` (linha 82)
- Quando nao ha `diagnosticResult` e nao ha `cachedStrategy`, exibir empty state com CTA "Completar diagnostico"
- Remover import de `mockStrategy`

### 6. `src/pages/SprintDetail.tsx`

**O que muda:**
- Remover fallback para `mockSprints` (linha 836)
- Remover import de `mockPillars` e `mockSprints`
- Se sprint nao encontrado, exibir estado de "Sprint nao encontrado" com link para voltar

### 7. `src/hooks/useTrends.ts`

**O que muda:**
- Remover import e uso de `mockStrategy`
- Usar a estrategia real do `AppContext` como parametro para a edge function

### 8. `src/data/mockData.ts`

**O que muda:**
- Manter apenas os helpers utilitarios (`getStatusLabel`, `formatDatePTBR`, `getRemainingCredits`, `getCreditPercentage`)
- Manter `mockPricingPlans` (dados estaticos de planos, nao sao user-scoped)
- Remover `mockUser`, `mockBrand`, `mockSprints`, `mockIdeas`, `mockFrameworks`, `mockTrends`, `mockActivities`, `mockPillars`
- Renomear arquivo para `src/data/helpers.ts` ou manter com conteudo reduzido

### 9. `src/data/strategyData.ts`

**O que muda:**
- Remover `mockStrategy`
- Manter apenas a interface/tipo `Strategy`

---

## Derivacao de Brand a partir da Estrategia

Quando a estrategia e gerada pela IA, ela contem dados que alimentam o Brand Hub:

```text
strategy.contentPillars -> brand.pillars
strategy.guidelines -> brand.voice.tone
strategy.diagnosticSummary.brandArchetype -> brand.voice.personality
strategy.strategicGoal -> brand.positioning.valueProposition
```

Um `useEffect` no `AppContext` ira derivar `brand` automaticamente quando `strategy` mudar.

---

## Empty States (Obrigatorios)

Cada pagina deve ter um empty state educativo com:
- Icone ilustrativo
- Titulo explicativo
- Descricao do que aquela secao faz
- CTA principal (ex: "Completar diagnostico" ou "Criar Sprint")

Nenhum estado silencioso ou vazio sem orientacao.

---

## Skeleton States

Apos login, todas as paginas protegidas devem exibir `Skeleton` components enquanto o perfil e carregado. Isso ja e parcialmente implementado via `isAuthLoading` no `App.tsx`, mas deve ser replicado dentro de cada pagina para secoes especificas (cards, listas, etc).

---

## Secao Tecnica

### Tipo Brand alterado

```typescript
// AppContext
brand: Brand | null
setBrand: React.Dispatch<React.SetStateAction<Brand | null>>
```

### Default User (sem mock)

```typescript
const defaultUser: User = {
  id: '',
  name: '',
  email: '',
  onboardingStatus: 'not_started',
  onboardingStep: 0,
  plan: 'free',
  aiCredits: { total: 0, used: 0 },
  createdAt: new Date().toISOString(),
};
```

### Arquivos afetados

| Arquivo | Acao |
|---------|------|
| `src/contexts/AppContext.tsx` | Remover mocks, inicializar vazio |
| `src/pages/Dashboard.tsx` | Empty states + skeleton |
| `src/pages/Brand.tsx` | Null check + empty state |
| `src/pages/Profile.tsx` | Remover mockActivities |
| `src/pages/Strategy.tsx` | Remover mockStrategy fallback |
| `src/pages/SprintDetail.tsx` | Remover mock fallbacks |
| `src/hooks/useTrends.ts` | Usar estrategia real |
| `src/data/mockData.ts` | Limpar mocks, manter helpers |
| `src/data/strategyData.ts` | Remover mockStrategy |

### Ordem de execucao

1. Limpar `mockData.ts` e `strategyData.ts` (remover objetos mock)
2. Refatorar `AppContext.tsx` (inicializar vazio, derivar brand)
3. Atualizar `Dashboard.tsx` (empty states + skeleton)
4. Atualizar `Brand.tsx` (null check + empty state)
5. Atualizar `Profile.tsx` (remover mockActivities)
6. Atualizar `Strategy.tsx` (remover fallback mock)
7. Atualizar `SprintDetail.tsx` (remover mock fallback)
8. Atualizar `useTrends.ts` (usar estrategia real)
