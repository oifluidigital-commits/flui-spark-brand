// Onboarding Mock Data

// Role options for autocomplete (14 options)
export const roleOptions = [
  { value: 'founder', label: 'Founder / CEO' },
  { value: 'cpo', label: 'CPO' },
  { value: 'cto', label: 'CTO' },
  { value: 'head_product', label: 'Head of Product' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'growth_manager', label: 'Growth Manager' },
  { value: 'marketing_manager', label: 'Marketing Manager' },
  { value: 'designer', label: 'Designer' },
  { value: 'tech_lead', label: 'Tech Lead' },
  { value: 'consultant', label: 'Consultor(a)' },
  { value: 'educator', label: 'Educador(a)' },
  { value: 'creator', label: 'Criador(a) de Conteúdo' },
  { value: 'freelancer', label: 'Freelancer' },
];

// Experience levels for slider
export const experienceLevels = [
  { value: 0, label: '0-2 anos' },
  { value: 1, label: '3-5 anos' },
  { value: 2, label: '6-10 anos' },
  { value: 3, label: '10+ anos' },
];

// Areas of expertise (15 options including "Other")
export const expertiseAreas = [
  { 
    id: 'product', 
    label: 'Produto', 
    icon: 'Package',
    subareas: ['Product Management', 'UX/UI', 'Research', 'Analytics', 'Growth', 'Roadmapping']
  },
  { 
    id: 'marketing', 
    label: 'Marketing', 
    icon: 'Megaphone',
    subareas: ['Growth', 'Performance', 'Branding', 'SEO', 'Email Marketing', 'Influência']
  },
  { 
    id: 'tech', 
    label: 'Tecnologia', 
    icon: 'Code',
    subareas: ['Desenvolvimento', 'DevOps', 'IA/ML', 'Cloud', 'Segurança', 'Mobile']
  },
  { 
    id: 'sales', 
    label: 'Vendas', 
    icon: 'Target',
    subareas: ['B2B', 'B2C', 'Inside Sales', 'Field Sales', 'Partnerships', 'Account Management']
  },
  { 
    id: 'design', 
    label: 'Design', 
    icon: 'Palette',
    subareas: ['UI Design', 'UX Design', 'Brand Design', 'Motion', 'Ilustração', 'Design System']
  },
  { 
    id: 'data', 
    label: 'Dados', 
    icon: 'BarChart',
    subareas: ['Analytics', 'Data Science', 'BI', 'Data Engineering', 'Machine Learning', 'Visualização']
  },
  { 
    id: 'operations', 
    label: 'Operações', 
    icon: 'Settings',
    subareas: ['Processos', 'Supply Chain', 'Qualidade', 'Logística', 'Customer Success', 'Suporte']
  },
  { 
    id: 'hr', 
    label: 'RH / People', 
    icon: 'Users',
    subareas: ['Recrutamento', 'Cultura', 'Desenvolvimento', 'Employer Branding', 'Compensation', 'People Analytics']
  },
  { 
    id: 'finance', 
    label: 'Finanças', 
    icon: 'TrendingUp',
    subareas: ['Investimentos', 'Contabilidade', 'Planejamento', 'M&A', 'Valuation', 'FP&A']
  },
  { 
    id: 'education', 
    label: 'Educação', 
    icon: 'GraduationCap',
    subareas: ['Cursos Online', 'Mentoria', 'Treinamento', 'E-learning', 'Workshops', 'Coaching']
  },
  { 
    id: 'entrepreneurship', 
    label: 'Empreendedorismo', 
    icon: 'Briefcase',
    subareas: ['Startups', 'Bootstrapping', 'Fundraising', 'Scaling', 'Pivoting', 'Exit']
  },
  { 
    id: 'career', 
    label: 'Carreira', 
    icon: 'Award',
    subareas: ['Transição', 'Promoção', 'Networking', 'Marca Pessoal', 'Liderança', 'Produtividade']
  },
  { 
    id: 'leadership', 
    label: 'Liderança', 
    icon: 'Crown',
    subareas: ['Gestão de Times', 'Estratégia', 'Comunicação', 'Mentoria', 'Cultura', 'Decisão']
  },
  { 
    id: 'creator_economy', 
    label: 'Creator Economy', 
    icon: 'Sparkles',
    subareas: ['YouTube', 'Newsletter', 'Podcasting', 'Monetização', 'Comunidade', 'Infoprodutos']
  },
  { 
    id: 'other', 
    label: 'Outro', 
    icon: 'Plus',
    subareas: []
  },
];

// Goals (6 options + Other)
export const goalOptions = [
  { id: 'authority', label: 'Construir autoridade', description: 'Ser reconhecido como expert na área', icon: 'Award' },
  { id: 'audience', label: 'Crescer audiência', description: 'Aumentar alcance e seguidores', icon: 'Users' },
  { id: 'leads', label: 'Gerar leads', description: 'Atrair potenciais clientes', icon: 'Target' },
  { id: 'sales', label: 'Vender mais', description: 'Converter seguidores em clientes', icon: 'ShoppingBag' },
  { id: 'community', label: 'Criar comunidade', description: 'Engajar e conectar pessoas', icon: 'Heart' },
  { id: 'personal_brand', label: 'Marca pessoal', description: 'Fortalecer sua imagem', icon: 'Star' },
  { id: 'other', label: 'Outro', description: 'Defina seu objetivo', icon: 'Plus' },
];

// Content topics grouped by category
export const topicCategories = [
  {
    category: 'Estratégia',
    topics: ['Posicionamento', 'Growth', 'Inovação', 'Liderança', 'Cultura']
  },
  {
    category: 'Execução',
    topics: ['Produtividade', 'Processos', 'Ferramentas', 'Métricas', 'Gestão de Projetos']
  },
  {
    category: 'Carreira',
    topics: ['Transição de Carreira', 'Marca Pessoal', 'Networking', 'Mentoria', 'Soft Skills']
  },
  {
    category: 'Técnico',
    topics: ['Desenvolvimento', 'Design', 'Dados', 'IA', 'Cloud']
  },
  {
    category: 'Negócios',
    topics: ['Vendas', 'Marketing', 'Finanças', 'Jurídico', 'Operações']
  }
];

// Legacy topic mapping for backward compatibility
export const topicsByArea: Record<string, string[]> = {
  tech: ['Desenvolvimento Web', 'Arquitetura de Software', 'Cloud Computing', 'IA & Machine Learning', 'DevOps', 'Segurança'],
  marketing: ['Growth Hacking', 'Marketing de Conteúdo', 'SEO', 'Mídia Paga', 'Copywriting', 'Branding'],
  product: ['Product Management', 'UX/UI Design', 'Métricas de Produto', 'Roadmapping', 'Discovery', 'User Research'],
  sales: ['Vendas B2B', 'Inside Sales', 'Negociação', 'Pipeline', 'CRM', 'Social Selling'],
  design: ['UI Design', 'UX Research', 'Design System', 'Prototipação', 'Design Thinking', 'Visual Design'],
  data: ['Analytics', 'Data Science', 'Business Intelligence', 'Machine Learning', 'Data Engineering', 'Visualização de Dados'],
  operations: ['Processos', 'Customer Success', 'Qualidade', 'Logística', 'Automação', 'Suporte'],
  hr: ['Recrutamento', 'Cultura Organizacional', 'Employer Branding', 'Desenvolvimento de Pessoas', 'Engajamento', 'Diversidade'],
  finance: ['Investimentos', 'Finanças Pessoais', 'Planejamento Financeiro', 'Valuation', 'M&A', 'FP&A'],
  education: ['Educação Online', 'Criação de Cursos', 'Mentoria', 'Metodologias de Ensino', 'EdTech', 'Aprendizado Contínuo'],
  entrepreneurship: ['Startups', 'Bootstrapping', 'Fundraising', 'Scaling', 'Pivoting', 'Validação'],
  career: ['Transição de Carreira', 'Promoção', 'Networking Profissional', 'Entrevistas', 'Negociação Salarial', 'LinkedIn'],
  leadership: ['Gestão de Times', 'Comunicação', 'Feedback', 'Delegação', 'Tomada de Decisão', 'Resolução de Conflitos'],
  creator_economy: ['YouTube', 'Newsletter', 'Podcasting', 'Monetização', 'Comunidade', 'Infoprodutos'],
  other: ['Estratégia', 'Inovação', 'Produtividade', 'Comunicação', 'Networking', 'Marca Pessoal'],
};

// Audience types (6 options + Other)
export const audienceTypes = [
  { id: 'beginners', label: 'Iniciantes', description: 'Pessoas começando na área', icon: 'Sprout' },
  { id: 'intermediate', label: 'Intermediários', description: 'Profissionais em evolução', icon: 'TrendingUp' },
  { id: 'advanced', label: 'Avançados', description: 'Especialistas e seniores', icon: 'Rocket' },
  { id: 'leaders', label: 'Líderes', description: 'Gestores e executivos', icon: 'Crown' },
  { id: 'entrepreneurs', label: 'Empreendedores', description: 'Donos de negócio', icon: 'Briefcase' },
  { id: 'career_changers', label: 'Transição', description: 'Mudando de carreira', icon: 'RefreshCw' },
  { id: 'other', label: 'Outro', description: 'Defina sua audiência', icon: 'Plus' },
];

// Challenges (8 options + Other as conditional)
export const challengeOptions = [
  { id: 'consistency', label: 'Manter consistência', icon: 'Calendar' },
  { id: 'ideas', label: 'Ter ideias de conteúdo', icon: 'Lightbulb' },
  { id: 'time', label: 'Falta de tempo', icon: 'Clock' },
  { id: 'engagement', label: 'Baixo engajamento', icon: 'MessageCircle' },
  { id: 'strategy', label: 'Definir estratégia', icon: 'Compass' },
  { id: 'differentiation', label: 'Me diferenciar', icon: 'Sparkles' },
  { id: 'writing', label: 'Escrever bem', icon: 'Pen' },
  { id: 'monetization', label: 'Monetizar conteúdo', icon: 'DollarSign' },
  { id: 'other', label: 'Outro', icon: 'Plus' },
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
  customRole: string;
  experienceLevel: number;
  
  // Step 3: Area of Expertise
  primaryArea: string;
  customArea: string;
  subareas: string[];
  
  // Step 4: Goals
  primaryGoal: string;
  customPrimaryGoal: string;
  secondaryGoal: string;
  customSecondaryGoal: string;
  
  // Step 5: Content Topics
  selectedTopics: string[];
  customTopics: string[];
  
  // Step 6: Audience & Challenges
  audienceType: string;
  customAudience: string;
  challenges: string[];
  customChallenge: string;
  
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
  email: '',
  profilePhoto: null,
  role: '',
  customRole: '',
  experienceLevel: 1,
  primaryArea: '',
  customArea: '',
  subareas: [],
  primaryGoal: '',
  customPrimaryGoal: '',
  secondaryGoal: '',
  customSecondaryGoal: '',
  selectedTopics: [],
  customTopics: [],
  audienceType: '',
  customAudience: '',
  challenges: [],
  customChallenge: '',
  communicationStyle: {
    formality: 50,
    approach: 50,
    tone: 50,
    expression: 50,
  },
};