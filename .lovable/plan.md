
# Plano de Evolucao — Objetivo Aberto, Remocao de Tipo e Side Panels

## Visao Geral

Ajustar o fluxo existente de criacao de Sprint para:
1. Transformar o objetivo principal em campo de texto livre (textarea)
2. Remover completamente o campo "Tipo de Sprint"
3. Substituir Dialogs por Side Panels (Sheet) em todo o fluxo
4. Adicionar sistema de Frameworks de conteudo para detalhamento

---

## 1. Situacao Atual

### Campos do Wizard Step 1:
- **Objetivo**: Select com 5 opcoes fixas (`objectiveOptions`)
- **Pilar**: Cards selecionaveis (4 pilares)
- **Tipo de Sprint**: Toggle group com 5 tipos (`sprintTypes`)

### Containers:
- Todo o wizard usa `<Dialog>` (modal popup)
- Ajuste de conteudos e detalhamento tambem via Dialog

---

## 2. Modificacoes Principais

### 2.1 Campo Objetivo — De Select para Textarea

**Remover**:
```typescript
const objectiveOptions = [
  { id: 'build_authority', label: 'Construir autoridade no tema' },
  { id: 'educate_audience', label: 'Educar minha audiência' },
  // ...
];
```

**Substituir por**:
- Campo `Textarea` com placeholder exemplificativo
- Validacao: minimo 10 caracteres

**Novo wizardData**:
```typescript
objective: '', // Agora string livre, nao ID
```

**Exemplos no placeholder**:
- "Consolidar autoridade como referência em Produto"
- "Educar o público sobre fundamentos de marketing"
- "Preparar audiência para lançamento de um curso"

### 2.2 Remover Tipo de Sprint

**Deletar completamente**:
```typescript
const sprintTypes = [
  { id: 'authority', label: 'Autoridade', description: 'Demonstrar expertise' },
  // ...
];
```

**Remover de wizardData**:
```typescript
sprintType: '', // REMOVER
```

**Atualizar validacao**:
```typescript
// Antes:
const canProceedStep1 = wizardData.objective && wizardData.pillarId && wizardData.sprintType;

// Depois:
const canProceedStep1 = wizardData.objective.trim().length >= 10 && wizardData.pillarId;
```

---

## 3. Substituir Dialog por Sheet (Side Panel)

### 3.1 Imports a Adicionar

```typescript
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
```

### 3.2 Estrutura do Wizard em Sheet

Substituir:
```tsx
<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent className="sm:max-w-[560px]">
    ...
  </DialogContent>
</Dialog>
```

Por:
```tsx
<Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <SheetContent side="right" className="w-[540px] sm:max-w-[540px] overflow-y-auto">
    <SheetHeader>
      <SheetTitle>...</SheetTitle>
      <SheetDescription>...</SheetDescription>
    </SheetHeader>
    <div className="py-6">
      {/* Wizard steps content */}
    </div>
    <SheetFooter>
      {/* Navigation buttons */}
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

## 4. Novo Sistema de Frameworks

### 4.1 Definicao dos Frameworks

```typescript
interface ContentFramework {
  id: string;
  name: string;
  description: string;
  bestUse: string;
}

const contentFrameworks: ContentFramework[] = [
  {
    id: 'aida',
    name: 'AIDA',
    description: 'Atenção → Interesse → Desejo → Ação',
    bestUse: 'Ideal para conteúdos de conversão e vendas'
  },
  {
    id: 'pas',
    name: 'PAS',
    description: 'Problema → Agitação → Solução',
    bestUse: 'Perfeito para identificar dores e apresentar soluções'
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    description: 'Narrativa com início, meio e fim',
    bestUse: 'Conexão emocional e memorabilidade'
  },
  {
    id: 'bab',
    name: 'Before / After / Bridge',
    description: 'Antes → Depois → Como chegar lá',
    bestUse: 'Mostrar transformação e resultados'
  },
  {
    id: '4ps',
    name: '4Ps',
    description: 'Promessa → Prova → Proposta → Push',
    bestUse: 'Estrutura persuasiva para vendas'
  },
  {
    id: 'hvc',
    name: 'Hook → Value → CTA',
    description: 'Gancho → Entrega de valor → Chamada para ação',
    bestUse: 'Formato direto para redes sociais'
  },
  {
    id: 'educational',
    name: 'Educacional Estruturado',
    description: 'Contexto → Conceito → Exemplos → Aplicação',
    bestUse: 'Ensinar conceitos complexos de forma clara'
  },
  {
    id: 'authority',
    name: 'Autoridade',
    description: 'Opinião → Evidência → Insight',
    bestUse: 'Posicionamento como referência no tema'
  },
];
```

### 4.2 Adicionar Framework ao SuggestedContent

```typescript
interface SuggestedContent {
  id: string;
  theme: string;
  intention: 'educate' | 'engage' | 'convert';
  format: string;
  strategicObjective: string;
  hook: string;
  suggestedCta: string;
  framework: string; // NOVO - obrigatorio antes de gerar
}
```

---

## 5. Novo Step 6 — Detalhamento com Framework (Sheet Aninhado)

### 5.1 Estado para Content Detail Sheet

```typescript
const [contentDetailSheet, setContentDetailSheet] = useState<{
  isOpen: boolean;
  contentId: string | null;
}>({ isOpen: false, contentId: null });
```

### 5.2 Seletor de Framework (nao dropdown)

Cards selecionaveis para cada framework, exibindo:
- Nome do framework
- Descricao curta
- Melhor uso estrategico

```tsx
<div className="grid grid-cols-1 gap-3">
  {contentFrameworks.map((framework) => (
    <button
      key={framework.id}
      onClick={() => updateApprovedContent(contentId, { framework: framework.id })}
      className={cn(
        'p-4 rounded-lg border text-left transition-all',
        selectedFramework === framework.id
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50'
      )}
    >
      <div className="font-medium text-sm">{framework.name}</div>
      <div className="text-xs text-muted-foreground mt-1">{framework.description}</div>
      <div className="text-xs text-primary/80 mt-2">{framework.bestUse}</div>
    </button>
  ))}
</div>
```

---

## 6. Evolucao do Step 6 — Ajuste Humano

### 6.1 Card de Conteudo com Botao de Detalhamento

Cada card agora exibe:
- Campos editaveis inline (tema, intencao, formato, gancho, CTA)
- **Novo**: Badge mostrando framework selecionado (ou "Selecionar framework")
- Botao "Detalhar" que abre Sheet aninhado

```tsx
<div className="flex items-center justify-between mt-2">
  <Button 
    variant="outline" 
    size="sm"
    onClick={() => openContentDetailSheet(content.id)}
  >
    {content.framework 
      ? `Framework: ${getFrameworkLabel(content.framework)}` 
      : 'Selecionar Framework'}
  </Button>
  <div className="flex gap-2">
    <Button variant="ghost" size="sm" onClick={() => duplicateApprovedContent(content.id)}>
      Duplicar
    </Button>
    <Button variant="ghost" size="sm" className="text-destructive">
      Remover
    </Button>
  </div>
</div>
```

### 6.2 Sheet de Detalhamento (lado direito, sobrepondo parcialmente)

```tsx
<Sheet open={contentDetailSheet.isOpen} onOpenChange={(open) => setContentDetailSheet({ isOpen: open, contentId: null })}>
  <SheetContent side="right" className="w-[480px] sm:max-w-[480px]">
    <SheetHeader>
      <SheetTitle>Detalhamento do Conteúdo</SheetTitle>
      <SheetDescription>Configure todos os detalhes antes da geração</SheetDescription>
    </SheetHeader>
    
    <div className="py-6 space-y-6">
      {/* Campos editaveis */}
      <div className="space-y-4">
        <div>
          <Label>Pauta / Tema</Label>
          <Input value={content.theme} onChange={...} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Formato</Label>
            <Select value={content.format} onValueChange={...}>...</Select>
          </div>
          <div>
            <Label>Intenção</Label>
            <Select value={content.intention} onValueChange={...}>...</Select>
          </div>
        </div>
        <div>
          <Label>Gancho Principal</Label>
          <Textarea value={content.hook} onChange={...} rows={2} />
        </div>
        <div>
          <Label>CTA</Label>
          <Input value={content.suggestedCta} onChange={...} />
        </div>
      </div>
      
      {/* Framework Selection - Required */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          Framework de Conteúdo
          <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
        </Label>
        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto">
          {contentFrameworks.map(framework => (
            <FrameworkCard key={framework.id} framework={framework} selected={...} onSelect={...} />
          ))}
        </div>
      </div>
    </div>
    
    <SheetFooter>
      <Button onClick={() => setContentDetailSheet({ isOpen: false, contentId: null })}>
        Salvar Detalhes
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

## 7. Evolucao do Step 7 — Confirmacao

### 7.1 Exibir Objetivo como Texto Livre

```tsx
<div className="flex justify-between">
  <span className="text-muted-foreground">Objetivo:</span>
  <span className="text-right max-w-[60%]">{wizardData.objective}</span>
</div>
```

### 7.2 Exibir Framework por Conteudo

```tsx
{wizardData.approvedContents.map((content) => (
  <div key={content.id} className="flex items-center gap-2 text-sm">
    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
    <span className="truncate flex-1">{content.theme}</span>
    <Badge variant="outline" className="text-xs shrink-0">
      {getFrameworkLabel(content.framework)}
    </Badge>
    <Badge variant="secondary" className="text-xs shrink-0">
      {getFormatLabel(content.format)}
    </Badge>
  </div>
))}
```

### 7.3 Validacao de Confirmacao

```typescript
// Antes de confirmar, todos os conteudos devem ter framework
const allContentsHaveFramework = wizardData.approvedContents.every(c => c.framework);
const canCreateSprint = wizardData.title.trim().length >= 2 && allContentsHaveFramework;
```

---

## 8. IA como Consultora (ajustes visuais)

### 8.1 Mensagem no Step 5

```tsx
<div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
  <Sparkles className="h-4 w-4 text-primary shrink-0" />
  <div className="text-sm">
    <span className="font-medium">A IA está sugerindo, não decidindo.</span>
    <br />
    <span className="text-muted-foreground">
      Baseado em: "{wizardData.objective.slice(0, 50)}..."
    </span>
  </div>
</div>
```

### 8.2 Geracao de Sugestoes usando Objetivo Livre

Atualizar `generateMockSuggestions()` para usar o texto livre como contexto:

```typescript
const generateMockSuggestions = (): SuggestedContent[] => {
  const { contentsPlanned, intentionMix, formats, pillarId, objective } = wizardData;
  
  // O objetivo em texto livre e usado como contexto para a IA
  // (mock - simulamos que a IA le o texto)
  
  const suggestions = [...];
  return suggestions.map(s => ({
    ...s,
    strategicObjective: objective, // Vincula ao objetivo aberto
    framework: '', // Sem framework inicial - usuario define
  }));
};
```

---

## 9. Arquivo a Modificar

| Arquivo | Modificacao |
|---------|-------------|
| `src/pages/Sprints.tsx` | Todas as modificacoes concentradas |

---

## 10. Resumo das Mudancas

### Remocoes
- `objectiveOptions` (array de opcoes fixas)
- `sprintTypes` (array de tipos)
- Campo `sprintType` do wizardData
- Componente `Dialog` (substituido por `Sheet`)

### Adicoes
- `contentFrameworks` (8 frameworks)
- Campo `framework` em `SuggestedContent`
- Estado `contentDetailSheet` para painel aninhado
- Textarea para objetivo livre

### Evolucoes
- Step 1: Select → Textarea para objetivo
- Step 6: Cards editaveis + botao para Sheet de detalhamento
- Step 7: Exibir objetivo livre + framework por conteudo
- Wizard inteiro: Dialog → Sheet (right side panel)

---

## 11. Checklist de Entrega

### Step 1 - Intencao Estrategica
- [ ] Substituir Select por Textarea com placeholder exemplificativo
- [ ] Remover "Tipo de Sprint" completamente
- [ ] Atualizar validacao para 10+ caracteres no objetivo

### Wizard Container
- [ ] Substituir Dialog por Sheet (side="right")
- [ ] Ajustar largura para ~540px
- [ ] Manter scroll interno para conteudo longo

### Frameworks
- [ ] Definir 8 frameworks com nome, descricao e melhor uso
- [ ] Adicionar campo `framework` ao tipo `SuggestedContent`
- [ ] Criar selecao por cards (nao dropdown)

### Step 6 - Ajuste Humano
- [ ] Adicionar botao "Selecionar Framework" em cada card
- [ ] Criar Sheet aninhado para detalhamento completo
- [ ] Incluir selecao obrigatoria de framework no painel

### Step 7 - Confirmacao
- [ ] Exibir objetivo como texto livre
- [ ] Mostrar framework selecionado por conteudo
- [ ] Validar que todos os conteudos tem framework

### Geral
- [ ] Manter todos os campos existentes (exceto sprintType)
- [ ] Nao criar novas paginas
- [ ] Usar exclusivamente Sheet (nao modals)
- [ ] Seguir design system existente
