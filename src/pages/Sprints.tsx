import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Copy,
  Archive,
  Trash2,
  Calendar,
  Target,
  Filter,
  Eye,
  Sparkles,
  AlertTriangle,
  Check,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { Sprint, SprintStatus } from '@/types';
import { getStatusLabel, formatDatePTBR, mockPillars } from '@/data/mockData';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Slider } from '@/components/ui/slider';

const statusColors: Record<SprintStatus, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  active: 'bg-success text-success-foreground',
  completed: 'bg-primary text-primary-foreground',
  archived: 'bg-muted text-muted-foreground',
};

// Mock priorities for demo
const sprintPriorities: Record<string, 'high' | 'medium' | 'low'> = {
  'sprint-1': 'high',
  'sprint-2': 'medium',
  'sprint-3': 'low',
};

// Mock progress details
const getProgressDetails = (sprintId: string) => {
  const details: Record<string, { draft: number; review: number; published: number; planned: number }> = {
    'sprint-1': { draft: 2, review: 2, published: 4, planned: 2 },
    'sprint-2': { draft: 0, review: 0, published: 0, planned: 8 },
    'sprint-3': { draft: 0, review: 0, published: 15, planned: 0 },
  };
  return details[sprintId] || { draft: 0, review: 0, published: 0, planned: 0 };
};

// Mock score composition
const getScoreDetails = (sprintId: string) => {
  const details: Record<string, { strategyAlignment: number; publishConsistency: number; audienceAlignment: number; formatDiversity: number }> = {
    'sprint-1': { strategyAlignment: 85, publishConsistency: 70, audienceAlignment: 90, formatDiversity: 75 },
    'sprint-2': { strategyAlignment: 0, publishConsistency: 0, audienceAlignment: 0, formatDiversity: 0 },
    'sprint-3': { strategyAlignment: 95, publishConsistency: 88, audienceAlignment: 92, formatDiversity: 85 },
  };
  return details[sprintId] || { strategyAlignment: 0, publishConsistency: 0, audienceAlignment: 0, formatDiversity: 0 };
};

// Sprint types for wizard
const sprintTypes = [
  { id: 'authority', label: 'Autoridade', description: 'Demonstrar expertise' },
  { id: 'educational', label: 'Educacional', description: 'Ensinar conceitos' },
  { id: 'launch', label: 'Lançamento', description: 'Campanha de vendas' },
  { id: 'relationship', label: 'Relacionamento', description: 'Conexão com audiência' },
  { id: 'conversion', label: 'Conversão', description: 'Gerar vendas diretas' },
];

// Content formats for wizard
const contentFormats = [
  { id: 'post', label: 'Post' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'video', label: 'Vídeo' },
  { id: 'story', label: 'Story' },
  { id: 'thread', label: 'Thread' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'article', label: 'Artigo' },
];

// Objective options for wizard
const objectiveOptions = [
  { id: 'build_authority', label: 'Construir autoridade no tema' },
  { id: 'educate_audience', label: 'Educar minha audiência' },
  { id: 'launch_product', label: 'Lançar produto/serviço' },
  { id: 'strengthen_relationship', label: 'Fortalecer relacionamento' },
  { id: 'generate_conversions', label: 'Gerar conversões' },
];

// Priority indicator component
const PriorityDot = ({ priority }: { priority: 'high' | 'medium' | 'low' }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span
        className={cn(
          'w-2 h-2 rounded-full inline-block shrink-0',
          priority === 'high' && 'bg-red-500',
          priority === 'medium' && 'bg-amber-500',
          priority === 'low' && 'bg-emerald-500'
        )}
      />
    </TooltipTrigger>
    <TooltipContent side="top" className="text-xs">
      Prioridade {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Média' : 'Baixa'}
    </TooltipContent>
  </Tooltip>
);

export default function Sprints() {
  const { sprints, addSprint, updateSprint, deleteSprint } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [isWizardMode, setIsWizardMode] = useState(false);

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
    objective: '',
    pillarId: '',
    sprintType: '',
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
    if (wizardData.objective) score += 20;
    if (wizardData.pillarId) score += 20;
    if (wizardData.sprintType) score += 15;
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
        sprintType: '',
        startDate: '',
        endDate: '',
        contentsPlanned: 8,
        frequency: 'weekly',
        formats: [],
        intentionMix: { educate: 40, engage: 30, convert: 30 },
        title: '',
        description: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingSprint) {
      updateSprint(editingSprint.id, formData);
    } else {
      const sprintTypeLabel = sprintTypes.find(t => t.id === wizardData.sprintType)?.label || '';
      const pillar = mockPillars.find(p => p.id === wizardData.pillarId);
      const newSprint: Sprint = {
        id: `sprint-${Date.now()}`,
        title: wizardData.title,
        description: wizardData.description,
        theme: sprintTypeLabel,
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
    handleOpenDialog(sprint);
  };

  const nextStep = () => setWizardStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setWizardStep((prev) => Math.max(prev - 1, 1));

  const canProceedStep1 = wizardData.objective && wizardData.pillarId && wizardData.sprintType;
  const canProceedStep2 = wizardData.startDate && wizardData.endDate && wizardData.contentsPlanned >= 1;
  const canProceedStep3 = wizardData.formats.length >= 1;
  const canCreateSprint = wizardData.title.trim().length >= 2;

  const toggleFormat = (formatId: string) => {
    setWizardData((prev) => ({
      ...prev,
      formats: prev.formats.includes(formatId)
        ? prev.formats.filter((f) => f !== formatId)
        : [...prev.formats, formatId],
    }));
  };

  // Wizard Step Components
  const renderWizardStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Qual é o objetivo principal desta sprint?</Label>
        <Select
          value={wizardData.objective}
          onValueChange={(value) => setWizardData({ ...wizardData, objective: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o objetivo" />
          </SelectTrigger>
          <SelectContent>
            {objectiveOptions.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Em qual pilar este conteúdo se encaixa?</Label>
        <div className="grid grid-cols-2 gap-3">
          {mockPillars.map((pillar) => (
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
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: pillar.color }}
                />
                <span className="font-medium text-sm">{pillar.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {pillar.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Tipo de Sprint</Label>
        <div className="flex flex-wrap gap-2">
          {sprintTypes.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setWizardData({ ...wizardData, sprintType: type.id })}
              className={cn(
                'px-4 py-2 rounded-full text-sm border transition-all',
                wizardData.sprintType === type.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWizardStep2 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Período da Sprint</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wizard-startDate" className="text-xs text-muted-foreground">
              Data Início
            </Label>
            <Input
              id="wizard-startDate"
              type="date"
              value={wizardData.startDate}
              onChange={(e) => setWizardData({ ...wizardData, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wizard-endDate" className="text-xs text-muted-foreground">
              Data Fim
            </Label>
            <Input
              id="wizard-endDate"
              type="date"
              value={wizardData.endDate}
              onChange={(e) => setWizardData({ ...wizardData, endDate: e.target.value })}
            />
          </div>
        </div>
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
        <div className="flex flex-wrap gap-2">
          {contentFormats.map((format) => (
            <button
              key={format.id}
              type="button"
              onClick={() => toggleFormat(format.id)}
              className={cn(
                'px-4 py-2 rounded-full text-sm border transition-all',
                wizardData.formats.includes(format.id)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {format.label}
            </button>
          ))}
        </div>
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

  const renderWizardStep4 = () => {
    const selectedPillar = mockPillars.find((p) => p.id === wizardData.pillarId);
    const selectedType = sprintTypes.find((t) => t.id === wizardData.sprintType);
    const selectedObjective = objectiveOptions.find((o) => o.id === wizardData.objective);
    const suggestions = getImprovementSuggestions();

    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-secondary/50 border border-border space-y-3">
          <p className="font-medium text-sm">Resumo da Sprint</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Objetivo:</span>
              <span>{selectedObjective?.label || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pilar:</span>
              <span className="flex items-center gap-2">
                {selectedPillar && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedPillar.color }}
                  />
                )}
                {selectedPillar?.name || '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo:</span>
              <span>{selectedType?.label || '-'}</span>
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
              <span className="text-muted-foreground">Volume:</span>
              <span>{wizardData.contentsPlanned} conteúdos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Formatos:</span>
              <span>
                {wizardData.formats
                  .map((f) => contentFormats.find((cf) => cf.id === f)?.label)
                  .join(', ') || '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Score Inicial Estimado</span>
            <span
              className={cn(
                'font-bold',
                estimatedScore >= 70 && 'text-emerald-500',
                estimatedScore >= 50 && estimatedScore < 70 && 'text-amber-500',
                estimatedScore < 50 && 'text-red-500'
              )}
            >
              {estimatedScore}%
            </span>
          </div>
          <Progress value={estimatedScore} className="h-2" />
        </div>

        {suggestions.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-amber-500 mb-1">Sugestões de melhoria:</p>
                <ul className="text-xs text-amber-500/80 space-y-1">
                  {suggestions.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

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
              {mockPillars.map((pillar) => (
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

  return (
    <MainLayout>
      <TooltipProvider>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Sprints</h2>
            <p className="text-muted-foreground">
              Organize seu conteúdo em ciclos de produção
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Sprint
              </Button>
            </DialogTrigger>
              <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>
                    {editingSprint
                      ? 'Editar Sprint'
                      : `Etapa ${wizardStep} de 4 — ${
                          wizardStep === 1
                            ? 'Intenção Estratégica'
                            : wizardStep === 2
                            ? 'Escopo'
                            : wizardStep === 3
                            ? 'Estrutura'
                            : 'Confirmação'
                        }`}
                </DialogTitle>
                <DialogDescription>
                    {editingSprint
                      ? 'Atualize as informações do sprint'
                      : wizardStep === 1
                      ? 'Defina o propósito estratégico da sua sprint'
                      : wizardStep === 2
                      ? 'Configure o período e volume de conteúdo'
                      : wizardStep === 3
                      ? 'Escolha formatos e distribuição'
                      : 'Revise e finalize sua sprint'}
                </DialogDescription>
              </DialogHeader>

                {editingSprint ? (
                  renderEditForm()
                ) : (
                  <div className="py-4">
                    {wizardStep === 1 && renderWizardStep1()}
                    {wizardStep === 2 && renderWizardStep2()}
                    {wizardStep === 3 && renderWizardStep3()}
                    {wizardStep === 4 && renderWizardStep4()}
                  </div>
                )}

              <DialogFooter>
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
                      {wizardStep < 4 ? (
                        <Button
                          onClick={nextStep}
                          disabled={
                            (wizardStep === 1 && !canProceedStep1) ||
                            (wizardStep === 2 && !canProceedStep2) ||
                            (wizardStep === 3 && !canProceedStep3)
                          }
                        >
                          Próximo
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      ) : (
                        <Button onClick={handleSave} disabled={!canCreateSprint}>
                          <Check className="h-4 w-4 mr-1" />
                          Criar Sprint
                        </Button>
                      )}
                    </>
                  )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar sprints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sprints Table */}
        <Card className="border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sprint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {filteredSprints.map((sprint) => {
                  const pillar = mockPillars.find((p) => p.id === sprint.pillarId);
                  const priority = sprintPriorities[sprint.id] || 'medium';
                  const progressDetails = getProgressDetails(sprint.id);
                  const scoreDetails = getScoreDetails(sprint.id);
                  const progressPercentage =
                    sprint.contentsPlanned > 0
                      ? (sprint.contentsPublished / sprint.contentsPlanned) * 100
                      : 0;

                  return (
                    <TableRow
                      key={sprint.id}
                      className={cn(
                        'hover:bg-secondary/50 transition-colors',
                        sprint.status === 'active' && 'bg-primary/5 border-l-2 border-l-primary'
                      )}
                    >
                  <TableCell>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <PriorityDot priority={priority} />
                            <span className="font-medium">{sprint.title}</span>
                          </div>
                          {pillar && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 py-0"
                              style={{ borderColor: pillar.color, color: pillar.color }}
                            >
                              {pillar.name}
                            </Badge>
                          )}
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {sprint.description.length > 60
                              ? `${sprint.description.slice(0, 60)}...`
                              : sprint.description}
                          </div>
                        </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[sprint.status]}>
                      {getStatusLabel(sprint.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDatePTBR(sprint.startDate)} - {formatDatePTBR(sprint.endDate)}
                        </div>
                  </TableCell>
                  <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-32 cursor-help">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>
                                  {sprint.contentsPublished}/{sprint.contentsPlanned}
                                </span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="w-48">
                            <div className="space-y-1.5 text-xs">
                              <p className="font-medium">Detalhes do Progresso</p>
                              <div className="flex justify-between">
                                <span>Total:</span>
                                <span>{sprint.contentsPlanned} conteúdos</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Rascunho:</span>
                                <span>{progressDetails.draft}</span>
                              </div>
                              <div className="flex justify-between text-muted-foreground">
                                <span>Em revisão:</span>
                                <span>{progressDetails.review}</span>
                              </div>
                              <div className="flex justify-between text-emerald-500">
                                <span>Publicados:</span>
                                <span>{sprint.contentsPublished}</span>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                  </TableCell>
                  <TableCell>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              <Target className="h-4 w-4 text-muted-foreground" />
                              <span
                                className={cn(
                                  'font-medium',
                                  sprint.alignmentScore >= 80 && 'text-emerald-500',
                                  sprint.alignmentScore >= 50 &&
                                    sprint.alignmentScore < 80 &&
                                    'text-amber-500',
                                  sprint.alignmentScore < 50 && 'text-red-500'
                                )}
                              >
                                {sprint.alignmentScore}%
                              </span>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent side="left" className="w-64">
                            <div className="space-y-2">
                              <p className="font-medium text-sm">Composição do Score</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span>Aderência à estratégia</span>
                                  <span
                                    className={cn(
                                      scoreDetails.strategyAlignment >= 80
                                        ? 'text-emerald-500'
                                        : scoreDetails.strategyAlignment >= 50
                                        ? 'text-amber-500'
                                        : 'text-muted-foreground'
                                    )}
                                  >
                                    {scoreDetails.strategyAlignment}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Consistência de publicação</span>
                                  <span
                                    className={cn(
                                      scoreDetails.publishConsistency >= 80
                                        ? 'text-emerald-500'
                                        : scoreDetails.publishConsistency >= 50
                                        ? 'text-amber-500'
                                        : 'text-muted-foreground'
                                    )}
                                  >
                                    {scoreDetails.publishConsistency}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Alinhamento com público</span>
                                  <span
                                    className={cn(
                                      scoreDetails.audienceAlignment >= 80
                                        ? 'text-emerald-500'
                                        : scoreDetails.audienceAlignment >= 50
                                        ? 'text-amber-500'
                                        : 'text-muted-foreground'
                                    )}
                                  >
                                    {scoreDetails.audienceAlignment}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Diversidade de formatos</span>
                                  <span
                                    className={cn(
                                      scoreDetails.formatDiversity >= 80
                                        ? 'text-emerald-500'
                                        : scoreDetails.formatDiversity >= 50
                                        ? 'text-amber-500'
                                        : 'text-muted-foreground'
                                    )}
                                  >
                                    {scoreDetails.formatDiversity}%
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                                Score gerado por IA com base na sua estratégia
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(sprint)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar detalhes
                            </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenDialog(sprint)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(sprint)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => updateSprint(sprint.id, { status: 'archived' })}
                            >
                          <Archive className="h-4 w-4 mr-2" />
                          Arquivar
                        </DropdownMenuItem>
                            <DropdownMenuItem
                          onClick={() => deleteSprint(sprint.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                  );
                })}
            </TableBody>
          </Table>

          {filteredSprints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum sprint encontrado</p>
            </div>
          )}
        </Card>
      </div>
      </TooltipProvider>
    </MainLayout>
  );
}
