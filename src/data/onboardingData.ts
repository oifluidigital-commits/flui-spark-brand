// Onboarding Mock Data

// Role options
export const roleOptions = [
  { value: 'founder', label: 'Fundador(a) / CEO' },
  { value: 'marketing_head', label: 'Head de Marketing' },
  { value: 'content_creator', label: 'Criador(a) de Conteúdo' },
  { value: 'social_media', label: 'Social Media Manager' },
  { value: 'consultant', label: 'Consultor(a)' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'developer', label: 'Desenvolvedor(a)' },
  { value: 'designer', label: 'Designer' },
  { value: 'sales', label: 'Vendas' },
  { value: 'hr', label: 'RH / People' },
  { value: 'finance', label: 'Finanças' },
  { value: 'coach', label: 'Coach / Mentor' },
  { value: 'educator', label: 'Educador(a)' },
  { value: 'other', label: 'Outro' },
];

// Experience levels
export const experienceLevels = [
  { value: '0-2', label: '0-2 anos' },
  { value: '3-5', label: '3-5 anos' },
  { value: '6-10', label: '6-10 anos' },
  { value: '10+', label: '10+ anos' },
];

// Areas of expertise
export const expertiseAreas = [
  { 
    id: 'tech', 
    label: 'Tecnologia', 
    icon: 'Code',
    subareas: ['Desenvolvimento', 'DevOps', 'IA/ML', 'Cloud', 'Segurança', 'Mobile']
  },
  { 
    id: 'marketing', 
    label: 'Marketing', 
    icon: 'Megaphone',
    subareas: ['Growth', 'Performance', 'Branding', 'SEO', 'Email Marketing', 'Influência']
  },
  { 
    id: 'business', 
    label: 'Negócios', 
    icon: 'Briefcase',
    subareas: ['Estratégia', 'Vendas', 'Operações', 'Finanças', 'Jurídico', 'RH']
  },
  { 
    id: 'product', 
    label: 'Produto', 
    icon: 'Package',
    subareas: ['Product Management', 'UX/UI', 'Research', 'Analytics', 'Growth', 'Roadmap']
  },
  { 
    id: 'creative', 
    label: 'Criativo', 
    icon: 'Palette',
    subareas: ['Design Gráfico', 'Vídeo', 'Fotografia', 'Copywriting', 'Ilustração', 'Motion']
  },
  { 
    id: 'health', 
    label: 'Saúde', 
    icon: 'Heart',
    subareas: ['Fitness', 'Nutrição', 'Mental', 'Medicina', 'Terapias', 'Bem-estar']
  },
  { 
    id: 'education', 
    label: 'Educação', 
    icon: 'GraduationCap',
    subareas: ['Cursos Online', 'Mentoria', 'Treinamento', 'E-learning', 'Workshops', 'Coaching']
  },
  { 
    id: 'finance', 
    label: 'Finanças', 
    icon: 'TrendingUp',
    subareas: ['Investimentos', 'Contabilidade', 'Planejamento', 'Crypto', 'Trading', 'Consultoria']
  },
];

// Goals
export const goalOptions = [
  { id: 'authority', label: 'Construir autoridade', description: 'Ser reconhecido como expert na área', icon: 'Award' },
  { id: 'audience', label: 'Crescer audiência', description: 'Aumentar alcance e seguidores', icon: 'Users' },
  { id: 'leads', label: 'Gerar leads', description: 'Atrair potenciais clientes', icon: 'Target' },
  { id: 'sales', label: 'Vender mais', description: 'Converter seguidores em clientes', icon: 'ShoppingBag' },
  { id: 'community', label: 'Criar comunidade', description: 'Engajar e conectar pessoas', icon: 'Heart' },
  { id: 'personal_brand', label: 'Marca pessoal', description: 'Fortalecer sua imagem', icon: 'Star' },
];

// Content topics by area
export const topicsByArea: Record<string, string[]> = {
  tech: [
    'Desenvolvimento Web', 'Arquitetura de Software', 'Cloud Computing', 
    'IA & Machine Learning', 'DevOps', 'Segurança', 'Open Source',
    'Carreira em Tech', 'Novas Tecnologias', 'Code Reviews'
  ],
  marketing: [
    'Growth Hacking', 'Marketing de Conteúdo', 'SEO', 'Mídia Paga',
    'Copywriting', 'Branding', 'Analytics', 'Automação',
    'Influencer Marketing', 'Email Marketing'
  ],
  business: [
    'Empreendedorismo', 'Gestão', 'Liderança', 'Vendas B2B',
    'Estratégia', 'Startups', 'Inovação', 'Negociação',
    'Produtividade', 'Cultura Organizacional'
  ],
  product: [
    'Product Management', 'UX/UI Design', 'Métricas de Produto',
    'Roadmapping', 'Discovery', 'User Research', 'Priorização',
    'Metodologias Ágeis', 'Product-Led Growth', 'OKRs'
  ],
  creative: [
    'Design Visual', 'Branding', 'UI Design', 'Motion Graphics',
    'Storytelling Visual', 'Direção de Arte', 'Tipografia',
    'Fotografia', 'Ilustração', 'Video'
  ],
  health: [
    'Fitness', 'Nutrição', 'Saúde Mental', 'Mindfulness',
    'Hábitos Saudáveis', 'Sono', 'Produtividade Pessoal',
    'Bem-estar', 'Medicina Preventiva', 'Lifestyle'
  ],
  education: [
    'Educação Online', 'Metodologias de Ensino', 'Criação de Cursos',
    'Mentoria', 'Aprendizado Contínuo', 'Didática',
    'Tecnologia Educacional', 'Gamificação', 'Soft Skills', 'Hard Skills'
  ],
  finance: [
    'Investimentos', 'Finanças Pessoais', 'Planejamento Financeiro',
    'Mercado de Ações', 'Renda Passiva', 'Criptomoedas',
    'Educação Financeira', 'Economia', 'Empreendedorismo Financeiro', 'Independência Financeira'
  ],
};

// Audience types
export const audienceTypes = [
  { id: 'beginners', label: 'Iniciantes', description: 'Pessoas começando na área', icon: 'Sprout' },
  { id: 'intermediate', label: 'Intermediários', description: 'Profissionais em evolução', icon: 'TrendingUp' },
  { id: 'advanced', label: 'Avançados', description: 'Especialistas e seniores', icon: 'Rocket' },
  { id: 'leaders', label: 'Líderes', description: 'Gestores e executivos', icon: 'Crown' },
  { id: 'entrepreneurs', label: 'Empreendedores', description: 'Donos de negócio', icon: 'Briefcase' },
  { id: 'career_changers', label: 'Transição', description: 'Mudando de carreira', icon: 'RefreshCw' },
];

// Challenges
export const challengeOptions = [
  { id: 'consistency', label: 'Manter consistência', icon: 'Calendar' },
  { id: 'ideas', label: 'Ter ideias de conteúdo', icon: 'Lightbulb' },
  { id: 'time', label: 'Falta de tempo', icon: 'Clock' },
  { id: 'engagement', label: 'Baixo engajamento', icon: 'MessageCircle' },
  { id: 'strategy', label: 'Definir estratégia', icon: 'Compass' },
  { id: 'differentiation', label: 'Me diferenciar', icon: 'Sparkles' },
  { id: 'writing', label: 'Escrever bem', icon: 'Pen' },
  { id: 'monetization', label: 'Monetizar conteúdo', icon: 'DollarSign' },
];

// Communication style dimensions
export const communicationDimensions = [
  { id: 'formality', left: 'Casual', right: 'Formal', leftIcon: 'Coffee', rightIcon: 'Briefcase' },
  { id: 'approach', left: 'Storyteller', right: 'Data-driven', leftIcon: 'BookOpen', rightIcon: 'BarChart' },
  { id: 'tone', left: 'Seguro', right: 'Provocativo', leftIcon: 'Shield', rightIcon: 'Zap' },
  { id: 'expression', left: 'Reservado', right: 'Expressivo', leftIcon: 'Volume1', rightIcon: 'Volume2' },
];

// Diagnostic loading messages
export const diagnosticMessages = [
  'Analisando seu perfil profissional…',
  'Identificando padrões estratégicos…',
  'Construindo mapa de persona…',
  'Calibrando tom de voz…',
  'Definindo pilares de conteúdo…',
  'Gerando recomendações personalizadas…',
];

// Mock diagnostic result
export interface DiagnosticResult {
  profileAnalysis: {
    title: string;
    summary: string;
    strengths: string[];
    opportunities: string[];
  };
  strategicPatterns: {
    title: string;
    patterns: Array<{ name: string; description: string; match: number }>;
  };
  personaMap: {
    title: string;
    primaryPersona: string;
    characteristics: string[];
    contentPreferences: string[];
  };
  brandArchetype: {
    title: string;
    archetype: string;
    description: string;
    traits: string[];
  };
  toneCalibration: {
    title: string;
    dimensions: Array<{ name: string; value: number; description: string }>;
  };
  contentPillars: {
    title: string;
    pillars: Array<{ name: string; percentage: number; description: string; color: string }>;
  };
}

export const mockDiagnosticResult: DiagnosticResult = {
  profileAnalysis: {
    title: 'Análise do Perfil Profissional',
    summary: 'Você é um profissional com sólida experiência em sua área, com potencial para se tornar uma referência em conteúdo estratégico.',
    strengths: [
      'Experiência prática sólida',
      'Visão estratégica de negócios',
      'Capacidade de traduzir complexidade',
    ],
    opportunities: [
      'Explorar formatos mais visuais',
      'Aumentar frequência de publicação',
      'Desenvolver série recorrente',
    ],
  },
  strategicPatterns: {
    title: 'Padrões Estratégicos Identificados',
    patterns: [
      { name: 'Educador Prático', description: 'Ensina através de exemplos reais e aplicáveis', match: 92 },
      { name: 'Curador de Tendências', description: 'Filtra e contextualiza novidades do mercado', match: 78 },
      { name: 'Contador de Histórias', description: 'Usa narrativas para transmitir conhecimento', match: 65 },
    ],
  },
  personaMap: {
    title: 'Mapa de Persona & Audiência',
    primaryPersona: 'Profissional em Ascensão',
    characteristics: [
      '28-40 anos',
      'Busca crescimento profissional',
      'Valoriza conteúdo prático',
      'Ativo no LinkedIn',
    ],
    contentPreferences: [
      'Tutoriais passo-a-passo',
      'Estudos de caso',
      'Frameworks aplicáveis',
      'Insights de carreira',
    ],
  },
  brandArchetype: {
    title: 'Arquétipo da Sua Marca',
    archetype: 'O Sábio',
    description: 'Você busca entender o mundo e compartilhar conhecimento. Sua marca pessoal é construída sobre expertise, análise e insights valiosos.',
    traits: [
      'Conhecimento profundo',
      'Visão analítica',
      'Mentoria natural',
      'Credibilidade',
    ],
  },
  toneCalibration: {
    title: 'Calibração do Tom de Voz',
    dimensions: [
      { name: 'Formalidade', value: 35, description: 'Profissional mas acessível' },
      { name: 'Abordagem', value: 60, description: 'Equilíbrio entre história e dados' },
      { name: 'Ousadia', value: 45, description: 'Opiniões fortes com base sólida' },
      { name: 'Expressividade', value: 70, description: 'Comunicação envolvente' },
    ],
  },
  contentPillars: {
    title: 'Pilares de Conteúdo Sugeridos',
    pillars: [
      { name: 'Autoridade Técnica', percentage: 40, description: 'Demonstrar expertise profunda', color: '#6366f1' },
      { name: 'Educação Prática', percentage: 30, description: 'Ensinar de forma aplicável', color: '#10b981' },
      { name: 'Bastidores & Conexão', percentage: 20, description: 'Humanizar sua marca', color: '#f59e0b' },
      { name: 'Conversão', percentage: 10, description: 'Conteúdo comercial estratégico', color: '#ef4444' },
    ],
  },
};

// Onboarding form data type
export interface OnboardingFormData {
  // Step 1: Account & Identity
  name: string;
  email: string;
  profilePhoto: string | null;
  
  // Step 2: Role & Experience
  role: string;
  experienceLevel: number;
  
  // Step 3: Area of Expertise
  primaryArea: string;
  subareas: string[];
  
  // Step 4: Goals
  primaryGoal: string;
  secondaryGoal: string;
  
  // Step 5: Content Topics
  selectedTopics: string[];
  
  // Step 6: Audience & Challenges
  audienceType: string;
  challenges: string[];
  
  // Step 7: Communication Style
  communicationStyle: {
    formality: number;
    approach: number;
    tone: number;
    expression: number;
  };
}

export const initialFormData: OnboardingFormData = {
  name: '',
  email: 'pedro@flui.app',
  profilePhoto: null,
  role: '',
  experienceLevel: 1,
  primaryArea: '',
  subareas: [],
  primaryGoal: '',
  secondaryGoal: '',
  selectedTopics: [],
  audienceType: '',
  challenges: [],
  communicationStyle: {
    formality: 50,
    approach: 50,
    tone: 50,
    expression: 50,
  },
};
