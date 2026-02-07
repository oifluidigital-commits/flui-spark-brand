import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
 import { useUserGate } from '@/contexts/UserGateContext';
 import { useGate } from '@/hooks/useGate';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Copy,
  Archive,
  Trash2,
  Calendar as CalendarIcon,
  Sparkles,
  AlertTriangle,
  Check,
  ChevronRight,
  ChevronLeft,
  Link2,
  FileText,
  Upload,
  User,
  GripVertical,
  X,
  Crown,
  GraduationCap,
  Heart,
  Target,
  Circle,
} from 'lucide-react';
import { Sprint, SprintStatus } from '@/types';
import { formatDatePTBR } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
 import { useNavigate } from 'react-router-dom';
 import { SprintLimitCard } from '@/components/gates/SprintLimitCard';

// Status configuration for card badges
const getStatusConfig = (status: SprintStatus) => {
  switch (status) {
    case 'active':
      return {
        label: 'Em andamento',
        className: 'bg-violet-500/20 text-violet-500 border-violet-500/30',
      };
    case 'draft':
      return {
        label: 'Planejamento',
        className: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
      };
    case 'completed':
      return {
        label: 'Concluída',
        className: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
      };
    default:
      return {
        label: 'Arquivado',
        className: 'bg-zinc-500/20 text-zinc-500 border-zinc-500/30',
      };
  }
};

// NewSprintCard component
interface NewSprintCardProps {
  onClick: () => void;
}

const NewSprintCard = ({ onClick }: NewSprintCardProps) => (
  <button
    onClick={onClick}
    className={cn(
      'flex flex-col items-center justify-center gap-3',
      'min-h-[240px] rounded-lg',
      'border-2 border-dashed border-border',
      'bg-card/50 hover:border-primary',
      'transition-colors cursor-pointer',
      'group'
    )}
  >
    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
      <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
    </div>
    <span className="text-muted-foreground group-hover:text-foreground text-sm font-medium transition-colors">
      Criar nova Sprint
    </span>
  </button>
);

// SprintCard component
interface SprintCardProps {
  sprint: Sprint;
  onEdit: (sprint: Sprint) => void;
  onDuplicate: (sprint: Sprint) => void;
  onArchive: (sprint: Sprint) => void;
  onDelete: (sprintId: string) => void;
   onViewDetails: (sprint: Sprint) => void;
}

 const SprintCard = ({ sprint, onEdit, onDuplicate, onArchive, onDelete, onViewDetails }: SprintCardProps) => {
  const { brand } = useApp();
  const pillars = brand?.pillars ?? [];
  const pillar = pillars.find((p) => p.id === sprint.pillarId);
  const progressPercentage =
    sprint.contentsPlanned > 0
      ? Math.round((sprint.contentsPublished / sprint.contentsPlanned) * 100)
      : 0;

  const statusConfig = getStatusConfig(sprint.status);

  return (
    <Card
      className={cn(
        'bg-card border-border hover:border-primary/30 transition-colors',
        sprint.status === 'active' && 'ring-1 ring-violet-500/30'
      )}
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Badge variant="outline" className={cn('text-xs', statusConfig.className)}>
          {statusConfig.label}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(sprint)}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(sprint)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onArchive(sprint)}>
              <Archive className="h-4 w-4 mr-2" />
              Arquivar
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
          <h3 className="text-lg font-semibold text-foreground line-clamp-1">{sprint.title}</h3>
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
            <span className="text-muted-foreground">
              {sprint.contentsPublished}/{sprint.contentsPlanned} conteúdos prontos
            </span>
            <span
              className={cn(
                'font-medium',
                sprint.status === 'completed' ? 'text-emerald-500' : 'text-foreground'
              )}
            >
              {progressPercentage}%
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className={cn('h-2', sprint.status === 'completed' && '[&>div]:bg-emerald-500')}
          />
        </div>
      </CardContent>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {formatDatePTBR(sprint.startDate)} - {formatDatePTBR(sprint.endDate)}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
           onClick={() => onViewDetails(sprint)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

// SprintCardSkeleton component
const SprintCardSkeleton = () => (
  <Card className="bg-card border-border">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>
    </CardContent>
    <div className="px-6 py-4 border-t border-border flex items-center justify-between">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  </Card>
);

// Content formats for wizard
const contentFormats: { id: string; label: string; category: string }[] = [
  { id: 'post-linkedin-text', label: 'Post LinkedIn (texto curto)', category: 'social' },
  { id: 'post-linkedin-carousel', label: 'Post LinkedIn (carrossel)', category: 'social' },
  { id: 'article', label: 'Artigo longo', category: 'longform' },
  { id: 'newsletter', label: 'Newsletter', category: 'longform' },
  { id: 'video-short', label: 'Roteiro de vídeo curto', category: 'video' },
  { id: 'video-long', label: 'Roteiro de vídeo longo', category: 'video' },
  { id: 'thread', label: 'Thread', category: 'social' },
  { id: 'case-study', label: 'Case', category: 'longform' },
  { id: 'landing-page', label: 'Landing page', category: 'conversion' },
  { id: 'email-marketing', label: 'Email marketing', category: 'conversion' },
  { id: 'story', label: 'Story', category: 'social' },
  { id: 'reels', label: 'Reels / TikTok', category: 'video' },
];

// Pillar icon configuration
const pillarIconConfig: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }> = {
  'pillar-1': { icon: Crown, color: '#6366f1' },        // Autoridade
  'pillar-2': { icon: GraduationCap, color: '#10b981' }, // Educacional
  'pillar-3': { icon: Heart, color: '#f59e0b' },         // Conexão
  'pillar-4': { icon: Target, color: '#ef4444' },        // Conversão
};

// Content Frameworks
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

// Suggested content type
interface SuggestedContent {
  id: string;
  theme: string;
  intention: 'educate' | 'engage' | 'convert';
  format: string;
  strategicObjective: string;
  hook: string;
  suggestedCta: string;
  framework: string;
  frameworkReason?: string;
  frameworkBenefit?: string;
}

// Reference types
interface Reference {
  id: string;
  url?: string;
  name?: string;
  description: string;
  type: 'link' | 'file';
}

// Mock themes for AI suggestion generation
const mockThemesByPillar: Record<string, string[]> = {
  'pillar-1': [
    'Framework de priorização que todo PM deveria conhecer',
    'Por que roadmaps falham (e como evitar)',
    'Métricas de produto que realmente importam',
    'Como alinhar stakeholders sem perder a sanidade',
    'O segredo das empresas que escalam rápido',
    'Decisões baseadas em dados vs intuição',
    'Como criar uma cultura de experimentação',
    'Lições de 10 anos liderando produtos',
  ],
  'pillar-2': [
    'Tutorial: Configurando seu primeiro OKR',
    '5 erros comuns ao definir personas',
    'Template de discovery pronto para usar',
    'Como fazer entrevistas com usuários',
    'Passo a passo para priorização RICE',
    'Guia completo de A/B testing',
    'Como criar um backlog saudável',
    'Checklist de lançamento de produto',
  ],
  'pillar-3': [
    'Bastidores: como organizei minha semana',
    'O dia que quase desisti (e o que aprendi)',
    'Minha rotina de aprendizado contínuo',
    'Ferramentas que uso todo dia',
    'Como equilibro trabalho e vida pessoal',
    'Respondendo suas dúvidas sobre carreira',
    'Uma conversa honesta sobre síndrome do impostor',
    'O que ninguém te conta sobre liderança',
  ],
  'pillar-4': [
    'Case de sucesso: como ajudei empresa X',
    'Resultados do meu último projeto',
    'Por que meus clientes me escolhem',
    'Vagas abertas na minha mentoria',
    'Últimas vagas para o workshop',
    'Oferta especial para seguidores',
    'Depoimentos de quem já trabalhou comigo',
    'Como posso ajudar você a crescer',
  ],
};

const mockHooks: Record<string, string[]> = {
  educate: [
    '90% das pessoas erram nisso...',
    'O método que mudou minha carreira:',
    'Aprendi isso depois de 5 anos:',
    'A técnica que poucos conhecem:',
    'Simples, mas poderoso:',
  ],
  engage: [
    'Você concorda com isso?',
    'Qual sua maior dificuldade com...',
    'Conta pra mim nos comentários:',
    'Você já passou por isso?',
    'Polêmico, mas verdade:',
  ],
  convert: [
    'Resultado garantido ou dinheiro de volta',
    'Últimas vagas disponíveis',
    'Desconto exclusivo para você',
    'A oportunidade que você esperava',
    'Transforme sua carreira agora',
  ],
};

const mockCtas: Record<string, string[]> = {
  educate: [
    'Salve para consultar depois',
    'Compartilhe com alguém que precisa',
    'Comente sua dúvida',
    'Siga para mais conteúdo assim',
  ],
  engage: [
    'Deixe sua opinião nos comentários',
    'Marque alguém que precisa ver',
    'Reposte nos seus stories',
    'Conta sua experiência',
  ],
  convert: [
    'Clique no link da bio',
    'Envie "QUERO" por DM',
    'Garanta sua vaga agora',
    'Agende uma conversa gratuita',
  ],
};

export default function Sprints() {
  const { sprints, brand, addSprint, updateSprint, deleteSprint } = useApp();
  const pillars = brand?.pillars ?? [];
   const { userGate, getPlanLimits } = useUserGate();
   const createSprintGate = useGate('create-sprint');
   const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [isWizardMode, setIsWizardMode] = useState(false);
  const [contentDetailSheet, setContentDetailSheet] = useState<{
    isOpen: boolean;
    contentId: string | null;
  }>({ isOpen: false, contentId: null });
  const [showFrameworkOptions, setShowFrameworkOptions] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    status: 'draft' as SprintStatus,
    startDate: '',
    endDate: '',
    pillarId: '',
    contentsPlanned: 10,
  });

  const [wizardData, setWizardData] = useState({
    objective: '', // Now a free-text field
    pillarId: '',
    startDate: '',
    endDate: '',
    contentsPlanned: 8,
    frequency: 'weekly' as 'daily' | 'weekly' | 'biweekly',
    formats: [] as string[],
    intentionMix: {
      educate: 40,
      engage: 30,
      convert: 30,
    },
    title: '',
    description: '',
    // Step 4 - References
    references: [] as Reference[],
    // Steps 5-6 - Suggestions
    suggestedContents: [] as SuggestedContent[],
    approvedContents: [] as SuggestedContent[],
  });

  const filteredSprints = sprints.filter((sprint) => {
    const matchesSearch = sprint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sprint.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sprint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate estimated initial score based on wizard data
  const estimatedScore = useMemo(() => {
    let score = 0;
    if (wizardData.objective.trim().length >= 10) score += 20;
    if (wizardData.pillarId) score += 20;
    score += 15; // Base score since sprintType removed
    if (wizardData.formats.length >= 2) score += 15;
    if (wizardData.formats.length >= 3) score += 10;
    if (wizardData.contentsPlanned >= 4 && wizardData.contentsPlanned <= 12) score += 10;
    if (wizardData.intentionMix.educate > 0 && wizardData.intentionMix.engage > 0 && wizardData.intentionMix.convert > 0) score += 10;
    return Math.min(score, 100);
  }, [wizardData]);

  // Get improvement suggestions
  const getImprovementSuggestions = () => {
    const suggestions: string[] = [];
    if (wizardData.formats.length < 3) {
      suggestions.push('Adicione mais diversidade de formatos');
    }
    if (wizardData.intentionMix.engage < 25) {
      suggestions.push('Considere aumentar foco em engajamento');
    }
    if (wizardData.contentsPlanned > 12) {
      suggestions.push('Volume alto pode impactar qualidade');
    }
    if (wizardData.contentsPlanned < 4) {
      suggestions.push('Considere aumentar o volume para maior consistência');
    }
    return suggestions;
  };

  const handleOpenDialog = (sprint?: Sprint) => {
    if (sprint) {
      setEditingSprint(sprint);
      setIsWizardMode(false);
      setFormData({
        title: sprint.title,
        description: sprint.description,
        theme: sprint.theme,
        status: sprint.status,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        pillarId: sprint.pillarId || '',
        contentsPlanned: sprint.contentsPlanned,
      });
    } else {
      setEditingSprint(null);
      setIsWizardMode(true);
      setWizardStep(1);
      setWizardData({
        objective: '',
        pillarId: '',
        startDate: '',
        endDate: '',
        contentsPlanned: 8,
        frequency: 'weekly',
        formats: [],
        intentionMix: { educate: 40, engage: 30, convert: 30 },
        title: '',
        description: '',
        references: [],
        suggestedContents: [],
        approvedContents: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingSprint) {
      updateSprint(editingSprint.id, formData);
    } else {
      const pillar = pillars.find(p => p.id === wizardData.pillarId);
      const newSprint: Sprint = {
        id: `sprint-${Date.now()}`,
        title: wizardData.title,
        description: wizardData.description,
        theme: wizardData.objective.slice(0, 50),
        status: 'draft' as SprintStatus,
        startDate: wizardData.startDate,
        endDate: wizardData.endDate,
        pillarId: wizardData.pillarId,
        contentsPlanned: wizardData.contentsPlanned,
        alignmentScore: estimatedScore,
        contentsPublished: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addSprint(newSprint);
    }
    setIsDialogOpen(false);
  };

  const handleEditSave = () => {
    if (editingSprint) {
      updateSprint(editingSprint.id, formData);
    }
    setIsDialogOpen(false);
  };

  const handleDuplicate = (sprint: Sprint) => {
    const duplicated: Sprint = {
      ...sprint,
      id: `sprint-${Date.now()}`,
      title: `${sprint.title} (Cópia)`,
      status: 'draft',
      alignmentScore: 0,
      contentsPublished: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSprint(duplicated);
  };

  const handleViewDetails = (sprint: Sprint) => {
     navigate(`/sprints/${sprint.id}`);
  };

  // Generate mock AI suggestions based on wizard data
  const generateMockSuggestions = (): SuggestedContent[] => {
    const { contentsPlanned, intentionMix, formats, pillarId } = wizardData;
    const themes = mockThemesByPillar[pillarId] || mockThemesByPillar['pillar-1'];
    
    const educateCount = Math.round((intentionMix.educate / 100) * contentsPlanned);
    const engageCount = Math.round((intentionMix.engage / 100) * contentsPlanned);
    const convertCount = Math.max(0, contentsPlanned - educateCount - engageCount);
    
    const suggestions: SuggestedContent[] = [];
    const availableFormats = formats.length > 0 ? formats : ['post-linkedin-text'];
    
    // AI Framework recommendation based on intention and format
    const getFrameworkRecommendation = (
      intention: 'educate' | 'engage' | 'convert',
      format: string
    ): { id: string; reason: string; benefit: string } => {
      // Format-specific recommendations
      if (format.includes('carousel') || format === 'post-linkedin-carousel') {
        return {
          id: 'educational',
          reason: 'Carrosséis funcionam melhor com estrutura de etapas didáticas',
          benefit: 'Maior retenção e salvamentos'
        };
      }
      
      if (format === 'video-short' || format === 'reels' || format === 'story') {
        return {
          id: 'hvc',
          reason: 'Vídeos curtos precisam de gancho imediato e CTA direto',
          benefit: 'Maior taxa de visualização completa'
        };
      }
      
      if (format === 'case-study') {
        return {
          id: 'bab',
          reason: 'Cases se beneficiam da estrutura Antes/Depois/Ponte',
          benefit: 'Demonstra transformação com clareza'
        };
      }
      
      if (format === 'landing-page' || format === 'email-marketing') {
        return {
          id: 'aida',
          reason: 'Estrutura ideal para páginas e emails de conversão',
          benefit: 'Maior taxa de cliques e conversões'
        };
      }
      
      // Intention-based recommendations
      if (intention === 'convert') {
        return {
          id: 'aida',
          reason: 'Estrutura ideal para conteúdos de conversão, guiando o leitor até a ação',
          benefit: 'Maior taxa de cliques e conversões'
        };
      }
      
      if (intention === 'engage') {
        return {
          id: 'storytelling',
          reason: 'Narrativa gera conexão emocional e comentários',
          benefit: 'Maior engajamento e compartilhamentos'
        };
      }
      
      if (intention === 'educate') {
        return {
          id: 'educational',
          reason: 'Estrutura didática para ensinar conceitos de forma clara',
          benefit: 'Retenção e compreensão do conteúdo'
        };
      }
      
      // Default
      return {
        id: 'hvc',
        reason: 'Estrutura direta e eficaz para redes sociais',
        benefit: 'Clareza e objetividade'
      };
    };
    
    const createSuggestion = (intention: 'educate' | 'engage' | 'convert', index: number): SuggestedContent => {
      const hooks = mockHooks[intention];
      const ctas = mockCtas[intention];
      const format = availableFormats[index % availableFormats.length];
      const theme = themes[index % themes.length];
      const frameworkRec = getFrameworkRecommendation(intention, format);
      
      return {
        id: `suggestion-${Date.now()}-${index}`,
        theme,
        intention,
        format,
        strategicObjective: intention === 'educate' 
          ? 'Demonstrar expertise e educar a audiência'
          : intention === 'engage'
          ? 'Gerar conexão e interação com o público'
          : 'Converter seguidores em leads/clientes',
        hook: hooks[index % hooks.length],
        suggestedCta: ctas[index % ctas.length],
        framework: frameworkRec.id, // AI recommends a framework
        frameworkReason: frameworkRec.reason,
        frameworkBenefit: frameworkRec.benefit,
      };
    };
    
    let themeIndex = 0;
    for (let i = 0; i < educateCount; i++) {
      suggestions.push(createSuggestion('educate', themeIndex++));
    }
    for (let i = 0; i < engageCount; i++) {
      suggestions.push(createSuggestion('engage', themeIndex++));
    }
    for (let i = 0; i < convertCount; i++) {
      suggestions.push(createSuggestion('convert', themeIndex++));
    }
    
    return suggestions.slice(0, contentsPlanned);
  };

  const totalSteps = 7;
  
  const nextStep = () => {
    if (wizardStep === 4) {
      // Generate AI suggestions when entering step 5
      const suggestions = generateMockSuggestions();
      setWizardData(prev => ({ 
        ...prev, 
        suggestedContents: suggestions,
        approvedContents: [...suggestions]
      }));
    }
    setWizardStep((prev) => Math.min(prev + 1, totalSteps));
  };
  const prevStep = () => setWizardStep((prev) => Math.max(prev - 1, 1));

  const canProceedStep1 = wizardData.objective.trim().length >= 10 && wizardData.pillarId;
  const canProceedStep2 = wizardData.startDate && wizardData.endDate && wizardData.contentsPlanned >= 1;
  const canProceedStep3 = wizardData.formats.length >= 1;
  const canProceedStep6 = wizardData.approvedContents.length >= 1;
  const allContentsHaveFramework = wizardData.approvedContents.every(c => c.framework);
  const canCreateSprint = wizardData.title.trim().length >= 2 && allContentsHaveFramework;

  const toggleFormat = (formatId: string) => {
    setWizardData((prev) => ({
      ...prev,
      formats: prev.formats.includes(formatId)
        ? prev.formats.filter((f) => f !== formatId)
        : [...prev.formats, formatId],
    }));
  };

  // Reference handlers
  const addReference = (type: 'link' | 'file') => {
    const newRef: Reference = {
      id: `ref-${Date.now()}`,
      type,
      url: type === 'link' ? '' : undefined,
      name: type === 'file' ? '' : undefined,
      description: '',
    };
    setWizardData(prev => ({
      ...prev,
      references: [...prev.references, newRef]
    }));
  };

  const updateReference = (id: string, updates: Partial<Reference>) => {
    setWizardData(prev => ({
      ...prev,
      references: prev.references.map(ref => 
        ref.id === id ? { ...ref, ...updates } : ref
      )
    }));
  };

  const removeReference = (id: string) => {
    setWizardData(prev => ({
      ...prev,
      references: prev.references.filter(ref => ref.id !== id)
    }));
  };

  // Content adjustment handlers
  const updateApprovedContent = (id: string, updates: Partial<SuggestedContent>) => {
    setWizardData(prev => ({
      ...prev,
      approvedContents: prev.approvedContents.map(content =>
        content.id === id ? { ...content, ...updates } : content
      )
    }));
  };

  const removeApprovedContent = (id: string) => {
    setWizardData(prev => ({
      ...prev,
      approvedContents: prev.approvedContents.filter(c => c.id !== id)
    }));
  };

  const duplicateApprovedContent = (id: string) => {
    const content = wizardData.approvedContents.find(c => c.id === id);
    if (content) {
      const duplicate: SuggestedContent = {
        ...content,
        id: `suggestion-${Date.now()}-dup`,
        theme: `${content.theme} (cópia)`,
      };
      setWizardData(prev => ({
        ...prev,
        approvedContents: [...prev.approvedContents, duplicate]
      }));
    }
  };

  const addManualContent = () => {
    const newContent: SuggestedContent = {
      id: `manual-${Date.now()}`,
      theme: 'Novo conteúdo',
      intention: 'educate',
      format: wizardData.formats[0] || 'post-linkedin-text',
      strategicObjective: 'Defina o objetivo estratégico',
      hook: 'Adicione um gancho',
      suggestedCta: 'Adicione um CTA',
      framework: '',
    };
    setWizardData(prev => ({
      ...prev,
      approvedContents: [...prev.approvedContents, newContent]
    }));
  };

  // Content detail sheet handlers
  const openContentDetailSheet = (contentId: string) => {
    setContentDetailSheet({ isOpen: true, contentId });
    setShowFrameworkOptions(false);
  };

  const closeContentDetailSheet = () => {
    setContentDetailSheet({ isOpen: false, contentId: null });
    setShowFrameworkOptions(false);
  };

  const getFrameworkLabel = (frameworkId: string) => {
    return contentFrameworks.find(f => f.id === frameworkId)?.name || frameworkId;
  };

  // Wizard step title helper
  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Intenção Estratégica';
      case 2: return 'Escopo';
      case 3: return 'Estrutura';
      case 4: return 'Referências & Briefing';
      case 5: return 'Plano Editorial Sugerido';
      case 6: return 'Ajuste do Plano';
      case 7: return 'Confirmação da Sprint';
      default: return '';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Defina o propósito estratégico da sua sprint';
      case 2: return 'Configure o período e volume de conteúdo';
      case 3: return 'Escolha formatos e distribuição';
      case 4: return 'Adicione referências para enriquecer as sugestões (opcional)';
      case 5: return 'Revise as sugestões geradas pela IA';
      case 6: return 'Ajuste, reordene ou remova conteúdos antes de confirmar';
      case 7: return 'Revise e finalize sua sprint';
      default: return '';
    }
  };

  // Wizard Step Components
  const renderWizardStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Qual é o objetivo principal desta sprint?</Label>
        <Textarea
          value={wizardData.objective}
          onChange={(e) => setWizardData({ ...wizardData, objective: e.target.value })}
          placeholder="Ex: Consolidar autoridade como referência em Produto / Educar o público sobre fundamentos de marketing / Preparar audiência para lançamento de um curso"
          rows={3}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground">
          Mínimo de 10 caracteres ({wizardData.objective.trim().length}/10)
        </p>
      </div>

      <div className="space-y-3">
        <Label>Em qual pilar este conteúdo se encaixa?</Label>
        <div className="grid grid-cols-2 gap-3">
          {pillars.map((pillar) => {
            const iconConfig = pillarIconConfig[pillar.id];
            const IconComponent = iconConfig?.icon || Circle;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setWizardData({ ...wizardData, pillarId: pillar.id })}
                className={cn(
                  'p-3 rounded-lg border text-left transition-all',
                  wizardData.pillarId === pillar.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className="flex items-center gap-2">
                  <IconComponent
                    className="h-5 w-5"
                    style={{ color: iconConfig?.color || pillar.color }}
                  />
                  <span className="font-medium text-sm">{pillar.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  {pillar.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderWizardStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Período da Sprint</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !wizardData.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {wizardData.startDate && wizardData.endDate ? (
                <>
                  {format(new Date(wizardData.startDate), "dd MMM yyyy", { locale: ptBR })} -{" "}
                  {format(new Date(wizardData.endDate), "dd MMM yyyy", { locale: ptBR })}
                </>
              ) : wizardData.startDate ? (
                format(new Date(wizardData.startDate), "dd MMM yyyy", { locale: ptBR })
              ) : (
                "Selecione o período"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
            <Calendar
              mode="range"
              selected={{
                from: wizardData.startDate ? new Date(wizardData.startDate) : undefined,
                to: wizardData.endDate ? new Date(wizardData.endDate) : undefined,
              }}
              onSelect={(range: DateRange | undefined) => {
                setWizardData(prev => ({
                  ...prev,
                  startDate: range?.from?.toISOString().split('T')[0] || '',
                  endDate: range?.to?.toISOString().split('T')[0] || '',
                }));
              }}
              numberOfMonths={2}
              locale={ptBR}
              disabled={(date) => isBefore(date, startOfDay(new Date()))}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {wizardData.startDate && wizardData.endDate && (
          <p className="text-xs text-muted-foreground">
            Duração: {Math.ceil((new Date(wizardData.endDate).getTime() - new Date(wizardData.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} dias
          </p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Volume estimado de conteúdos</Label>
          <span className="text-sm font-medium">{wizardData.contentsPlanned} conteúdos</span>
        </div>
        <Slider
          value={[wizardData.contentsPlanned]}
          onValueChange={(value) => setWizardData({ ...wizardData, contentsPlanned: value[0] })}
          min={1}
          max={20}
          step={1}
          className="w-full"
        />
        {wizardData.contentsPlanned > 12 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-500">
              Volume agressivo. Considere reduzir para manter qualidade e consistência.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label>Frequência sugerida</Label>
        <div className="flex gap-2">
          {[
            { id: 'daily', label: 'Diário' },
            { id: 'weekly', label: 'Semanal' },
            { id: 'biweekly', label: 'Quinzenal' },
          ].map((freq) => (
            <button
              key={freq.id}
              type="button"
              onClick={() =>
                setWizardData({ ...wizardData, frequency: freq.id as 'daily' | 'weekly' | 'biweekly' })
              }
              className={cn(
                'flex-1 px-4 py-2 rounded-lg text-sm border transition-all',
                wizardData.frequency === freq.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {freq.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWizardStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Formatos de conteúdo (selecione múltiplos)</Label>
        <div className="grid grid-cols-2 gap-2">
          {contentFormats.map((format) => (
            <button
              key={format.id}
              type="button"
              onClick={() => toggleFormat(format.id)}
              className={cn(
                'p-3 rounded-lg border text-left transition-all text-sm',
                wizardData.formats.includes(format.id)
                  ? 'bg-primary/10 border-primary text-foreground'
                  : 'border-border hover:border-primary/50 text-muted-foreground'
              )}
            >
              <div className="flex items-center gap-2">
                {wizardData.formats.includes(format.id) && (
                  <Check className="h-4 w-4 text-primary shrink-0" />
                )}
                <span className={cn(
                  !wizardData.formats.includes(format.id) && "ml-6"
                )}>
                  {format.label}
                </span>
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {wizardData.formats.length} formato(s) selecionado(s)
        </p>
      </div>

      <div className="space-y-4">
        <Label>Mix de intenção (ajuste as porcentagens)</Label>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Educar</span>
              <span className="font-medium">{wizardData.intentionMix.educate}%</span>
            </div>
            <Slider
              value={[wizardData.intentionMix.educate]}
              onValueChange={(value) =>
                setWizardData({
                  ...wizardData,
                  intentionMix: { ...wizardData.intentionMix, educate: value[0] },
                })
              }
              min={0}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Engajar</span>
              <span className="font-medium">{wizardData.intentionMix.engage}%</span>
            </div>
            <Slider
              value={[wizardData.intentionMix.engage]}
              onValueChange={(value) =>
                setWizardData({
                  ...wizardData,
                  intentionMix: { ...wizardData.intentionMix, engage: value[0] },
                })
              }
              min={0}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Converter</span>
              <span className="font-medium">{wizardData.intentionMix.convert}%</span>
            </div>
            <Slider
              value={[wizardData.intentionMix.convert]}
              onValueChange={(value) =>
                setWizardData({
                  ...wizardData,
                  intentionMix: { ...wizardData.intentionMix, convert: value[0] },
                })
              }
              min={0}
              max={100}
              step={5}
            />
          </div>
        </div>

        {wizardData.formats.length > 0 && wizardData.contentsPlanned > 0 && (
          <div className="p-3 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Distribuição sugerida: </span>
              {Math.round((wizardData.intentionMix.educate / 100) * wizardData.contentsPlanned)} educacionais,{' '}
              {Math.round((wizardData.intentionMix.engage / 100) * wizardData.contentsPlanned)} de engajamento,{' '}
              {Math.round((wizardData.intentionMix.convert / 100) * wizardData.contentsPlanned)} de conversão
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Step 4 - References & Briefing
  const renderWizardStep4References = () => {
    const linkRefs = wizardData.references.filter(r => r.type === 'link');
    const fileRefs = wizardData.references.filter(r => r.type === 'file');

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border">
          <Sparkles className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">
            Esta etapa é opcional. Adicione materiais que podem enriquecer as sugestões da IA.
          </span>
        </div>

        {/* Links Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Links Externos
            </Label>
            <Button variant="outline" size="sm" onClick={() => addReference('link')}>
              <Plus className="h-3 w-3 mr-1" />
              Adicionar link
            </Button>
          </div>
          
          {linkRefs.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
              Nenhum link adicionado
            </div>
          ) : (
            <div className="space-y-2">
              {linkRefs.map((ref) => (
                <div key={ref.id} className="p-3 rounded-lg border border-border bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="https://exemplo.com/artigo"
                      value={ref.url || ''}
                      onChange={(e) => updateReference(ref.id, { url: e.target.value })}
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeReference(ref.id)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Por que isso é relevante? (opcional)"
                    value={ref.description}
                    onChange={(e) => updateReference(ref.id, { description: e.target.value })}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Files Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Upload de Arquivos
            </Label>
            <Button variant="outline" size="sm" onClick={() => addReference('file')}>
              <Upload className="h-3 w-3 mr-1" />
              Adicionar arquivo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Formatos aceitos: PDF, DOC, DOCX</p>
          
          {fileRefs.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
              Nenhum arquivo adicionado
            </div>
          ) : (
            <div className="space-y-2">
              {fileRefs.map((ref) => (
                <div key={ref.id} className="p-3 rounded-lg border border-border bg-card space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <Input
                      placeholder="nome-do-arquivo.pdf"
                      value={ref.name || ''}
                      onChange={(e) => updateReference(ref.id, { name: e.target.value })}
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeReference(ref.id)}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Por que isso é relevante? (opcional)"
                    value={ref.description}
                    onChange={(e) => updateReference(ref.id, { description: e.target.value })}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Step 5 - AI Suggestions
  const renderWizardStep5Suggestions = () => {
    const selectedPillar = pillars.find((p) => p.id === wizardData.pillarId);

    const intentionLabel = (intention: string) => {
      switch (intention) {
        case 'educate': return 'Educar';
        case 'engage': return 'Engajar';
        case 'convert': return 'Converter';
        default: return intention;
      }
    };

    return (
      <div className="space-y-4">
        {/* AI Notice */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <div className="text-sm">
            <span className="font-medium">A IA está sugerindo, não decidindo.</span>
            <br />
            <span className="text-muted-foreground">
              Baseado em: "{wizardData.objective.slice(0, 50)}{wizardData.objective.length > 50 ? '...' : ''}"
            </span>
          </div>
        </div>

        {/* Context analyzed */}
        <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Analisando estratégia...</p>
          <div className="text-xs space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">→ Objetivo:</span>
              <span className="truncate max-w-[250px]">{wizardData.objective || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">→ Pilar:</span>
              <span>{selectedPillar?.name || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">→ Público:</span>
              <span>Profissionais em Ascensão</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">→ Tom:</span>
              <span>Profissional mas acessível</span>
            </div>
          </div>
        </div>

        {/* Suggestions list */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Sugestões ({wizardData.suggestedContents.length} conteúdos)</p>
          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
            {wizardData.suggestedContents.map((content, index) => (
              <div key={content.id} className="p-3 rounded-lg border border-border bg-card">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium">{index + 1}. {content.theme}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {intentionLabel(content.intention)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {contentFormats.find(f => f.id === content.format)?.label || content.format}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <p><span className="font-medium text-foreground">Gancho:</span> "{content.hook}"</p>
                  <p><span className="font-medium text-foreground">CTA:</span> "{content.suggestedCta}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Step 6 - Human Adjustment
  const renderWizardStep6Adjustment = () => {
    const intentionLabel = (intention: string) => {
      switch (intention) {
        case 'educate': return 'Educar';
        case 'engage': return 'Engajar';
        case 'convert': return 'Converter';
        default: return intention;
      }
    };

    const selectedContent = contentDetailSheet.contentId 
      ? wizardData.approvedContents.find(c => c.id === contentDetailSheet.contentId)
      : null;

    return (
      <div className="space-y-4">
        {/* Human control notice */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <User className="h-4 w-4 text-amber-500 shrink-0" />
          <span className="text-sm text-amber-600 dark:text-amber-400">Você aprova antes da criação. Edite, reordene ou remova sugestões.</span>
        </div>

        {/* Add manual content */}
        <Button variant="outline" size="sm" onClick={addManualContent} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar conteúdo manualmente
        </Button>

        {/* Editable content cards */}
        <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
          {wizardData.approvedContents.map((content, index) => (
            <div key={content.id} className="p-3 rounded-lg border border-border bg-card space-y-3">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                <span className="text-xs text-muted-foreground shrink-0">{index + 1}.</span>
                <Input
                  value={content.theme}
                  onChange={(e) => updateApprovedContent(content.id, { theme: e.target.value })}
                  className="flex-1 h-8 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={content.intention}
                  onValueChange={(value) => updateApprovedContent(content.id, { 
                    intention: value as 'educate' | 'engage' | 'convert' 
                  })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educate">Educar</SelectItem>
                    <SelectItem value="engage">Engajar</SelectItem>
                    <SelectItem value="convert">Converter</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={content.format}
                  onValueChange={(value) => updateApprovedContent(content.id, { format: value })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentFormats.map((format) => (
                      <SelectItem key={format.id} value={format.id}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openContentDetailSheet(content.id)}
                  className={cn(
                    "h-7 text-xs",
                    !content.framework && "border-amber-500/50 text-amber-600 dark:text-amber-400"
                  )}
                >
                  {content.framework
                    ? `Framework: ${getFrameworkLabel(content.framework)}`
                    : 'Selecionar Framework'}
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateApprovedContent(content.id)}
                    className="h-7 text-xs px-2"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeApprovedContent(content.id)}
                    className="h-7 text-xs text-destructive hover:text-destructive px-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {wizardData.approvedContents.length === 0 && (
          <div className="text-center py-8 border border-dashed border-border rounded-lg">
            <p className="text-sm text-muted-foreground">Nenhum conteúdo na lista</p>
            <p className="text-xs text-muted-foreground mt-1">Adicione conteúdos manualmente ou volte para gerar sugestões</p>
          </div>
        )}

        {/* Content Detail Sheet */}
        <Sheet open={contentDetailSheet.isOpen} onOpenChange={(open) => !open && closeContentDetailSheet()}>
          <SheetContent side="right" className="w-[480px] sm:max-w-[480px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Detalhamento do Conteúdo</SheetTitle>
              <SheetDescription>Configure todos os detalhes antes da geração</SheetDescription>
            </SheetHeader>

            {selectedContent && (
              <div className="py-6 space-y-6">
                {/* Editable fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pauta / Tema</Label>
                    <Input
                      value={selectedContent.theme}
                      onChange={(e) => updateApprovedContent(selectedContent.id, { theme: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Formato</Label>
                      <Select
                        value={selectedContent.format}
                        onValueChange={(value) => updateApprovedContent(selectedContent.id, { format: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {contentFormats.map((format) => (
                            <SelectItem key={format.id} value={format.id}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Intenção</Label>
                      <Select
                        value={selectedContent.intention}
                        onValueChange={(value) => updateApprovedContent(selectedContent.id, {
                          intention: value as 'educate' | 'engage' | 'convert'
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="educate">Educar</SelectItem>
                          <SelectItem value="engage">Engajar</SelectItem>
                          <SelectItem value="convert">Converter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Gancho Principal</Label>
                    <Textarea
                      value={selectedContent.hook}
                      onChange={(e) => updateApprovedContent(selectedContent.id, { hook: e.target.value })}
                      rows={2}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CTA</Label>
                    <Input
                      value={selectedContent.suggestedCta}
                      onChange={(e) => updateApprovedContent(selectedContent.id, { suggestedCta: e.target.value })}
                    />
                  </div>
                </div>

                {/* Framework Selection - Required */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      Framework de Conteúdo
                      <Badge variant="default" className="text-xs bg-primary">Obrigatório</Badge>
                    </Label>
                  </div>

                  {/* AI Recommendation Banner */}
                  {selectedContent.frameworkReason && (
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium">Recomendação da IA</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedContent.frameworkReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selected Framework Display */}
                  {selectedContent.framework && !showFrameworkOptions && (
                    <div className="p-4 rounded-lg border-2 border-primary bg-primary/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary shrink-0" />
                          <span className="font-medium">
                            {contentFrameworks.find(f => f.id === selectedContent.framework)?.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowFrameworkOptions(true)}
                        >
                          Trocar
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {contentFrameworks.find(f => f.id === selectedContent.framework)?.description}
                      </p>
                      {selectedContent.frameworkBenefit && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-emerald-500">
                          <Check className="h-3 w-3 shrink-0" />
                          {selectedContent.frameworkBenefit}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Framework Options (shown when "Trocar" is clicked or no framework selected) */}
                  {(showFrameworkOptions || !selectedContent.framework) && (
                    <div className="space-y-2 max-h-[280px] overflow-y-auto">
                      {contentFrameworks.map((framework) => (
                        <button
                          key={framework.id}
                          type="button"
                          onClick={() => {
                            updateApprovedContent(selectedContent.id, { framework: framework.id });
                            setShowFrameworkOptions(false);
                          }}
                          className={cn(
                            'w-full p-3 rounded-lg border text-left transition-all',
                            selectedContent.framework === framework.id
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
                  )}
                </div>
              </div>
            )}

            <SheetFooter className="mt-4">
              <Button onClick={closeContentDetailSheet} className="w-full">
                Salvar Detalhes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  };

  // Step 7 - Final Confirmation
  const renderWizardStep7Confirmation = () => {
    const selectedPillar = pillars.find((p) => p.id === wizardData.pillarId);

    const intentionLabel = (intention: string) => {
      switch (intention) {
        case 'educate': return 'Educar';
        case 'engage': return 'Engajar';
        case 'convert': return 'Converter';
        default: return intention;
      }
    };

    const contentsWithoutFramework = wizardData.approvedContents.filter(c => !c.framework);

    return (
      <div className="space-y-4">
        {/* Strategic Summary */}
        <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-2">
          <p className="font-medium text-sm">Resumo Estratégico</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Objetivo:</span>
              <span className="text-right max-w-[60%]">{wizardData.objective || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pilar:</span>
              <span className="flex items-center gap-2">
                {selectedPillar && (() => {
                  const iconConfig = pillarIconConfig[selectedPillar.id];
                  const IconComponent = iconConfig?.icon || Circle;
                  return (
                    <IconComponent
                      className="h-4 w-4"
                      style={{ color: iconConfig?.color || selectedPillar.color }}
                    />
                  );
                })()}
                {selectedPillar?.name || '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Período:</span>
              <span>
                {wizardData.startDate && wizardData.endDate
                  ? `${formatDatePTBR(wizardData.startDate)} - ${formatDatePTBR(wizardData.endDate)}`
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Público:</span>
              <span>Profissionais em Ascensão</span>
            </div>
          </div>
        </div>

        {/* Approved contents */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Conteúdos Aprovados ({wizardData.approvedContents.length})</p>
          <div className="p-3 rounded-lg border border-border bg-card max-h-[140px] overflow-y-auto space-y-1.5">
            {wizardData.approvedContents.map((content, index) => (
              <div key={content.id} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="truncate flex-1">{content.theme}</span>
                <Badge variant="outline" className="text-xs shrink-0">
                  {content.framework ? getFrameworkLabel(content.framework) : 'Sem framework'}
                </Badge>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {contentFormats.find(f => f.id === content.format)?.label || content.format}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Warning if contents missing framework */}
        {contentsWithoutFramework.length > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-xs text-amber-600 dark:text-amber-400">
              {contentsWithoutFramework.length} conteúdo(s) sem framework. Volte e selecione um framework para cada conteúdo.
            </span>
          </div>
        )}

        {/* Title and description */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="wizard-title">Título da Sprint</Label>
            <Input
              id="wizard-title"
              value={wizardData.title}
              onChange={(e) => setWizardData({ ...wizardData, title: e.target.value })}
              placeholder="Nome do sprint"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wizard-description">Descrição (opcional)</Label>
            <Textarea
              id="wizard-description"
              value={wizardData.description}
              onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
              placeholder="Descreva o objetivo do sprint"
              rows={2}
            />
          </div>
        </div>

        {/* Warning notice */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-border">
          <AlertTriangle className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">
            Este botão NÃO gera textos. Apenas consolida o planejamento.
          </span>
        </div>
      </div>
    );
  };

  // Edit form (for existing sprints)
  const renderEditForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Nome do sprint"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Descreva o objetivo do sprint"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="theme">Tema Principal</Label>
        <Input
          id="theme"
          value={formData.theme}
          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
          placeholder="Ex: Product Leadership"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Data Início</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Data Fim</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pillar">Pilar</Label>
          <Select
            value={formData.pillarId}
            onValueChange={(value) => setFormData({ ...formData, pillarId: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {pillars.map((pillar) => (
                <SelectItem key={pillar.id} value={pillar.id}>
                  {pillar.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as SprintStatus })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contentsPlanned">Conteúdos Planejados</Label>
        <Input
          id="contentsPlanned"
          type="number"
          min={1}
          value={formData.contentsPlanned}
          onChange={(e) => setFormData({ ...formData, contentsPlanned: parseInt(e.target.value) || 1 })}
        />
      </div>
    </div>
  );

  // Archive handler
  const handleArchive = (sprint: Sprint) => {
    updateSprint(sprint.id, { status: 'archived' });
  };

  return (
    <MainLayout>
      <TooltipProvider>
        <div className="space-y-6 bg-background min-h-screen">
          {/* Page Header */}
          <div className="space-y-4">
            <div>
              <h2 className="text-[28px] font-semibold leading-tight text-foreground">Sprints de Conteúdo</h2>
              <p className="text-muted-foreground">
                Organize suas campanhas estratégicas e ciclos de produção
              </p>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar sprints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Tabs + Button */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                  <TabsList>
                    <TabsTrigger value="all">
                      Todas
                    </TabsTrigger>
                    <TabsTrigger value="active">
                      Ativas
                    </TabsTrigger>
                    <TabsTrigger value="draft">
                      Planejamento
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Concluídas
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <SheetTrigger asChild>
                    <Button
                      onClick={() => handleOpenDialog()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Sprint
                    </Button>
                  </SheetTrigger>
            <SheetContent side="right" className="w-[540px] sm:max-w-[540px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>
                    {editingSprint
                      ? 'Editar Sprint'
                      : `Etapa ${wizardStep} de ${totalSteps} — ${getStepTitle(wizardStep)}`}
                </SheetTitle>
                <SheetDescription>
                    {editingSprint
                      ? 'Atualize as informações do sprint'
                      : getStepDescription(wizardStep)}
                </SheetDescription>
              </SheetHeader>

                {editingSprint ? (
                  renderEditForm()
                ) : (
                  <div className="py-4">
                    {wizardStep === 1 && renderWizardStep1()}
                    {wizardStep === 2 && renderWizardStep2()}
                    {wizardStep === 3 && renderWizardStep3()}
                    {wizardStep === 4 && renderWizardStep4References()}
                    {wizardStep === 5 && renderWizardStep5Suggestions()}
                    {wizardStep === 6 && renderWizardStep6Adjustment()}
                    {wizardStep === 7 && renderWizardStep7Confirmation()}
                  </div>
                )}

              <SheetFooter className="flex-row gap-2 sm:justify-between">
                  {editingSprint ? (
                    <>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleEditSave}>Salvar</Button>
                    </>
                  ) : (
                    <>
                      {wizardStep === 1 ? (
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancelar
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={prevStep}>
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Voltar
                        </Button>
                      )}
                      <div className="flex gap-2">
                        {wizardStep === 4 && (
                          <Button variant="ghost" onClick={nextStep}>
                            Pular
                          </Button>
                        )}
                        {wizardStep < totalSteps ? (
                          <Button
                            onClick={nextStep}
                            disabled={
                              (wizardStep === 1 && !canProceedStep1) ||
                              (wizardStep === 2 && !canProceedStep2) ||
                              (wizardStep === 3 && !canProceedStep3) ||
                              (wizardStep === 6 && !canProceedStep6)
                            }
                          >
                            {wizardStep === 5 ? 'Revisar Sugestões' : 'Próximo'}
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        ) : (
                          <Button onClick={handleSave} disabled={!canCreateSprint}>
                            <Check className="h-4 w-4 mr-1" />
                            Confirmar Sprint
                          </Button>
                        )}
                      </div>
                    </>
                  )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
              </div>
            </div>
          </div>

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* New Sprint Card */}
             {createSprintGate.allowed ? (
               <NewSprintCard onClick={() => handleOpenDialog()} />
             ) : (
               <SprintLimitCard
                 currentSprints={userGate.activeSprints}
                 maxSprints={getPlanLimits().maxActiveSprints}
               />
             )}

            {/* Sprint Cards */}
            {filteredSprints.map((sprint) => (
              <SprintCard
                key={sprint.id}
                sprint={sprint}
                onEdit={handleViewDetails}
                onDuplicate={handleDuplicate}
                onArchive={handleArchive}
                onDelete={deleteSprint}
                 onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {filteredSprints.length === 0 && (
            <div className="text-center py-12">
             <p className="text-muted-foreground">
                Nenhuma sprint encontrada para os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </TooltipProvider>
    </MainLayout>
  );
}
