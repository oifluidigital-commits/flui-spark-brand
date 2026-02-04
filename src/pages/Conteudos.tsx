import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Plus,
  Filter,
  Search,
  Lightbulb,
  BookOpen,
  MoreHorizontal,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock content data
const mockContent = {
  ideas: [
    { id: '1', title: '5 erros comuns em Product Discovery', status: 'draft', format: 'Post', pillar: 'Gestão de Produto' },
    { id: '2', title: 'Como fazer transição para PM', status: 'scheduled', format: 'Carrossel', pillar: 'Carreira' },
    { id: '3', title: 'Framework RICE na prática', status: 'published', format: 'Artigo', pillar: 'Gestão de Produto' },
    { id: '4', title: 'Minha rotina como Head de Produto', status: 'draft', format: 'Story', pillar: 'Bastidores' },
  ],
  frameworks: [
    { id: '1', name: 'AIDA', category: 'Copywriting', uses: 12 },
    { id: '2', name: 'PAS', category: 'Storytelling', uses: 8 },
    { id: '3', name: 'Hero Story', category: 'Narrativa', uses: 5 },
  ],
};

const statusConfig: Record<string, { label: string; className: string }> = {
  draft: { label: 'Rascunho', className: 'border-zinc-500/50 text-zinc-400' },
  scheduled: { label: 'Agendado', className: 'border-amber-500/50 text-amber-500' },
  published: { label: 'Publicado', className: 'border-emerald-500/50 text-emerald-500' },
};

export default function Conteudos() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Conteúdos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas ideias, rascunhos e publicações
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Ideia
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="ideas" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="bg-secondary">
              <TabsTrigger value="ideas" className="gap-2">
                <Lightbulb className="h-4 w-4" />
                Ideias
              </TabsTrigger>
              <TabsTrigger value="frameworks" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Frameworks
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9 bg-secondary border-border w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockContent.ideas.map((idea) => (
                <Card
                  key={idea.id}
                  className="border-border bg-secondary hover:border-zinc-700 transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground line-clamp-2">
                          {idea.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="outline"
                            className={statusConfig[idea.status].className}
                          >
                            {statusConfig[idea.status].label}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {idea.format}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Pilar: {idea.pillar}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty state hint */}
            <Card className="border-dashed border-zinc-700 bg-transparent">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <Lightbulb className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  Clique em "Nova Ideia" para começar a planejar seu próximo conteúdo
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Frameworks Tab */}
          <TabsContent value="frameworks" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockContent.frameworks.map((framework) => (
                <Card
                  key={framework.id}
                  className="border-border bg-secondary hover:border-zinc-700 transition-colors cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{framework.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {framework.uses} usos
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{framework.category}</p>
                  </CardContent>
                </Card>
              ))}

              {/* Add Framework Card */}
              <Card className="border-dashed border-zinc-700 bg-transparent hover:border-zinc-600 transition-colors cursor-pointer">
                <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[100px]">
                  <Plus className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Novo Framework</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}