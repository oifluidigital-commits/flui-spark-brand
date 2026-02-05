

# Plano de Evolucao — Sprints em Layout de Cards

## Visao Geral

Redesenhar completamente a pagina de Sprints, substituindo o layout de tabela atual por um **layout de grid com cards**, seguindo as especificacoes visuais fornecidas e o Visual Dictionary do Flui.

---

## 1. Analise da Situacao Atual

### Estrutura Existente

**Arquivo**: `src/pages/Sprints.tsx` (~1931 linhas)

**Layout Atual**:
- Tabela com colunas: Sprint, Status, Periodo, Progresso, Score, Acoes
- Wizard de criacao com 7 etapas (Sheet/Side Panel)
- Filtros: Search + Dropdown de status

**Problemas a Resolver**:
- Layout de tabela nao corresponde ao design solicitado (cards)
- Filtros por dropdown, nao por tabs
- Falta o card "Criar nova Sprint" com borda tracejada
- Estrutura visual do card de sprint diferente do especificado

---

## 2. Modificacoes Principais

### 2.1 Header da Pagina

**Antes**:
```
Sprints
Organize seu conteudo em ciclos de producao
[+ Novo Sprint]
```

**Depois**:
```text
Sprints de Conteudo
Organize suas campanhas estrategicas e ciclos de producao

[Search: Buscar sprints...]  [Tabs: Todas | Ativas | Planejamento | Concluidas]  [+ Nova Sprint]
```

**Implementacao**:
```tsx
<div className="space-y-4">
  <div>
    <h2 className="text-2xl font-bold text-zinc-50">Sprints de Conteúdo</h2>
    <p className="text-zinc-400">
      Organize suas campanhas estratégicas e ciclos de produção
    </p>
  </div>
  
  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
    <div className="relative w-full sm:max-w-xs">
      <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
      <Input
        placeholder="Buscar sprints..."
        className="pl-10 bg-zinc-900 border-zinc-800"
      />
    </div>
    
    <div className="flex gap-4 items-center">
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="bg-zinc-900">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="active">Ativas</TabsTrigger>
          <TabsTrigger value="draft">Planejamento</TabsTrigger>
          <TabsTrigger value="completed">Concluídas</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Button className="bg-indigo-600 hover:bg-indigo-700">
        <Plus className="h-4 w-4 mr-2" />
        Nova Sprint
      </Button>
    </div>
  </div>
</div>
```

### 2.2 Layout de Grid

**Antes**: Tabela
**Depois**: Grid de cards responsivo

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* New Sprint Card - sempre visivel */}
  <NewSprintCard onClick={() => handleOpenDialog()} />
  
  {/* Sprint Cards */}
  {filteredSprints.map((sprint) => (
    <SprintCard key={sprint.id} sprint={sprint} />
  ))}
</div>
```

---

## 3. Novo Componente: NewSprintCard

Card especial sempre visivel para criar nova sprint.

```tsx
const NewSprintCard = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-3",
      "min-h-[200px] rounded-lg",
      "border-2 border-dashed border-zinc-700",
      "bg-zinc-900/50 hover:border-indigo-600",
      "transition-colors cursor-pointer",
      "group"
    )}
  >
    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
      <Plus className="h-6 w-6 text-zinc-400 group-hover:text-indigo-500" />
    </div>
    <span className="text-zinc-400 group-hover:text-zinc-50 text-sm font-medium transition-colors">
      Criar nova Sprint
    </span>
  </button>
);
```

---

## 4. Novo Componente: SprintCard

Card individual para cada sprint, conforme especificacao.

### Estrutura Visual

```text
+--------------------------------------------------+
| [Badge: Status]                            [...]  |  <- Header
+--------------------------------------------------+
|                                                   |
| Titulo da Sprint (text-lg font-semibold)          |  <- Body
| [Badge: Pilar]                                    |
|                                                   |
| X/Y conteudos prontos                 XX%         |  <- Progress
| [=============================--------]           |
|                                                   |
+--------------------------------------------------+
| 📅 01 Fev - 28 Fev                      →        |  <- Footer
+--------------------------------------------------+
```

### Implementacao

```tsx
interface SprintCardProps {
  sprint: Sprint;
  onEdit: (sprint: Sprint) => void;
  onDuplicate: (sprint: Sprint) => void;
  onDelete: (sprintId: string) => void;
}

const SprintCard = ({ sprint, onEdit, onDuplicate, onDelete }: SprintCardProps) => {
  const pillar = mockPillars.find(p => p.id === sprint.pillarId);
  const progressPercentage = sprint.contentsPlanned > 0 
    ? Math.round((sprint.contentsPublished / sprint.contentsPlanned) * 100) 
    : 0;
  
  const getStatusConfig = (status: SprintStatus) => {
    switch (status) {
      case 'active':
        return { 
          label: 'Em andamento', 
          className: 'bg-violet-500/20 text-violet-500 border-violet-500/30' 
        };
      case 'draft':
        return { 
          label: 'Planejamento', 
          className: 'bg-amber-500/20 text-amber-500 border-amber-500/30' 
        };
      case 'completed':
        return { 
          label: 'Concluída', 
          className: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' 
        };
      default:
        return { 
          label: 'Arquivado', 
          className: 'bg-zinc-500/20 text-zinc-500 border-zinc-500/30' 
        };
    }
  };
  
  const statusConfig = getStatusConfig(sprint.status);
  
  return (
    <Card className={cn(
      "bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors",
      sprint.status === 'active' && "ring-1 ring-violet-500/30"
    )}>
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Badge 
          variant="outline" 
          className={cn("text-xs", statusConfig.className)}
        >
          {statusConfig.label}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
            <DropdownMenuItem onClick={() => onEdit(sprint)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(sprint)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(sprint.id)}
              className="text-red-500 focus:text-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      {/* Body */}
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-zinc-50 line-clamp-1">
            {sprint.title}
          </h3>
          {pillar && (
            <Badge 
              variant="outline" 
              className="text-xs"
              style={{ borderColor: pillar.color, color: pillar.color }}
            >
              {pillar.name}
            </Badge>
          )}
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-400">
              {sprint.contentsPublished}/{sprint.contentsPlanned} conteúdos prontos
            </span>
            <span className={cn(
              "font-medium",
              sprint.status === 'completed' ? "text-emerald-500" : "text-zinc-50"
            )}>
              {progressPercentage}%
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={cn(
              "h-2",
              sprint.status === 'completed' && "[&>div]:bg-emerald-500"
            )}
          />
        </div>
      </CardContent>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDatePTBR(sprint.startDate)} - {formatDatePTBR(sprint.endDate)}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          onClick={() => {/* Navigate to details */}}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
```

---

## 5. Cores e Visual Dictionary

Mapeamento exato conforme especificacao:

| Elemento | Classe |
|----------|--------|
| App background | `bg-zinc-950` |
| Cards | `bg-zinc-900` |
| Borders | `border-zinc-800` |
| Primary text | `text-zinc-50` |
| Secondary text | `text-zinc-400` |
| Primary action | `bg-indigo-600` |
| Active status | `text-violet-500`, `bg-violet-500/20` |
| Planning status | `text-amber-500`, `bg-amber-500/20` |
| Completed status | `text-emerald-500`, `bg-emerald-500/20` |
| Progress bar | `bg-indigo-600` (default), `bg-emerald-500` (completed) |
| New Sprint border | `border-zinc-700`, hover: `border-indigo-600` |

---

## 6. Mock Data Atualizado

Usar o mock conforme especificado, adaptando para tipos existentes:

```typescript
const mockSprintsCards = [
  {
    id: '1',
    title: 'Q1 Autoridade em Produto',
    description: 'Sprint focado em estabelecer autoridade no tema de Product Management',
    pillarId: 'pillar-1', // Autoridade
    status: 'active' as SprintStatus,
    contentsPlanned: 12,
    contentsPublished: 8,
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    theme: 'Product Leadership',
    alignmentScore: 82,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // ... mais sprints
];
```

---

## 7. Filtros com Tabs

Substituir o Select por Tabs conforme especificado:

```tsx
<Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
  <TabsList className="bg-zinc-900 border border-zinc-800">
    <TabsTrigger 
      value="all"
      className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50"
    >
      Todas
    </TabsTrigger>
    <TabsTrigger 
      value="active"
      className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50"
    >
      Ativas
    </TabsTrigger>
    <TabsTrigger 
      value="draft"
      className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50"
    >
      Planejamento
    </TabsTrigger>
    <TabsTrigger 
      value="completed"
      className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-50"
    >
      Concluídas
    </TabsTrigger>
  </TabsList>
</Tabs>
```

---

## 8. Estados de Loading (Skeleton)

Cards skeleton para carregamento:

```tsx
const SprintCardSkeleton = () => (
  <Card className="bg-zinc-900 border-zinc-800">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-5 w-24 bg-zinc-800" />
      <Skeleton className="h-8 w-8 rounded-md bg-zinc-800" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4 bg-zinc-800" />
        <Skeleton className="h-5 w-20 bg-zinc-800" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-32 bg-zinc-800" />
          <Skeleton className="h-4 w-12 bg-zinc-800" />
        </div>
        <Skeleton className="h-2 w-full bg-zinc-800" />
      </div>
    </CardContent>
    <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
      <Skeleton className="h-4 w-40 bg-zinc-800" />
      <Skeleton className="h-8 w-8 rounded-md bg-zinc-800" />
    </div>
  </Card>
);
```

---

## 9. Estrutura Final da Pagina

```tsx
export default function Sprints() {
  // ... estados existentes
  
  return (
    <MainLayout>
      <TooltipProvider>
        <div className="space-y-6 bg-zinc-950 min-h-screen">
          {/* Page Header */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-zinc-50">Sprints de Conteúdo</h2>
              <p className="text-zinc-400">
                Organize suas campanhas estratégicas e ciclos de produção
              </p>
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                <Input
                  placeholder="Buscar sprints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-900 border-zinc-800"
                />
              </div>
              
              {/* Tabs + Button */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                  <TabsList className="bg-zinc-900 border border-zinc-800">
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="active">Ativas</TabsTrigger>
                    <TabsTrigger value="draft">Planejamento</TabsTrigger>
                    <TabsTrigger value="completed">Concluídas</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      onClick={() => handleOpenDialog()}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Sprint
                    </Button>
                  </SheetTrigger>
                  {/* ... Sheet content (wizard existente) */}
                </Sheet>
              </div>
            </div>
          </div>
          
          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Sprint Card */}
            <NewSprintCard onClick={() => handleOpenDialog()} />
            
            {/* Sprint Cards */}
            {filteredSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                onEdit={handleViewDetails}
                onDuplicate={handleDuplicate}
                onDelete={deleteSprint}
              />
            ))}
          </div>
          
          {/* Empty State */}
          {filteredSprints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-400">
                Nenhuma sprint encontrada para os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </TooltipProvider>
    </MainLayout>
  );
}
```

---

## 10. O Que Sera Mantido

- Todo o wizard de criacao de Sprint (7 etapas)
- Sheet/Side Panel para edicao
- Logica de filtros e busca
- Handlers de CRUD (handleSave, handleDuplicate, etc)
- Integracao com AppContext

---

## 11. O Que Sera Removido

- Layout de tabela (Table, TableHeader, TableBody, etc)
- Select para filtro de status (substituido por Tabs)
- Componente PriorityDot (nao presente no novo design)
- HoverCard de score (nao presente no novo design)
- Tooltip de progresso detalhado (simplificado)

---

## 12. Arquivo a Modificar

| Arquivo | Modificacao |
|---------|-------------|
| `src/pages/Sprints.tsx` | Redesign completo de tabela para cards |

---

## 13. Checklist de Entrega

### Header
- [ ] Titulo: "Sprints de Conteudo"
- [ ] Subtitulo atualizado
- [ ] Search input com placeholder correto
- [ ] Tabs para filtro de status (Todas/Ativas/Planejamento/Concluidas)
- [ ] Botao "+ Nova Sprint" com bg-indigo-600

### Grid de Cards
- [ ] Grid responsivo (1/2/3 colunas)
- [ ] gap-6 entre cards

### NewSprintCard
- [ ] Borda tracejada border-zinc-700
- [ ] Hover com border-indigo-600
- [ ] Icone "+" centralizado
- [ ] Label "Criar nova Sprint"

### SprintCard
- [ ] Header: Badge de status + Menu de acoes
- [ ] Body: Titulo + Badge do pilar
- [ ] Progress: Texto + Barra com porcentagem
- [ ] Footer: Datas + Icone de seta
- [ ] Destaque visual para sprints ativas (ring)
- [ ] Barra verde para concluidas

### Cores
- [ ] bg-zinc-950 para background
- [ ] bg-zinc-900 para cards
- [ ] border-zinc-800 para bordas
- [ ] Cores de status conforme especificado

### Estados
- [ ] Skeleton para loading
- [ ] Empty state para lista vazia
- [ ] Hover states

