import { useState } from 'react';
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
} from 'lucide-react';
import { Sprint, SprintStatus } from '@/types';
import { getStatusLabel, formatDatePTBR, mockPillars } from '@/data/mockData';
import { cn } from '@/lib/utils';

const statusColors: Record<SprintStatus, string> = {
  draft: 'bg-secondary text-secondary-foreground',
  active: 'bg-success text-success-foreground',
  completed: 'bg-primary text-primary-foreground',
  archived: 'bg-muted text-muted-foreground',
};

export default function Sprints() {
  const { sprints, addSprint, updateSprint, deleteSprint } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);
  
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
  
  const filteredSprints = sprints.filter((sprint) => {
    const matchesSearch = sprint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sprint.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sprint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const handleOpenDialog = (sprint?: Sprint) => {
    if (sprint) {
      setEditingSprint(sprint);
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
      setFormData({
        title: '',
        description: '',
        theme: '',
        status: 'draft',
        startDate: '',
        endDate: '',
        pillarId: '',
        contentsPlanned: 10,
      });
    }
    setIsDialogOpen(true);
  };
  
  const handleSave = () => {
    if (editingSprint) {
      updateSprint(editingSprint.id, formData);
    } else {
      const newSprint: Sprint = {
        id: `sprint-${Date.now()}`,
        ...formData,
        alignmentScore: 0,
        contentsPublished: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addSprint(newSprint);
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
  
  return (
    <MainLayout>
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
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingSprint ? 'Editar Sprint' : 'Novo Sprint'}
                </DialogTitle>
                <DialogDescription>
                  {editingSprint ? 'Atualize as informações do sprint' : 'Crie um novo ciclo de conteúdo'}
                </DialogDescription>
              </DialogHeader>
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
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  {editingSprint ? 'Salvar' : 'Criar Sprint'}
                </Button>
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
              {filteredSprints.map((sprint) => (
                <TableRow key={sprint.id} className="hover:bg-secondary/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{sprint.title}</div>
                      <div className="text-sm text-muted-foreground">{sprint.theme}</div>
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
                    <div className="w-32">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{sprint.contentsPublished}/{sprint.contentsPlanned}</span>
                      </div>
                      <Progress 
                        value={(sprint.contentsPublished / sprint.contentsPlanned) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{sprint.alignmentScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(sprint)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(sprint)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateSprint(sprint.id, { status: 'archived' })}>
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
              ))}
            </TableBody>
          </Table>
          
          {filteredSprints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum sprint encontrado</p>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
