 import { useState, useMemo, useEffect } from 'react';
 import { useParams, useNavigate } from 'react-router-dom';
 import { useApp } from '@/contexts/AppContext';
 import { MainLayout } from '@/components/layout/MainLayout';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Progress } from '@/components/ui/progress';
 import { Skeleton } from '@/components/ui/skeleton';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { Checkbox } from '@/components/ui/checkbox';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
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
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from '@/components/ui/dropdown-menu';
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from '@/components/ui/popover';
 import { Calendar } from '@/components/ui/calendar';
 import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
   TooltipProvider,
 } from '@/components/ui/tooltip';
 import {
   ArrowLeft,
   Calendar as CalendarIcon,
   Plus,
   Sparkles,
   ArrowUpDown,
   Pencil,
   Trash2,
   FileText,
   LayoutGrid,
   Mail,
   Video,
   Film,
   MessageSquare,
   Briefcase,
   Globe,
   Camera,
   Check,
   ChevronDown,
   AlertTriangle,
 } from 'lucide-react';
 import { Sprint, SprintStatus } from '@/types';
 import { formatDatePTBR, mockPillars, mockSprints } from '@/data/mockData';
 import { cn } from '@/lib/utils';
 import { format, isBefore, startOfDay } from 'date-fns';
 import { ptBR } from 'date-fns/locale';
 
 // Types for Sprint Content
 type ContentStatus = 'idea' | 'review' | 'scheduled' | 'backlog' | 'completed';
 type FunnelStage = 'tofu' | 'mofu' | 'bofu';
 
 interface SprintContent {
   id: string;
   sprintId: string;
   title: string;
   hook: string;
   description: string;
   format: string;
   status: ContentStatus;
   funnelStage: FunnelStage;
   targetDate?: string;
   framework: string;
   frameworkReason?: string;
   intention: 'educate' | 'engage' | 'convert';
   suggestedCta: string;
   createdAt: string;
   updatedAt: string;
 }
 
 // Status configuration
 const contentStatusConfig: Record<ContentStatus, { label: string; className: string }> = {
   idea: {
     label: 'Ideia',
     className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
   },
   backlog: {
     label: 'Backlog',
     className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
   },
   review: {
     label: 'Revisão',
     className: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
   },
   scheduled: {
     label: 'Agendado',
     className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
   },
   completed: {
     label: 'Concluído',
     className: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
   },
 };
 
 const funnelStageConfig: Record<FunnelStage, { label: string; className: string }> = {
   tofu: { label: 'ToFu', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
   mofu: { label: 'MoFu', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
   bofu: { label: 'BoFu', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
 };
 
 const sprintStatusConfig: Record<SprintStatus, { label: string; className: string }> = {
   draft: {
     label: 'Planejamento',
     className: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
   },
   active: {
     label: 'Em andamento',
     className: 'bg-violet-500/20 text-violet-500 border-violet-500/30',
   },
   completed: {
     label: 'Concluída',
     className: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
   },
   archived: {
     label: 'Arquivada',
     className: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
   },
 };
 
 // Format configuration
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
 
 // Framework configuration
 const contentFrameworks: { id: string; name: string; description: string }[] = [
   { id: 'aida', name: 'AIDA', description: 'Atenção → Interesse → Desejo → Ação' },
   { id: 'pas', name: 'PAS', description: 'Problema → Agitação → Solução' },
   { id: 'storytelling', name: 'Storytelling', description: 'Narrativa com início, meio e fim' },
   { id: 'bab', name: 'Before/After/Bridge', description: 'Antes → Depois → Como chegar lá' },
   { id: 'hvc', name: 'Hook → Value → CTA', description: 'Gancho → Valor → Chamada para ação' },
   { id: 'educational', name: 'Educacional', description: 'Contexto → Conceito → Exemplos → Aplicação' },
   { id: 'authority', name: 'Autoridade', description: 'Opinião → Evidência → Insight' },
 ];
 
 // Mock sprint contents
 const mockSprintContents: SprintContent[] = [
   {
     id: 'content-1',
     sprintId: 'sprint-1',
     title: 'Por que 90% dos roadmaps falham',
     hook: '90% das pessoas erram nisso...',
     description: 'Carousel explicando os erros mais comuns ao criar roadmaps de produto',
     format: 'post-linkedin-carousel',
     status: 'review',
     funnelStage: 'tofu',
     targetDate: '2024-02-15',
     framework: 'educational',
     frameworkReason: 'Formato de carrossel combina com estrutura didática em etapas',
     intention: 'educate',
     suggestedCta: 'Salve para consultar depois',
     createdAt: '2024-02-01T10:00:00Z',
     updatedAt: '2024-02-08T14:00:00Z',
   },
   {
     id: 'content-2',
     sprintId: 'sprint-1',
     title: 'Como defino prioridades no meu time',
     hook: 'O método que mudou minha carreira:',
     description: 'Vídeo mostrando meu processo real de priorização semanal',
     format: 'video-short',
     status: 'scheduled',
     funnelStage: 'mofu',
     targetDate: '2024-02-12',
     framework: 'storytelling',
     frameworkReason: 'Narrativa gera conexão emocional e comentários',
     intention: 'engage',
     suggestedCta: 'Conta sua experiência',
     createdAt: '2024-02-02T09:00:00Z',
     updatedAt: '2024-02-10T11:00:00Z',
   },
   {
     id: 'content-3',
     sprintId: 'sprint-1',
     title: 'O framework que uso para dizer não',
     hook: 'Aprendi isso depois de 5 anos:',
     description: 'Post sobre como recusar demandas de forma estratégica',
     format: 'post-linkedin-text',
     status: 'idea',
     funnelStage: 'tofu',
     targetDate: '2024-02-20',
     framework: 'hvc',
     frameworkReason: 'Formato direto para redes sociais',
     intention: 'educate',
     suggestedCta: 'Comente sua dúvida',
     createdAt: '2024-02-03T16:00:00Z',
     updatedAt: '2024-02-10T09:00:00Z',
   },
   {
     id: 'content-4',
     sprintId: 'sprint-1',
     title: 'Cases de sucesso: transformação de roadmap',
     hook: 'Resultado garantido ou dinheiro de volta',
     description: 'Post mostrando resultados reais de um cliente',
     format: 'post-linkedin-carousel',
     status: 'backlog',
     funnelStage: 'bofu',
     framework: 'aida',
     frameworkReason: 'Estrutura ideal para conteúdos de conversão',
     intention: 'convert',
     suggestedCta: 'Agende uma conversa gratuita',
     createdAt: '2024-02-04T10:00:00Z',
     updatedAt: '2024-02-04T10:00:00Z',
   },
   {
     id: 'content-5',
     sprintId: 'sprint-1',
     title: 'Métricas de produto que realmente importam',
     hook: 'A técnica que poucos conhecem:',
     description: 'Thread com as métricas essenciais para cada fase',
     format: 'thread',
     status: 'completed',
     funnelStage: 'tofu',
     targetDate: '2024-02-08',
     framework: 'educational',
     intention: 'educate',
     suggestedCta: 'Salve para consultar depois',
     createdAt: '2024-02-01T10:00:00Z',
     updatedAt: '2024-02-08T18:00:00Z',
   },
 ];
 
 // Status order for sorting
 const statusOrder: Record<ContentStatus, number> = {
   review: 1,
   scheduled: 2,
   idea: 3,
   backlog: 4,
   completed: 5,
 };
 
 // Sort types
 type SortField = 'status' | 'targetDate' | 'format';
 type SortDirection = 'asc' | 'desc';
 
 // Format Dropdown Component
 const FormatDropdown = ({
   value,
   onChange,
 }: {
   value: string;
   onChange: (value: string) => void;
 }) => {
   const currentFormat = contentFormats.find((f) => f.id === value);
   const Icon = currentFormat?.icon || FileText;
 
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button variant="ghost" size="sm" className="h-8 px-2 gap-2 text-muted-foreground hover:text-foreground">
           <Icon className="h-4 w-4" />
           <span className="text-sm">{currentFormat?.label || value}</span>
           <ChevronDown className="h-3 w-3 opacity-50" />
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="start" className="w-48">
         {contentFormats.map((format) => {
           const FormatIcon = format.icon;
           return (
             <DropdownMenuItem key={format.id} onClick={() => onChange(format.id)}>
               <FormatIcon className="h-4 w-4 mr-2" />
               {format.label}
             </DropdownMenuItem>
           );
         })}
       </DropdownMenuContent>
     </DropdownMenu>
   );
 };
 
 // Status Dropdown Component
 const StatusDropdown = ({
   value,
   onChange,
 }: {
   value: ContentStatus;
   onChange: (value: ContentStatus) => void;
 }) => {
   const config = contentStatusConfig[value];
 
   return (
     <DropdownMenu>
       <DropdownMenuTrigger asChild>
         <Button variant="ghost" size="sm" className="h-7 px-2 gap-1">
           <Badge variant="outline" className={cn('text-xs', config.className)}>
             {config.label}
           </Badge>
           <ChevronDown className="h-3 w-3 opacity-50" />
         </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="start">
         {(Object.keys(contentStatusConfig) as ContentStatus[]).map((status) => (
           <DropdownMenuItem key={status} onClick={() => onChange(status)}>
             <Badge variant="outline" className={cn('text-xs', contentStatusConfig[status].className)}>
               {contentStatusConfig[status].label}
             </Badge>
           </DropdownMenuItem>
         ))}
       </DropdownMenuContent>
     </DropdownMenu>
   );
 };
 
 // Inline Date Picker Component
 const InlineDatePicker = ({
   value,
   onChange,
   isOverdue,
 }: {
   value?: string;
   onChange: (date: string | undefined) => void;
   isOverdue?: boolean;
 }) => {
   const [open, setOpen] = useState(false);
   const date = value ? new Date(value) : undefined;
 
   return (
     <Popover open={open} onOpenChange={setOpen}>
       <PopoverTrigger asChild>
         <Button
           variant="ghost"
           size="sm"
           className={cn(
             'h-8 px-2 gap-2 text-sm',
             !value && 'text-muted-foreground',
             isOverdue && 'text-red-500'
           )}
         >
           <CalendarIcon className="h-4 w-4" />
           {value ? (
             <span className="flex items-center gap-1">
               {format(new Date(value), 'dd MMM', { locale: ptBR })}
               {isOverdue && <AlertTriangle className="h-3 w-3" />}
             </span>
           ) : (
             <span>Sem data</span>
           )}
         </Button>
       </PopoverTrigger>
       <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
         <Calendar
           mode="single"
           selected={date}
           onSelect={(newDate) => {
             onChange(newDate?.toISOString().split('T')[0]);
             setOpen(false);
           }}
           locale={ptBR}
           className="pointer-events-auto"
         />
       </PopoverContent>
     </Popover>
   );
 };
 
 // Content Detail Sheet Component
 const ContentDetailSheet = ({
   isOpen,
   onClose,
   content,
   onSave,
 }: {
   isOpen: boolean;
   onClose: () => void;
   content: SprintContent | null;
   onSave: (content: SprintContent) => void;
 }) => {
   const [editedContent, setEditedContent] = useState<SprintContent | null>(content);
 
   // Update local state when content prop changes
   useEffect(() => {
     if (content) {
       setEditedContent(content);
     }
   }, [content]);
 
   if (!content || !editedContent) return null;
 
   const currentFramework = contentFrameworks.find((f) => f.id === editedContent.framework);
 
   return (
     <Sheet open={isOpen} onOpenChange={onClose}>
       <SheetContent side="right" className="w-[540px] sm:max-w-[540px] overflow-y-auto">
         <SheetHeader>
           <SheetTitle>Detalhes do Conteúdo</SheetTitle>
           <SheetDescription>Edite as informações do conteúdo</SheetDescription>
         </SheetHeader>
 
         <div className="py-6 space-y-6">
           {/* Title */}
           <div className="space-y-2">
             <Label>Título / Tema</Label>
             <Input
               value={editedContent.title}
               onChange={(e) => setEditedContent({ ...editedContent, title: e.target.value })}
             />
           </div>
 
           {/* Hook */}
           <div className="space-y-2">
             <Label>Hook</Label>
             <Textarea
               value={editedContent.hook}
               rows={2}
               onChange={(e) => setEditedContent({ ...editedContent, hook: e.target.value })}
             />
           </div>
 
           {/* Description */}
           <div className="space-y-2">
             <Label>Descrição</Label>
             <Textarea
               value={editedContent.description}
               rows={3}
               onChange={(e) => setEditedContent({ ...editedContent, description: e.target.value })}
             />
           </div>
 
           {/* Framework */}
           <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
             <div className="flex items-center gap-2 mb-2">
               <Sparkles className="h-4 w-4 text-primary" />
               <span className="font-medium text-sm">Framework Selecionado</span>
             </div>
             <p className="text-foreground">{currentFramework?.name}</p>
             <p className="text-xs text-muted-foreground mt-1">
               {currentFramework?.description}
             </p>
             {editedContent.frameworkReason && (
               <p className="text-xs text-muted-foreground mt-2 italic">
                 "{editedContent.frameworkReason}"
               </p>
             )}
           </div>
 
           {/* Format and Status */}
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label>Formato</Label>
               <Select
                 value={editedContent.format}
                 onValueChange={(value) => setEditedContent({ ...editedContent, format: value })}
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
               <Label>Status</Label>
               <Select
                 value={editedContent.status}
                 onValueChange={(value) =>
                   setEditedContent({ ...editedContent, status: value as ContentStatus })
                 }
               >
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   {(Object.keys(contentStatusConfig) as ContentStatus[]).map((status) => (
                     <SelectItem key={status} value={status}>
                       {contentStatusConfig[status].label}
                     </SelectItem>
                   ))}
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
                     !editedContent.targetDate && 'text-muted-foreground'
                   )}
                 >
                   <CalendarIcon className="mr-2 h-4 w-4" />
                   {editedContent.targetDate
                     ? format(new Date(editedContent.targetDate), 'dd MMM yyyy', { locale: ptBR })
                     : 'Selecione uma data'}
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                 <Calendar
                   mode="single"
                   selected={editedContent.targetDate ? new Date(editedContent.targetDate) : undefined}
                   onSelect={(date) =>
                     setEditedContent({
                       ...editedContent,
                       targetDate: date?.toISOString().split('T')[0],
                     })
                   }
                   locale={ptBR}
                   className="pointer-events-auto"
                 />
               </PopoverContent>
             </Popover>
           </div>
 
           {/* CTA */}
           <div className="space-y-2">
             <Label>CTA Sugerido</Label>
             <Input
               value={editedContent.suggestedCta}
               onChange={(e) => setEditedContent({ ...editedContent, suggestedCta: e.target.value })}
             />
           </div>
 
           {/* AI Actions */}
           <div className="pt-4 border-t border-border">
             <Button variant="outline" className="w-full">
               <Sparkles className="h-4 w-4 mr-2" />
               Gerar Texto com IA
             </Button>
           </div>
         </div>
 
         <SheetFooter>
           <Button variant="outline" onClick={onClose}>
             Cancelar
           </Button>
           <Button onClick={() => onSave(editedContent)}>Salvar Alterações</Button>
         </SheetFooter>
       </SheetContent>
     </Sheet>
   );
 };
 
 // Empty State Component
 const EmptyContentsState = ({ onAddContent }: { onAddContent: () => void }) => (
   <div className="text-center py-16 border border-dashed border-zinc-700 rounded-lg">
     <FileText className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
     <h3 className="text-lg font-medium text-foreground mb-2">Nenhum conteúdo nesta Sprint</h3>
     <p className="text-muted-foreground mb-6 max-w-md mx-auto">
       Comece adicionando conteúdos manualmente ou deixe a IA sugerir baseado no objetivo da Sprint.
     </p>
     <div className="flex items-center justify-center gap-3">
       <Button onClick={onAddContent}>
         <Plus className="h-4 w-4 mr-2" />
         Adicionar Conteúdo
       </Button>
       <Button variant="outline">
         <Sparkles className="h-4 w-4 mr-2" />
         Gerar Sugestões IA
       </Button>
     </div>
   </div>
 );
 
 // Loading Skeleton Component
 const SprintDetailSkeleton = () => (
   <div className="space-y-6">
     <div className="flex items-center gap-4">
       <Skeleton className="h-9 w-40" />
       <Skeleton className="h-6 w-32" />
     </div>
     <Skeleton className="h-24 w-full rounded-lg" />
     <div className="border border-border rounded-lg">
       <div className="p-4">
         <Skeleton className="h-10 w-full" />
       </div>
       {[1, 2, 3, 4, 5].map((i) => (
         <div key={i} className="p-4 border-t border-border">
           <Skeleton className="h-12 w-full" />
         </div>
       ))}
     </div>
   </div>
 );
 
 // Not Found Component
 const SprintNotFound = ({ onBack }: { onBack: () => void }) => (
   <div className="text-center py-16">
     <h2 className="text-xl font-semibold text-foreground mb-2">Sprint não encontrada</h2>
     <p className="text-muted-foreground mb-6">A Sprint que você está procurando não existe.</p>
     <Button onClick={onBack}>
       <ArrowLeft className="h-4 w-4 mr-2" />
       Voltar para Sprints
     </Button>
   </div>
 );
 
 export default function SprintDetail() {
   const { sprintId } = useParams<{ sprintId: string }>();
   const navigate = useNavigate();
   const { sprints } = useApp();
 
   // Find sprint from context or mock data
   const sprint = useMemo(() => {
     return sprints.find((s) => s.id === sprintId) || mockSprints.find((s) => s.id === sprintId);
   }, [sprints, sprintId]);
 
   // State
   const [contents, setContents] = useState<SprintContent[]>(
     mockSprintContents.filter((c) => c.sprintId === sprintId)
   );
   const [selectedIds, setSelectedIds] = useState<string[]>([]);
   const [sortField, setSortField] = useState<SortField>('targetDate');
   const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
   const [isLoading, setIsLoading] = useState(false);
   const [editingContent, setEditingContent] = useState<SprintContent | null>(null);
   const [isSheetOpen, setIsSheetOpen] = useState(false);
 
   // Sorted contents
   const sortedContents = useMemo(() => {
     return [...contents].sort((a, b) => {
       let comparison = 0;
       switch (sortField) {
         case 'status':
           comparison = statusOrder[a.status] - statusOrder[b.status];
           break;
         case 'targetDate':
           comparison = (a.targetDate || '9999-99-99').localeCompare(b.targetDate || '9999-99-99');
           break;
         case 'format':
           comparison = a.format.localeCompare(b.format);
           break;
       }
       return sortDirection === 'asc' ? comparison : -comparison;
     });
   }, [contents, sortField, sortDirection]);
 
   // Progress calculation
   const progressPercentage = useMemo(() => {
     if (contents.length === 0) return 0;
     const completed = contents.filter((c) => c.status === 'completed').length;
     return Math.round((completed / contents.length) * 100);
   }, [contents]);
 
   // Handlers
   const handleBack = () => navigate('/content-lab/sprints');
 
   const handleSelectAll = (checked: boolean) => {
     if (checked) {
       setSelectedIds(contents.map((c) => c.id));
     } else {
       setSelectedIds([]);
     }
   };
 
   const handleSelect = (id: string) => {
     setSelectedIds((prev) =>
       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
     );
   };
 
   const handleEdit = (content: SprintContent) => {
     setEditingContent(content);
     setIsSheetOpen(true);
   };
 
   const handleDelete = (id: string) => {
     setContents((prev) => prev.filter((c) => c.id !== id));
     setSelectedIds((prev) => prev.filter((i) => i !== id));
   };
 
   const handleStatusChange = (id: string, status: ContentStatus) => {
     setContents((prev) =>
       prev.map((c) => (c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c))
     );
   };
 
   const handleDateChange = (id: string, date: string | undefined) => {
     setContents((prev) =>
       prev.map((c) => (c.id === id ? { ...c, targetDate: date, updatedAt: new Date().toISOString() } : c))
     );
   };
 
   const handleFormatChange = (id: string, format: string) => {
     setContents((prev) =>
       prev.map((c) => (c.id === id ? { ...c, format, updatedAt: new Date().toISOString() } : c))
     );
   };
 
   const handleSaveContent = (content: SprintContent) => {
     setContents((prev) =>
       prev.map((c) => (c.id === content.id ? { ...content, updatedAt: new Date().toISOString() } : c))
     );
     setIsSheetOpen(false);
     setEditingContent(null);
   };
 
   const handleSort = (field: SortField) => {
     if (sortField === field) {
       setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
     } else {
       setSortField(field);
       setSortDirection('asc');
     }
   };
 
   const handleAddContent = () => {
     // Create new content with default values
     const newContent: SprintContent = {
       id: `content-${Date.now()}`,
       sprintId: sprintId || '',
       title: 'Novo conteúdo',
       hook: '',
       description: '',
       format: 'post-linkedin-text',
       status: 'idea',
       funnelStage: 'tofu',
       framework: 'hvc',
       intention: 'educate',
       suggestedCta: '',
       createdAt: new Date().toISOString(),
       updatedAt: new Date().toISOString(),
     };
     setContents((prev) => [...prev, newContent]);
     handleEdit(newContent);
   };
 
   // Find pillar
   const pillar = mockPillars.find((p) => p.id === sprint?.pillarId);
 
   // Render
   if (isLoading) {
     return (
       <MainLayout>
         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
           <SprintDetailSkeleton />
         </div>
       </MainLayout>
     );
   }
 
   if (!sprint) {
     return (
       <MainLayout>
         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
           <SprintNotFound onBack={handleBack} />
         </div>
       </MainLayout>
     );
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
                   <ArrowLeft className="h-4 w-4 mr-2" />
                   Voltar para Sprints
                 </Button>
                 <div className="h-4 w-px bg-border" />
                 <h1 className="text-lg font-semibold text-foreground">{sprint.title}</h1>
               </div>
               <Badge variant="outline" className={cn('text-xs', statusConfig.className)}>
                 {statusConfig.label}
               </Badge>
             </div>
           </div>
         </div>
 
         <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
           {/* Summary Strip */}
           <div className="bg-card border border-border rounded-lg p-4">
             <div className="flex flex-wrap items-center gap-6 mb-3">
               <div className="flex items-center gap-2 text-sm">
                 <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                 <span className="text-muted-foreground">
                   {formatDatePTBR(sprint.startDate)} - {formatDatePTBR(sprint.endDate)}
                 </span>
               </div>
               {pillar && (
                 <Badge
                   variant="outline"
                   className="text-xs"
                   style={{ borderColor: pillar.color, color: pillar.color }}
                 >
                   {pillar.name}
                 </Badge>
               )}
               <div className="text-sm text-muted-foreground flex-1 truncate">
                 "{sprint.description}"
               </div>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-sm text-muted-foreground">
                 {contents.filter((c) => c.status === 'completed').length}/{contents.length} conteúdos
                 prontos
               </span>
               <Progress value={progressPercentage} className="flex-1 h-2" />
               <span className="text-sm font-medium text-foreground">{progressPercentage}%</span>
             </div>
           </div>
 
           {/* Actions Bar */}
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Button onClick={handleAddContent}>
                 <Plus className="h-4 w-4 mr-2" />
                 Adicionar Conteúdo
               </Button>
               <Button variant="outline">
                 <Sparkles className="h-4 w-4 mr-2" />
                 Gerar Sugestões IA
               </Button>
             </div>
             <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground">Ordenar por:</span>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => handleSort('status')}
                 className={cn(sortField === 'status' && 'text-primary')}
               >
                 Status
                 <ArrowUpDown className="h-3 w-3 ml-1" />
               </Button>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => handleSort('targetDate')}
                 className={cn(sortField === 'targetDate' && 'text-primary')}
               >
                 Data
                 <ArrowUpDown className="h-3 w-3 ml-1" />
               </Button>
               <Button
                 variant="ghost"
                 size="sm"
                 onClick={() => handleSort('format')}
                 className={cn(sortField === 'format' && 'text-primary')}
               >
                 Formato
                 <ArrowUpDown className="h-3 w-3 ml-1" />
               </Button>
             </div>
           </div>
 
           {/* Content Table or Empty State */}
           {contents.length === 0 ? (
             <EmptyContentsState onAddContent={handleAddContent} />
           ) : (
             <div className="border border-border rounded-lg overflow-hidden">
               <Table>
                 <TableHeader>
                   <TableRow className="bg-muted/50 hover:bg-muted/50">
                     <TableHead className="w-12">
                       <Checkbox
                         checked={selectedIds.length === contents.length && contents.length > 0}
                         onCheckedChange={handleSelectAll}
                       />
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
                     const isOverdue =
                       content.targetDate &&
                       isBefore(new Date(content.targetDate), startOfDay(new Date())) &&
                       content.status !== 'completed';
 
                     return (
                       <TableRow
                         key={content.id}
                         className={cn(
                           'hover:bg-muted/50 transition-colors',
                           isOverdue && 'bg-destructive/5',
                           content.status === 'completed' && 'opacity-60',
                           content.status === 'backlog' && 'opacity-80'
                         )}
                       >
                         <TableCell>
                           <Checkbox
                             checked={selectedIds.includes(content.id)}
                             onCheckedChange={() => handleSelect(content.id)}
                           />
                         </TableCell>
                         <TableCell>
                           <div className="space-y-1">
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <button
                                   onClick={() => handleEdit(content)}
                                   className="text-left hover:text-primary transition-colors"
                                 >
                                   <span className="font-medium text-foreground line-clamp-1">
                                     {content.title}
                                   </span>
                                 </button>
                               </TooltipTrigger>
                               <TooltipContent side="top" className="max-w-xs">
                                 <p className="font-medium">{content.title}</p>
                                 <p className="text-xs text-muted-foreground mt-1">{content.hook}</p>
                               </TooltipContent>
                             </Tooltip>
                             <Badge
                               variant="outline"
                               className={cn('text-xs', funnelStageConfig[content.funnelStage].className)}
                             >
                               {funnelStageConfig[content.funnelStage].label}
                             </Badge>
                           </div>
                         </TableCell>
                         <TableCell>
                           <FormatDropdown
                             value={content.format}
                             onChange={(format) => handleFormatChange(content.id, format)}
                           />
                         </TableCell>
                         <TableCell>
                           <StatusDropdown
                             value={content.status}
                             onChange={(status) => handleStatusChange(content.id, status)}
                           />
                         </TableCell>
                         <TableCell>
                           <InlineDatePicker
                             value={content.targetDate}
                             onChange={(date) => handleDateChange(content.id, date)}
                             isOverdue={isOverdue}
                           />
                         </TableCell>
                         <TableCell>
                           <div className="flex items-center gap-1">
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <Button
                                   variant="ghost"
                                   size="icon"
                                   className="h-8 w-8"
                                   onClick={() => handleEdit(content)}
                                 >
                                   <Pencil className="h-4 w-4" />
                                 </Button>
                               </TooltipTrigger>
                               <TooltipContent>Editar</TooltipContent>
                             </Tooltip>
                             <Tooltip>
                               <TooltipTrigger asChild>
                                 <Button
                                   variant="ghost"
                                   size="icon"
                                   className="h-8 w-8 text-destructive hover:text-destructive"
                                   onClick={() => handleDelete(content.id)}
                                 >
                                   <Trash2 className="h-4 w-4" />
                                 </Button>
                               </TooltipTrigger>
                               <TooltipContent>Remover</TooltipContent>
                             </Tooltip>
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
           onClose={() => {
             setIsSheetOpen(false);
             setEditingContent(null);
           }}
           content={editingContent}
           onSave={handleSaveContent}
         />
       </TooltipProvider>
     </MainLayout>
   );
 }