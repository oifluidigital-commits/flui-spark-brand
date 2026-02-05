
# Plano de Implementação — Página /estrategia

## Visão Geral

Construir uma página de **Estratégia** que funciona como continuação direta do Diagnóstico. Esta é uma página **somente leitura** que exibe a estratégia editorial derivada do diagnóstico do usuário, sem capacidades de edição.

---

## 1. Estrutura da Página

A página seguirá esta hierarquia de seções:

```text
+------------------------------------------+
|  Breadcrumb: Diagnóstico → Estratégia    |
|  Texto de apoio contextual               |
+------------------------------------------+
|  RESUMO DO DIAGNÓSTICO (4 cards)         |
|  ┌────────┐ ┌────────┐ ┌────────┐ ┌────┐ |
|  │Público │ │Objetivo│ │Arquéti-│ │Tom │ |
|  │-alvo   │ │Primário│ │po Marca│ │Voz │ |
|  └────────┘ └────────┘ └────────┘ └────┘ |
+------------------------------------------+
|  OBJETIVO ESTRATÉGICO                    |
|  Card com declaração clara               |
+------------------------------------------+
|  PILARES DE CONTEÚDO (4 cards)           |
|  ┌─────────────────┐ ┌─────────────────┐ |
|  │ Pilar + % foco  │ │ Pilar + % foco  │ |
|  │ Descrição       │ │ Descrição       │ |
|  │ Tópicos exemplo │ │ Tópicos exemplo │ |
|  └─────────────────┘ └─────────────────┘ |
+------------------------------------------+
|  TIPOS DE CONTEÚDO                       |
|  Lista visual com ícones                 |
+------------------------------------------+
|  DIRETRIZES ESTRATÉGICAS                 |
|  Cards estilo checklist                  |
+------------------------------------------+
|  CTA FIXO                                |
|  "Ir para Planejamento de Conteúdo"      |
+------------------------------------------+
```

---

## 2. Estados da Página

| Estado | Comportamento |
|--------|---------------|
| **Diagnóstico não concluído** | Mensagem de bloqueio + CTA "Voltar ao Diagnóstico" |
| **Carregando** | Skeletons com mensagens estratégicas rotativas |
| **Com dados** | Exibição completa da estratégia |

---

## 3. Arquivos a Criar/Modificar

### 3.1 Criar: `src/data/strategyData.ts`
Definição de tipos e mock data para estratégia:

```typescript
// Interface principal
interface Strategy {
  id: string;
  diagnosticId: string; // Referência explícita ao diagnóstico
  createdAt: string;
  
  // Resumo do diagnóstico (referência)
  diagnosticSummary: {
    targetAudience: string;
    primaryGoal: string;
    brandArchetype: string;
    dominantTone: string;
  };
  
  // Objetivo estratégico
  strategicGoal: {
    statement: string;
    description: string;
  };
  
  // Pilares de conteúdo expandidos
  contentPillars: Array<{
    id: string;
    name: string;
    description: string;
    focusPercentage: number;
    exampleTopics: string[];
    color: string;
  }>;
  
  // Tipos de conteúdo
  contentTypes: Array<{
    id: string;
    name: string;
    icon: string;
    relatedPillars: string[];
  }>;
  
  // Diretrizes estratégicas
  guidelines: {
    frequency: string;
    depthLevel: string;
    ctaPosture: string;
    brandStance: string;
  };
}
```

**Mock data realista:**
- Estratégia derivada do `mockDiagnosticResult` existente
- Pilares com tópicos de exemplo
- Tipos de conteúdo vinculados aos pilares
- Diretrizes claras e acionáveis

### 3.2 Criar: `src/pages/Strategy.tsx`
Página principal com todas as seções:

**Componentes internos:**
- `ContinuityHeader` — Breadcrumb + texto contextual
- `DiagnosticSummaryCards` — 4 cards compactos
- `StrategicGoalCard` — Card único com objetivo
- `ContentPillarsSection` — Grid de pilares
- `ContentTypesSection` — Lista visual com ícones
- `StrategicGuidelinesSection` — Cards estilo checklist
- `ProgressionCTA` — Seção fixa no final

### 3.3 Criar: `src/components/strategy/StrategyLoadingState.tsx`
Loading state com:
- Skeleton cards
- Mensagens rotativas:
  - "Processando seu diagnóstico..."
  - "Estruturando pilares de conteúdo..."
  - "Definindo diretrizes estratégicas..."
  - "Finalizando sua estratégia editorial..."

### 3.4 Criar: `src/components/strategy/StrategyBlockedState.tsx`
Estado de bloqueio quando diagnóstico não foi concluído:
- Ícone de alerta
- Mensagem clara
- CTA para retornar ao Diagnóstico

### 3.5 Modificar: `src/App.tsx`
Adicionar rota `/estrategia` como rota protegida:
```tsx
<Route path="/estrategia" element={<ProtectedRoute><Strategy /></ProtectedRoute>} />
```

### 3.6 Modificar: `src/contexts/AppContext.tsx`
Adicionar estado de diagnóstico concluído e dados de estratégia:
- `diagnosticCompleted: boolean`
- `strategy: Strategy | null`

---

## 4. Componentes Shadcn Utilizados

| Componente | Uso |
|------------|-----|
| Card | Containers de seções |
| Badge | Status e percentuais |
| Button | CTA de progressão |
| Skeleton | Estado de carregamento |
| Progress | Indicador de foco dos pilares |

---

## 5. Estilização

Seguindo o Visual Dictionary:
- `bg-zinc-950` → Background da página
- `bg-zinc-900` → Cards e superfícies
- `border-zinc-800` → Divisórias
- `text-zinc-50` → Texto primário
- `text-zinc-400` → Texto secundário
- `indigo-600` → Ações primárias e destaques
- `emerald-500` → Indicadores de sucesso/objetivo
- Cores customizadas para cada pilar (hex codes do diagnostic)

---

## 6. Detalhes Técnicos

### Seção: Continuity Header
```tsx
<div className="space-y-2 mb-8">
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <span>Diagnóstico</span>
    <ChevronRight className="h-4 w-4" />
    <span className="text-foreground font-medium">Estratégia</span>
  </div>
  <p className="text-muted-foreground">
    Com base no seu diagnóstico, estruturamos a seguinte estratégia editorial.
  </p>
</div>
```

### Seção: Diagnostic Summary
Grid de 4 cards compactos (2x2 em mobile, 4x1 em desktop):
- Ícone + Label + Valor
- Estilo read-only (sem hover de edição)

### Seção: Strategic Goal
Card único com:
- Declaração em destaque (text-lg font-semibold)
- Descrição expandida abaixo

### Seção: Content Pillars
Grid 2 colunas com cards expandidos:
- Nome + Badge de percentual
- Barra de progresso visual
- Descrição
- Chips com tópicos de exemplo

### Seção: Content Types
Lista vertical com:
- Ícone colorido (baseado no pilar)
- Nome do tipo
- Badge(s) indicando pilares relacionados

### Seção: Strategic Guidelines
Grid 2x2 de cards estilo checklist:
- Frequência de publicação
- Nível de profundidade
- Postura de CTA
- Posicionamento da marca

### Seção: Progression CTA
Container fixo no final:
- Background com borda superior
- Texto motivacional
- Botão primário com seta

---

## 7. Fluxo de Navegação

```text
/onboarding (Diagnóstico completo)
    ↓
/estrategia (Página atual)
    ↓
/planejamento (Próxima etapa - CTA)
```

---

## 8. Responsividade

| Breakpoint | Layout |
|------------|--------|
| Mobile | 1 coluna, cards empilhados |
| Tablet | 2 colunas para pilares |
| Desktop | Grid completo, CTA fixa visível |

---

## 9. Mock Data Completo

A estratégia mock incluirá:

```typescript
const mockStrategy: Strategy = {
  id: 'strategy-1',
  diagnosticId: 'diagnostic-1',
  createdAt: '2024-02-10T15:00:00Z',
  
  diagnosticSummary: {
    targetAudience: 'Profissionais em Ascensão (28-40 anos)',
    primaryGoal: 'Construir autoridade no mercado',
    brandArchetype: 'O Sábio',
    dominantTone: 'Profissional mas acessível'
  },
  
  strategicGoal: {
    statement: 'Posicionar-se como referência em Product Management através de conteúdo educacional de alta densidade.',
    description: 'Sua estratégia foca em construir autoridade consistente, educando profissionais intermediários sobre práticas avançadas de gestão de produto.'
  },
  
  contentPillars: [
    {
      id: 'pillar-1',
      name: 'Autoridade Técnica',
      description: 'Demonstrar expertise profunda em sua área',
      focusPercentage: 40,
      exampleTopics: ['Frameworks de priorização', 'Métricas de produto', 'Roadmap estratégico'],
      color: '#6366f1'
    },
    // ... outros pilares
  ],
  
  contentTypes: [
    { id: 'type-1', name: 'Carrossel Educativo', icon: 'LayoutGrid', relatedPillars: ['Autoridade', 'Educação'] },
    { id: 'type-2', name: 'Thread de Análise', icon: 'MessageSquare', relatedPillars: ['Autoridade'] },
    // ... outros tipos
  ],
  
  guidelines: {
    frequency: '3-4 publicações por semana',
    depthLevel: 'Conteúdo intermediário a avançado',
    ctaPosture: 'Soft CTAs em 20% do conteúdo',
    brandStance: 'Opinativo com embasamento'
  }
};
```

---

## 10. Checklist de Entrega

- [ ] Criar tipos e mock data de estratégia
- [ ] Criar componente de loading state
- [ ] Criar componente de blocked state
- [ ] Criar página Strategy.tsx com todas as seções
- [ ] Adicionar rota no App.tsx
- [ ] Atualizar contexto com estado de diagnóstico
- [ ] Testar responsividade
- [ ] Validar navegação entre páginas
