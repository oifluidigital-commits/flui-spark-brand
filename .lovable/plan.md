
# Plano: Integrar Edge Function discover-trends com Radar

## Objetivo
Conectar a edge function `discover-trends` com a pagina Radar para exibir tendencias geradas por IA em tempo real, substituindo os dados mock atuais.

---

## Arquitetura da Solucao

```text
+------------------+       +-------------------+       +----------------------+
|   Radar.tsx      |  -->  |  useTrends hook   |  -->  | discover-trends      |
| (UI Component)   |       | (fetch + cache)   |       | (Edge Function)      |
+------------------+       +-------------------+       +----------------------+
        |                         |                            |
        v                         v                            v
  - Loading skeleton       - React Query            - Lovable AI Gateway
  - Empty state            - Error handling         - gemini-3-flash-preview
  - Trend cards            - Optimistic update      - Gera 5-7 tendencias
```

---

## Componentes a Criar/Modificar

### 1. Hook `useTrends` (NOVO)
**Arquivo:** `src/hooks/useTrends.ts`

Responsabilidades:
- Chamar edge function `discover-trends`
- Gerenciar estado de loading/error/success
- Cache com React Query (staleTime: 10min)
- Expor funcao `refreshTrends()` para atualizar manualmente

```typescript
// Estrutura do hook
export function useTrends() {
  return {
    trends: Trend[],
    isLoading: boolean,
    isRefreshing: boolean,
    error: Error | null,
    refreshTrends: () => void,
    lastUpdated: Date | null,
  }
}
```

### 2. Contexto AppContext (ATUALIZAR)
**Arquivo:** `src/contexts/AppContext.tsx`

Alteracoes:
- Adicionar `setTrends` ao contexto para permitir atualizacao
- Expor `strategy` (mock atual) para fornecer niche/audience ao hook

### 3. Pagina Radar (REFATORAR)
**Arquivo:** `src/pages/Radar.tsx`

Alteracoes:
- Integrar hook `useTrends`
- Adicionar estado de loading com Skeleton
- Adicionar estado vazio educativo (sem tendencias)
- Conectar botao "Atualizar Radar" a `refreshTrends()`
- Exibir indicador de ultima atualizacao
- Adicionar feedback visual durante refresh

---

## Estados de Interface

### Loading State (Primeira Carga)
- 3 Skeleton cards com estrutura da trend
- Stats cards com Skeleton numbers
- Botao "Atualizar Radar" desabilitado

### Empty State (Nenhuma Tendencia)
- Icone ilustrativo (TrendingUp)
- Titulo: "Nenhuma tendencia descoberta"
- Descricao: "Clique em 'Atualizar Radar' para descobrir tendencias relevantes para o seu nicho"
- CTA: Botao "Descobrir Tendencias"

### Refreshing State
- Spinner no botao "Atualizar Radar"
- Cards existentes com opacidade reduzida
- Toast de feedback apos conclusao

### Error State
- Toast de erro com mensagem
- Trends anteriores permanecem visiveis
- Botao para retry

---

## Detalhes Tecnicos

### Chamada a Edge Function
```typescript
const response = await supabase.functions.invoke('discover-trends', {
  body: {
    niche: strategy.strategicGoal.statement,
    keywords: strategy.contentPillars.map(p => p.name),
    audience: strategy.diagnosticSummary.targetAudience,
    existingPillars: strategy.contentPillars.map(p => ({
      name: p.name,
      description: p.description,
    })),
  },
});
```

### Mapeamento de Dados (Edge Function -> UI)
```typescript
// Resposta da edge function
{
  success: true,
  trends: [
    {
      title: string,
      description: string,
      category: string,
      relevance: "high" | "medium" | "low",
      source: string,
      suggested_actions: string[],
      discovered_at: string,
      expires_at: string,
    }
  ],
  generated_at: string,
}

// Transformacao para tipo Trend do frontend
const mappedTrend: Trend = {
  id: crypto.randomUUID(), // Gerar ID local
  title: trend.title,
  description: trend.description,
  source: trend.source,
  relevance: trend.relevance,
  category: trend.category,
  suggestedActions: trend.suggested_actions, // snake_case -> camelCase
  discoveredAt: trend.discovered_at,
  expiresAt: trend.expires_at,
}
```

### React Query Configuration
```typescript
useQuery({
  queryKey: ['trends', userId],
  queryFn: fetchTrends,
  staleTime: 10 * 60 * 1000, // 10 minutos
  refetchOnWindowFocus: false,
  retry: 2,
});
```

---

## Arquivos a Criar

| Arquivo | Tipo | Descricao |
|---------|------|-----------|
| `src/hooks/useTrends.ts` | Hook | Gerencia fetch e cache de tendencias |
| `src/components/radar/TrendSkeleton.tsx` | Componente | Skeleton para loading state |
| `src/components/radar/EmptyTrends.tsx` | Componente | Empty state educativo |

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Radar.tsx` | Integrar useTrends, loading/empty states |
| `src/contexts/AppContext.tsx` | Adicionar setTrends e strategy |
| `src/data/strategyData.ts` | Exportar mockStrategy no contexto |

---

## Fluxo do Usuario

1. Usuario acessa `/content-lab/radar`
2. Hook `useTrends` verifica cache (React Query)
3. Se cache vazio ou stale: chama edge function
4. Durante loading: exibe Skeleton cards
5. Apos sucesso: renderiza cards de tendencia
6. Usuario clica "Atualizar Radar": chama `refreshTrends()`
7. Durante refresh: spinner no botao + cards com opacidade
8. Apos sucesso: toast de confirmacao + novas tendencias

---

## Consumo de Creditos

Esta integracao usa a edge function `discover-trends` que consome aproximadamente 30 creditos por chamada. O cache de 10 minutos evita chamadas excessivas.
