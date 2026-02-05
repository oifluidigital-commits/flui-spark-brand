

# Analise de Navegacao e Continuidade — Flui

## Resumo Executivo

Apos analise detalhada de todas as paginas e fluxos do sistema Flui, identifiquei **12 gaps de navegacao e continuidade** que fragmentam a experiencia do usuario. Este plano descreve cada gap, seu impacto, e a correcao minima necessaria para criar uma jornada coesa.

---

## Mapa de Paginas e Conexoes Atuais

```text
+---------------+       +-------------+       +------------+
|    Login      | ----> |  Onboarding | ----> | Dashboard  |
+---------------+       +-------------+       +------------+
                              |                     |
                              |                     v
                              |              +-------------+
                              +------------> |  Strategy   | (blocked if not completed)
                                             +-------------+
                                                   |
                                                   v (broken link: /planejamento)
                                             +-------------+
                                             |   Sprints   |
                                             +-------------+
                                                   |
                                                   v
                                             +--------------+
                                             | SprintDetail |
                                             +--------------+
```

---

## Gap 1: Strategy CTA aponta para rota inexistente

**Pagina**: `/strategy`  
**Problema**: O botao "Ir para Planejamento de Conteudo" navega para `/planejamento`, que nao existe. O usuario e levado para 404.
**Linha**: `src/pages/Strategy.tsx:325`

```typescript
// ATUAL (ERRADO)
<Button onClick={() => navigate('/planejamento')} className="gap-2">

// CORRECAO
<Button onClick={() => navigate('/content-lab/sprints')} className="gap-2">
```

**Correcao**: Alterar rota para `/content-lab/sprints`

---

## Gap 2: DiagnosticResults nao direciona para Strategy

**Pagina**: `/onboarding` (fase results)  
**Problema**: Apos finalizar o diagnostico, o usuario e direcionado ao Dashboard, mas nao ha indicacao clara de que a estrategia foi gerada e pode ser visualizada.

**Impacto**: Usuario nao descobre que `/strategy` agora esta disponivel.

**Correcao em `src/components/onboarding/DiagnosticResults.tsx`**:
- Adicionar um segundo CTA ou alterar texto do botao principal
- Navegar para `/strategy` em vez de `/dashboard`, ou oferecer escolha

```tsx
// Alterar o onComplete callback ou adicionar opcoes
<div className="flex flex-col gap-3 pt-6">
  <Button onClick={() => navigate('/strategy')} className="w-full" size="lg">
    <Sparkles className="h-4 w-4 mr-2" />
    Ver minha Estrategia Editorial
  </Button>
  <Button variant="outline" onClick={onComplete} className="w-full">
    Ir para o Dashboard
  </Button>
</div>
```

---

## Gap 3: Dashboard nao conecta claramente a Strategy

**Pagina**: `/dashboard`  
**Problema**: O Dashboard exibe o `OnboardingProgressCard` quando onboarding nao esta completo, mas quando esta completo, nao ha CTA para ver a estrategia gerada.

**Correcao em `src/pages/Dashboard.tsx`**:
- Adicionar card de "Estrategia Pronta" quando onboarding esta completo

```tsx
{user.onboardingStatus === 'completed' && (
  <Card className="border-primary/30 bg-primary/5 cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => navigate('/strategy')}>
    <CardContent className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Target className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium">Sua Estrategia Editorial</p>
          <p className="text-sm text-muted-foreground">Baseada no seu diagnostico</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </CardContent>
  </Card>
)}
```

---

## Gap 4: SprintDetail nao tem CTA de proximos passos

**Pagina**: `/sprints/:sprintId`  
**Problema**: Quando todos os conteudos estao concluidos, a pagina nao indica que a sprint pode ser finalizada ou que o usuario pode ir para proxima sprint.

**Correcao**: Adicionar banner contextual quando progresso = 100%

```tsx
{progressPercentage === 100 && (
  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between">
    <div className="flex items-center gap-2">
      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      <span className="text-sm font-medium">Todos os conteudos concluidos!</span>
    </div>
    <Button size="sm" variant="outline" onClick={() => navigate('/content-lab/sprints')}>
      Ver todas as Sprints
    </Button>
  </div>
)}
```

---

## Gap 5: Ideas nao conecta com Sprints

**Pagina**: `/content-lab/ideas`  
**Problema**: O modal de criacao/edicao de ideia permite selecionar uma Sprint, mas nao ha CTA contextual para criar uma Sprint se nao existirem. Alem disso, ao associar uma ideia a uma sprint, nao ha opcao de ir para aquela sprint.

**Correcao**:
1. Adicionar link para criar sprint quando lista de sprints esta vazia no select
2. Adicionar botao "Ver na Sprint" quando ideia tem sprintId

```tsx
// No card da ideia quando tem sprintId
{idea.sprintId && (
  <Button
    variant="ghost"
    size="sm"
    className="text-xs"
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/sprints/${idea.sprintId}`);
    }}
  >
    Ver na Sprint
  </Button>
)}
```

---

## Gap 6: Frameworks "Usar Framework" nao faz nada

**Pagina**: `/content-lab/frameworks`  
**Problema**: O botao "Usar Framework" no dialog de detalhes nao tem acao. Usuario clica e nada acontece.

**Correcao**: Navegar para criacao de ideia com framework pre-selecionado ou mostrar toast informativo

```tsx
<Button onClick={() => {
  setSelectedFramework(null);
  // Opcao 1: Navegar para Ideas com contexto
  navigate('/content-lab/ideas?framework=' + selectedFramework.id);
  // Opcao 2: Toast informativo (mais simples)
  toast({ description: 'Framework copiado! Use-o ao criar seu proximo conteudo.' });
}}>
  Usar Framework
</Button>
```

---

## Gap 7: Radar tendencias nao conectam com Ideas

**Pagina**: `/content-lab/radar`  
**Problema**: Cada tendencia tem "Acoes Sugeridas", mas nao ha botao para transformar a tendencia em uma ideia de conteudo.

**Correcao**: Adicionar botao "Criar Ideia" em cada card de tendencia

```tsx
<Button
  size="sm"
  variant="outline"
  className="mt-4"
  onClick={() => navigate(`/content-lab/ideas?trend=${trend.id}`)}
>
  <Lightbulb className="h-4 w-4 mr-2" />
  Criar Ideia
</Button>
```

---

## Gap 8: Brand (Hub da Marca) e uma pagina isolada

**Pagina**: `/brand`  
**Problema**: A pagina nao e acessivel pela navegacao principal (apenas mobile drawer). Nao ha contexto de como o usuario chegaria la nem para onde ir depois.

**Correcao**:
1. Adicionar link para Brand na pagina Strategy (secao "Tom de Voz")
2. Adicionar breadcrumb ou CTA de retorno ao Strategy

```tsx
// Em Strategy.tsx, na secao de Tom de Voz
<Button variant="link" onClick={() => navigate('/brand')}>
  Gerenciar no Hub da Marca
  <ArrowRight className="h-4 w-4 ml-1" />
</Button>
```

---

## Gap 9: Pricing nao tem navegacao de volta

**Pagina**: `/pricing`  
**Problema**: Quando usuario vem do CreditWarning ou UpgradePrompt, nao ha botao claro de voltar. Depende do browser back.

**Correcao**: Adicionar botao de voltar no header

```tsx
<div className="flex items-center gap-4 mb-6">
  <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
    <ArrowLeft className="h-4 w-4 mr-2" />
    Voltar
  </Button>
</div>
```

---

## Gap 10: Profile nao conecta com Pricing para upgrade

**Pagina**: `/profile`  
**Problema**: A secao "Estatisticas de Uso" mostra creditos restantes mas nao oferece caminho para upgrade quando baixo.

**Correcao**: Adicionar CTA de upgrade quando creditos estao baixos

```tsx
{(user.aiCredits.total - user.aiCredits.used) / user.aiCredits.total < 0.2 && (
  <Button
    variant="outline"
    size="sm"
    className="mt-4"
    onClick={() => navigate('/pricing')}
  >
    <Sparkles className="h-4 w-4 mr-2" />
    Obter mais creditos
  </Button>
)}
```

---

## Gap 11: StrategyBlockedState texto do botao confuso

**Pagina**: `/strategy` (quando onboarding incompleto)  
**Problema**: O botao diz "Voltar ao Diagnostico", mas o usuario pode nunca ter ido la. O icone ArrowLeft sugere "voltar" quando deveria ser "ir para".

**Correcao**:

```tsx
<Button onClick={() => navigate('/onboarding')} className="w-full gap-2">
  Completar Diagnostico
  <ArrowRight className="h-4 w-4" />
</Button>
```

---

## Gap 12: User Avatar dropdown items nao navegam

**Pagina**: TopNavigation (global)  
**Problema**: Os itens "Perfil", "Configuracoes" e "Ajuda" no dropdown do avatar nao tem onClick handlers que navegam.

**Correcao em `src/components/layout/TopNavigation.tsx`**:

```tsx
<DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
  <User className="h-4 w-4 mr-2" />
  Perfil
</DropdownMenuItem>
// Configuracoes e Ajuda podem mostrar toast "Em breve" por enquanto
```

---

## Resumo das Alteracoes por Arquivo

| Arquivo | Alteracoes |
|---------|-----------|
| `src/pages/Strategy.tsx` | Fix rota do CTA, adicionar link para Brand |
| `src/pages/Dashboard.tsx` | Adicionar card de Strategy quando onboarding completo |
| `src/pages/SprintDetail.tsx` | Adicionar banner de conclusao |
| `src/pages/Ideas.tsx` | Adicionar link "Ver na Sprint" |
| `src/pages/Frameworks.tsx` | Implementar acao do botao "Usar Framework" |
| `src/pages/Radar.tsx` | Adicionar botao "Criar Ideia" |
| `src/pages/Pricing.tsx` | Adicionar botao de voltar |
| `src/pages/Profile.tsx` | Adicionar CTA de upgrade quando creditos baixos |
| `src/components/onboarding/DiagnosticResults.tsx` | Oferecer opcao de ir para Strategy |
| `src/components/strategy/StrategyBlockedState.tsx` | Corrigir texto e icone do botao |
| `src/components/layout/TopNavigation.tsx` | Implementar navegacao nos dropdown items |

---

## Criterios de Sucesso

Apos as correcoes:

1. Nenhuma pagina termina em beco sem saida
2. Todo fluxo completado oferece proximo passo claro
3. Usuario sempre sabe onde esta e como voltar
4. Acoes como "Usar Framework" tem comportamento definido
5. Navegacao do avatar funciona corretamente
6. CTAs apontam para rotas existentes

---

## Secao Tecnica

### Padroes de Navegacao a Seguir

- **CTAs primarios**: `Button` com `onClick={() => navigate(...)}`
- **Links contextuais**: `Button variant="link"` ou `Button variant="ghost"`
- **Voltar**: `navigate(-1)` para historico ou rota especifica quando contexto e conhecido
- **Toast informativos**: Para acoes que nao navegam mas precisam de feedback

### Rotas Validas

```typescript
const validRoutes = [
  '/login',
  '/onboarding',
  '/dashboard',
  '/strategy',
  '/brand',
  '/content-lab/sprints',
  '/sprints/:sprintId',
  '/content-lab/ideas',
  '/content-lab/frameworks',
  '/content-lab/radar',
  '/profile',
  '/pricing',
  '/privacy-policy',
];
```

### Componentes Reutilizaveis

- `Button` com variantes apropriadas
- `ArrowRight` / `ArrowLeft` para indicar direcao
- Nenhum componente novo necessario

