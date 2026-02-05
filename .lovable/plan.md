
# Plano de Evolucao — Pagina de Sprints

## Visao Geral

Evoluir a pagina existente de Sprints (`/content-lab/sprints`) com foco em clareza estrategica, eficiencia operacional e criacao guiada, mantendo toda a estrutura atual de paginas, rotas, dados e logica.

---

## 1. Analise da Situacao Atual

### Estrutura Existente

**Arquivo**: `src/pages/Sprints.tsx`

**Componentes utilizados**:
- Table, TableHeader, TableBody, TableRow, TableCell, TableHead
- Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
- Button, Input, Label, Textarea, Badge, Progress
- Select, SelectContent, SelectItem, SelectTrigger, SelectValue
- DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger

**Dados do Sprint** (type Sprint):
- id, title, description, status, theme
- startDate, endDate
- alignmentScore, contentsPlanned, contentsPublished
- pillarId, createdAt, updatedAt

**Dados Mock disponíveis**:
- mockPillars (4 pilares: Autoridade, Educacional, Conexao, Conversao)
- mockSprints (3 sprints de exemplo)
- mockIdeas (para simular conteudos dentro do sprint)

---

## 2. Modificacoes na Tabela de Sprints

### 2.1 Coluna "Sprint" — Hierarquia Estrategica

**Antes**:
```
Sprint
├── Titulo (font-medium)
└── Tema (text-muted-foreground)
```

**Depois**:
```
Sprint
├── Titulo (font-medium)
├── Pilar de conteudo (Badge colorido pequeno)
└── Objetivo estrategico resumido (text-xs text-muted-foreground, max 60 chars)
```

**Implementacao**:
```tsx
<TableCell>
  <div className="space-y-1">
    <div className="font-medium">{sprint.title}</div>
    <div className="flex items-center gap-2">
      {pillar && (
        <Badge 
          variant="outline" 
          className="text-xs px-1.5 py-0"
          style={{ borderColor: pillar.color, color: pillar.color }}
        >
          {pillar.name}
        </Badge>
      )}
    </div>
    <div className="text-xs text-muted-foreground line-clamp-1">
      {sprint.description.slice(0, 60)}...
    </div>
  </div>
</TableCell>
```

### 2.2 Adicionar Indicador de Prioridade

**Nova coluna ou indicador visual junto ao Status**:

Adicionar campo `priority` no mock data com valores: `high`, `medium`, `low`

**Visualizacao**:
```tsx
// Dot indicator junto ao titulo
<span className={cn(
  "w-2 h-2 rounded-full inline-block mr-2",
  priority === 'high' && "bg-red-500",
  priority === 'medium' && "bg-amber-500",
  priority === 'low' && "bg-emerald-500"
)} />
```

**Nota**: Como nao podemos alterar types, usaremos mock inline para demonstracao.

### 2.3 Progresso Explicavel com Tooltip

**Estrutura atual**:
```
Progresso: 4/10 [========--] (barra simples)
```

**Evolucao com Tooltip**:
```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <div className="w-32 cursor-help">
      <div className="flex items-center justify-between text-xs mb-1">
        <span>{sprint.contentsPublished}/{sprint.contentsPlanned}</span>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  </TooltipTrigger>
  <TooltipContent side="top" className="w-48">
    <div className="space-y-1 text-xs">
      <p className="font-medium">Detalhes do Progresso</p>
      <div className="flex justify-between">
        <span>Total:</span>
        <span>{sprint.contentsPlanned} conteudos</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Rascunho:</span>
        <span>{mockProgressDetails.draft}</span>
      </div>
      <div className="flex justify-between text-muted-foreground">
        <span>Em revisao:</span>
        <span>{mockProgressDetails.review}</span>
      </div>
      <div className="flex justify-between text-emerald-500">
        <span>Publicados:</span>
        <span>{sprint.contentsPublished}</span>
      </div>
    </div>
  </TooltipContent>
</Tooltip>
```

### 2.4 Score com Explicabilidade

**Evolucao com HoverCard para mais detalhes**:
```tsx
<HoverCard>
  <HoverCardTrigger asChild>
    <div className="flex items-center gap-2 cursor-help">
      <Target className="h-4 w-4 text-muted-foreground" />
      <span className={cn(
        "font-medium",
        sprint.alignmentScore >= 80 && "text-emerald-500",
        sprint.alignmentScore >= 50 && sprint.alignmentScore < 80 && "text-amber-500",
        sprint.alignmentScore < 50 && "text-red-500"
      )}>
        {sprint.alignmentScore}%
      </span>
    </div>
  </HoverCardTrigger>
  <HoverCardContent side="left" className="w-64">
    <div className="space-y-2">
      <p className="font-medium text-sm">Composicao do Score</p>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Aderencia a estrategia</span>
          <span className="text-emerald-500">85%</span>
        </div>
        <div className="flex justify-between">
          <span>Consistencia de publicacao</span>
          <span className="text-amber-500">70%</span>
        </div>
        <div className="flex justify-between">
          <span>Alinhamento com publico</span>
          <span className="text-emerald-500">90%</span>
        </div>
        <div className="flex justify-between">
          <span>Diversidade de formatos</span>
          <span className="text-amber-500">75%</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground pt-2 border-t">
        Score gerado por IA com base na sua estrategia
      </p>
    </div>
  </HoverCardContent>
</HoverCard>
```

### 2.5 Destaque Visual da Sprint Ativa

**Aplicar estilo diferenciado na TableRow quando status === 'active'**:
```tsx
<TableRow 
  key={sprint.id} 
  className={cn(
    "hover:bg-secondary/50 transition-colors",
    sprint.status === 'active' && "bg-primary/5 border-l-2 border-l-primary"
  )}
>
```

---

## 3. Acoes Rapidas Aprimoradas

### Menu de Acoes Atual (manter)

```
├── Editar
├── Duplicar
├── Arquivar
└── Excluir
```

### Adicionar "Visualizar detalhes"

```tsx
<DropdownMenuItem onClick={() => handleViewDetails(sprint)}>
  <Eye className="h-4 w-4 mr-2" />
  Visualizar detalhes
</DropdownMenuItem>
```

**Nota**: O "Visualizar detalhes" abrira o mesmo Dialog de edicao em modo leitura ou simplesmente focara na sprint (nao cria nova pagina).

---

## 4. Wizard de Criacao de Sprint

### Estrutura do Wizard

Substituir o Dialog atual por um Dialog multi-step com 4 etapas.

### Estado do Wizard

```tsx
const [wizardStep, setWizardStep] = useState(1);
const [wizardData, setWizardData] = useState({
  // Step 1 - Intencao Estrategica
  objective: '',
  pillarId: '',
  sprintType: '' as 'authority' | 'educational' | 'launch' | 'relationship' | 'conversion' | '',
  
  // Step 2 - Escopo
  startDate: '',
  endDate: '',
  contentsPlanned: 8,
  frequency: 'weekly' as 'daily' | 'weekly' | 'biweekly',
  
  // Step 3 - Estrutura
  formats: [] as string[],
  intentionMix: {
    educate: 40,
    engage: 30,
    convert: 30,
  },
  
  // Campos existentes
  title: '',
  description: '',
  theme: '',
});
```

### Step 1 — Intencao Estrategica

```text
+--------------------------------------------------+
|  Etapa 1 de 4 — Intencao Estrategica             |
+--------------------------------------------------+
|                                                   |
|  Qual e o objetivo principal desta sprint?        |
|  [Select: lista de objetivos]                     |
|    - Construir autoridade no tema                 |
|    - Educar minha audiencia                       |
|    - Lancar produto/servico                       |
|    - Fortalecer relacionamento                    |
|    - Gerar conversoes                             |
|                                                   |
|  Em qual pilar este conteudo se encaixa?          |
|  [Cards selecionaveis com os 4 pilares]           |
|                                                   |
|  Tipo de Sprint:                                  |
|  [Toggle group: Autoridade | Educacional |        |
|   Lancamento | Relacionamento | Conversao]        |
|                                                   |
+--------------------------------------------------+
|  [Cancelar]                      [Proximo →]      |
+--------------------------------------------------+
```

### Step 2 — Escopo

```text
+--------------------------------------------------+
|  Etapa 2 de 4 — Escopo                           |
+--------------------------------------------------+
|                                                   |
|  Periodo da Sprint                                |
|  [Data Inicio]      [Data Fim]                    |
|                                                   |
|  Volume estimado de conteudos                     |
|  [Slider: 1-20] → 8 conteudos                     |
|                                                   |
|  ⚠️ Alerta se volume > 12:                       |
|  "Volume agressivo. Considere reduzir para       |
|   manter qualidade e consistencia."               |
|                                                   |
|  Frequencia sugerida                              |
|  [Toggle: Diario | Semanal | Quinzenal]           |
|                                                   |
+--------------------------------------------------+
|  [← Voltar]                      [Proximo →]      |
+--------------------------------------------------+
```

### Step 3 — Estrutura

```text
+--------------------------------------------------+
|  Etapa 3 de 4 — Estrutura                        |
+--------------------------------------------------+
|                                                   |
|  Formatos de conteudo (selecione multiplos)       |
|  [Chips selecionaveis]                            |
|  ◉ Post  ◉ Carousel  ◉ Video  ◯ Story            |
|  ◯ Thread  ◯ Newsletter  ◯ Artigo                |
|                                                   |
|  Mix de intencao (ajuste as porcentagens)         |
|  [Slider] Educar: 40%                             |
|  [Slider] Engajar: 30%                            |
|  [Slider] Converter: 30%                          |
|                                                   |
|  Distribuicao sugerida:                           |
|  "4 posts educacionais, 2 carousels de            |
|   engajamento, 2 videos de conversao"             |
|                                                   |
+--------------------------------------------------+
|  [← Voltar]                      [Proximo →]      |
+--------------------------------------------------+
```

### Step 4 — Confirmacao

```text
+--------------------------------------------------+
|  Etapa 4 de 4 — Confirmacao                      |
+--------------------------------------------------+
|                                                   |
|  Resumo da Sprint                                 |
|  ┌────────────────────────────────────────────┐   |
|  │ Pilar: Autoridade                          │   |
|  │ Tipo: Educacional                          │   |
|  │ Periodo: 01 Mar - 31 Mar 2024              │   |
|  │ Volume: 8 conteudos                        │   |
|  │ Formatos: Post, Carousel, Video            │   |
|  └────────────────────────────────────────────┘   |
|                                                   |
|  Score Inicial Estimado: 78%                      |
|  [Barra de progresso visual]                      |
|                                                   |
|  💡 Sugestoes de melhoria:                       |
|  • Adicione mais diversidade de formatos          |
|  • Considere aumentar foco em engajamento         |
|                                                   |
|  Titulo da Sprint                                 |
|  [Input: Nome do sprint]                          |
|                                                   |
|  Descricao (opcional)                             |
|  [Textarea: Descreva o objetivo]                  |
|                                                   |
+--------------------------------------------------+
|  [← Voltar]                    [Criar Sprint]     |
+--------------------------------------------------+
```

---

## 5. Componentes a Criar

### 5.1 SprintWizard (componente interno)

Criar como componente funcional dentro do arquivo Sprints.tsx ou como componente separado em `src/components/sprints/SprintWizard.tsx`.

**Recomendacao**: Manter inline no Sprints.tsx para simplicidade, dado que e especifico desta pagina.

### 5.2 Subcomponentes do Wizard

```tsx
// Componentes internos
const WizardStepIndicator = ({ currentStep, totalSteps }) => ...
const WizardStepIntent = ({ data, onChange }) => ...
const WizardStepScope = ({ data, onChange }) => ...
const WizardStepStructure = ({ data, onChange }) => ...
const WizardStepConfirmation = ({ data }) => ...
```

---

## 6. Modificacoes nos Tipos/Dados

### Adicionar dados mock para demonstracao

Dentro do arquivo `Sprints.tsx`, adicionar:

```tsx
// Mock de prioridade por sprint (simulado)
const sprintPriorities: Record<string, 'high' | 'medium' | 'low'> = {
  'sprint-1': 'high',
  'sprint-2': 'medium',
  'sprint-3': 'low',
};

// Mock de detalhes de progresso (simulado)
const getProgressDetails = (sprintId: string) => ({
  draft: 2,
  review: 1,
  published: 4,
  planned: 3,
});

// Mock de composicao do score (simulado)
const getScoreDetails = (sprintId: string) => ({
  strategyAlignment: 85,
  publishConsistency: 70,
  audienceAlignment: 90,
  formatDiversity: 75,
});

// Tipos de sprint
const sprintTypes = [
  { id: 'authority', label: 'Autoridade', description: 'Demonstrar expertise' },
  { id: 'educational', label: 'Educacional', description: 'Ensinar conceitos' },
  { id: 'launch', label: 'Lancamento', description: 'Campanha de vendas' },
  { id: 'relationship', label: 'Relacionamento', description: 'Conexao com audiencia' },
  { id: 'conversion', label: 'Conversao', description: 'Gerar vendas diretas' },
];

// Formatos de conteudo
const contentFormats = [
  { id: 'post', label: 'Post' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'video', label: 'Video' },
  { id: 'story', label: 'Story' },
  { id: 'thread', label: 'Thread' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'article', label: 'Artigo' },
];
```

---

## 7. Imports Adicionais

```tsx
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from '@/components/ui/hover-card';
import { Slider } from '@/components/ui/slider';
import { Eye, Sparkles, AlertTriangle, Check } from 'lucide-react';
```

---

## 8. Fluxo de Navegacao do Wizard

```text
[Novo Sprint] 
    ↓
Dialog abre
    ↓
Step 1: Intencao → [Proximo]
    ↓
Step 2: Escopo → [Proximo]
    ↓
Step 3: Estrutura → [Proximo]
    ↓
Step 4: Confirmacao → [Criar Sprint]
    ↓
Sprint criado, Dialog fecha
```

**Validacoes por step**:
- Step 1: Objetivo e pilar obrigatorios
- Step 2: Datas obrigatorias, volume >= 1
- Step 3: Pelo menos 1 formato selecionado
- Step 4: Titulo obrigatorio

---

## 9. Estilizacao

Seguindo o Visual Dictionary do projeto:

| Elemento | Classes |
|----------|---------|
| Background cards | bg-card |
| Borders | border-border |
| Text primary | text-foreground |
| Text secondary | text-muted-foreground |
| Success | text-emerald-500 |
| Warning | text-amber-500 |
| Error | text-red-500 |
| Primary action | bg-primary |
| Sprint ativa | bg-primary/5 border-l-primary |

---

## 10. Arquivo a Modificar

| Arquivo | Modificacao |
|---------|-------------|
| `src/pages/Sprints.tsx` | Evolucao completa da tabela e wizard de criacao |

---

## 11. Checklist de Entrega

### Tabela
- [ ] Coluna Sprint com hierarquia estrategica (titulo + pilar + objetivo)
- [ ] Indicador visual de prioridade (dot colorido)
- [ ] Progresso com tooltip detalhado
- [ ] Score com HoverCard explicativo
- [ ] Destaque visual da sprint ativa (borda + background)
- [ ] Acao "Visualizar detalhes" no menu

### Wizard
- [ ] Step 1: Intencao estrategica
- [ ] Step 2: Escopo com validacoes
- [ ] Step 3: Estrutura de formatos
- [ ] Step 4: Confirmacao com resumo e sugestoes
- [ ] Navegacao entre steps
- [ ] Validacoes por step
- [ ] Criacao da sprint ao final

### Geral
- [ ] Manter todos os campos existentes
- [ ] Nao alterar rotas
- [ ] Nao duplicar dados
- [ ] Usar apenas componentes existentes
- [ ] Seguir design system
