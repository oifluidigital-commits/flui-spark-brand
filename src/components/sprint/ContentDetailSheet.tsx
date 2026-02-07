import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Check,
  AlertTriangle,
  Bot,
  User,
  RefreshCw,
  Copy,
  Loader2,
  Lock,
} from 'lucide-react';
import { PlanBadge } from '@/components/gates/PlanBadge';
import type { SprintContentItem } from '@/hooks/useSprintContents';
import type { FrameworkDB } from '@/hooks/useFrameworksDB';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

// Configs
const contentStatusConfig = {
  idea: { label: 'Ideia', className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
  backlog: { label: 'Backlog', className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
  review: { label: 'Revisão', className: 'bg-amber-500/20 text-amber-500 border-amber-500/30' },
  scheduled: { label: 'Agendado', className: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  completed: { label: 'Concluído', className: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' },
};

const contentFormats = [
  { id: 'post-linkedin-text', label: 'Post LinkedIn' },
  { id: 'post-linkedin-carousel', label: 'Carrossel' },
  { id: 'article', label: 'Artigo' },
  { id: 'newsletter', label: 'Newsletter' },
  { id: 'video-short', label: 'Vídeo curto' },
  { id: 'video-long', label: 'Vídeo longo' },
  { id: 'thread', label: 'Thread' },
  { id: 'case-study', label: 'Case' },
  { id: 'landing-page', label: 'Landing page' },
  { id: 'email-marketing', label: 'Email marketing' },
  { id: 'story', label: 'Story' },
  { id: 'reels', label: 'Reels' },
];

type ContentStatus = keyof typeof contentStatusConfig;

interface ContentDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  content: SprintContentItem | null;
  frameworks: FrameworkDB[];
  frameworksLoading: boolean;
  aiAllowed: boolean;
  isGenerating: boolean;
  onSave: (updates: Record<string, unknown>) => Promise<void>;
  onGenerate: () => Promise<void>;
}

export function ContentDetailSheet({
  isOpen,
  onClose,
  content,
  frameworks,
  frameworksLoading,
  aiAllowed,
  isGenerating,
  onSave,
  onGenerate,
}: ContentDetailSheetProps) {
  // Local editing state
  const [title, setTitle] = useState('');
  const [hook, setHook] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('post-linkedin-text');
  const [status, setStatus] = useState<ContentStatus>('idea');
  const [targetDate, setTargetDate] = useState<string | undefined>();
  const [framework, setFramework] = useState('');
  const [frameworkOrigin, setFrameworkOrigin] = useState<string | null>(null);
  const [frameworkReason, setFrameworkReason] = useState<string | undefined>();
  const [intention, setIntention] = useState<string | null>(null);
  const [funnelStage, setFunnelStage] = useState<string | null>(null);
  const [suggestedCta, setSuggestedCta] = useState('');
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  // Framework editing mode
  const [isEditingFramework, setIsEditingFramework] = useState(false);
  const [tempFramework, setTempFramework] = useState('');

  // Determine if framework needs to be selected (new content with no framework)
  const needsFramework = !framework;

  // Reset local state when content changes
  useEffect(() => {
    if (content) {
      setTitle(content.title);
      setHook(content.hook);
      setDescription(content.description);
      setSelectedFormat(content.format);
      setStatus(content.status as ContentStatus);
      setTargetDate(content.targetDate);
      setFramework(content.framework);
      setFrameworkOrigin(content.frameworkOrigin || null);
      setFrameworkReason(content.frameworkReason);
      setIntention(content.intention);
      setFunnelStage(content.funnelStage);
      setSuggestedCta(content.suggestedCta);
      setGeneratedText(content.generatedText);
      setIsEditingFramework(!content.framework);
      setTempFramework(content.framework || '');
    }
  }, [content]);

  if (!content) return null;

  const currentFramework = frameworks.find((f) => f.id === framework || f.name === framework);

  const handleConfirmFramework = async () => {
    if (!tempFramework) return;
    const fw = frameworks.find((f) => f.id === tempFramework);
    setFramework(fw?.name || tempFramework);
    setFrameworkOrigin('manual');
    setFrameworkReason(undefined);
    setIsEditingFramework(false);
    await onSave({
      framework: fw?.name || tempFramework,
      framework_origin: 'manual',
      framework_reason: null,
    });
  };

  const handleChangeFramework = () => {
    setTempFramework('');
    setIsEditingFramework(true);
  };

  const handleClearFrameworkAndText = async () => {
    setFramework('');
    setGeneratedText(null);
    setIsEditingFramework(true);
    await onSave({
      framework: null,
      framework_origin: null,
      framework_reason: null,
      generated_text: null,
      status: 'idea',
    });
  };

  const handleSaveAll = async () => {
    await onSave({
      title,
      hook,
      description,
      format: selectedFormat,
      status,
      target_date: targetDate || null,
      intention: intention || null,
      funnel_stage: funnelStage || null,
      suggested_cta: suggestedCta || null,
    });
    onClose();
  };

  const handleCopyText = () => {
    if (generatedText) {
      navigator.clipboard.writeText(generatedText);
      toast({ title: 'Texto copiado!' });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[540px] sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do Conteúdo</SheetTitle>
          <SheetDescription>
            {needsFramework && !isEditingFramework
              ? 'Selecione um framework para este conteúdo'
              : 'Edite as informações do conteúdo'}
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label>Título / Tema</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Hook */}
          <div className="space-y-2">
            <Label>Hook</Label>
            <Textarea value={hook} rows={2} onChange={(e) => setHook(e.target.value)} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={description} rows={3} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {/* === FRAMEWORK SECTION === */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Framework do Conteúdo</Label>

            {/* State: Framework confirmed (read-only view) */}
            {!isEditingFramework && framework && (
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {frameworkOrigin === 'ai' ? (
                      <Bot className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-medium text-foreground">{currentFramework?.name || framework}</span>
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      frameworkOrigin === 'ai'
                        ? 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                        : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                    )}
                  >
                    {frameworkOrigin === 'ai' ? 'Sugerido pela IA' : 'Definido manualmente'}
                  </Badge>
                </div>

                {/* Framework structure (read-only) */}
                {currentFramework?.structure && (
                  <div className="space-y-1 mb-3">
                    {currentFramework.structure.map((step, i) => (
                      <p key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-primary font-mono">{i + 1}.</span>
                        {step}
                      </p>
                    ))}
                  </div>
                )}

                {frameworkReason && (
                  <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
                    "{frameworkReason}"
                  </p>
                )}

                {generatedText ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={handleClearFrameworkAndText}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Trocar Framework (limpa texto gerado)
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={handleChangeFramework}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Alterar framework
                  </Button>
                )}
              </div>
            )}

            {/* State: Selecting framework */}
            {isEditingFramework && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-500 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Selecione um framework para este conteúdo
                  </p>
                </div>

                {frameworksLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {frameworks.map((fw) => (
                      <button
                        key={fw.id}
                        type="button"
                        onClick={() => setTempFramework(fw.id)}
                        className={cn(
                          'w-full p-4 rounded-lg border text-left transition-all',
                          tempFramework === fw.id
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                            : 'border-border hover:border-primary/50 bg-card'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground flex items-center gap-2">
                            {tempFramework === fw.id && <Check className="h-4 w-4 text-primary" />}
                            {fw.name}
                          </span>
                          {fw.category && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {fw.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{fw.description}</p>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  {framework && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setTempFramework(framework);
                        setIsEditingFramework(false);
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button
                    className="flex-1"
                    onClick={handleConfirmFramework}
                    disabled={!tempFramework}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirmar framework
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Fields below framework (only when framework is confirmed) */}
          {!isEditingFramework && framework && (
            <>
              {/* Format and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Formato</Label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {contentFormats.map((f) => (
                        <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as ContentStatus)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(contentStatusConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>{config.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Intention and Funnel Stage */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Intenção</Label>
                  <Select value={intention || ''} onValueChange={(v) => setIntention(v || null)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="educate">Educar</SelectItem>
                      <SelectItem value="engage">Engajar</SelectItem>
                      <SelectItem value="convert">Converter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estágio do Funil</Label>
                  <Select value={funnelStage || ''} onValueChange={(v) => setFunnelStage(v || null)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tofu">ToFu</SelectItem>
                      <SelectItem value="mofu">MoFu</SelectItem>
                      <SelectItem value="bofu">BoFu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Target Date */}
              <div className="space-y-2">
                <Label>Data Alvo</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !targetDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {targetDate
                        ? format(new Date(targetDate), 'dd MMM yyyy', { locale: ptBR })
                        : 'Selecione uma data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                    <Calendar
                      mode="single"
                      selected={targetDate ? new Date(targetDate) : undefined}
                      onSelect={(date) => setTargetDate(date?.toISOString().split('T')[0])}
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* CTA */}
              <div className="space-y-2">
                <Label>CTA Sugerido</Label>
                <Input value={suggestedCta} onChange={(e) => setSuggestedCta(e.target.value)} />
              </div>

              {/* === GENERATED TEXT SECTION === */}
              {generatedText && (
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Texto Gerado</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCopyText}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={generatedText}
                    readOnly
                    rows={12}
                    className="bg-muted/50 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onGenerate}
                    disabled={isGenerating || !aiAllowed}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Regenerar Texto
                  </Button>
                </div>
              )}

              {/* AI Generate Button (only when no generated text yet) */}
              {!generatedText && (
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full"
                    disabled={!aiAllowed || isGenerating || !framework}
                    onClick={onGenerate}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Gerar Texto com IA
                    {!aiAllowed && <span className="ml-2"><PlanBadge requiredPlan="pro" /></span>}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {!isEditingFramework && framework && (
          <SheetFooter>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSaveAll}>Salvar Alterações</Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
