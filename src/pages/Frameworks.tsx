import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Plus,
  Search,
  Filter,
  BookOpen,
  Copy,
  ArrowRight,
} from 'lucide-react';
 import { useToast } from '@/hooks/use-toast';
import { Framework, FrameworkCategory } from '@/types';
import { getCategoryLabel } from '@/data/mockData';
import { cn } from '@/lib/utils';

const categoryColors: Record<FrameworkCategory, string> = {
  storytelling: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  educational: 'bg-success/10 text-success border-success/20',
  sales: 'bg-destructive/10 text-destructive border-destructive/20',
  engagement: 'bg-warning/10 text-warning border-warning/20',
  authority: 'bg-primary/10 text-primary border-primary/20',
  personal: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
};

export default function Frameworks() {
  const { frameworks, addFramework } = useApp();
   const { toast } = useToast();
   const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'educational' as FrameworkCategory,
    structure: '',
    example: '',
  });
  
  const filteredFrameworks = frameworks.filter((framework) => {
    const matchesSearch = framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      framework.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || framework.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  
  const handleCreateFramework = () => {
    const newFramework: Framework = {
      id: `framework-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      structure: formData.structure.split('\n').filter(Boolean),
      example: formData.example,
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    addFramework(newFramework);
    setIsCreateDialogOpen(false);
    setFormData({
      name: '',
      description: '',
      category: 'educational',
      structure: '',
      example: '',
    });
  };
  
  const handleCopyExample = (example: string) => {
    navigator.clipboard.writeText(example);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[28px] font-semibold leading-tight">Frameworks</h2>
            <p className="text-muted-foreground">
              Templates e estruturas para seus conteúdos
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Framework
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Framework</DialogTitle>
                <DialogDescription>
                  Crie um framework customizado para seu conteúdo
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nome do framework"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Breve descrição do framework"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as FrameworkCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="storytelling">Storytelling</SelectItem>
                      <SelectItem value="educational">Educacional</SelectItem>
                      <SelectItem value="sales">Vendas</SelectItem>
                      <SelectItem value="engagement">Engajamento</SelectItem>
                      <SelectItem value="authority">Autoridade</SelectItem>
                      <SelectItem value="personal">Pessoal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="structure">Estrutura (uma etapa por linha)</Label>
                  <Textarea
                    id="structure"
                    value={formData.structure}
                    onChange={(e) => setFormData({ ...formData, structure: e.target.value })}
                    placeholder="Etapa 1: Descrição&#10;Etapa 2: Descrição&#10;Etapa 3: Descrição"
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="example">Exemplo de uso</Label>
                  <Textarea
                    id="example"
                    value={formData.example}
                    onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                    placeholder="Um exemplo prático do framework..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateFramework}>
                  Criar Framework
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
              placeholder="Buscar frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              <SelectItem value="storytelling">Storytelling</SelectItem>
              <SelectItem value="educational">Educacional</SelectItem>
              <SelectItem value="sales">Vendas</SelectItem>
              <SelectItem value="engagement">Engajamento</SelectItem>
              <SelectItem value="authority">Autoridade</SelectItem>
              <SelectItem value="personal">Pessoal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Frameworks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFrameworks.map((framework) => (
            <Card
              key={framework.id}
              className="border-border hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => setSelectedFramework(framework)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{framework.name}</CardTitle>
                      <Badge variant="outline" className={cn('mt-1', categoryColors[framework.category])}>
                        {getCategoryLabel(framework.category)}
                      </Badge>
                    </div>
                  </div>
                  {framework.isCustom && (
                    <Badge variant="secondary" className="text-xs">
                      Customizado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {framework.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {framework.structure.length} etapas
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredFrameworks.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold leading-tight mb-2">Nenhum framework encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-md">Tente ajustar os filtros ou o termo de busca para encontrar o que procura.</p>
          </div>
        )}
        
        {/* Framework Detail Dialog */}
        <Dialog open={!!selectedFramework} onOpenChange={() => setSelectedFramework(null)}>
          {selectedFramework && (
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedFramework.name}</DialogTitle>
                    <Badge variant="outline" className={cn('mt-1', categoryColors[selectedFramework.category])}>
                      {getCategoryLabel(selectedFramework.category)}
                    </Badge>
                  </div>
                </div>
                <DialogDescription className="pt-2">
                  {selectedFramework.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                <div>
                  <h4 className="font-medium mb-3">Estrutura</h4>
                  <div className="space-y-2">
                    {selectedFramework.structure.map((step, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-secondary rounded-lg">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Exemplo</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyExample(selectedFramework.example)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg italic text-sm text-muted-foreground">
                    "{selectedFramework.example}"
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedFramework(null)}>
                  Fechar
                </Button>
                 <Button onClick={() => {
                   toast({
                     title: 'Framework copiado!',
                     description: 'Use-o ao criar seu próximo conteúdo.',
                   });
                   setSelectedFramework(null);
                   navigate('/content-lab/ideas');
                 }}>
                  Usar Framework
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </MainLayout>
  );
}
