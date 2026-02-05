

# Detalhamento da Camada de IA e Estrutura de Dados — Flui

## Visao Geral

Este documento detalha todos os pontos do produto onde a IA e necessaria, os dados de entrada/saida para cada funcionalidade, e a estrutura de dados recomendada para o Supabase.

---

## Parte 1: Mapeamento dos Pontos de IA no Produto

### 1.1 Diagnostico Estrategico (Onboarding)

**Localizacao**: `/onboarding` (fase loading → results)

**Descricao**: Apos coletar dados do usuario em 7 etapas, a IA analisa as respostas e gera um diagnostico personalizado contendo perfil estrategico, padroes identificados, arquetipo de marca, tom de voz e pilares de conteudo.

**Dados de Entrada (OnboardingFormData)**:
```typescript
{
  name: string;
  role: string;
  experienceLevel: number; // 0-3
  primaryArea: string;
  subareas: string[];
  primaryGoal: string;
  secondaryGoal: string;
  selectedTopics: string[];
  customTopics: string[];
  audienceType: string;
  challenges: string[];
  communicationStyle: {
    formality: number;     // 0-100
    approach: number;      // 0-100 (storyteller vs data-driven)
    tone: number;          // 0-100 (seguro vs provocativo)
    expression: number;    // 0-100 (reservado vs expressivo)
  };
}
```

**Dados de Saida (DiagnosticResult)**:
```typescript
{
  profileAnalysis: {
    title: string;
    summary: string;
    strengths: string[];
    opportunities: string[];
  };
  strategicPatterns: {
    patterns: Array<{ name: string; description: string; match: number }>;
  };
  personaMap: {
    primaryPersona: string;
    characteristics: string[];
    contentPreferences: string[];
  };
  brandArchetype: {
    archetype: string;
    description: string;
    traits: string[];
  };
  toneCalibration: {
    dimensions: Array<{ name: string; value: number; description: string }>;
  };
  contentPillars: {
    pillars: Array<{ name: string; percentage: number; description: string; color: string }>;
  };
}
```

**Modelo Recomendado**: `google/gemini-3-flash-preview` (rapido, bom para analise estruturada)

---

### 1.2 Geracao de Estrategia Editorial

**Localizacao**: `/strategy` (gerada apos diagnostico)

**Descricao**: A partir do DiagnosticResult, a IA gera uma estrategia editorial completa com objetivo estrategico, pilares de conteudo, tipos de conteudo recomendados e diretrizes.

**Dados de Entrada**:
```typescript
{
  diagnosticResult: DiagnosticResult;
  brandInfo?: {
    name: string;
    valueProposition: string;
    targetAudience: string;
  };
}
```

**Dados de Saida (Strategy)**:
```typescript
{
  id: string;
  diagnosticId: string;
  createdAt: string;
  diagnosticSummary: {
    targetAudience: string;
    primaryGoal: string;
    brandArchetype: string;
    dominantTone: string;
  };
  strategicGoal: {
    statement: string;
    description: string;
  };
  contentPillars: Array<{
    id: string;
    name: string;
    description: string;
    focusPercentage: number;
    exampleTopics: string[];
    color: string;
  }>;
  contentTypes: Array<{
    id: string;
    name: string;
    icon: string;
    relatedPillars: string[];
  }>;
  guidelines: {
    frequency: string;
    depthLevel: string;
    ctaPosture: string;
    brandStance: string;
  };
}
```

**Modelo Recomendado**: `google/gemini-2.5-pro` (mais elaborado para analise estrategica)

---

### 1.3 Sugestao de Conteudos para Sprint

**Localizacao**: `/sprints/:sprintId` (botao "Gerar Sugestoes IA")

**Descricao**: Dado o tema e objetivo de uma sprint, a IA sugere uma lista de conteudos com titulos, hooks, formatos, frameworks e CTAs.

**Dados de Entrada**:
```typescript
{
  sprint: {
    id: string;
    title: string;
    description: string;
    theme: string;
    pillarId?: string;
  };
  strategy: Strategy;
  brand: Brand;
  existingContents: SprintContent[]; // Para evitar duplicatas
}
```

**Dados de Saida (Array de SprintContent)**:
```typescript
Array<{
  title: string;
  hook: string;
  description: string;
  format: string;
  funnelStage: 'tofu' | 'mofu' | 'bofu';
  framework: string;
  frameworkReason: string;
  intention: 'educate' | 'engage' | 'convert';
  suggestedCta: string;
}>
```

**Modelo Recomendado**: `google/gemini-3-flash-preview` (rapido para geracao de listas)

---

### 1.4 Geracao de Texto de Conteudo

**Localizacao**: `/sprints/:sprintId` (sheet de detalhes → "Gerar Texto com IA")

**Descricao**: Dado um conteudo com titulo, hook, framework e formato, a IA gera o texto completo pronto para publicacao.

**Dados de Entrada**:
```typescript
{
  content: {
    title: string;
    hook: string;
    description: string;
    format: string;
    framework: string;
    funnelStage: string;
    intention: string;
    suggestedCta: string;
  };
  brand: Brand; // Tom de voz, personalidade
  strategy: Strategy; // Contexto estrategico
}
```

**Dados de Saida**:
```typescript
{
  generatedText: string;
  alternativeVersions?: string[]; // 2-3 variacoes
  hashtags?: string[];
  estimatedReadTime?: number;
}
```

**Modelo Recomendado**: `google/gemini-2.5-flash` (equilibrio entre qualidade e velocidade)

---

### 1.5 Sugestao de Framework para Conteudo

**Localizacao**: `/sprints/:sprintId` (ao criar novo conteudo)

**Descricao**: Dado o titulo, descricao e formato de um conteudo, a IA sugere o melhor framework com justificativa.

**Dados de Entrada**:
```typescript
{
  content: {
    title: string;
    description: string;
    format: string;
  };
  availableFrameworks: Framework[];
  brand: Brand;
}
```

**Dados de Saida**:
```typescript
{
  suggestedFrameworkId: string;
  reason: string;
  confidence: number; // 0-100
  alternatives: Array<{ frameworkId: string; reason: string }>;
}
```

**Modelo Recomendado**: `google/gemini-3-flash-preview` (rapido para classificacao)

---

### 1.6 Geracao de Ideias a partir de Tendencias

**Localizacao**: `/content-lab/radar` (botao "Criar Ideia com esta Tendencia")

**Descricao**: Transforma uma tendencia do radar em uma ideia de conteudo estruturada, alinhada com a estrategia do usuario.

**Dados de Entrada**:
```typescript
{
  trend: Trend;
  strategy: Strategy;
  brand: Brand;
  existingIdeas: Idea[]; // Para evitar duplicatas
}
```

**Dados de Saida**:
```typescript
{
  title: string;
  description: string;
  suggestedFormat: ContentFormat;
  suggestedPillar: string;
  tags: string[];
  reasoning: string;
}
```

**Modelo Recomendado**: `google/gemini-3-flash-preview`

---

### 1.7 Analise de Concorrentes

**Localizacao**: `/brand` (secao concorrentes - bloqueado para Free)

**Descricao**: Dado o perfil de concorrentes, a IA analisa forcas, fraquezas e oportunidades de diferenciacao.

**Dados de Entrada**:
```typescript
{
  competitors: Array<{
    name: string;
    website: string;
    description?: string;
  }>;
  brand: Brand;
  strategy: Strategy;
}
```

**Dados de Saida**:
```typescript
{
  competitors: Array<{
    name: string;
    strengths: string[];
    weaknesses: string[];
    differentiationOpportunities: string[];
  }>;
  overallAnalysis: string;
  recommendedPositioning: string;
}
```

**Modelo Recomendado**: `google/gemini-2.5-pro` (analise mais profunda)

---

### 1.8 Radar de Tendencias (Descoberta Automatica)

**Localizacao**: `/content-lab/radar` (botao "Atualizar Radar")

**Descricao**: Busca tendencias relevantes para o nicho do usuario usando Perplexity para busca web + IA para filtragem e priorizacao.

**Dados de Entrada**:
```typescript
{
  strategy: Strategy;
  brand: Brand;
  previousTrends: Trend[]; // Para evitar duplicatas
}
```

**Dados de Saida**:
```typescript
Array<{
  title: string;
  description: string;
  source: string;
  relevance: 'high' | 'medium' | 'low';
  category: string;
  suggestedActions: string[];
  expiresAt?: string;
}>
```

**Integracao Necessaria**: Perplexity (conector disponivel) + Lovable AI

**Modelo Recomendado**: 
- Perplexity para busca web
- `google/gemini-3-flash-preview` para filtragem e priorizacao

---

## Parte 2: Estrutura de Dados para Supabase

### 2.1 Diagrama de Relacionamentos

```text
+------------------+       +------------------+       +------------------+
|     users        |       |    diagnostics   |       |   strategies     |
+------------------+       +------------------+       +------------------+
| id (PK)          |<---+  | id (PK)          |<---+  | id (PK)          |
| email            |    |  | user_id (FK)     |    |  | diagnostic_id    |
| name             |    |  | form_data (JSON) |    |  | user_id (FK)     |
| avatar_url       |    |  | result (JSON)    |    |  | data (JSON)      |
| role             |    |  | created_at       |    |  | created_at       |
| plan             |    |  +------------------+    |  +------------------+
| ai_credits       |    |                          |
| created_at       |    +--------------------------+
+------------------+
        |
        |  1:N
        v
+------------------+       +------------------+
|     brands       |       |     sprints      |
+------------------+       +------------------+
| id (PK)          |       | id (PK)          |
| user_id (FK)     |       | user_id (FK)     |
| name             |       | title            |
| logo_url         |       | description      |
| colors (JSON)    |       | status           |
| voice (JSON)     |       | theme            |
| positioning(JSON)|       | pillar_id (FK)   |
| created_at       |       | start_date       |
+------------------+       | end_date         |
                           | created_at       |
                           +------------------+
                                   |
                                   | 1:N
                                   v
                           +------------------+
                           | sprint_contents  |
                           +------------------+
                           | id (PK)          |
                           | sprint_id (FK)   |
                           | title            |
                           | hook             |
                           | description      |
                           | format           |
                           | status           |
                           | funnel_stage     |
                           | framework        |
                           | framework_origin |
                           | generated_text   |
                           | target_date      |
                           | created_at       |
                           +------------------+
```

### 2.2 Tabelas Principais

#### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'studio')),
  ai_credits_total INTEGER DEFAULT 500,
  ai_credits_used INTEGER DEFAULT 0,
  onboarding_status TEXT DEFAULT 'not_started' CHECK (onboarding_status IN ('not_started', 'in_progress', 'completed')),
  onboarding_step INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### diagnostics
```sql
CREATE TABLE diagnostics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL, -- OnboardingFormData
  result JSONB, -- DiagnosticResult (gerado pela IA)
  ai_model_used TEXT,
  tokens_consumed INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### strategies
```sql
CREATE TABLE strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  diagnostic_id UUID REFERENCES diagnostics(id),
  data JSONB NOT NULL, -- Strategy completa
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### brands
```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  colors JSONB DEFAULT '{"primary": "#6366f1", "secondary": "#10b981", "accent": "#f59e0b"}',
  typography JSONB DEFAULT '{"headingFont": "Inter", "bodyFont": "Inter"}',
  voice JSONB, -- tone[], personality[], examples[]
  positioning JSONB, -- valueProposition, differentiators[], targetAudience
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### content_pillars
```sql
CREATE TABLE content_pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  strategy_id UUID REFERENCES strategies(id),
  name TEXT NOT NULL,
  description TEXT,
  percentage INTEGER DEFAULT 25,
  color TEXT DEFAULT '#6366f1',
  example_topics TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### sprints
```sql
CREATE TABLE sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
  theme TEXT,
  pillar_id UUID REFERENCES content_pillars(id),
  start_date DATE,
  end_date DATE,
  alignment_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### sprint_contents
```sql
CREATE TABLE sprint_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID REFERENCES sprints(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  hook TEXT,
  description TEXT,
  format TEXT NOT NULL,
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'backlog', 'review', 'scheduled', 'completed')),
  funnel_stage TEXT CHECK (funnel_stage IN ('tofu', 'mofu', 'bofu')),
  framework TEXT,
  framework_reason TEXT,
  framework_origin TEXT DEFAULT 'manual' CHECK (framework_origin IN ('ai', 'manual')),
  intention TEXT CHECK (intention IN ('educate', 'engage', 'convert')),
  suggested_cta TEXT,
  generated_text TEXT, -- Texto gerado pela IA
  target_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### ideas
```sql
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'planned', 'in_progress', 'review', 'published', 'archived')),
  format TEXT,
  pillar_id UUID REFERENCES content_pillars(id),
  sprint_id UUID REFERENCES sprints(id),
  tags TEXT[],
  due_date DATE,
  source_trend_id UUID REFERENCES trends(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### frameworks
```sql
CREATE TABLE frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id), -- NULL = framework global
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('storytelling', 'educational', 'sales', 'engagement', 'authority', 'personal')),
  structure TEXT[], -- Etapas do framework
  example TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### trends
```sql
CREATE TABLE trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  relevance TEXT CHECK (relevance IN ('high', 'medium', 'low')),
  category TEXT,
  suggested_actions TEXT[],
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
```

#### ai_usage_log
```sql
CREATE TABLE ai_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'diagnostic', 'strategy', 'content_suggestion', 'text_generation', etc.
  model_used TEXT,
  tokens_input INTEGER,
  tokens_output INTEGER,
  credits_consumed INTEGER,
  request_payload JSONB,
  response_preview TEXT, -- Primeiros 500 chars da resposta
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Parte 3: Arquitetura de Edge Functions

### 3.1 Funcoes Necessarias

| Funcao | Descricao | Input | Output |
|--------|-----------|-------|--------|
| `generate-diagnostic` | Gera diagnostico a partir do onboarding | OnboardingFormData | DiagnosticResult |
| `generate-strategy` | Gera estrategia a partir do diagnostico | DiagnosticResult + Brand | Strategy |
| `suggest-sprint-contents` | Sugere conteudos para uma sprint | Sprint + Strategy + Brand | SprintContent[] |
| `generate-content-text` | Gera texto completo de um conteudo | SprintContent + Brand | GeneratedText |
| `suggest-framework` | Sugere framework para conteudo | ContentInfo + Brand | FrameworkSuggestion |
| `generate-idea-from-trend` | Cria ideia a partir de tendencia | Trend + Strategy + Brand | Idea |
| `analyze-competitors` | Analisa concorrentes | Competitors[] + Brand | CompetitorAnalysis |
| `discover-trends` | Descobre tendencias do nicho | Strategy + Brand | Trend[] |

### 3.2 Exemplo de Edge Function (generate-diagnostic)

```typescript
// supabase/functions/generate-diagnostic/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { formData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `Voce e um estrategista de conteudo especializado em marcas pessoais.
Analise os dados do usuario e gere um diagnostico completo no formato JSON especificado.
Seja preciso, pratico e baseado em padroes reais de criadores de conteudo de sucesso.`;

    const userPrompt = `Dados do usuario:
- Nome: ${formData.name}
- Cargo: ${formData.role}
- Experiencia: ${formData.experienceLevel} (0=iniciante, 3=expert)
- Area: ${formData.primaryArea}
- Subareas: ${formData.subareas.join(', ')}
- Objetivo primario: ${formData.primaryGoal}
- Objetivo secundario: ${formData.secondaryGoal}
- Topicos: ${formData.selectedTopics.join(', ')}
- Audiencia: ${formData.audienceType}
- Desafios: ${formData.challenges.join(', ')}
- Estilo de comunicacao:
  - Formalidade: ${formData.communicationStyle.formality}/100
  - Abordagem: ${formData.communicationStyle.approach}/100 (storyteller vs data-driven)
  - Tom: ${formData.communicationStyle.tone}/100 (seguro vs provocativo)
  - Expressividade: ${formData.communicationStyle.expression}/100

Gere o diagnostico no seguinte formato JSON:`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_diagnostic",
            description: "Gera diagnostico estrategico completo",
            parameters: {
              type: "object",
              properties: {
                profileAnalysis: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    summary: { type: "string" },
                    strengths: { type: "array", items: { type: "string" } },
                    opportunities: { type: "array", items: { type: "string" } }
                  }
                },
                strategicPatterns: {
                  type: "object",
                  properties: {
                    patterns: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          description: { type: "string" },
                          match: { type: "number" }
                        }
                      }
                    }
                  }
                },
                personaMap: {
                  type: "object",
                  properties: {
                    primaryPersona: { type: "string" },
                    characteristics: { type: "array", items: { type: "string" } },
                    contentPreferences: { type: "array", items: { type: "string" } }
                  }
                },
                brandArchetype: {
                  type: "object",
                  properties: {
                    archetype: { type: "string" },
                    description: { type: "string" },
                    traits: { type: "array", items: { type: "string" } }
                  }
                },
                toneCalibration: {
                  type: "object",
                  properties: {
                    dimensions: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          value: { type: "number" },
                          description: { type: "string" }
                        }
                      }
                    }
                  }
                },
                contentPillars: {
                  type: "object",
                  properties: {
                    pillars: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          percentage: { type: "number" },
                          description: { type: "string" },
                          color: { type: "string" }
                        }
                      }
                    }
                  }
                }
              },
              required: ["profileAnalysis", "strategicPatterns", "personaMap", "brandArchetype", "toneCalibration", "contentPillars"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_diagnostic" } }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI Gateway error:", response.status, error);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const diagnosticResult = JSON.parse(toolCall?.function?.arguments || "{}");

    return new Response(JSON.stringify(diagnosticResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
```

---

## Parte 4: Consumo de Creditos de IA

### 4.1 Tabela de Custos por Acao

| Acao | Creditos Estimados | Modelo |
|------|-------------------|--------|
| Diagnostico Estrategico | 50 | gemini-3-flash-preview |
| Geracao de Estrategia | 80 | gemini-2.5-pro |
| Sugestao de Conteudos (5 itens) | 30 | gemini-3-flash-preview |
| Geracao de Texto (1 conteudo) | 40 | gemini-2.5-flash |
| Sugestao de Framework | 10 | gemini-3-flash-preview |
| Ideia a partir de Tendencia | 15 | gemini-3-flash-preview |
| Analise de Concorrentes | 100 | gemini-2.5-pro |
| Descoberta de Tendencias | 120 | Perplexity + gemini-3-flash-preview |

### 4.2 Limites por Plano

| Plano | Creditos/Mes | Radar | Concorrentes | Frameworks Premium |
|-------|-------------|-------|--------------|-------------------|
| Free | 500 | Nao | Nao | Nao |
| Pro | 5.000 | Sim | Sim | Sim |
| Studio | 20.000 | Sim | Sim | Sim |

---

## Parte 5: Proximos Passos para Implementacao

### Fase 1: Infraestrutura Base
1. Habilitar Lovable Cloud
2. Criar tabelas no Supabase
3. Configurar RLS policies
4. Criar primeira edge function (generate-diagnostic)

### Fase 2: Fluxo de Onboarding com IA
1. Substituir mock por chamada real ao generate-diagnostic
2. Persistir diagnostico no banco
3. Gerar estrategia automaticamente apos diagnostico

### Fase 3: Geracao de Conteudo
1. Implementar suggest-sprint-contents
2. Implementar generate-content-text
3. Implementar suggest-framework

### Fase 4: Features Avancadas
1. Conectar Perplexity para Radar de Tendencias
2. Implementar analyze-competitors
3. Implementar generate-idea-from-trend

### Fase 5: Controle de Creditos
1. Implementar deducao de creditos por acao
2. Implementar ai_usage_log
3. Implementar alertas de creditos baixos

