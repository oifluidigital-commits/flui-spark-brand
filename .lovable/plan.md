

# 🚀 Plano de Implementação — Flui

Uma aplicação SaaS de estratégia de conteúdo com IA, totalmente navegável e pronta para demonstração.

---

## 1. Fundação & Sistema de Design

### Configuração do Tema
- Modo escuro como padrão usando as cores especificadas (zinc-950, zinc-900, etc.)
- Tokens de cores customizadas no Tailwind para ações primárias (indigo-600), sucesso (emerald-500), avisos (amber-500) e erros (red-500)
- Estilos hover consistentes com `hover:border-zinc-700` e transições suaves

### Estrutura de Mock Data
- Contexto global com dados do usuário, sprints, ideias e configurações
- Simulação de estados (carregando, vazio, sucesso)
- Contador de créditos IA (5000 total, 1200 usados)

---

## 2. Layout Principal

### Barra Superior
- Título da página atual (dinâmico por rota)
- Contador de créditos IA com indicador visual
- Menu do usuário (perfil, configurações, sair)

### Sidebar Navegável (Colapsável)
- Logo Flui
- Navegação principal: Dashboard, Marca, Content Lab (com sub-itens)
- Indicador de progresso do onboarding (global)
- Links secundários: Preços, Política de Privacidade

### Grid Responsivo
- 3 colunas desktop / 2 tablet / 1 mobile
- `gap-6` entre cards

---

## 3. Páginas da Aplicação

### `/login`
- Formulário de login com email e senha
- Opção de login com Google (mockado)
- Link para criar conta
- Design limpo e focado

### `/onboarding` (Wizard Completo)
**Etapa 1 — Perfil**
- Nome, empresa, cargo
- Upload de foto (mockado)

**Etapa 2 — Configuração da Marca**
- Tom de voz, público-alvo, pilares de conteúdo
- Seleção de nicho/indústria

**Etapa 3 — Objetivos de Conteúdo**
- Frequência de publicação desejada
- Plataformas principais
- Métricas de sucesso

**Etapa 4 — Criar Primeiro Sprint**
- Nome do sprint, duração
- Tema principal
- Confirmação e conclusão

### `/dashboard` (Orientado a Ações)
- **Ações Rápidas**: Criar ideia, iniciar sprint, acessar frameworks
- **Tarefas Pendentes**: Lista de conteúdos para revisar/publicar
- **Sugestões de Conteúdo**: Cards com ideias geradas pela IA
- **Progresso do Sprint Ativo**: Barra de progresso, score de alinhamento
- **Estatísticas Rápidas**: Créditos restantes, conteúdos publicados, taxa de consistência

### `/brand` (Hub Completo da Marca)
**Abas:**
- **Identidade Visual**: Logo, cores da marca, tipografia (mockado)
- **Voz & Tom**: Atributos de personalidade, exemplos de tom
- **Posicionamento**: Proposta de valor, diferenciais, público-alvo
- **Pilares de Conteúdo**: Temas principais, porcentagem de foco
- **Análise de Concorrentes**: Cards comparativos (mockado)
- **Diretrizes da Marca**: Documento de guidelines (mockado)

### `/content-lab` (Hub Principal)
- Visão geral das seções
- Estatísticas agregadas
- Acesso rápido às sub-páginas

### `/content-lab/sprints` (Interface CRUD Completa)
- Tabela/lista de sprints com filtros (status, data, tema)
- Ordenação por múltiplos campos
- Cards expandíveis com detalhes
- Dialog para criar/editar sprint
- Score de alinhamento visual (Progress bar)
- Ações: Editar, Duplicar, Arquivar, Excluir

### `/content-lab/ideas` (Interface CRUD Completa)
- Lista de ideias de conteúdo com filtros (status, pilar, formato)
- Dialog para criar/editar ideia
- Campos: Título, descrição, pilar, formato, status, sprint vinculado
- Tags e categorização
- Ações em lote (mockadas)

### `/content-lab/frameworks` (Interface CRUD Completa)
- Biblioteca de frameworks de conteúdo
- Cards com preview do framework
- Dialog detalhado para visualização
- Criar framework customizado
- Filtros por categoria (storytelling, educacional, vendas, etc.)

### `/content-lab/radar` (Tendências & Insights)
- Lista de tendências do mercado (mockado)
- Alertas de oportunidades
- Filtros por relevância e data
- Integração visual com sprints

### `/profile`
- Informações pessoais editáveis
- Estatísticas de uso
- Histórico de atividade
- Configurações de notificação

### `/pricing`
- Tabela comparativa de planos
- Destaque para plano recomendado
- CTAs para upgrade/downgrade
- FAQ sobre cobrança

### `/privacy-policy`
- Texto legal completo
- Navegação por seções
- Última atualização

---

## 4. Regras de UX Implementadas

- **Bloqueio de Acesso**: Rotas protegidas redirecionam para `/onboarding` se incompleto
- **Progresso Global**: Indicador de onboarding visível em todas as páginas
- **Estados Visuais**: Loading (Skeleton), Empty States, Success/Error feedback
- **Responsividade**: Todas as páginas adaptadas para desktop, tablet e mobile
- **Feedback Visual**: Todos os botões respondem ao hover/click
- **Navegação Funcional**: Todas as rotas navegáveis via react-router-dom

---

## 5. Componentes Shadcn Utilizados

| Componente | Uso |
|------------|-----|
| Card | Containers principais, dashboards |
| Button | Todas as ações (variantes: primary, secondary, destructive) |
| Badge | Status de sprints, ideias, usuário |
| Progress | Onboarding, métricas, créditos |
| Tabs | Seções do Content Lab, Brand |
| Skeleton | Estados de carregamento |
| Dialog | Criação/edição, previews de frameworks |
| DropdownMenu | Menu do usuário, ações de contexto |
| Table | Listas de sprints, ideias |
| Input/Textarea | Formulários |
| Select | Filtros, seleção de opções |
| Switch | Configurações on/off |

---

## 6. Entregável Final

Uma aplicação **demo-ready** com:
- ✅ Design system consistente (dark mode)
- ✅ Todas as rotas funcionais
- ✅ Interfaces CRUD completas
- ✅ Onboarding wizard de 4 etapas
- ✅ Dashboard orientado a ações
- ✅ Hub completo da marca
- ✅ Content Lab com 4 seções detalhadas
- ✅ Mock data realista
- ✅ Simulação de estados e interações
- ✅ Layout responsivo
- ✅ Pronta para integração futura com Supabase

