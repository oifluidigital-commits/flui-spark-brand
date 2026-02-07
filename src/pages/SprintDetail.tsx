import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useUserGate } from '@/contexts/UserGateContext';
import { useGate } from '@/hooks/useGate';
import { useSprintContents } from '@/hooks/useSprintContents';
import { useFrameworksDB } from '@/hooks/useFrameworksDB';
import { ContentDetailSheet } from '@/components/sprint/ContentDetailSheet';
import { PlanBadge } from '@/components/gates/PlanBadge';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Tooltip, TooltipContent, TooltipTrigger, TooltipProvider,
} from '@/components/ui/tooltip';
import {
  ArrowLeft, Calendar as CalendarIcon, Plus, Sparkles, ArrowUpDown,
  Pencil, Trash2, FileText, LayoutGrid, Mail, Video, Film,
  MessageSquare, Briefcase, Globe, Camera, Check, ChevronDown, AlertTriangle,
} from 'lucide-react';
import { SprintStatus } from '@/types';
import { formatDatePTBR } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { SprintContentItem } from '@/hooks/useSprintContents';

// Status configuration
type ContentStatus = 'idea' | 'review' | 'scheduled' | 'backlog' | 'completed';
type FunnelStage = 'tofu' | 'mofu' | 'bofu';

const contentStatusConfig: Record<ContentStatus, { label: string; className: string }> = {
  idea: { label: 'Ideia', className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
  backlog: { label: 'Backlog', className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
  review: { label: 'Revisão', className: 'bg-amber-500/20 text-amber-500 border-amber-500/30' },
  scheduled: { label: 'Agendado', className: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  completed: { label: 'Concluído', className: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' },
};

const funnelStageConfig: Record<FunnelStage, { label: string; className: string }> = {
  tofu: { label: 'ToFu', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  mofu: { label: 'MoFu', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  bofu: { label: 'BoFu', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
};

const sprintStatusConfig: Record<SprintStatus, { label: string; className: string }> = {
  draft: { label: 'Planejamento', className: 'bg-amber-500/20 text-amber-500 border-amber-500/30' },
  active: { label: 'Em andamento', className: 'bg-violet-500/20 text-violet-500 border-violet-500/30' },
  completed: { label: 'Concluída', className: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' },
  archived: { label: 'Arquivada', className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
};

const contentFormats: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'post-linkedin-text', label: 'Post LinkedIn', icon: FileText },
  { id: 'post-linkedin-carousel', label: 'Carrossel', icon: LayoutGrid },
  { id: 'article', label: 'Artigo', icon: FileText },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'video-short', label: 'Vídeo curto', icon: Video },
  { id: 'video-long', label: 'Vídeo longo', icon: Film },
  { id: 'thread', label: 'Thread', icon: MessageSquare },
  { id: 'case-study', label: 'Case', icon: Briefcase },
  { id: 'landing-page', label: 'Landing page', icon: Globe },
  { id: 'email-marketing', label: 'Email marketing', icon: Mail },
  { id: 'story', label: 'Story', icon: Camera },
  { id: 'reels', label: 'Reels', icon: Video },
];

const statusOrder: Record<ContentStatus, number> = {
  review: 1, scheduled: 2, idea: 3, backlog: 4, completed: 5,
};

type SortField = 'status' | 'targetDate' | 'format';
type SortDirection = 'asc' | 'desc';

// ─── Inline sub-components ───

const FormatDropdown = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const cur = contentFormats.find((f) => f.id === value);
  const Icon = cur?.icon || FileText;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 gap-2 text-muted-foreground hover:text-foreground">
          <Icon className="h-4 w-4" /><span className="text-sm">{cur?.label || value}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {contentFormats.map((f) => {
          const FI = f.icon;
          return <DropdownMenuItem key={f.id} onClick={() => onChange(f.id)}><FI className="h-4 w-4 mr-2" />{f.label}</DropdownMenuItem>;
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const StatusDropdown = ({ value, onChange }: { value: ContentStatus; onChange: (v: ContentStatus) => void }) => {
  const config = contentStatusConfig[value];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
          <Badge variant="outline" className={cn('text-xs', config.className)}>{config.label}</Badge>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {(Object.keys(contentStatusConfig) as ContentStatus[]).map((s) => (
          <DropdownMenuItem key={s} onClick={() => onChange(s)}>
            <Badge variant="outline" className={cn('text-xs', contentStatusConfig[s].className)}>{contentStatusConfig[s].label}</Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const InlineDatePicker = ({ value, onChange, isOverdue }: { value?: string; onChange: (d: string | undefined) => void; isOverdue?: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className={cn('h-8 px-2 gap-2 text-sm', !value && 'text-muted-foreground', isOverdue && 'text-red-500')}>
          <CalendarIcon className="h-4 w-4" />
          {value ? (
            <span className="flex items-center gap-1">{format(new Date(value), 'dd MMM', { locale: ptBR })}{isOverdue && <AlertTriangle className="h-3 w-3" />}</span>
          ) : <span>Sem data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
        <Calendar mode="single" selected={value ? new Date(value) : undefined} onSelect={(d) => { onChange(d?.toISOString().split('T')[0]); setOpen(false); }} locale={ptBR} className="pointer-events-auto" />
      </PopoverContent>
    </Popover>
  );
};

const EmptyContentsState = ({ onAddContent, aiAllowed }: { onAddContent: () => void; aiAllowed: boolean }) => (
  <div className="text-center py-16 border border-dashed border-border rounded-lg">
    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
    <h3 className="text-lg font-medium text-foreground mb-2">Nenhum conteúdo nesta Sprint</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">Comece adicionando conteúdos manualmente ou deixe a IA sugerir baseado no objetivo da Sprint.</p>
    <div className="flex items-center justify-center gap-3">
      <Button onClick={onAddContent}><Plus className="h-4 w-4 mr-2" />Adicionar Conteúdo</Button>
      <Button variant="outline" disabled={!aiAllowed}>
        <Sparkles className="h-4 w-4 mr-2" />Gerar Sugestões IA
        {!aiAllowed && <PlanBadge requiredPlan="pro" />}
      </Button>
    </div>
  </div>
);

const SprintDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4"><Skeleton className="h-9 w-40" /><Skeleton className="h-6 w-32" /></div>
    <Skeleton className="h-24 w-full rounded-lg" />
    <div className="border border-border rounded-lg">
      <div className="p-4"><Skeleton className="h-10 w-full" /></div>
      {[1, 2, 3, 4, 5].map((i) => <div key={i} className="p-4 border-t border-border"><Skeleton className="h-12 w-full" /></div>)}
    </div>
  </div>
);

const SprintNotFound = ({ onBack }: { onBack: () => void }) => (
  <div className="text-center py-16">
    <h2 className="text-xl font-semibold text-foreground mb-2">Sprint não encontrada</h2>
    <p className="text-muted-foreground mb-6">A Sprint que você está procurando não existe.</p>
    <Button onClick={onBack}><ArrowLeft className="h-4 w-4 mr-2" />Voltar para Sprints</Button>
  </div>
);

// ─── Main Component ───

export default function SprintDetail() {
  const { sprintId } = useParams<{ sprintId: string }>();
  const navigate = useNavigate();
  const { sprints, brand, strategy } = useApp();
  const { userGate, setUserGate } = useUserGate();
  const aiGate = useGate('use-ai');
  const pillars = brand?.pillars ?? [];

  // DB-backed hooks
  const {
    contents, isLoading: contentsLoading, isGenerating,
    loadContents, createContent, updateContent, deleteContent, generateText,
  } = useSprintContents(sprintId);
  const { frameworks, isLoading: frameworksLoading } = useFrameworksDB();

  // Load contents on mount
  useEffect(() => { loadContents(); }, [loadContents]);

  const sprint = useMemo(() => sprints.find((s) => s.id === sprintId), [sprints, sprintId]);

  // UI state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('targetDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingContent, setEditingContent] = useState<SprintContentItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const sortedContents = useMemo(() => {
    return [...contents].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'status': cmp = (statusOrder[a.status as ContentStatus] || 5) - (statusOrder[b.status as ContentStatus] || 5); break;
        case 'targetDate': cmp = (a.targetDate || '9999-99-99').localeCompare(b.targetDate || '9999-99-99'); break;
        case 'format': cmp = a.format.localeCompare(b.format); break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [contents, sortField, sortDirection]);

  const progressPercentage = useMemo(() => {
    if (contents.length === 0) return 0;
    return Math.round((contents.filter((c) => c.status === 'completed').length / contents.length) * 100);
  }, [contents]);

  // Handlers
  const handleBack = () => navigate('/content-lab/sprints');

  const handleSelectAll = (checked: boolean) => setSelectedIds(checked ? contents.map((c) => c.id) : []);
  const handleSelect = (id: string) => setSelectedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);

  const handleEdit = (content: SprintContentItem) => {
    setEditingContent(content);
    setIsSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteContent(id);
    setSelectedIds((p) => p.filter((i) => i !== id));
  };

  const handleStatusChange = async (id: string, status: ContentStatus) => {
    await updateContent(id, { status });
  };

  const handleDateChange = async (id: string, date: string | undefined) => {
    await updateContent(id, { target_date: date || null });
  };

  const handleFormatChange = async (id: string, fmt: string) => {
    await updateContent(id, { format: fmt });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDirection((p) => p === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const handleAddContent = async () => {
    const item = await createContent({ title: 'Novo conteúdo', format: 'post-linkedin-text' });
    if (item) handleEdit(item);
  };

  const handleSheetSave = async (updates: Record<string, unknown>) => {
    if (!editingContent) return;
    await updateContent(editingContent.id, updates as any);
    // Refresh editing content from state
    const refreshed = contents.find((c) => c.id === editingContent.id);
    if (refreshed) setEditingContent({ ...refreshed, ...updates as any });
  };

  const CREDIT_COST = 10;

  const handleConsumeCredits = (cost: number) => {
    setUserGate((prev) => ({
      ...prev,
      contentCredits: Math.max(0, prev.contentCredits - cost),
    }));
  };

  const handleGenerate = async () => {
    if (!editingContent) return;

    // Pre-validate credits
    if (userGate.contentCredits < CREDIT_COST) {
      toast({ title: 'Créditos insuficientes', description: `São necessários ${CREDIT_COST} créditos para gerar texto.`, variant: 'destructive' });
      return;
    }

    const fw = frameworks.find(
      (f) => f.name === editingContent.framework || f.id === editingContent.framework
    );
    const result = await generateText(
      editingContent.id,
      fw?.structure || null,
      brand ? { name: brand.name, voice: brand.voice, positioning: brand.positioning } : null,
      strategy as any,
      handleConsumeCredits,
    );
    if (result) {
      // Refresh editing content
      setEditingContent((prev) => prev ? { ...prev, generatedText: result.generatedText, status: 'review' } : null);
    }
  };

  const pillar = pillars.find((p) => p.id === sprint?.pillarId);

  // Render
  if (contentsLoading && contents.length === 0) {
    return <MainLayout><div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"><SprintDetailSkeleton /></div></MainLayout>;
  }

  if (!sprint) {
    return <MainLayout><div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"><SprintNotFound onBack={handleBack} /></div></MainLayout>;
  }

  const statusConfig = sprintStatusConfig[sprint.status];

  return (
    <MainLayout>
      <TooltipProvider>
        {/* Header */}
        <div className="sticky top-16 z-10 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />Voltar para Sprints
                </Button>
                <div className="h-4 w-px bg-border" />
                <h1 className="text-lg font-semibold text-foreground">{sprint.title}</h1>
              </div>
              <Badge variant="outline" className={cn('text-xs', statusConfig.className)}>{statusConfig.label}</Badge>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Summary Strip */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-wrap items-center gap-6 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{formatDatePTBR(sprint.startDate)} - {formatDatePTBR(sprint.endDate)}</span>
              </div>
              {pillar && (
                <Badge variant="outline" className="text-xs" style={{ borderColor: pillar.color, color: pillar.color }}>{pillar.name}</Badge>
              )}
              <div className="text-sm text-muted-foreground flex-1 truncate">"{sprint.description}"</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{contents.filter((c) => c.status === 'completed').length}/{contents.length} conteúdos prontos</span>
              <Progress value={progressPercentage} className="flex-1 h-2" />
              <span className="text-sm font-medium text-foreground">{progressPercentage}%</span>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button onClick={handleAddContent}><Plus className="h-4 w-4 mr-2" />Adicionar Conteúdo</Button>
              <Button variant="outline" disabled={!aiGate.allowed}>
                <Sparkles className="h-4 w-4 mr-2" />Gerar Sugestões IA
                {!aiGate.allowed && <PlanBadge requiredPlan="pro" />}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar por:</span>
              {(['status', 'targetDate', 'format'] as SortField[]).map((f) => (
                <Button key={f} variant="ghost" size="sm" onClick={() => handleSort(f)} className={cn(sortField === f && 'text-primary')}>
                  {f === 'status' ? 'Status' : f === 'targetDate' ? 'Data' : 'Formato'}
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                </Button>
              ))}
            </div>
          </div>

          {/* Content Table or Empty State */}
          {contents.length === 0 ? (
            <EmptyContentsState onAddContent={handleAddContent} aiAllowed={aiGate.allowed} />
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-12">
                      <Checkbox checked={selectedIds.length === contents.length && contents.length > 0} onCheckedChange={handleSelectAll} />
                    </TableHead>
                    <TableHead>Topic / Hook</TableHead>
                    <TableHead className="w-36">Formato</TableHead>
                    <TableHead className="w-32">Status</TableHead>
                    <TableHead className="w-32">Data Alvo</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedContents.map((content) => {
                    const isOverdue = content.targetDate && isBefore(new Date(content.targetDate), startOfDay(new Date())) && content.status !== 'completed';
                    const fs = content.funnelStage as FunnelStage | null;

                    return (
                      <TableRow key={content.id} className={cn(
                        'hover:bg-muted/50 transition-colors',
                        isOverdue && 'bg-destructive/5',
                        content.status === 'completed' && 'opacity-60',
                        content.status === 'backlog' && 'opacity-80',
                      )}>
                        <TableCell><Checkbox checked={selectedIds.includes(content.id)} onCheckedChange={() => handleSelect(content.id)} /></TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => handleEdit(content)} className="text-left hover:text-primary transition-colors">
                                  <span className="font-medium text-foreground line-clamp-1">{content.title}</span>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p className="font-medium">{content.title}</p>
                                {content.hook && <p className="text-xs text-muted-foreground mt-1">{content.hook}</p>}
                              </TooltipContent>
                            </Tooltip>
                            {fs && funnelStageConfig[fs] && (
                              <Badge variant="outline" className={cn('text-xs', funnelStageConfig[fs].className)}>{funnelStageConfig[fs].label}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell><FormatDropdown value={content.format} onChange={(f) => handleFormatChange(content.id, f)} /></TableCell>
                        <TableCell><StatusDropdown value={content.status as ContentStatus} onChange={(s) => handleStatusChange(content.id, s)} /></TableCell>
                        <TableCell><InlineDatePicker value={content.targetDate} onChange={(d) => handleDateChange(content.id, d)} isOverdue={isOverdue || false} /></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(content)}><Pencil className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Editar</TooltipContent></Tooltip>
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(content.id)}><Trash2 className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent>Remover</TooltipContent></Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Content Detail Sheet */}
        <ContentDetailSheet
          isOpen={isSheetOpen}
          onClose={() => { setIsSheetOpen(false); setEditingContent(null); }}
          content={editingContent}
          frameworks={frameworks}
          frameworksLoading={frameworksLoading}
          aiAllowed={aiGate.allowed}
          isGenerating={!!isGenerating}
          onSave={handleSheetSave}
          onGenerate={handleGenerate}
        />
      </TooltipProvider>
    </MainLayout>
  );
}
