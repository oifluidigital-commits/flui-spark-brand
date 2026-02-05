

# Plano de Evolucao — Wizard de Sprints com UX Guiada por IA

## Visao Geral

Evoluir o wizard de criacao de sprints para tornar o fluxo mais claro, acessivel e guiado por IA. As modificacoes abrangem 4 etapas principais: selecao de pilar, periodo da sprint, formatos de conteudo e sistema de frameworks com recomendacao automatica pela IA.

---

## 1. Analise da Situacao Atual

### Etapa 1 (Intencao Estrategica)
- **Pilares**: Exibidos como cards com bolinhas coloridas (`w-3 h-3 rounded-full`)
- **Problema**: Bolinhas coloridas nao sao acessiveis para usuarios com baixa percepcao de cor

### Etapa 2 (Escopo)
- **Datas**: Dois campos `<Input type="date">` separados
- **Problema**: UX fragmentada, sem validacao visual do intervalo

### Etapa 3 (Estrutura)
- **Formatos**: Lista limitada de 7 opcoes (`contentFormats`)
- **Problema**: Faltam formatos relevantes como "Post LinkedIn (carrossel)", "Roteiro de video", "Email marketing", etc.

### Etapa 6 (Ajuste do Plano)
- **Frameworks**: Usuario deve escolher manualmente framework por conteudo
- **Problema**: IA nao recomenda frameworks automaticamente; UX complexa com multiplos campos visiveis

---

## 2. Modificacao 1: Pilares com Icones Distintos

### Implementacao

Substituir bolinhas coloridas por icones Lucide com formas e cores distintas.

**Antes (linha 848-850)**:
```tsx
<span
  className="w-3 h-3 rounded-full"
  style={{ backgroundColor: pillar.color }}
/>
```

**Depois**:
```tsx
const pillarIcons: Record<string, { icon: LucideIcon; color: string }> = {
  'pillar-1': { icon: Crown, color: '#6366f1' },      // Autoridade - Coroa
  'pillar-2': { icon: GraduationCap, color: '#10b981' }, // Educacional - Chapeu
  'pillar-3': { icon: Heart, color: '#f59e0b' },       // Conexao - Coracao
  'pillar-4': { icon: Target, color: '#ef4444' },      // Conversao - Alvo
};

// No render:
{mockPillars.map((pillar) => {
  const iconConfig = pillarIcons[pillar.id];
  const IconComponent = iconConfig?.icon || Circle;
  return (
    <button
      key={pillar.id}
      onClick={() => setWizardData({ ...wizardData, pillarId: pillar.id })}
      className={cn(
        'p-3 rounded-lg border text-left transition-all',
        wizardData.pillarId === pillar.id
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50'
      )}
    >
      <div className="flex items-center gap-2">
        <IconComponent 
          className="h-5 w-5" 
          style={{ color: iconConfig?.color }}
        />
        <span className="font-medium text-sm">{pillar.name}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
        {pillar.description}
      </p>
    </button>
  );
})}
```

### Beneficios
- Acessibilidade: Forma + cor para identificacao
- Clareza visual: Icones distintos para cada pilar
- Consistencia: Uso de Lucide Icons do design system

---

## 3. Modificacao 2: Date Range Picker

### Implementacao

Substituir os dois campos `<Input type="date">` por um Date Range Picker com Popover e Calendar.

**Imports adicionais**:
```tsx
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
```

**Estado do wizard atualizado**:
```tsx
// Substituir startDate/endDate strings por objeto DateRange
const [dateRange, setDateRange] = useState<DateRange | undefined>({
  from: wizardData.startDate ? new Date(wizardData.startDate) : undefined,
  to: wizardData.endDate ? new Date(wizardData.endDate) : undefined,
});
```

**Componente Date Range Picker**:
```tsx
<div className="space-y-3">
  <Label>Período da Sprint</Label>
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !dateRange?.from && "text-muted-foreground"
        )}
      >
        <Calendar className="mr-2 h-4 w-4" />
        {dateRange?.from ? (
          dateRange.to ? (
            <>
              {format(dateRange.from, "dd MMM yyyy", { locale: ptBR })} -{" "}
              {format(dateRange.to, "dd MMM yyyy", { locale: ptBR })}
            </>
          ) : (
            format(dateRange.from, "dd MMM yyyy", { locale: ptBR })
          )
        ) : (
          "Selecione o período"
        )}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={(range) => {
          setDateRange(range);
          setWizardData(prev => ({
            ...prev,
            startDate: range?.from?.toISOString().split('T')[0] || '',
            endDate: range?.to?.toISOString().split('T')[0] || '',
          }));
        }}
        numberOfMonths={2}
        locale={ptBR}
        disabled={(date) => isBefore(date, new Date())}
        className="pointer-events-auto"
      />
    </PopoverContent>
  </Popover>
  {dateRange?.from && dateRange?.to && (
    <p className="text-xs text-muted-foreground">
      Duração: {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} dias
    </p>
  )}
</div>
```

### Validacao
- Data final deve ser posterior a data inicial (handled by react-day-picker)
- Datas passadas desabilitadas

---

## 4. Modificacao 3: Lista Exaustiva de Formatos

### Nova Lista de Formatos

```tsx
const contentFormats = [
  { id: 'post-linkedin-text', label: 'Post LinkedIn (texto curto)', category: 'social' },
  { id: 'post-linkedin-carousel', label: 'Post LinkedIn (carrossel)', category: 'social' },
  { id: 'article', label: 'Artigo longo', category: 'longform' },
  { id: 'newsletter', label: 'Newsletter', category: 'longform' },
  { id: 'video-short', label: 'Roteiro de vídeo curto', category: 'video' },
  { id: 'video-long', label: 'Roteiro de vídeo longo', category: 'video' },
  { id: 'thread', label: 'Thread', category: 'social' },
  { id: 'case-study', label: 'Case', category: 'longform' },
  { id: 'landing-page', label: 'Landing page', category: 'conversion' },
  { id: 'email-marketing', label: 'Email marketing', category: 'conversion' },
  { id: 'story', label: 'Story', category: 'social' },
  { id: 'reels', label: 'Reels / TikTok', category: 'video' },
];
```

### UX do Seletor: Grid de Cards Selecionaveis

```tsx
<div className="space-y-3">
  <Label>Formatos de conteúdo (selecione múltiplos)</Label>
  <div className="grid grid-cols-2 gap-2">
    {contentFormats.map((format) => (
      <button
        key={format.id}
        type="button"
        onClick={() => toggleFormat(format.id)}
        className={cn(
          'p-3 rounded-lg border text-left transition-all text-sm',
          wizardData.formats.includes(format.id)
            ? 'bg-primary/10 border-primary text-foreground'
            : 'border-border hover:border-primary/50 text-muted-foreground'
        )}
      >
        <div className="flex items-center gap-2">
          {wizardData.formats.includes(format.id) && (
            <Check className="h-4 w-4 text-primary shrink-0" />
          )}
          <span className={cn(
            !wizardData.formats.includes(format.id) && "ml-6"
          )}>
            {format.label}
          </span>
        </div>
      </button>
    ))}
  </div>
  <p className="text-xs text-muted-foreground">
    {wizardData.formats.length} formato(s) selecionado(s)
  </p>
</div>
```

---

## 5. Modificacao 4: IA Recomenda Frameworks Automaticamente

### Nova Logica de Geracao de Sugestoes

A funcao `generateMockSuggestions` agora inclui recomendacao automatica de framework:

```tsx
// Framework recommendation based on intention and format
const recommendFramework = (
  intention: 'educate' | 'engage' | 'convert',
  format: string
): { framework: string; reason: string; benefit: string } => {
  // Logic for AI recommendation
  if (intention === 'convert') {
    return {
      framework: 'aida',
      reason: 'Estrutura ideal para conteúdos de conversão, guiando o leitor até a ação',
      benefit: 'Maior taxa de cliques e conversões'
    };
  }
  if (intention === 'educate' && format.includes('carousel')) {
    return {
      framework: 'educational',
      reason: 'Formato de carrossel combina com estrutura didática em etapas',
      benefit: 'Retenção e compreensão do conteúdo'
    };
  }
  if (intention === 'engage') {
    return {
      framework: 'storytelling',
      reason: 'Narrativa gera conexão emocional e comentários',
      benefit: 'Maior engajamento e compartilhamentos'
    };
  }
  // Default
  return {
    framework: 'hvc',
    reason: 'Estrutura direta e eficaz para redes sociais',
    benefit: 'Clareza e objetividade'
  };
};

// Update createSuggestion to include recommended framework
const createSuggestion = (intention, index): SuggestedContent => {
  const recommendation = recommendFramework(intention, format);
  return {
    id: `suggestion-${Date.now()}-${index}`,
    theme,
    intention,
    format,
    strategicObjective: '...',
    hook: '...',
    suggestedCta: '...',
    framework: recommendation.framework, // Pre-populated!
    frameworkReason: recommendation.reason,
    frameworkBenefit: recommendation.benefit,
  };
};
```

### Tipo SuggestedContent Atualizado

```tsx
interface SuggestedContent {
  id: string;
  theme: string;
  intention: 'educate' | 'engage' | 'convert';
  format: string;
  strategicObjective: string;
  hook: string;
  suggestedCta: string;
  framework: string;
  frameworkReason?: string;  // NEW
  frameworkBenefit?: string; // NEW
}
```

---

## 6. Modificacao 5: UX de Selecao de Framework no Step 6

### Nova Interface do Content Detail Sheet

Quando o usuario abre o Sheet de detalhamento, a UX deve:
1. Mostrar o framework recomendado pela IA em destaque
2. Ocultar outros campos apos selecao
3. Permitir troca por outro framework

```tsx
// Inside ContentDetailSheet
const renderFrameworkSelection = (content: SuggestedContent) => {
  const currentFramework = contentFrameworks.find(f => f.id === content.framework);
  const recommendedFramework = content.framework; // IA's original recommendation
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          Framework de Conteúdo
          <Badge variant="default" className="text-xs bg-primary">
            Obrigatório
          </Badge>
        </Label>
      </div>

      {/* AI Recommendation Banner */}
      <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary mt-0.5" />
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium">Recomendação da IA</p>
            <p className="text-xs text-muted-foreground">
              {content.frameworkReason || 'Baseado na intenção e formato selecionados'}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Framework Display */}
      {currentFramework && (
        <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span className="font-medium">{currentFramework.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowFrameworkOptions(true)}
            >
              Trocar
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {currentFramework.description}
          </p>
          {content.frameworkBenefit && (
            <div className="flex items-center gap-2 mt-2 text-xs text-emerald-500">
              <Check className="h-3 w-3" />
              {content.frameworkBenefit}
            </div>
          )}
        </div>
      )}

      {/* Framework Options (shown when "Trocar" is clicked) */}
      {showFrameworkOptions && (
        <div className="space-y-2 max-h-[250px] overflow-y-auto">
          {contentFrameworks
            .filter(f => f.id !== content.framework)
            .map((framework) => (
              <button
                key={framework.id}
                onClick={() => {
                  updateApprovedContent(content.id, { framework: framework.id });
                  setShowFrameworkOptions(false);
                }}
                className="w-full p-3 rounded-lg border border-border text-left hover:border-primary/50 transition-all"
              >
                <span className="font-medium text-sm">{framework.name}</span>
                <p className="text-xs text-muted-foreground mt-1">
                  {framework.description}
                </p>
                <p className="text-xs text-primary/80 mt-1">
                  {framework.bestUse}
                </p>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
```

### Simplificacao Visual

Quando framework esta selecionado:
- Ocultar lista completa de frameworks
- Mostrar apenas resumo do framework escolhido
- Botao "Trocar" para alterar

---

## 7. Modificacao 6: Validacao de Framework Obrigatorio

### Regra de Negocio

Se usuario nao selecionar framework manualmente, a IA ja tera sugerido um. A validacao garante que:

```tsx
// Antes de avancar do Step 6 para Step 7
const canProceedStep6 = wizardData.approvedContents.length >= 1 && 
  wizardData.approvedContents.every(c => c.framework);

// Mensagem se houver conteudo sem framework
{wizardData.approvedContents.some(c => !c.framework) && (
  <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
    <AlertTriangle className="h-4 w-4 text-amber-500" />
    <span className="text-xs text-amber-500">
      Todos os conteúdos precisam ter um framework selecionado.
    </span>
  </div>
)}
```

---

## 8. Imports Adicionais

```tsx
import { 
  Crown, 
  GraduationCap, 
  Heart, 
  Target,
  Circle,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
```

---

## 9. Arquivo a Modificar

| Arquivo | Modificacao |
|---------|-------------|
| `src/pages/Sprints.tsx` | Todas as modificacoes do wizard |

---

## 10. Resumo das Mudancas

### Etapa 1 — Pilares
- Bolinhas coloridas → Icones Lucide distintos (Crown, GraduationCap, Heart, Target)
- Acessibilidade melhorada: forma + cor

### Etapa 2 — Periodo
- Dois inputs date → Date Range Picker com Calendar
- Validacao visual do intervalo
- Duracao calculada automaticamente

### Etapa 3 — Formatos
- 7 formatos → 12 formatos exaustivos
- Chips → Grid de cards selecionaveis
- Categorias implicitas (social, longform, video, conversion)

### Etapa 6 — Frameworks
- Usuario escolhe → IA recomenda automaticamente
- UX simplificada: mostra apenas framework selecionado
- Botao "Trocar" para alterar
- Oculta campos redundantes apos selecao

### Validacao
- Framework obrigatorio para todos os conteudos
- IA sempre sugere um framework se usuario nao definir

---

## 11. Secao Tecnica Detalhada

### Mapeamento de Pilares para Icones

```typescript
const pillarIconMap: Record<string, LucideIcon> = {
  'pillar-1': Crown,        // Autoridade
  'pillar-2': GraduationCap, // Educacional
  'pillar-3': Heart,         // Conexao
  'pillar-4': Target,        // Conversao
};
```

### Algoritmo de Recomendacao de Framework

```typescript
const getFrameworkRecommendation = (
  intention: 'educate' | 'engage' | 'convert',
  format: string,
  pillarId: string
): { id: string; reason: string; benefit: string } => {
  // Convert intention -> primary framework mapping
  const intentionMapping: Record<string, string[]> = {
    educate: ['educational', 'hvc', 'authority'],
    engage: ['storytelling', 'bab', 'pas'],
    convert: ['aida', '4ps', 'pas'],
  };

  // Format-specific adjustments
  if (format.includes('carousel')) {
    return {
      id: 'educational',
      reason: 'Carrosséis funcionam melhor com estrutura de etapas',
      benefit: 'Maior retenção e salvamentos'
    };
  }
  
  if (format === 'video-short' || format === 'reels') {
    return {
      id: 'hvc',
      reason: 'Vídeos curtos precisam de gancho imediato e CTA direto',
      benefit: 'Maior taxa de visualização completa'
    };
  }

  // Default based on intention
  const defaultFramework = intentionMapping[intention][0];
  return {
    id: defaultFramework,
    reason: `Framework otimizado para conteúdos de ${
      intention === 'educate' ? 'educação' :
      intention === 'engage' ? 'engajamento' : 'conversão'
    }`,
    benefit: contentFrameworks.find(f => f.id === defaultFramework)?.bestUse || ''
  };
};
```

---

## 12. Checklist de Entrega

### Etapa 1 — Pilares com Icones
- [ ] Adicionar imports de icones (Crown, GraduationCap, Heart, Target)
- [ ] Criar mapeamento pillarId → icone
- [ ] Substituir bolinhas por icones no renderWizardStep1
- [ ] Manter cores originais nos icones

### Etapa 2 — Date Range Picker
- [ ] Adicionar imports de Popover, Calendar, date-fns
- [ ] Criar estado dateRange
- [ ] Implementar Date Range Picker com dois meses
- [ ] Adicionar validacao de data minima (hoje)
- [ ] Exibir duracao em dias

### Etapa 3 — Formatos Exaustivos
- [ ] Expandir contentFormats de 7 para 12 opcoes
- [ ] Atualizar UX para grid de cards selecionaveis
- [ ] Adicionar contador de formatos selecionados

### Etapa 6 — Framework com IA
- [ ] Atualizar generateMockSuggestions para incluir framework recomendado
- [ ] Adicionar campos frameworkReason e frameworkBenefit ao tipo
- [ ] Redesenhar Sheet de detalhamento com foco no framework
- [ ] Implementar "Trocar" para alterar framework
- [ ] Ocultar campos redundantes apos selecao

### Geral
- [ ] Manter toda logica existente do wizard
- [ ] Nao criar novas paginas
- [ ] Usar apenas Side Panels (Sheet) para detalhamento
- [ ] Seguir design system existente

