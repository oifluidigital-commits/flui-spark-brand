
# Plano de Evolucao — Sugestao Estrategica de Conteudos por IA no Wizard de Sprint

## Visao Geral

Estender o fluxo de criacao de Sprint existente (4 etapas) para incluir 3 novas etapas focadas em sugestao estrategica de conteudos pela IA, edicao humana obrigatoria e confirmacao final com lista de conteudos prontos para geracao futura.

**Fluxo Atual (4 etapas)**:
1. Intencao Estrategica
2. Escopo
3. Estrutura
4. Confirmacao

**Novo Fluxo (7 etapas)**:
1. Intencao Estrategica (existente)
2. Escopo (existente)
3. Estrutura (existente)
4. **Referencias & Briefing** (nova - opcional)
5. **Sugestao de Conteudos pela IA** (nova - nucleo)
6. **Ajuste Humano** (nova - obrigatoria)
7. **Confirmacao da Sprint** (evolucao da etapa 4)

---

## 1. Nova Etapa — Referencias & Briefing (Step 4)

### Objetivo
Permitir que o usuario forneca insumos estrategicos para a IA antes da sugestao de conteudos.

### Estrutura Visual

```text
+--------------------------------------------------+
|  Etapa 4 de 7 — Referencias para a Sprint        |
+--------------------------------------------------+
|  Esta etapa e opcional. Adicione materiais       |
|  que podem enriquecer as sugestoes da IA.        |
|                                                   |
|  Links Externos                                   |
|  [+ Adicionar link]                               |
|  ┌────────────────────────────────────────────┐   |
|  │ https://exemplo.com/artigo                 │   |
|  │ "Referencia de tom de voz"     [Remover]   │   |
|  └────────────────────────────────────────────┘   |
|                                                   |
|  Upload de Arquivos                               |
|  [+ Adicionar arquivo] (PDF, DOC, DOCX)           |
|  ┌────────────────────────────────────────────┐   |
|  │ 📄 briefing-cliente.pdf                    │   |
|  │ "Material do cliente"          [Remover]   │   |
|  └────────────────────────────────────────────┘   |
|                                                   |
+--------------------------------------------------+
|  [← Voltar]           [Pular]    [Proximo →]     |
+--------------------------------------------------+
```

### Estado do Wizard (adicoes)

```typescript
// Adicionar ao wizardData
references: {
  links: Array<{ url: string; description: string }>;
  files: Array<{ name: string; description: string }>;
};
```

### Comportamento
- Etapa opcional: usuario pode pular
- Links: campo de URL + descricao curta (opcional)
- Arquivos: simulacao de upload (mock apenas, sem processamento real)
- Descricao por referencia: "Por que isso e relevante?" (max 100 chars)

---

## 2. Nova Etapa — Sugestao de Conteudos pela IA (Step 5)

### Objetivo
Exibir um plano editorial sugerido pela IA com base no briefing estrategico.

### Estrutura Visual

```text
+--------------------------------------------------+
|  Etapa 5 de 7 — Plano Editorial Sugerido         |
+--------------------------------------------------+
|  ✨ A IA esta sugerindo, nao decidindo.          |
|  Voce revisara e ajustara na proxima etapa.      |
|                                                   |
|  [Analisando estrategia...]                       |
|  → Objetivo: Construir autoridade                 |
|  → Pilar: Autoridade                              |
|  → Publico: Profissionais em Ascensao            |
|  → Tom: Profissional mas acessivel               |
|                                                   |
|  Sugestoes (8 conteudos)                          |
|  ┌────────────────────────────────────────────┐   |
|  │ 1. Por que roadmaps falham                 │   |
|  │    Intencao: Educar   Formato: Carousel    │   |
|  │    Gancho: "90% dos PMs cometem..."        │   |
|  │    CTA: "Salve para aplicar"               │   |
|  └────────────────────────────────────────────┘   |
|  ┌────────────────────────────────────────────┐   |
|  │ 2. Framework de priorizacao                │   |
|  │    Intencao: Educar   Formato: Post        │   |
|  │    Gancho: "O metodo que uso..."           │   |
|  │    CTA: "Comente sua duvida"               │   |
|  └────────────────────────────────────────────┘   |
|  ...                                              |
|                                                   |
+--------------------------------------------------+
|  [← Voltar]              [Revisar Sugestoes →]   |
+--------------------------------------------------+
```

### Dados da Sugestao (mock)

```typescript
interface SuggestedContent {
  id: string;
  theme: string;           // Tema/Pauta
  intention: 'educate' | 'engage' | 'convert';
  format: ContentFormat;
  strategicObjective: string;
  hook: string;            // Gancho principal
  suggestedCta: string;    // CTA sugerido
}
```

### Geracao de Sugestoes (mock)

A IA simulada vai:
1. Analisar o objetivo da sprint (`wizardData.objective`)
2. Considerar o pilar selecionado (`wizardData.pillarId`)
3. Usar o tom de voz da marca (`mockBrand.voice.tone`)
4. Respeitar o volume planejado (`wizardData.contentsPlanned`)
5. Distribuir segundo o mix de intencao (`wizardData.intentionMix`)

**Mock de sugestoes baseado nos dados existentes** sera gerado dinamicamente.

---

## 3. Nova Etapa — Ajuste Humano (Step 6)

### Objetivo
Garantir controle total do usuario antes de qualquer geracao de texto.

### Estrutura Visual

```text
+--------------------------------------------------+
|  Etapa 6 de 7 — Ajuste do Plano Editorial        |
+--------------------------------------------------+
|  👤 Voce aprova antes da criacao.                |
|  Edite, reordene ou remova sugestoes.            |
|                                                   |
|  [+ Adicionar conteudo manualmente]               |
|                                                   |
|  ┌────────────────────────────────────────────┐   |
|  │ ≡ 1. Por que roadmaps falham           ⋮  │   |
|  │    [Educar ▼]  [Carousel ▼]                │   |
|  │    Gancho: [input editavel]                │   |
|  │    CTA: [input editavel]                   │   |
|  │    [Duplicar] [Remover]                    │   |
|  └────────────────────────────────────────────┘   |
|  ┌────────────────────────────────────────────┐   |
|  │ ≡ 2. Framework de priorizacao          ⋮  │   |
|  │    [Educar ▼]  [Post ▼]                    │   |
|  │    Gancho: [input editavel]                │   |
|  │    CTA: [input editavel]                   │   |
|  │    [Duplicar] [Remover]                    │   |
|  └────────────────────────────────────────────┘   |
|  ...                                              |
|                                                   |
+--------------------------------------------------+
|  [← Voltar]                   [Confirmar →]       |
+--------------------------------------------------+
```

### Acoes por Conteudo
- **Editar pauta**: Input para titulo
- **Trocar formato**: Select com formatos disponiveis
- **Ajustar intencao**: Select (Educar/Engajar/Converter)
- **Editar gancho**: Textarea curto
- **Editar CTA**: Input de texto
- **Duplicar**: Cria copia do card
- **Remover**: Exclui sugestao

### Acoes Globais
- **Adicionar manualmente**: Criar novo conteudo do zero
- **Reordenar**: Drag handle (visual, sem implementar DnD real)

---

## 4. Etapa Evoluida — Confirmacao da Sprint (Step 7)

### Objetivo
Resumo final antes de consolidar o planejamento.

### Estrutura Visual

```text
+--------------------------------------------------+
|  Etapa 7 de 7 — Confirmacao da Sprint            |
+--------------------------------------------------+
|                                                   |
|  Resumo Estrategico                               |
|  ┌────────────────────────────────────────────┐   |
|  │ Objetivo: Construir autoridade             │   |
|  │ Pilar: Autoridade                          │   |
|  │ Periodo: 01 Mar - 31 Mar 2024              │   |
|  │ Publico: Profissionais em Ascensao         │   |
|  └────────────────────────────────────────────┘   |
|                                                   |
|  Conteudos Aprovados (8)                          |
|  ┌────────────────────────────────────────────┐   |
|  │ ✓ Por que roadmaps falham [Carousel]       │   |
|  │ ✓ Framework de priorizacao [Post]          │   |
|  │ ✓ Metricas que importam [Video]            │   |
|  │ ...                                        │   |
|  └────────────────────────────────────────────┘   |
|                                                   |
|  Titulo da Sprint: [________________]             |
|  Descricao: [_____________________________]       |
|                                                   |
|  ⚠️ Este botao NAO gera textos.                  |
|  Apenas consolida o planejamento.                 |
|                                                   |
+--------------------------------------------------+
|  [← Voltar]    [Confirmar Sprint e Preparar      |
|                 Conteudos]                        |
+--------------------------------------------------+
```

### Resultado da Confirmacao
- Sprint criada com status `draft`
- Conteudos salvos como ideias com status especial: `ready_for_generation` (simulado como `planned`)
- Cada ideia vinculada ao sprint criado

---

## 5. Detalhes Tecnicos

### Novos Estados do Wizard

```typescript
const [wizardData, setWizardData] = useState({
  // Steps 1-3 existentes...
  objective: '',
  pillarId: '',
  sprintType: '',
  startDate: '',
  endDate: '',
  contentsPlanned: 8,
  frequency: 'weekly',
  formats: [],
  intentionMix: { educate: 40, engage: 30, convert: 30 },
  title: '',
  description: '',
  
  // Novos campos - Step 4 (Referencias)
  references: {
    links: [] as Array<{ id: string; url: string; description: string }>,
    files: [] as Array<{ id: string; name: string; description: string }>,
  },
  
  // Novos campos - Steps 5-6 (Sugestoes)
  suggestedContents: [] as SuggestedContent[],
  approvedContents: [] as SuggestedContent[],
});

// Tipo do conteudo sugerido
interface SuggestedContent {
  id: string;
  theme: string;
  intention: 'educate' | 'engage' | 'convert';
  format: string;
  strategicObjective: string;
  hook: string;
  suggestedCta: string;
  isApproved: boolean;
}
```

### Funcao de Geracao Mock de Sugestoes

```typescript
const generateMockSuggestions = (): SuggestedContent[] => {
  const { contentsPlanned, intentionMix, formats, pillarId, objective } = wizardData;
  const pillar = mockPillars.find(p => p.id === pillarId);
  
  const suggestions: SuggestedContent[] = [];
  const educateCount = Math.round((intentionMix.educate / 100) * contentsPlanned);
  const engageCount = Math.round((intentionMix.engage / 100) * contentsPlanned);
  const convertCount = contentsPlanned - educateCount - engageCount;
  
  // Mock themes based on pillar
  const mockThemes = {
    'pillar-1': ['Framework de priorizacao', 'Metricas de produto', 'Roadmap estrategico'],
    'pillar-2': ['Tutorial passo a passo', 'Erros comuns', 'Templates prontos'],
    'pillar-3': ['Bastidores do dia', 'Minha rotina', 'Licoes aprendidas'],
    'pillar-4': ['Case de sucesso', 'Prova social', 'Oferta especial'],
  };
  
  // Generate based on distribution...
  // (logic to create mock suggestions)
  
  return suggestions;
};
```

### Navegacao do Wizard Atualizada

```typescript
const totalSteps = 7;
const nextStep = () => {
  if (wizardStep === 4) {
    // Generate AI suggestions when entering step 5
    const suggestions = generateMockSuggestions();
    setWizardData(prev => ({ 
      ...prev, 
      suggestedContents: suggestions,
      approvedContents: suggestions.map(s => ({ ...s, isApproved: true }))
    }));
  }
  setWizardStep((prev) => Math.min(prev + 1, totalSteps));
};
const prevStep = () => setWizardStep((prev) => Math.max(prev - 1, 1));
```

### Validacoes por Step

| Step | Validacao |
|------|-----------|
| 1 | Objetivo + Pilar + Tipo obrigatorios |
| 2 | Datas + Volume >= 1 |
| 3 | Pelo menos 1 formato |
| 4 | Opcional (pode pular) |
| 5 | Automatico (sugestoes geradas) |
| 6 | Pelo menos 1 conteudo aprovado |
| 7 | Titulo obrigatorio |

---

## 6. Mensagens de UX

### Indicadores Visuais

**Step 5 (IA sugerindo)**:
```tsx
<div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
  <Sparkles className="h-4 w-4 text-primary" />
  <span className="text-sm">A IA esta sugerindo, nao decidindo.</span>
</div>
```

**Step 6 (Ajuste humano)**:
```tsx
<div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
  <User className="h-4 w-4 text-amber-500" />
  <span className="text-sm">Voce aprova antes da criacao.</span>
</div>
```

**Step 7 (Confirmacao)**:
```tsx
<div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
  <span className="text-sm text-muted-foreground">
    Este botao NAO gera textos. Apenas consolida o planejamento.
  </span>
</div>
```

---

## 7. Componentes Internos a Criar

```tsx
// Dentro de Sprints.tsx
const renderWizardStep4 = () => { /* Referencias */ };
const renderWizardStep5 = () => { /* Sugestoes IA */ };
const renderWizardStep6 = () => { /* Ajuste Humano */ };
const renderWizardStep7 = () => { /* Confirmacao Final */ };

// Subcomponentes auxiliares
const ReferenceItem = ({ reference, onRemove }) => { ... };
const SuggestedContentCard = ({ content, onEdit, onDuplicate, onRemove }) => { ... };
const EditableContentCard = ({ content, onChange, onDuplicate, onRemove }) => { ... };
```

---

## 8. Imports Adicionais

```tsx
import { 
  Link2, 
  FileText, 
  Upload, 
  User, 
  GripVertical,
  Plus,
  X,
} from 'lucide-react';
```

---

## 9. Salvamento Final

Ao confirmar a sprint:

```typescript
const handleSave = () => {
  // 1. Criar Sprint
  const newSprint: Sprint = {
    id: `sprint-${Date.now()}`,
    title: wizardData.title,
    description: wizardData.description,
    status: 'draft',
    // ... outros campos
  };
  addSprint(newSprint);
  
  // 2. Criar Ideias para cada conteudo aprovado
  wizardData.approvedContents.forEach((content, index) => {
    const newIdea: Idea = {
      id: `idea-${Date.now()}-${index}`,
      title: content.theme,
      description: `Gancho: ${content.hook}\nCTA: ${content.suggestedCta}`,
      status: 'planned', // "Pronto para geracao"
      format: content.format as ContentFormat,
      pillarId: wizardData.pillarId,
      sprintId: newSprint.id,
      tags: [content.intention],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addIdea(newIdea);
  });
  
  setIsDialogOpen(false);
};
```

---

## 10. Arquivo a Modificar

| Arquivo | Modificacao |
|---------|-------------|
| `src/pages/Sprints.tsx` | Estender wizard de 4 para 7 etapas |

---

## 11. Checklist de Entrega

### Step 4 - Referencias
- [ ] Campo para adicionar links externos
- [ ] Simulacao de upload de arquivos (mock)
- [ ] Descricao opcional por referencia
- [ ] Botao "Pular" para etapa opcional

### Step 5 - Sugestoes IA
- [ ] Geracao mock de sugestoes baseada no briefing
- [ ] Exibicao do contexto estrategico analisado
- [ ] Lista de conteudos sugeridos com detalhes
- [ ] Mensagem "A IA esta sugerindo, nao decidindo"

### Step 6 - Ajuste Humano
- [ ] Cards editaveis para cada conteudo
- [ ] Selects para formato e intencao
- [ ] Inputs para gancho e CTA
- [ ] Acoes: Duplicar, Remover
- [ ] Botao para adicionar conteudo manualmente
- [ ] Mensagem "Voce aprova antes da criacao"

### Step 7 - Confirmacao
- [ ] Resumo estrategico completo
- [ ] Lista de conteudos aprovados
- [ ] Campos de titulo e descricao
- [ ] Aviso "NAO gera textos"
- [ ] Botao "Confirmar Sprint e Preparar Conteudos"

### Geral
- [ ] Atualizar navegacao do wizard (7 etapas)
- [ ] Atualizar validacoes por step
- [ ] Atualizar titulos e descricoes de cada etapa
- [ ] Salvar sprint e ideias ao confirmar
- [ ] Manter todos os campos existentes
- [ ] Usar apenas componentes Shadcn UI existentes
