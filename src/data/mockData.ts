import {
  User,
  Brand,
  Sprint,
  Idea,
  Framework,
  Trend,
  PricingPlan,
  Activity,
  ContentPillar,
} from '@/types';

// Mock User
export const mockUser: User = {
  id: 'user-1',
  name: 'Pedro Meira',
  email: 'pedro@flui.app',
  avatar: undefined,
  company: 'Meira Digital',
  role: 'Head de Conteúdo',
  onboardingStatus: 'in_progress',
  onboardingStep: 1,
  plan: 'free',
  aiCredits: {
    total: 5000,
    used: 1200,
  },
  createdAt: '2024-01-15T10:00:00Z',
};

// Mock Content Pillars
export const mockPillars: ContentPillar[] = [
  {
    id: 'pillar-1',
    name: 'Autoridade',
    description: 'Conteúdo que demonstra expertise e conhecimento profundo',
    percentage: 40,
    color: '#6366f1',
  },
  {
    id: 'pillar-2',
    name: 'Educacional',
    description: 'Ensinar conceitos e habilidades para a audiência',
    percentage: 30,
    color: '#10b981',
  },
  {
    id: 'pillar-3',
    name: 'Conexão',
    description: 'Criar relacionamento e aproximação com o público',
    percentage: 20,
    color: '#f59e0b',
  },
  {
    id: 'pillar-4',
    name: 'Conversão',
    description: 'Conteúdo focado em vendas e call-to-actions',
    percentage: 10,
    color: '#ef4444',
  },
];

// Mock Brand
export const mockBrand: Brand = {
  id: 'brand-1',
  userId: 'user-1',
  name: 'Meira Digital',
  logo: undefined,
  colors: {
    primary: '#6366f1',
    secondary: '#10b981',
    accent: '#f59e0b',
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
  },
  voice: {
    tone: ['Profissional', 'Acessível', 'Inspirador'],
    personality: ['Expert', 'Mentor', 'Prático'],
    examples: [
      'Você não precisa de mais informação, precisa de clareza.',
      'Estratégia não é sobre fazer mais, é sobre fazer o certo.',
    ],
  },
  positioning: {
    valueProposition: 'Transformar criadores em marcas estratégicas através de conteúdo intencional',
    differentiators: [
      'Metodologia proprietária de sprints de conteúdo',
      'Foco em consistência vs viralidade',
      'Abordagem de produto para conteúdo',
    ],
    targetAudience: 'Criadores de conteúdo e empreendedores digitais que querem construir autoridade',
  },
  pillars: mockPillars,
  competitors: [
    {
      id: 'comp-1',
      name: 'ContentStudio',
      website: 'contentstudio.io',
      strengths: ['Interface intuitiva', 'Agendamento multicanal'],
      weaknesses: ['Sem estratégia', 'Foco apenas em execução'],
    },
    {
      id: 'comp-2',
      name: 'Notion Templates',
      website: 'notion.so',
      strengths: ['Flexibilidade', 'Comunidade ativa'],
      weaknesses: ['Não é específico para conteúdo', 'Requer setup manual'],
    },
  ],
};

// Mock Sprints
export const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    title: 'Autoridade em Produto',
    description: 'Sprint focado em estabelecer autoridade no tema de Product Management',
    status: 'active',
    theme: 'Product Leadership',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    alignmentScore: 82,
    contentsPlanned: 10,
    contentsPublished: 4,
    pillarId: 'pillar-1',
    createdAt: '2024-01-28T10:00:00Z',
    updatedAt: '2024-02-10T15:30:00Z',
  },
  {
    id: 'sprint-2',
    title: 'Série Educacional: Fundamentos',
    description: 'Ensinar os conceitos básicos para iniciantes na área',
    status: 'draft',
    theme: 'Educação de Base',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    alignmentScore: 0,
    contentsPlanned: 8,
    contentsPublished: 0,
    pillarId: 'pillar-2',
    createdAt: '2024-02-05T14:00:00Z',
    updatedAt: '2024-02-05T14:00:00Z',
  },
  {
    id: 'sprint-3',
    title: 'Lançamento do Curso',
    description: 'Sprint de aquecimento e vendas para o novo curso',
    status: 'completed',
    theme: 'Lançamento',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    alignmentScore: 91,
    contentsPlanned: 15,
    contentsPublished: 15,
    pillarId: 'pillar-4',
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2024-01-31T18:00:00Z',
  },
];

// Mock Ideas
export const mockIdeas: Idea[] = [
  {
    id: 'idea-1',
    title: 'Por que 90% dos roadmaps falham',
    description: 'Carousel explicando os erros mais comuns ao criar roadmaps de produto',
    status: 'planned',
    format: 'carousel',
    pillarId: 'pillar-1',
    sprintId: 'sprint-1',
    tags: ['roadmap', 'produto', 'estratégia'],
    dueDate: '2024-02-15',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-08T14:00:00Z',
  },
  {
    id: 'idea-2',
    title: 'Como defino prioridades no meu time',
    description: 'Vídeo mostrando meu processo real de priorização semanal',
    status: 'in_progress',
    format: 'video',
    pillarId: 'pillar-3',
    sprintId: 'sprint-1',
    tags: ['priorização', 'bastidores', 'rotina'],
    dueDate: '2024-02-12',
    createdAt: '2024-02-02T09:00:00Z',
    updatedAt: '2024-02-10T11:00:00Z',
  },
  {
    id: 'idea-3',
    title: 'O framework que uso para dizer não',
    description: 'Post sobre como recusar demandas de forma estratégica',
    status: 'review',
    format: 'post',
    pillarId: 'pillar-2',
    sprintId: 'sprint-1',
    tags: ['framework', 'comunicação', 'gestão'],
    createdAt: '2024-02-03T16:00:00Z',
    updatedAt: '2024-02-10T09:00:00Z',
  },
  {
    id: 'idea-4',
    title: 'Minha stack de ferramentas 2024',
    description: 'Thread com todas as ferramentas que uso no dia a dia',
    status: 'backlog',
    format: 'thread',
    pillarId: 'pillar-3',
    tags: ['ferramentas', 'produtividade', 'tech'],
    createdAt: '2024-02-05T11:00:00Z',
    updatedAt: '2024-02-05T11:00:00Z',
  },
  {
    id: 'idea-5',
    title: 'Cases de sucesso: Cliente X',
    description: 'Story com depoimento e resultados do cliente',
    status: 'published',
    format: 'story',
    pillarId: 'pillar-4',
    sprintId: 'sprint-3',
    tags: ['case', 'resultados', 'prova social'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
];

// Mock Frameworks
export const mockFrameworks: Framework[] = [
  {
    id: 'framework-1',
    name: 'AIDA',
    description: 'Atenção, Interesse, Desejo, Ação - clássico framework de copywriting',
    category: 'sales',
    structure: [
      'Atenção: Capture com um gancho forte',
      'Interesse: Desenvolva a curiosidade',
      'Desejo: Mostre os benefícios',
      'Ação: CTA claro e direto',
    ],
    example: 'Você sabia que 80% dos PMs não sabem priorizar? Aqui está o método que uso para nunca mais ficar perdido...',
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'framework-2',
    name: 'PAS',
    description: 'Problema, Agitação, Solução - focado em dores do público',
    category: 'sales',
    structure: [
      'Problema: Identifique a dor',
      'Agitação: Amplifique o problema',
      'Solução: Apresente a resposta',
    ],
    example: 'Cansado de sprints que não entregam valor? Isso acontece porque você está priorizando errado. Descubra como resolver...',
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'framework-3',
    name: 'Storytelling 3 Atos',
    description: 'Estrutura narrativa clássica em três partes',
    category: 'storytelling',
    structure: [
      'Ato 1 - Setup: Apresente o contexto e personagem',
      'Ato 2 - Conflito: Desenvolva o desafio',
      'Ato 3 - Resolução: Mostre a transformação',
    ],
    example: 'Quando comecei, não sabia nada sobre produto. Depois de falhar em 3 empresas, descobri o que ninguém me contou...',
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'framework-4',
    name: 'How-To Educacional',
    description: 'Estrutura para ensinar conceitos de forma clara',
    category: 'educational',
    structure: [
      'Contexto: Por que isso importa',
      'Passo 1: Primeira ação',
      'Passo 2: Segunda ação',
      'Passo 3: Terceira ação',
      'Resultado: O que esperar',
    ],
    example: 'Como criar um roadmap em 30 minutos: 1. Liste os objetivos 2. Mapeie iniciativas 3. Priorize por impacto...',
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'framework-5',
    name: 'Contrarian Take',
    description: 'Posicionamento controverso para gerar engajamento',
    category: 'authority',
    structure: [
      'Hot Take: Afirmação contrária ao senso comum',
      'Evidência: Por que você pensa assim',
      'Nuance: Quando não se aplica',
      'Conclusão: Reforce o ponto',
    ],
    example: 'Roadmaps são inúteis. Calma, me deixa explicar... O problema não é a ferramenta, é como usamos.',
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'framework-6',
    name: 'Dia na Vida',
    description: 'Conteúdo de bastidores e conexão pessoal',
    category: 'personal',
    structure: [
      'Setup: Contexto do dia',
      'Momentos: Highlights da rotina',
      'Insights: O que você aprendeu',
      'Conexão: Pergunta para audiência',
    ],
    example: '6h30 - Acordo antes do sol. Minha primeira hora é só para pensar. Sem celular, sem email...',
    isCustom: false,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Mock Trends
export const mockTrends: Trend[] = [
  {
    id: 'trend-1',
    title: 'AI-First Content Strategy',
    description: 'Marcas estão adotando IA como co-piloto criativo, não substituto',
    source: 'Content Marketing Institute',
    relevance: 'high',
    category: 'Tecnologia',
    suggestedActions: [
      'Criar conteúdo sobre como você usa IA',
      'Mostrar bastidores do processo com IA',
    ],
    discoveredAt: '2024-02-08T10:00:00Z',
  },
  {
    id: 'trend-2',
    title: 'Conteúdo Longo está voltando',
    description: 'Threads e newsletters estão performando melhor que posts curtos',
    source: 'Sparktoro Research',
    relevance: 'high',
    category: 'Formato',
    suggestedActions: [
      'Transformar posts em threads',
      'Iniciar uma newsletter semanal',
    ],
    discoveredAt: '2024-02-05T14:00:00Z',
  },
  {
    id: 'trend-3',
    title: 'Fadiga de Creators',
    description: 'Público está cansado de gurus e busca vozes autênticas',
    source: 'LinkedIn Data',
    relevance: 'medium',
    category: 'Comportamento',
    suggestedActions: [
      'Mostrar vulnerabilidade',
      'Compartilhar falhas e aprendizados',
    ],
    discoveredAt: '2024-02-01T09:00:00Z',
  },
  {
    id: 'trend-4',
    title: 'Video Vertical Dominante',
    description: 'Reels e TikTok continuam crescendo em todas as faixas etárias',
    source: 'Meta Insights',
    relevance: 'medium',
    category: 'Formato',
    suggestedActions: [
      'Adaptar conteúdo para formato vertical',
      'Testar conteúdo nativo de video',
    ],
    discoveredAt: '2024-01-28T11:00:00Z',
  },
];

// Mock Pricing Plans
export const mockPricingPlans: PricingPlan[] = [
  {
    id: 'plan-free',
    name: 'Starter',
    description: 'Para quem está começando a organizar seu conteúdo',
    price: 0,
    billingPeriod: 'monthly',
    features: [
      '1 Sprint ativo',
      '10 ideias por mês',
      '500 créditos IA',
      'Frameworks básicos',
      'Suporte por email',
    ],
    aiCredits: 500,
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    description: 'Para criadores que levam conteúdo a sério',
    price: 97,
    billingPeriod: 'monthly',
    features: [
      'Sprints ilimitados',
      'Ideias ilimitadas',
      '5.000 créditos IA',
      'Todos os frameworks',
      'Radar de tendências',
      'Análise de concorrentes',
      'Suporte prioritário',
    ],
    aiCredits: 5000,
    isPopular: true,
    isCurrent: true,
  },
  {
    id: 'plan-business',
    name: 'Business',
    description: 'Para equipes e agências de conteúdo',
    price: 297,
    billingPeriod: 'monthly',
    features: [
      'Tudo do Pro',
      '20.000 créditos IA',
      'Múltiplas marcas',
      'Colaboração em equipe',
      'API access',
      'Onboarding dedicado',
      'Suporte 24/7',
    ],
    aiCredits: 20000,
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: 'activity-1',
    action: 'publicou',
    target: 'Cases de sucesso: Cliente X',
    targetType: 'content',
    timestamp: '2024-02-10T14:30:00Z',
  },
  {
    id: 'activity-2',
    action: 'criou',
    target: 'Por que 90% dos roadmaps falham',
    targetType: 'idea',
    timestamp: '2024-02-10T10:00:00Z',
  },
  {
    id: 'activity-3',
    action: 'atualizou',
    target: 'Autoridade em Produto',
    targetType: 'sprint',
    timestamp: '2024-02-09T16:00:00Z',
  },
  {
    id: 'activity-4',
    action: 'editou',
    target: 'Pilares de Conteúdo',
    targetType: 'brand',
    timestamp: '2024-02-08T11:00:00Z',
  },
];

// Helper to get remaining AI credits
export const getRemainingCredits = (user: User): number => {
  return user.aiCredits.total - user.aiCredits.used;
};

// Helper to get credit percentage used
export const getCreditPercentage = (user: User): number => {
  return Math.round((user.aiCredits.used / user.aiCredits.total) * 100);
};

// Helper to format date in PT-BR
export const formatDatePTBR = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Helper to get status label in PT-BR
export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    draft: 'Rascunho',
    active: 'Ativo',
    completed: 'Concluído',
    archived: 'Arquivado',
    backlog: 'Backlog',
    planned: 'Planejado',
    in_progress: 'Em Progresso',
    review: 'Revisão',
    published: 'Publicado',
    not_started: 'Não Iniciado',
  };
  return labels[status] || status;
};

// Helper to get format label in PT-BR
export const getFormatLabel = (format: string): string => {
  const labels: Record<string, string> = {
    post: 'Post',
    carousel: 'Carrossel',
    video: 'Vídeo',
    story: 'Story',
    article: 'Artigo',
    thread: 'Thread',
    newsletter: 'Newsletter',
  };
  return labels[format] || format;
};

// Helper to get category label in PT-BR
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    storytelling: 'Storytelling',
    educational: 'Educacional',
    sales: 'Vendas',
    engagement: 'Engajamento',
    authority: 'Autoridade',
    personal: 'Pessoal',
  };
  return labels[category] || category;
};
 
 // ============================================
 // USER GATE MOCK SCENARIOS
 // ============================================
 
 export type PlanType = 'free' | 'pro' | 'studio';
 
 export interface UserGateScenario {
   plan: PlanType;
   onboardingCompleted: boolean;
   activeSprints: number;
   contentCredits: number;
   totalCredits: number;
 }
 
 export const mockUserGateScenarios: Record<string, UserGateScenario> = {
   // Scenario: Free user near limit
   free_near_limit: {
     plan: 'free',
     onboardingCompleted: false,
     activeSprints: 1,
     contentCredits: 150,
     totalCredits: 500,
   },
 
   // Scenario: Free user with no credits
   free_no_credits: {
     plan: 'free',
     onboardingCompleted: true,
     activeSprints: 1,
     contentCredits: 0,
     totalCredits: 500,
   },
 
   // Scenario: Pro user normal usage
   pro_normal: {
     plan: 'pro',
     onboardingCompleted: true,
     activeSprints: 3,
     contentCredits: 4200,
     totalCredits: 5000,
   },
 
   // Scenario: Studio user full access
   studio_full: {
     plan: 'studio',
     onboardingCompleted: true,
     activeSprints: 5,
     contentCredits: 18500,
     totalCredits: 20000,
   },
 };
 
 // Active scenario for demo (change this to test different scenarios)
 export const activeUserGateScenario = 'free_near_limit';
