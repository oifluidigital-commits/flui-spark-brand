
# Plano de Implementacao — Card de Progresso do Onboarding no Dashboard

## Visao Geral

Criar um componente de card de progresso do onboarding que aparece no Dashboard para usuarios que ainda nao concluiram o diagnostico. O card sera informativo, nao intrusivo, e permitira que o usuario continue de onde parou.

---

## 1. Estrutura do Card

```text
+--------------------------------------------------+
|  [Icon]  Complete seu diagnostico para aproveitar |
|          todo o potencial da Flui                 |
+--------------------------------------------------+
|  [============================----] 70% concluido |
+--------------------------------------------------+
|  Etapas do Diagnostico:                           |
|  [✓] Conta e Identidade              Concluida    |
|  [✓] Cargo e Experiencia             Concluida    |
|  [✓] Area de Atuacao                 Concluida    |
|  [○] Objetivos                       Pendente     |
|  [○] Topicos de Conteudo             Pendente     |
|  [○] Audiencia e Desafios            Pendente     |
|  [○] Estilo de Comunicacao           Pendente     |
+--------------------------------------------------+
|                    [Continuar Diagnostico]        |
+--------------------------------------------------+
```

---

## 2. Regras de Exibicao

| Status do Onboarding | Comportamento |
|----------------------|---------------|
| `not_started`        | Card visivel com 0% de progresso |
| `in_progress`        | Card visivel com progresso parcial |
| `completed`          | Card NAO aparece |

---

## 3. Arquivos a Criar/Modificar

### 3.1 Criar: `src/components/dashboard/OnboardingProgressCard.tsx`

Novo componente que:

- Recebe `onboardingStatus` e `onboardingStep` do contexto
- Calcula progresso baseado no step atual (7 steps totais)
- Lista todas as etapas com status visual (concluida/pendente)
- Botao CTA que navega para `/onboarding` preservando o step atual

**Props e comportamento:**
```typescript
interface OnboardingProgressCardProps {
  currentStep: number; // 1-7
  totalSteps: number; // 7
  onboardingStatus: 'not_started' | 'in_progress' | 'completed';
}
```

**Mapeamento de etapas (consumindo dados existentes):**
1. Conta e Identidade
2. Cargo e Experiencia
3. Area de Atuacao
4. Objetivos
5. Topicos de Conteudo
6. Audiencia e Desafios
7. Estilo de Comunicacao

### 3.2 Modificar: `src/pages/Dashboard.tsx`

- Importar o novo componente `OnboardingProgressCard`
- Importar dados do usuario via `useApp()` (ja existente)
- Renderizar o card condicionalmente quando `user.onboardingStatus !== 'completed'`
- Posicionar o card no topo do grid principal, antes das Quick Actions

### 3.3 Modificar: `src/pages/Onboarding.tsx`

- Aceitar parametro de query `?step=X` para iniciar em um step especifico
- Preservar navegacao para "continuar de onde parou"

### 3.4 Modificar: `src/contexts/AppContext.tsx`

- Adicionar funcao `setOnboardingStep(step: number)` para atualizar o step atual
- Garantir que `onboardingStep` reflete o progresso real do usuario

---

## 4. Componentes Shadcn Utilizados

| Componente | Uso |
|------------|-----|
| Card | Container principal do card |
| Progress | Barra de progresso visual |
| Button | CTA "Continuar Diagnostico" |
| Badge | Status das etapas (opcional) |

---

## 5. Estilizacao

Seguindo o Visual Dictionary:

- `bg-zinc-900` → Background do card
- `border-zinc-800` → Borda do card
- `border-amber-500/50` → Borda de destaque (indicador de acao pendente)
- `text-zinc-50` → Texto primario
- `text-zinc-400` → Texto secundario
- `emerald-500` → Icone/indicador de etapa concluida
- `amber-500` → Icone/indicador de etapa pendente
- `indigo-600` → Botao CTA

---

## 6. Detalhes Tecnicos

### Componente: OnboardingProgressCard

```tsx
// Estrutura principal
<Card className="border-amber-500/30 bg-zinc-900">
  <CardHeader>
    <div className="flex items-start gap-4">
      <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
        <ClipboardList className="h-6 w-6 text-amber-500" />
      </div>
      <div className="flex-1">
        <CardTitle className="text-lg">
          Complete seu diagnostico para aproveitar todo o potencial da Flui
        </CardTitle>
        <CardDescription>
          {completedSteps} de {totalSteps} etapas concluidas
        </CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    {/* Barra de progresso */}
    <Progress value={progressPercentage} className="h-2 mb-6" />
    
    {/* Lista de etapas */}
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <Circle className="h-5 w-5 text-zinc-600" />
            )}
            <span className={cn(
              isCompleted ? 'text-zinc-400' : 'text-zinc-50'
            )}>
              {step.label}
            </span>
          </div>
          <Badge variant={isCompleted ? 'secondary' : 'outline'}>
            {isCompleted ? 'Concluida' : 'Pendente'}
          </Badge>
        </div>
      ))}
    </div>
    
    {/* CTA */}
    <Button 
      className="w-full mt-6" 
      onClick={() => navigate(`/onboarding?step=${nextPendingStep}`)}
    >
      Continuar Diagnostico
      <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  </CardContent>
</Card>
```

### Integracao no Dashboard

```tsx
// Em Dashboard.tsx, antes das Quick Actions
{user.onboardingStatus !== 'completed' && (
  <OnboardingProgressCard
    currentStep={user.onboardingStep}
    totalSteps={7}
    onboardingStatus={user.onboardingStatus}
  />
)}
```

### Navegacao para Step Especifico

```tsx
// Em Onboarding.tsx
const [searchParams] = useSearchParams();
const initialStep = parseInt(searchParams.get('step') || '1', 10);

const [currentStep, setCurrentStep] = useState(
  Math.min(Math.max(initialStep, 1), stepConfig.length)
);
```

---

## 7. Fluxo de Usuario

```text
Usuario acessa /dashboard
    |
    v
Sistema verifica user.onboardingStatus
    |
    +-- Se 'completed' --> Dashboard normal
    |
    +-- Se 'not_started' ou 'in_progress' --> Exibe card de progresso
            |
            v
        Usuario clica "Continuar Diagnostico"
            |
            v
        Navega para /onboarding?step=X (proxima etapa pendente)
            |
            v
        Onboarding inicia no step correto
```

---

## 8. Responsividade

| Breakpoint | Layout |
|------------|--------|
| Mobile | Card ocupa largura total, lista vertical |
| Tablet | Card ocupa largura total |
| Desktop | Card ocupa largura total do grid |

---

## 9. Atualizacao de Estado

O `onboardingStep` no contexto sera atualizado:
- Quando o usuario avanca para o proximo step no wizard
- Quando o usuario completa o onboarding

Para isso, modificaremos o `completeOnboardingStep` no AppContext para aceitar o step especifico:

```typescript
const updateOnboardingProgress = (step: number) => {
  setUser((prev) => ({
    ...prev,
    onboardingStep: step,
    onboardingStatus: step === 0 ? 'not_started' : 'in_progress',
  }));
};
```

---

## 10. Checklist de Entrega

- [ ] Criar componente OnboardingProgressCard
- [ ] Integrar card no Dashboard.tsx
- [ ] Adicionar suporte a query param `step` no Onboarding.tsx
- [ ] Atualizar AppContext com funcao de update de step
- [ ] Testar exibicao condicional do card
- [ ] Testar navegacao para step especifico
- [ ] Validar responsividade
