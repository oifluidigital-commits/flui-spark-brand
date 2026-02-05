
# Plano de Implementacao — Pagina de Detalhes da Sprint

## Visao Geral

Criar uma nova pagina dedicada em `/sprints/:sprintId` para gestao operacional dos conteudos de uma Sprint. Esta pagina funciona como um workspace de execucao, inspirado em ferramentas como Linear, Notion e Airtable, com foco em velocidade, leitura rapida e acoes diretas.

---

## 1. Arquivos a Criar/Modificar

| Arquivo | Acao |
|---------|------|
| `src/pages/SprintDetail.tsx` | CRIAR - Nova pagina de detalhes |
| `src/App.tsx` | MODIFICAR - Adicionar rota `/sprints/:sprintId` |
| `src/pages/Sprints.tsx` | MODIFICAR - Adicionar navegacao para detalhes |

---

## 2. Estrutura da Pagina SprintDetail

### 2.1 Header de Navegacao (Fixo)

```text
+-----------------------------------------------------------------------+
| [← Voltar para Sprints]    Sprint #s1    [Badge: Active/Planning]    |
+-----------------------------------------------------------------------+
```

**Componentes**:
- Botao "Voltar para Sprints" com icone `ArrowLeft`
- Titulo da Sprint
- Badge de status (Planning/Active/Completed)

### 2.2 Summary Strip (Contexto Compacto)

```text
+-----------------------------------------------------------------------+
| Autoridade em Produto  |  01 Fev - 28 Fev  |  "Objetivo da sprint..." |
|                                                                        |
| [Progress Bar: 4/10 conteudos prontos - 40%]                          |
+-----------------------------------------------------------------------+
```

**Campos**:
- Nome da Sprint
- Periodo (data inicial - data final)
- Objetivo principal (texto truncado)
- Barra de progresso com porcentagem

### 2.3 Acoes Globais

```text
+-----------------------------------------------------------------------+
| [+ Adicionar Conteudo]  [Sparkles: Gerar Sugestoes IA]  [Reordenar]  |
+-----------------------------------------------------------------------+
```

### 2.4 Tabela de Conteudos (Central)

```text
+---+-------------------+----------+------------+-------------+---------+
| □ | Topic / Hook      | Format   | Status     | Target Date | Actions |
+---+-------------------+----------+------------+-------------+---------+
| □ | Por que 90%...    | Carousel | [Review]   | 15 Fev      | ✎ 🗑    |
|   | [ToFu]            |          |            |             |         |
+---+-------------------+----------+------------+-------------+---------+
| □ | Como defino...    | Video    | [In Prog]  | 12 Fev ⚠    | ✎ 🗑    |
|   | [MoFu]            |          |            | (atrasado)  |         |
+---+-------------------+----------+------------+-------------+---------+
```

**Colunas**:
1. **Checkbox** - Selecao multipla
2. **Topic/Hook** - Titulo + Tag de funil (ToFu/MoFu/BoFu)
3. **Format** - Icone + label (dropdown inline)
4. **Status** - Badge editavel (Idea/Review/Scheduled/Backlog/Completed)
5. **Target Date** - Date picker inline
6. **Actions** - Icones de editar e remover

---

## 3. Tipos e Interfaces

### 3.1 SprintContent (Novo Tipo)

```typescript
type ContentStatus = 'idea' | 'review' | 'scheduled' | 'backlog' | 'completed';
type FunnelStage = 'tofu' | 'mofu' | 'bofu';

interface SprintContent {
  id: string;
  sprintId: string;
  title: string;
  hook: string;
  description: string;
  format: string;
  status: ContentStatus;
  funnelStage: FunnelStage;
  targetDate?: string;
  framework: string;
  frameworkReason?: string;
  intention: 'educate' | 'engage' | 'convert';
  suggestedCta: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Mock Data para Conteudos

```typescript
const mockSprintContents: SprintContent[] = [
  {
    id: 'content-1',
    sprintId: 'sprint-1',
    title: 'Por que 90% dos roadmaps falham',
    hook: '90% das pessoas erram nisso...',
    description: 'Carousel explicando os erros mais comuns',
    format: 'post-linkedin-carousel',
    status: 'review',
    funnelStage: 'tofu',
    targetDate: '2024-02-15',
    framework: 'educational',
    intention: 'educate',
    suggestedCta: 'Salve para consultar depois',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-08T14:00:00Z',
  },
  {
    id: 'content-2',
    sprintId: 'sprint-1',
    title: 'Como defino prioridades no meu time',
    hook: 'O metodo que mudou minha carreira:',
    description: 'Video mostrando meu processo real',
    format: 'video-short',
    status: 'scheduled',
    funnelStage: 'mofu',
    targetDate: '2024-02-12',
    framework: 'storytelling',
    intention: 'engage',
    suggestedCta: 'Conta sua experiencia',
    createdAt: '2024-02-02T09:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z',
  },
  // ... mais conteudos
];
```

---

## 5. Componentes da Pagina

### 5.1 SprintDetailHeader

```tsx
interface SprintDetailHeaderProps {
  sprint: Sprint;
  onBack: () => void;
}

const SprintDetailHeader = ({ sprint, onBack }: SprintDetailHeaderProps) => (
  <div className="sticky top-16 z-10 bg-zinc-950 border-b border-zinc-800">
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para Sprints
        </Button>
        <div className="h-4 w-px bg-zinc-700" />
        <h1 className="text-lg font-semibold text-zinc-50">
          {sprint.title}
        </h1>
      </div>
      <Badge variant="outline" className={getStatusClassName(sprint.status)}>
        {getStatusLabel(sprint.status)}
      </Badge>
    </div>
  </div>
);
```

### 5.2 SprintSummaryStrip

```tsx
const SprintSummaryStrip = ({ sprint }: { sprint: Sprint }) => {
  const progressPercentage = sprint.contentsPlanned > 0
    ? Math.round((sprint.contentsPublished / sprint.contentsPlanned) * 100)
    : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center gap-6 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-zinc-400" />
          <span className="text-zinc-400">
            {formatDatePTBR(sprint.startDate)} - {formatDatePTBR(sprint.endDate)}
          </span>
        </div>
        <div className="text-sm text-zinc-400 flex-1 truncate">
          "{sprint.description}"
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-400">
          {sprint.contentsPublished}/{sprint.contentsPlanned} conteudos prontos
        </span>
        <Progress value={progressPercentage} className="flex-1 h-2" />
        <span className="text-sm font-medium text-zinc-50">{progressPercentage}%</span>
      </div>
    </div>
  );
};
```

### 5.3 ContentTable

```tsx
const ContentTable = ({ 
  contents, 
  selectedIds, 
  onSelect, 
  onSelectAll,
  onEdit,
  onDelete,
  onStatusChange,
  onDateChange,
  onFormatChange
}: ContentTableProps) => {
  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-zinc-900/50 hover:bg-zinc-900/50">
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedIds.length === contents.length}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Topic / Hook</TableHead>
            <TableHead className="w-32">Formato</TableHead>
            <TableHead className="w-32">Status</TableHead>
            <TableHead className="w-36">Data Alvo</TableHead>
            <TableHead className="w-20">Acoes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.map((content) => (
            <ContentRow 
              key={content.id}
              content={content}
              isSelected={selectedIds.includes(content.id)}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onDateChange={onDateChange}
              onFormatChange={onFormatChange}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
```

### 5.4 ContentRow

```tsx
const ContentRow = ({ content, isSelected, ...handlers }: ContentRowProps) => {
  const isOverdue = content.targetDate && 
    isBefore(new Date(content.targetDate), new Date()) && 
    content.status !== 'completed';

  return (
    <TableRow 
      className={cn(
        "hover:bg-zinc-900/50 transition-colors",
        isOverdue && "bg-red-500/5",
        content.status === 'completed' && "opacity-60",
        content.status === 'backlog' && "opacity-80"
      )}
    >
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => handlers.onSelect(content.id)}
        />
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <button 
            onClick={() => handlers.onEdit(content)}
            className="text-left hover:text-indigo-400 transition-colors"
          >
            <span className="font-medium text-zinc-50 line-clamp-1">
              {content.title}
            </span>
          </button>
          <Badge variant="outline" className="text-xs">
            {getFunnelLabel(content.funnelStage)}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <FormatDropdown 
          value={content.format}
          onChange={(format) => handlers.onFormatChange(content.id, format)}
        />
      </TableCell>
      <TableCell>
        <StatusDropdown 
          value={content.status}
          onChange={(status) => handlers.onStatusChange(content.id, status)}
        />
      </TableCell>
      <TableCell>
        <DatePicker 
          value={content.targetDate}
          onChange={(date) => handlers.onDateChange(content.id, date)}
          isOverdue={isOverdue}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => handlers.onEdit(content)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:text-red-400"
            onClick={() => handlers.onDelete(content.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
```

### 5.5 ContentDetailSheet (Side Panel)

```tsx
const ContentDetailSheet = ({ 
  isOpen, 
  onClose, 
  content, 
  onSave 
}: ContentDetailSheetProps) => (
  <Sheet open={isOpen} onOpenChange={onClose}>
    <SheetContent side="right" className="w-[540px] sm:max-w-[540px] overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Detalhes do Conteudo</SheetTitle>
        <SheetDescription>
          Edite as informacoes do conteudo
        </SheetDescription>
      </SheetHeader>
      
      <div className="py-6 space-y-6">
        {/* Briefing */}
        <div className="space-y-2">
          <Label>Titulo / Tema</Label>
          <Input value={content.title} onChange={...} />
        </div>
        
        <div className="space-y-2">
          <Label>Hook</Label>
          <Textarea value={content.hook} rows={2} onChange={...} />
        </div>
        
        <div className="space-y-2">
          <Label>Descricao</Label>
          <Textarea value={content.description} rows={3} onChange={...} />
        </div>
        
        {/* Framework */}
        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Framework Selecionado</span>
          </div>
          <p className="text-zinc-50">{getFrameworkName(content.framework)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {content.frameworkReason}
          </p>
        </div>
        
        {/* Formato e Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Formato</Label>
            <Select value={content.format}>...</Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={content.status}>...</Select>
          </div>
        </div>
        
        {/* Datas */}
        <div className="space-y-2">
          <Label>Data Alvo</Label>
          <DatePicker value={content.targetDate} onChange={...} />
        </div>
        
        {/* CTA */}
        <div className="space-y-2">
          <Label>CTA Sugerido</Label>
          <Input value={content.suggestedCta} onChange={...} />
        </div>
        
        {/* Acoes IA */}
        <div className="pt-4 border-t border-zinc-800">
          <Button variant="outline" className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Gerar Texto com IA
          </Button>
        </div>
      </div>
      
      <SheetFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave}>Salvar Alteracoes</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);
```

---

## 6. Configuracoes de Status

```typescript
const contentStatusConfig: Record<ContentStatus, { label: string; className: string }> = {
  idea: { 
    label: 'Ideia', 
    className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' 
  },
  backlog: { 
    label: 'Backlog', 
    className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' 
  },
  review: { 
    label: 'Revisao', 
    className: 'bg-amber-500/20 text-amber-500 border-amber-500/30' 
  },
  scheduled: { 
    label: 'Agendado', 
    className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' 
  },
  completed: { 
    label: 'Concluido', 
    className: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' 
  },
};

const funnelStageConfig: Record<FunnelStage, { label: string; className: string }> = {
  tofu: { label: 'ToFu', className: 'bg-blue-500/20 text-blue-400' },
  mofu: { label: 'MoFu', className: 'bg-purple-500/20 text-purple-400' },
  bofu: { label: 'BoFu', className: 'bg-orange-500/20 text-orange-400' },
};
```

---

## 7. Icones de Formato

```typescript
const formatIcons: Record<string, LucideIcon> = {
  'post-linkedin-text': FileText,
  'post-linkedin-carousel': LayoutGrid,
  'article': FileText,
  'newsletter': Mail,
  'video-short': Video,
  'video-long': Film,
  'thread': MessageSquare,
  'case-study': Briefcase,
  'landing-page': Globe,
  'email-marketing': Mail,
  'story': Camera,
  'reels': Video,
};
```

---

## 8. Roteamento

### 8.1 Modificacao em App.tsx

```tsx
import SprintDetail from './pages/SprintDetail';

// Dentro de AppRoutes:
<Route 
  path="/sprints/:sprintId" 
  element={<ProtectedRoute><SprintDetail /></ProtectedRoute>} 
/>
```

### 8.2 Navegacao em Sprints.tsx

Modificar o `SprintCard` para navegar ao clicar:

```tsx
import { useNavigate } from 'react-router-dom';

// No SprintCard:
const navigate = useNavigate();

<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8"
  onClick={() => navigate(`/sprints/${sprint.id}`)}
>
  <ChevronRight className="h-4 w-4" />
</Button>
```

---

## 9. Ordenacao da Tabela

```typescript
type SortField = 'status' | 'targetDate' | 'format';
type SortDirection = 'asc' | 'desc';

const [sortField, setSortField] = useState<SortField>('targetDate');
const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

const sortedContents = useMemo(() => {
  return [...contents].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'status':
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case 'targetDate':
        comparison = (a.targetDate || '').localeCompare(b.targetDate || '');
        break;
      case 'format':
        comparison = a.format.localeCompare(b.format);
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });
}, [contents, sortField, sortDirection]);
```

---

## 10. Estados da Pagina

### 10.1 Loading State

```tsx
const SprintDetailSkeleton = () => (
  <div className="space-y-6">
    {/* Header Skeleton */}
    <div className="flex items-center gap-4">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-6 w-32" />
    </div>
    
    {/* Summary Skeleton */}
    <Skeleton className="h-24 w-full rounded-lg" />
    
    {/* Table Skeleton */}
    <div className="border border-zinc-800 rounded-lg">
      <div className="p-4">
        <Skeleton className="h-10 w-full" />
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 border-t border-zinc-800">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  </div>
);
```

### 10.2 Empty State

```tsx
const EmptyContentsState = ({ onAddContent }: { onAddContent: () => void }) => (
  <div className="text-center py-16 border border-dashed border-zinc-700 rounded-lg">
    <FileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-zinc-50 mb-2">
      Nenhum conteudo nesta Sprint
    </h3>
    <p className="text-zinc-400 mb-6 max-w-md mx-auto">
      Comece adicionando conteudos manualmente ou deixe a IA sugerir 
      baseado no objetivo da Sprint.
    </p>
    <div className="flex items-center justify-center gap-3">
      <Button onClick={onAddContent}>
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Conteudo
      </Button>
      <Button variant="outline">
        <Sparkles className="h-4 w-4 mr-2" />
        Gerar Sugestoes IA
      </Button>
    </div>
  </div>
);
```

---

## 11. Visual Dictionary Aplicado

| Elemento | Classe Tailwind |
|----------|-----------------|
| Background da pagina | `bg-zinc-950` |
| Header sticky | `bg-zinc-950 border-b border-zinc-800` |
| Summary strip | `bg-zinc-900 border border-zinc-800` |
| Tabela container | `border border-zinc-800 rounded-lg` |
| Table header | `bg-zinc-900/50` |
| Row hover | `hover:bg-zinc-900/50` |
| Row atrasada | `bg-red-500/5` |
| Texto primario | `text-zinc-50` |
| Texto secundario | `text-zinc-400` |
| Acoes primarias | `bg-indigo-600 hover:bg-indigo-700` |

---

## 12. Checklist de Entrega

### Roteamento
- [ ] Criar rota `/sprints/:sprintId` em App.tsx
- [ ] Importar e configurar SprintDetail page
- [ ] Adicionar navegacao no SprintCard

### Pagina SprintDetail
- [ ] Criar arquivo `src/pages/SprintDetail.tsx`
- [ ] Implementar SprintDetailHeader (fixo)
- [ ] Implementar SprintSummaryStrip
- [ ] Implementar barra de acoes globais
- [ ] Implementar ContentTable
- [ ] Implementar ContentRow com inline editing
- [ ] Implementar ContentDetailSheet (Side Panel)

### Tabela de Conteudos
- [ ] Checkbox para selecao multipla
- [ ] Coluna Topic/Hook com tag de funil
- [ ] Coluna Format com dropdown inline
- [ ] Coluna Status com badge editavel
- [ ] Coluna Target Date com date picker inline
- [ ] Coluna Actions com icones sutis
- [ ] Hover states por linha
- [ ] Visual para conteudo atrasado
- [ ] Visual para conteudo concluido

### Estados
- [ ] Loading skeleton
- [ ] Empty state educativo
- [ ] Sprint nao encontrada (404)

### Side Panel
- [ ] Sheet para detalhamento de conteudo
- [ ] Campos: briefing, framework, formato, status, datas
- [ ] Botao de acao IA
- [ ] Nao usar modais

### UX
- [ ] Navegacao clara de ida e volta
- [ ] Edicao inline sempre que possivel
- [ ] Acoes reversiveis
- [ ] Ordenacao por status/data/formato
