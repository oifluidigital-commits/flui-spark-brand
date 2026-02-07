import {
  User,
  PricingPlan,
} from '@/types';

// Mock Pricing Plans (static, not user-scoped)
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

// Helper to get remaining AI credits
export const getRemainingCredits = (user: User): number => {
  return user.aiCredits.total - user.aiCredits.used;
};

// Helper to get credit percentage used
export const getCreditPercentage = (user: User): number => {
  if (user.aiCredits.total === 0) return 0;
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
  free_near_limit: {
    plan: 'free',
    onboardingCompleted: false,
    activeSprints: 1,
    contentCredits: 150,
    totalCredits: 500,
  },
  free_no_credits: {
    plan: 'free',
    onboardingCompleted: true,
    activeSprints: 1,
    contentCredits: 0,
    totalCredits: 500,
  },
  pro_normal: {
    plan: 'pro',
    onboardingCompleted: true,
    activeSprints: 3,
    contentCredits: 4200,
    totalCredits: 5000,
  },
  studio_full: {
    plan: 'studio',
    onboardingCompleted: true,
    activeSprints: 5,
    contentCredits: 18500,
    totalCredits: 20000,
  },
};

export const activeUserGateScenario = 'free_near_limit';
