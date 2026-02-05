
# Plano de Implementacao — Dropdowns com Subitens no Menu Desktop

## Visao Geral

Modificar o menu horizontal desktop no `TopNavigation` para exibir dropdowns com subitens nos itens "Planejamento" e "Conteudos", preservando toda a navegacao existente.

---

## 1. Situacao Atual

O componente `TopNavigation.tsx` ja possui:

- Estrutura de dados `menuItems` com `children` definidos para "Planejamento" e "Conteudos"
- Imports do `DropdownMenu` do Shadcn UI
- Renderizacao de botoes simples no desktop (linhas 177-202) que NAO utilizam os children

**Problema**: Os subitens so aparecem no mobile drawer, nao no menu desktop.

---

## 2. Estrutura dos Subitens Existentes

```text
Planejamento (dropdown)
  └── Sprints

Conteudos (dropdown)
  ├── Ideias
  └── Frameworks
```

---

## 3. Modificacoes no TopNavigation.tsx

### 3.1 Atualizar a Renderizacao do Menu Desktop

Substituir a logica de renderizacao (linhas 177-202) para:
- Itens SEM children: botao simples (comportamento atual)
- Itens COM children: DropdownMenu com subitens

**Estrutura do dropdown:**
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <button className="flex items-center gap-2 ...">
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
      <ChevronDown className="h-3 w-3" />
      {/* Active indicator */}
    </button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="center">
    {item.children.map((child) => (
      <DropdownMenuItem onClick={() => navigate(child.route)}>
        <ChildIcon className="h-4 w-4 mr-2" />
        {child.label}
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
```

### 3.2 Ajustar Estado Ativo

O indicador de ativo deve aparecer no item pai quando qualquer rota filha estiver ativa:
- `/content-lab/sprints` → "Planejamento" ativo
- `/content-lab/ideas` → "Conteudos" ativo
- `/content-lab/frameworks` → "Conteudos" ativo

### 3.3 Adicionar Indicador de Ativo nos Subitens

Dentro do dropdown, o subitem ativo deve ter destaque visual (texto primary ou background sutil).

---

## 4. Componentes Shadcn Utilizados

| Componente | Uso |
|------------|-----|
| DropdownMenu | Container do dropdown |
| DropdownMenuTrigger | Botao que abre o dropdown |
| DropdownMenuContent | Container dos itens |
| DropdownMenuItem | Cada subitem clicavel |

Todos ja estao importados no arquivo.

---

## 5. Estilizacao

Seguindo o Visual Dictionary existente:

- `bg-popover` → Background do dropdown (ja definido no componente)
- `border-border` → Borda do dropdown
- `text-foreground` → Texto dos itens
- `text-primary` → Subitem ativo
- `hover:bg-accent` → Hover nos itens
- `z-50` → Z-index alto para garantir visibilidade

---

## 6. Detalhes Tecnicos

### Renderizacao Condicional no Desktop

```tsx
<nav className="hidden lg:flex items-center gap-1">
  {menuItems.map((item) => {
    const Icon = item.icon;
    const isActive = activeMenuItem === item.id;
    
    // Se o item tem children, renderiza dropdown
    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenu key={item.id}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative',
                'hover:text-foreground/80',
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              <ChevronDown className="h-3 w-3 ml-1" />
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="min-w-[140px]">
            {item.children.map((child) => {
              const ChildIcon = child.icon;
              const isChildActive = location.pathname === child.route;
              return (
                <DropdownMenuItem
                  key={child.id}
                  onClick={() => navigate(child.route)}
                  className={cn(
                    'cursor-pointer',
                    isChildActive && 'text-primary'
                  )}
                >
                  <ChildIcon className="h-4 w-4 mr-2" />
                  {child.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    // Se nao tem children, renderiza botao simples
    return (
      <button
        key={item.id}
        onClick={() => handleMenuItemClick(item.id)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative',
          'hover:text-foreground/80',
          isActive ? 'text-foreground' : 'text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
        <span>{item.label}</span>
        {isActive && (
          <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
        )}
      </button>
    );
  })}
</nav>
```

---

## 7. Comportamento

| Acao | Resultado |
|------|-----------|
| Hover em "Planejamento" | Cursor pointer, texto claro |
| Click em "Planejamento" | Abre dropdown com "Sprints" |
| Click em "Sprints" | Navega para `/content-lab/sprints`, fecha dropdown |
| Hover em "Conteudos" | Cursor pointer, texto claro |
| Click em "Conteudos" | Abre dropdown com "Ideias" e "Frameworks" |
| Click em "Ideias" | Navega para `/content-lab/ideas`, fecha dropdown |
| Click em "Frameworks" | Navega para `/content-lab/frameworks`, fecha dropdown |

---

## 8. Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| Desktop (lg+) | Dropdowns horizontais na top bar |
| Mobile/Tablet | Drawer lateral com subitens aninhados (ja implementado) |

---

## 9. Arquivo a Modificar

| Arquivo | Modificacao |
|---------|-------------|
| `src/components/layout/TopNavigation.tsx` | Atualizar renderizacao do menu desktop para usar dropdowns em itens com children |

---

## 10. Checklist de Entrega

- [ ] Modificar renderizacao do menu desktop para dropdowns condicionais
- [ ] Adicionar ChevronDown nos itens com children
- [ ] Estilizar subitens ativos dentro do dropdown
- [ ] Manter indicador de ativo no item pai
- [ ] Testar navegacao para todas as rotas
- [ ] Verificar z-index e posicionamento do dropdown
