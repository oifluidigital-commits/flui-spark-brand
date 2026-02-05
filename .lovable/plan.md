
# Plano de Implementacao — Sistema de Gates Frontend

## Visao Geral

Implementar um sistema de controle de acesso frontend baseado em contexto de usuario (plano, onboarding, sprints ativos, creditos). O sistema controlara limites de uso, bloqueios de funcionalidades e alertas visuais em toda a aplicacao.

---

## 1. Arquivos a Criar/Modificar

| Arquivo | Acao |
|---------|------|
| `src/contexts/UserGateContext.tsx` | CRIAR - Contexto global de gates |
| `src/components/gates/FeatureGate.tsx` | CRIAR - Componente de bloqueio de feature |
| `src/components/gates/PlanBadge.tsx` | CRIAR - Badge de plano exigido |
| `src/components/gates/UpgradePrompt.tsx` | CRIAR - Prompt de upgrade |
| `src/components/gates/CreditWarning.tsx` | CRIAR - Alerta de creditos baixos |
| `src/components/gates/SprintLimitCard.tsx` | CRIAR - Card de limite de sprints |
| `src/hooks/useGate.ts` | CRIAR - Hook de verificacao de gates |
| `src/contexts/AppContext.tsx` | MODIFICAR - Integrar userContext |
| `src/components/layout/TopBar.tsx` | MODIFICAR - Adicionar alerta de creditos |
| `src/pages/Sprints.tsx` | MODIFICAR - Aplicar gate de limite |
| `src/pages/SprintDetail.tsx` | MODIFICAR - Aplicar gate de creditos IA |
| `src/data/mockData.ts` | MODIFICAR - Adicionar mockUserContext |

---

## 2. Estrutura do UserContext (Mock Global)

```typescript
// src/contexts/UserGateContext.tsx

type PlanType = 'free' | 'pro' | 'studio';

interface UserGateContext {
  plan: PlanType;
  onboardingCompleted: boolean;
  activeSprints: number;
  contentCredits: number;
}

// Plan limits configuration
const planLimits = {
  free: {
    maxActiveSprints: 1,
    maxIdeasPerMonth: 10,
    aiCredits: 500,
    hasRadar: false,
    hasCompetitorAnalysis: false,
    hasAllFrameworks: false,
  },
  pro: {
    maxActiveSprints: Infinity,
    maxIdeasPerMonth: Infinity,
    aiCredits: 5000,
    hasRadar: true,
    hasCompetitorAnalysis: true,
    hasAllFrameworks: true,
  },
  studio: {
    maxActiveSprints: Infinity,
    maxIdeasPerMonth: Infinity,
    aiCredits: 20000,
    hasRadar: true,
    hasCompetitorAnalysis: true,
    hasAllFrameworks: true,
    hasMultipleBrands: true,
    hasTeamCollaboration: true,
    hasApiAccess: true,
  },
};
```

---

## 3. Hook useGate

```typescript
// src/hooks/useGate.ts

type GateType = 
  | 'create-sprint'
  | 'use-ai'
  | 'access-radar'
  | 'access-competitor-analysis'
  | 'use-advanced-frameworks'
  | 'access-strategy';

interface GateResult {
  allowed: boolean;
  reason?: string;
  requiredPlan?: PlanType;
  action?: 'upgrade' | 'complete-onboarding' | 'wait-credits';
}

const useGate = (gateType: GateType): GateResult => {
  const { userGate, planLimits } = useUserGate();
  
  switch (gateType) {
    case 'create-sprint':
      if (userGate.activeSprints >= planLimits[userGate.plan].maxActiveSprints) {
        return {
          allowed: false,
          reason: 'Você atingiu o limite de sprints ativos do seu plano.',
          requiredPlan: 'pro',
          action: 'upgrade',
        };
      }
      return { allowed: true };
      
    case 'use-ai':
      if (userGate.contentCredits <= 0) {
        return {
          allowed: false,
          reason: 'Seus créditos de IA acabaram.',
          requiredPlan: 'pro',
          action: 'upgrade',
        };
      }
      return { allowed: true };
      
    case 'access-radar':
      if (!planLimits[userGate.plan].hasRadar) {
        return {
          allowed: false,
          reason: 'O Radar de Tendências é exclusivo para planos Pro e Studio.',
          requiredPlan: 'pro',
          action: 'upgrade',
        };
      }
      return { allowed: true };
      
    case 'access-strategy':
      if (!userGate.onboardingCompleted) {
        return {
          allowed: false,
          reason: 'Complete o diagnóstico para acessar sua estratégia.',
          action: 'complete-onboarding',
        };
      }
      return { allowed: true };
      
    default:
      return { allowed: true };
  }
};
```

---

## 4. Componente FeatureGate

```tsx
// src/components/gates/FeatureGate.tsx

interface FeatureGateProps {
  gate: GateType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
}

const FeatureGate = ({ gate, children, fallback, showUpgradePrompt = true }: FeatureGateProps) => {
  const gateResult = useGate(gate);
  
  if (gateResult.allowed) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  if (showUpgradePrompt && gateResult.action === 'upgrade') {
    return (
      <UpgradePrompt 
        reason={gateResult.reason}
        requiredPlan={gateResult.requiredPlan}
      />
    );
  }
  
  if (gateResult.action === 'complete-onboarding') {
    return <OnboardingRequiredState reason={gateResult.reason} />;
  }
  
  return null;
};
```

---

## 5. Componente PlanBadge

```tsx
// src/components/gates/PlanBadge.tsx

interface PlanBadgeProps {
  requiredPlan: 'pro' | 'studio';
  size?: 'sm' | 'md';
}

const PlanBadge = ({ requiredPlan, size = 'sm' }: PlanBadgeProps) => {
  const config = {
    pro: { label: 'Pro', className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    studio: { label: 'Studio', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  };
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        config[requiredPlan].className,
        size === 'sm' ? 'text-xs px-1.5 py-0' : 'text-sm px-2 py-0.5'
      )}
    >
      <Crown className={size === 'sm' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1'} />
      {config[requiredPlan].label}
    </Badge>
  );
};
```

---

## 6. Componente UpgradePrompt

```tsx
// src/components/gates/UpgradePrompt.tsx

interface UpgradePromptProps {
  reason: string;
  requiredPlan: PlanType;
  variant?: 'card' | 'inline' | 'banner';
}

const UpgradePrompt = ({ reason, requiredPlan, variant = 'card' }: UpgradePromptProps) => {
  const navigate = useNavigate();
  
  if (variant === 'banner') {
    return (
      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-indigo-400" />
          <span className="text-sm text-zinc-50">{reason}</span>
        </div>
        <Button size="sm" onClick={() => navigate('/pricing')}>
          Ver Planos
        </Button>
      </div>
    );
  }
  
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>{reason}</span>
        <Button variant="link" size="sm" className="h-auto p-0" onClick={() => navigate('/pricing')}>
          Fazer upgrade
        </Button>
      </div>
    );
  }
  
  // Card variant (default)
  return (
    <Card className="border-indigo-500/30 bg-indigo-500/5">
      <CardContent className="p-6 text-center space-y-4">
        <div className="mx-auto w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center">
          <Lock className="h-7 w-7 text-indigo-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-zinc-50">
            Recurso exclusivo
          </h3>
          <p className="text-muted-foreground text-sm">{reason}</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <PlanBadge requiredPlan={requiredPlan} size="md" />
        </div>
        <Button onClick={() => navigate('/pricing')} className="w-full">
          <Sparkles className="h-4 w-4 mr-2" />
          Fazer Upgrade
        </Button>
      </CardContent>
    </Card>
  );
};
```

---

## 7. Componente CreditWarning

```tsx
// src/components/gates/CreditWarning.tsx

interface CreditWarningProps {
  currentCredits: number;
  totalCredits: number;
}

const CreditWarning = ({ currentCredits, totalCredits }: CreditWarningProps) => {
  const navigate = useNavigate();
  const percentage = Math.round((currentCredits / totalCredits) * 100);
  
  // Only show warning if credits below 20%
  if (percentage > 20) return null;
  
  const isExhausted = currentCredits <= 0;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
        isExhausted 
          ? "bg-red-500/10 border border-red-500/20 hover:bg-red-500/20"
          : "bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20"
      )}
      onClick={() => navigate('/pricing')}
    >
      <AlertTriangle className={cn(
        "h-4 w-4",
        isExhausted ? "text-red-500" : "text-amber-500"
      )} />
      <span className={cn(
        "text-xs font-medium",
        isExhausted ? "text-red-500" : "text-amber-500"
      )}>
        {isExhausted ? 'Créditos esgotados' : `${percentage}% restante`}
      </span>
    </div>
  );
};
```

---

## 8. Componente SprintLimitCard

```tsx
// src/components/gates/SprintLimitCard.tsx

interface SprintLimitCardProps {
  currentSprints: number;
  maxSprints: number;
}

const SprintLimitCard = ({ currentSprints, maxSprints }: SprintLimitCardProps) => {
  const navigate = useNavigate();
  const isAtLimit = currentSprints >= maxSprints;
  
  if (!isAtLimit) return null;
  
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      'min-h-[240px] rounded-lg',
      'border border-amber-500/30',
      'bg-amber-500/5'
    )}>
      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
        <Lock className="h-6 w-6 text-amber-500" />
      </div>
      <div className="text-center space-y-1 px-4">
        <span className="text-zinc-50 text-sm font-medium">
          Limite de sprints atingido
        </span>
        <p className="text-xs text-muted-foreground">
          Você está usando {currentSprints}/{maxSprints} sprint(s) do plano gratuito.
        </p>
      </div>
      <Button size="sm" onClick={() => navigate('/pricing')}>
        <Sparkles className="h-4 w-4 mr-2" />
        Fazer Upgrade
      </Button>
    </div>
  );
};
```

---

## 9. Integracao com AppContext

```typescript
// Adicionar ao AppContext.tsx

interface UserGateState {
  plan: 'free' | 'pro' | 'studio';
  onboardingCompleted: boolean;
  activeSprints: number;
  contentCredits: number;
}

// Mock inicial
const initialUserGate: UserGateState = {
  plan: 'free',
  onboardingCompleted: false,
  activeSprints: 1,
  contentCredits: 350,
};

// Adicionar ao contexto
const [userGate, setUserGate] = useState<UserGateState>(initialUserGate);

// Adicionar ao provider value
userGate,
setUserGate,
```

---

## 10. Modificacao TopBar (Alerta de Creditos)

```tsx
// src/components/layout/TopBar.tsx

// Adicionar import
import { CreditWarning } from '@/components/gates/CreditWarning';

// Modificar secao de creditos
<div className="flex items-center gap-3">
  {/* Credit Warning (shown when < 20%) */}
  <CreditWarning 
    currentCredits={remainingCredits} 
    totalCredits={user.aiCredits.total} 
  />
  
  {/* Existing credits counter */}
  <div className="flex items-center gap-3 px-4 py-2 bg-secondary rounded-lg">
    <Sparkles className="h-4 w-4 text-primary" />
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">
          {remainingCredits.toLocaleString('pt-BR')}
        </span>
        <span className="text-xs text-muted-foreground">créditos IA</span>
      </div>
      <Progress value={100 - creditPercentage} className="h-1 w-24" />
    </div>
  </div>
</div>
```

---

## 11. Modificacao Sprints.tsx (Gate de Limite)

```tsx
// src/pages/Sprints.tsx

// Adicionar import
import { useGate } from '@/hooks/useGate';
import { SprintLimitCard } from '@/components/gates/SprintLimitCard';
import { PlanBadge } from '@/components/gates/PlanBadge';

// No componente
const { userGate } = useApp();
const createSprintGate = useGate('create-sprint');

// Modificar NewSprintCard condicional
{createSprintGate.allowed ? (
  <NewSprintCard onClick={handleOpenWizard} />
) : (
  <SprintLimitCard 
    currentSprints={userGate.activeSprints}
    maxSprints={1}
  />
)}
```

---

## 12. Modificacao SprintDetail.tsx (Gate de Creditos IA)

```tsx
// Ao usar acoes de IA
const aiGate = useGate('use-ai');

// Botao de gerar com IA
<Button
  variant="outline"
  className="gap-2"
  disabled={!aiGate.allowed}
  onClick={handleGenerateAI}
>
  <Sparkles className="h-4 w-4" />
  Gerar Sugestões IA
  {!aiGate.allowed && <PlanBadge requiredPlan="pro" />}
</Button>

// Se bloqueado
{!aiGate.allowed && (
  <UpgradePrompt 
    reason={aiGate.reason}
    requiredPlan={aiGate.requiredPlan}
    variant="banner"
  />
)}
```

---

## 13. Gates por Pagina

| Pagina | Gate | Condicao | Acao |
|--------|------|----------|------|
| `/strategy` | Onboarding | `!onboardingCompleted` | Mostrar StrategyBlockedState |
| `/content-lab/sprints` | Sprint Limit | `activeSprints >= maxSprints` | Bloquear criacao |
| `/content-lab/radar` | Plan | `plan === 'free'` | Mostrar UpgradePrompt |
| `SprintDetail` | AI Credits | `contentCredits <= 0` | Desabilitar acoes IA |
| Wizard Step 5 | AI Credits | `contentCredits <= 0` | Mostrar aviso |
| `Ideas` (criar) | Ideas Limit | `ideasThisMonth >= maxIdeas` | Bloquear criacao |
| `Brand` (concorrentes) | Plan | `plan === 'free'` | Badge Pro required |

---

## 14. Mock Data Inicial

```typescript
// src/data/mockData.ts

// Adicionar ao final do arquivo
export const mockUserGateContext = {
  // Cenario: Usuario free com limite proximo
  free_near_limit: {
    plan: 'free' as const,
    onboardingCompleted: false,
    activeSprints: 1,
    contentCredits: 150,
  },
  
  // Cenario: Usuario free sem creditos
  free_no_credits: {
    plan: 'free' as const,
    onboardingCompleted: true,
    activeSprints: 1,
    contentCredits: 0,
  },
  
  // Cenario: Usuario Pro
  pro_normal: {
    plan: 'pro' as const,
    onboardingCompleted: true,
    activeSprints: 3,
    contentCredits: 4200,
  },
  
  // Cenario: Usuario Studio
  studio_full: {
    plan: 'studio' as const,
    onboardingCompleted: true,
    activeSprints: 5,
    contentCredits: 18500,
  },
};

// Cenario ativo para demo
export const activeUserGateScenario = 'free_near_limit';
```

---

## 15. Hierarquia Visual dos Gates

```text
+----------------------------------------------------------+
|                    GATE HIERARCHY                        |
+----------------------------------------------------------+
|                                                          |
|  1. AUTHENTICATION (ja existe em ProtectedRoute)         |
|     └─ Redireciona para /login                           |
|                                                          |
|  2. ONBOARDING (soft gate - informativo)                 |
|     └─ Exibe card de progresso no Dashboard              |
|     └─ Bloqueia apenas /strategy se nao concluido        |
|                                                          |
|  3. PLAN LIMITS (hard gate - upgrade required)           |
|     └─ Sprints: max 1 para free                          |
|     └─ Ideas: max 10/mes para free                       |
|     └─ Features: Radar, Concorrentes bloqueados          |
|                                                          |
|  4. CREDITS (soft gate - warning + disable)              |
|     └─ < 20%: Alerta visual no TopBar                    |
|     └─ = 0: Desabilita acoes de IA                       |
|                                                          |
+----------------------------------------------------------+
```

---

## 16. Componentes UI Utilizados

- `Card`, `CardContent` - Containers de bloqueio
- `Badge` - PlanBadge (Pro/Studio)
- `Button` - CTAs de upgrade
- `Progress` - Barra de creditos
- `Tooltip` - Explicacoes de limites
- Icons: `Lock`, `Crown`, `Sparkles`, `AlertTriangle`, `ArrowRight`

---

## 17. Checklist de Entrega

### Contexto e Hook
- [ ] Criar `src/contexts/UserGateContext.tsx`
- [ ] Definir `UserGateState` interface
- [ ] Criar `planLimits` configuration
- [ ] Criar `src/hooks/useGate.ts`
- [ ] Integrar com `AppContext.tsx`

### Componentes de Gate
- [ ] Criar `FeatureGate.tsx`
- [ ] Criar `PlanBadge.tsx`
- [ ] Criar `UpgradePrompt.tsx` (3 variants)
- [ ] Criar `CreditWarning.tsx`
- [ ] Criar `SprintLimitCard.tsx`

### Aplicacao nas Paginas
- [ ] Modificar `TopBar.tsx` com CreditWarning
- [ ] Modificar `Sprints.tsx` com SprintLimitCard
- [ ] Modificar `SprintDetail.tsx` com AI gate
- [ ] Verificar `Strategy.tsx` (ja tem gate de onboarding)
- [ ] Adicionar gate em `Radar.tsx`

### Mock Data
- [ ] Adicionar `mockUserGateContext` em mockData
- [ ] Criar cenarios de teste
- [ ] Configurar cenario ativo para demo

### Testes de Cenarios
- [ ] Free user: limite de sprints
- [ ] Free user: creditos baixos (< 20%)
- [ ] Free user: creditos esgotados
- [ ] Free user: onboarding incompleto
- [ ] Pro user: acesso total

