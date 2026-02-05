
# Plano: Integrar Onboarding com Edge Function generate-diagnostic

## Objetivo
Substituir a geracao mock de diagnostico por chamada real a edge function `generate-diagnostic`, persistindo os dados no banco e exibindo resultados reais gerados por IA.

---

## Arquitetura da Solucao

```text
+-------------------+       +---------------------+       +------------------------+
|   Onboarding.tsx  |  -->  |  DiagnosticLoading  |  -->  |  generate-diagnostic   |
| (Coleta formData) |       | (Chama edge func)   |       |  (Edge Function)       |
+-------------------+       +---------------------+       +------------------------+
        |                           |                              |
        v                           v                              v
  - 7 steps wizard           - Fetch com retry            - Lovable AI Gateway
  - Form validation          - Progress real              - gemini-3-flash-preview
  - formData state           - Error handling             - Tool calling
                                    |
                                    v
                          +---------------------+
                          | DiagnosticResults   |
                          | (Exibe resultado)   |
                          +---------------------+
                                    |
                                    v
                          +---------------------+
                          | Tabela diagnostics  |
                          | (Persistencia)      |
                          +---------------------+
```

---

## Componentes a Modificar

### 1. Onboarding.tsx (MODIFICAR)
**Arquivo:** `src/pages/Onboarding.tsx`

Alteracoes:
- Passar `formData` para `DiagnosticLoading` como prop
- Receber `diagnosticResult` do loading para passar ao results
- Adicionar estado para armazenar resultado do diagnostico
- Gerenciar fluxo de erro (mostrar toast e permitir retry)

```typescript
// Novo estado
const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

// Prop para loading
<DiagnosticLoading 
  formData={formData}
  onComplete={(result) => {
    setDiagnosticResult(result);
    setPhase('results');
  }}
  onError={() => setPhase('wizard')}
/>
```

### 2. DiagnosticLoading.tsx (REFATORAR)
**Arquivo:** `src/components/onboarding/DiagnosticLoading.tsx`

Alteracoes:
- Receber `formData` como prop
- Chamar edge function `generate-diagnostic` via Supabase invoke
- Exibir progresso baseado em tempo estimado (nao fake progress)
- Tratar erros 429 (rate limit) e 402 (creditos)
- Callback `onComplete` passa resultado real
- Callback `onError` para retry

```typescript
interface DiagnosticLoadingProps {
  formData: OnboardingFormData;
  onComplete: (result: DiagnosticResult) => void;
  onError: (error: string) => void;
}

// Chamada a edge function
const { data, error } = await supabase.functions.invoke('generate-diagnostic', {
  body: { formData }
});
```

### 3. DiagnosticResults.tsx (REFATORAR)
**Arquivo:** `src/components/onboarding/DiagnosticResults.tsx`

Alteracoes:
- Receber `result` como prop em vez de usar mock
- Remover import de `mockDiagnosticResult`
- Renderizar dados dinamicos da IA

```typescript
interface DiagnosticResultsProps {
  result: DiagnosticResult;
  onComplete: () => void;
}
```

---

## Novo Hook useDiagnostic (CRIAR)
**Arquivo:** `src/hooks/useDiagnostic.ts`

Responsabilidades:
- Encapsular logica de chamada a edge function
- Gerenciar estados de loading/error/success
- Implementar retry com exponential backoff
- Retornar resultado tipado

```typescript
export function useDiagnostic() {
  return {
    generateDiagnostic: (formData: OnboardingFormData) => Promise<DiagnosticResult>,
    isLoading: boolean,
    error: string | null,
    retry: () => void,
  }
}
```

---

## Estados de Interface

### Loading State (Durante Geracao)
- Icones animados rotacionando
- Mensagens de progresso reais (baseadas em etapas da IA)
- Progress bar com estimativa de tempo (10-15 segundos tipico)
- Skeleton cards de preview

### Error State (Falha na Geracao)
- Toast com mensagem de erro especifica
- Botao "Tentar Novamente" visivel
- Mensagens especiais para:
  - 429: "Limite de requisicoes atingido. Aguarde alguns minutos."
  - 402: "Creditos de IA esgotados. Adicione mais creditos para continuar."
  - Generico: "Erro ao gerar diagnostico. Tente novamente."

### Success State (Diagnostico Gerado)
- Transicao suave para tela de resultados
- Dados reais da IA renderizados
- Opcao de navegar para Estrategia ou Dashboard

---

## Detalhes Tecnicos

### Chamada a Edge Function
```typescript
const { data, error } = await supabase.functions.invoke('generate-diagnostic', {
  body: { 
    formData: {
      name: formData.name,
      role: formData.role || formData.customRole,
      experienceLevel: formData.experienceLevel,
      primaryArea: formData.primaryArea === 'other' ? formData.customArea : formData.primaryArea,
      subareas: formData.subareas,
      primaryGoal: formData.primaryGoal === 'other' ? formData.customPrimaryGoal : formData.primaryGoal,
      secondaryGoal: formData.secondaryGoal === 'other' ? formData.customSecondaryGoal : formData.secondaryGoal,
      selectedTopics: [...formData.selectedTopics, ...formData.customTopics],
      customTopics: formData.customTopics,
      audienceType: formData.audienceType === 'other' ? formData.customAudience : formData.audienceType,
      challenges: formData.challenges.filter(c => c !== 'other'),
      communicationStyle: formData.communicationStyle,
    }
  }
});
```

### Mapeamento de Resposta
A edge function ja retorna estrutura compativel com `DiagnosticResult`:
```typescript
{
  profileAnalysis: { title, summary, strengths, opportunities },
  strategicPatterns: { patterns: [...] },
  personaMap: { primaryPersona, characteristics, contentPreferences },
  brandArchetype: { archetype, description, traits },
  toneCalibration: { dimensions: [...] },
  contentPillars: { pillars: [...] },
  metadata: { generatedAt, model, version }
}
```

### Tratamento de Erros
```typescript
if (error) {
  if (error.message.includes('429') || error.status === 429) {
    toast.error('Limite de requisicoes atingido. Aguarde alguns minutos.');
  } else if (error.message.includes('402') || error.status === 402) {
    toast.error('Creditos de IA esgotados.');
  } else {
    toast.error('Erro ao gerar diagnostico. Tente novamente.');
  }
  onError(error.message);
  return;
}
```

---

## Arquivos a Criar

| Arquivo | Tipo | Descricao |
|---------|------|-----------|
| `src/hooks/useDiagnostic.ts` | Hook | Encapsula chamada a edge function |

## Arquivos a Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `src/pages/Onboarding.tsx` | Passar formData e gerenciar resultado |
| `src/components/onboarding/DiagnosticLoading.tsx` | Chamar edge function real |
| `src/components/onboarding/DiagnosticResults.tsx` | Receber resultado como prop |
| `src/data/onboardingData.ts` | Adicionar titulos aos tipos se necessario |

---

## Fluxo do Usuario

1. Usuario completa as 7 etapas do wizard
2. Clica em "Gerar Diagnostico" na ultima etapa
3. Tela de loading aparece com mensagens rotativas
4. Hook `useDiagnostic` chama edge function `generate-diagnostic`
5. Durante loading: icones animados + progress estimado
6. Se sucesso: transicao para tela de resultados com dados reais
7. Se erro: toast com mensagem + botao retry
8. Na tela de resultados: usuario ve diagnostico personalizado
9. Clica em "Ver Estrategia" ou "Ir para Dashboard"

---

## Consumo de Creditos

Esta integracao consome aproximadamente 50-100 creditos por diagnostico devido ao uso do modelo `google/gemini-3-flash-preview` com tool calling estruturado. O diagnostico e gerado uma unica vez por usuario durante o onboarding.

---

## Secao Tecnica

### Dependencias
- `@supabase/supabase-js` (ja instalado)
- `sonner` para toasts (ja instalado)

### Tipagem
A interface `DiagnosticResult` ja existe em `src/data/onboardingData.ts` e e compativel com a resposta da edge function. Sera necessario adicionar campos `title` opcionais para algumas secoes conforme retorno da IA.

### Edge Function
A edge function `generate-diagnostic` ja esta implementada e retorna a estrutura correta. Nao requer alteracoes.
