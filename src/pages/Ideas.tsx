import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Filter,
  Calendar,
  Tag,
   ArrowRight,
} from 'lucide-react';
import { Idea, IdeaStatus, ContentFormat } from '@/types';
import { getStatusLabel, getFormatLabel, formatDatePTBR } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusColors: Record<IdeaStatus, string> = {
  backlog: 'bg-secondary text-secondary-foreground',
  planned: 'bg-primary/20 text-primary',
  in_progress: 'bg-warning/20 text-warning',
  review: 'bg-destructive/20 text-destructive',
  published: 'bg-success text-success-foreground',
  archived: 'bg-muted text-muted-foreground',
};

export default function Ideas() {
  const { ideas, sprints, brand, addIdea, updateIdea, deleteIdea } = useApp();
   const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'backlog' as IdeaStatus,
    format: 'post' as ContentFormat,
    pillarId: '',
    sprintId: '',
    tags: '',
    dueDate: '',
  });
  
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || idea.status === statusFilter;
    const matchesFormat = formatFilter === 'all' || idea.format === formatFilter;
    return matchesSearch && matchesStatus && matchesFormat;
  });
  
  const handleOpenDialog = (idea?: Idea) => {
    if (idea) {
      setEditingIdea(idea);
      setFormData({
        title: idea.title,
        description: idea.description,
        status: idea.status,
        format: idea.format,
        pillarId: idea.pillarId || '',
        sprintId: idea.sprintId || '',
        tags: idea.tags.join(', '),
        dueDate: idea.dueDate || '',
      });
    } else {
      setEditingIdea(null);
      setFormData({
        title: '',
        description: '',
        status: 'backlog',
        format: 'post',
        pillarId: '',
        sprintId: '',
        tags: '',
        dueDate: '',
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleSave = () => {
    const tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    
    if (editingIdea) {
      updateIdea(editingIdea.id, {
        ...formData,
        tags,
        pillarId: formData.pillarId || undefined,
        sprintId: formData.sprintId || undefined,
        dueDate: formData.dueDate || undefined,
      });
    } else {
      const newIdea: Idea = {
        id: `idea-${Date.now()}`,
        ...formData,
        tags,
        pillarId: formData.pillarId || undefined,
        sprintId: formData.sprintId || undefined,
        dueDate: formData.dueDate || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addIdea(newIdea);
    }
    setIsDialogOpen(false);
  };
  
  const pillars = brand?.pillars ?? [];

  const getPillarName = (pillarId?: string) => {
    if (!pillarId) return null;
    return pillars.find((p) => p.id === pillarId)?.name;
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Ideias</h2>
            <p className="text-muted-foreground">
              Banco de ideias e conteúdos
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Ideia
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingIdea ? 'Editar Ideia' : 'Nova Ideia'}
                </DialogTitle>
                <DialogDescription>
                  {editingIdea ? 'Atualize os detalhes da ideia' : 'Adicione uma nova ideia de conteúdo'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título do conteúdo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva a ideia..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Formato</Label>
                    <Select
                      value={formData.format}
                      onValueChange={(value) => setFormData({ ...formData, format: value as ContentFormat })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="post">Post</SelectItem>
                        <SelectItem value="carousel">Carrossel</SelectItem>
                        <SelectItem value="video">Vídeo</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                        <SelectItem value="article">Artigo</SelectItem>
                        <SelectItem value="thread">Thread</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as IdeaStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="backlog">Backlog</SelectItem>
                        <SelectItem value="planned">Planejado</SelectItem>
                        <SelectItem value="in_progress">Em Progresso</SelectItem>
                        <SelectItem value="review">Revisão</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="archived">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="">Nenhum</SelectItem>
                        {pillars.map((pillar) => (
                          <SelectItem key={pillar.id} value={pillar.id}>
                            {pillar.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sprint">Sprint</Label>
                    <Select
                      value={formData.sprintId}
                      onValueChange={(value) => setFormData({ ...formData, sprintId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Nenhum</SelectItem>
                        {sprints.map((sprint) => (
                          <SelectItem key={sprint.id} value={sprint.id}>
                            {sprint.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Ex: produto, estratégia, liderança"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Data de Entrega</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingIdea ? 'Salvar' : 'Criar Ideia'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar ideias..."
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
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="backlog">Backlog</SelectItem>
              <SelectItem value="planned">Planejado</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="review">Revisão</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Formatos</SelectItem>
              <SelectItem value="post">Post</SelectItem>
              <SelectItem value="carousel">Carrossel</SelectItem>
              <SelectItem value="video">Vídeo</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="article">Artigo</SelectItem>
              <SelectItem value="thread">Thread</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => (
            <Card
              key={idea.id}
              className="border-border hover:border-primary/30 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-2">{idea.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {idea.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenDialog(idea)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteIdea(idea.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={statusColors[idea.status]}>
                    {getStatusLabel(idea.status)}
                  </Badge>
                  <Badge variant="outline">
                    {getFormatLabel(idea.format)}
                  </Badge>
                  {getPillarName(idea.pillarId) && (
                    <Badge variant="outline">
                      {getPillarName(idea.pillarId)}
                    </Badge>
                  )}
                </div>
                
                {idea.tags.length > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs text-muted-foreground">
                          #{tag}
                        </span>
                      ))}
                      {idea.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{idea.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {idea.dueDate && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Até {formatDatePTBR(idea.dueDate)}</span>
                  </div>
                )}

               {/* Link to Sprint if assigned */}
               {idea.sprintId && (
                 <Button
                   variant="ghost"
                   size="sm"
                   className="w-full mt-3 text-xs justify-center gap-1"
                   onClick={(e) => {
                     e.stopPropagation();
                     const sprint = sprints.find(s => s.id === idea.sprintId);
                     if (sprint) {
                       navigate(`/sprints/${idea.sprintId}`);
                     }
                   }}
                 >
                   Ver na Sprint
                   <ArrowRight className="h-3 w-3" />
                 </Button>
               )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredIdeas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma ideia encontrada</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
