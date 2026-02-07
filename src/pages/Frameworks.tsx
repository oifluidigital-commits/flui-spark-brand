import { useState } from 'react';
import { useFrameworksDB, type FrameworkDB } from '@/hooks/useFrameworksDB';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, BookOpen, Copy, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const categoryColors: Record<string, string> = {
  storytelling: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  educational: 'bg-success/10 text-success border-success/20',
  sales: 'bg-destructive/10 text-destructive border-destructive/20',
  engagement: 'bg-warning/10 text-warning border-warning/20',
  authority: 'bg-primary/10 text-primary border-primary/20',
  personal: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
};

const categoryLabels: Record<string, string> = {
  storytelling: 'Storytelling',
  educational: 'Educacional',
  sales: 'Vendas',
  engagement: 'Engajamento',
  authority: 'Autoridade',
  personal: 'Pessoal',
};

const funnelColors: Record<string, string> = {
  tofu: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
  mofu: 'bg-primary/10 text-primary border-primary/20',
  bofu: 'bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/20',
};

const funnelLabels: Record<string, string> = {
  tofu: 'ToFu',
  mofu: 'MoFu',
  bofu: 'BoFu',
};

export default function Frameworks() {
  const { frameworks, isLoading } = useFrameworksDB();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<FrameworkDB | null>(null);

  const filteredFrameworks = frameworks.filter((fw) => {
    const matchesSearch =
      fw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fw.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || fw.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleCopyExample = (example: string) => {
    navigator.clipboard.writeText(example);
    toast({ title: 'Exemplo copiado!' });
  };

  const MAX_VISIBLE_STEPS = 4;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-[28px] font-semibold leading-tight">Frameworks</h2>
          <p className="text-muted-foreground">Guias de estrutura para seus conteúdos</p>
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
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-[260px] rounded-2xl" />
            ))}
          </div>
        )}

        {/* Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFrameworks.map((fw) => {
              const funnel = fw.metadata?.recommendedFunnelStage;
              const steps = fw.structure || [];
              const visibleSteps = steps.slice(0, MAX_VISIBLE_STEPS);
              const remainingCount = steps.length - MAX_VISIBLE_STEPS;

              return (
                <Card
                  key={fw.id}
                  className="rounded-2xl border-border hover:border-primary/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedFramework(fw)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{fw.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      {fw.category && (
                        <Badge variant="outline" className={cn('rounded-full text-xs', categoryColors[fw.category])}>
                          {categoryLabels[fw.category] || fw.category}
                        </Badge>
                      )}
                      {funnel && (
                        <Badge variant="outline" className={cn('rounded-full text-xs', funnelColors[funnel])}>
                          {funnelLabels[funnel]}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {fw.description}
                    </p>
                    <div className="space-y-1">
                      {visibleSteps.map((step, i) => (
                        <p key={i} className="text-xs text-muted-foreground flex gap-2">
                          <span className="text-primary font-mono font-medium">{i + 1}.</span>
                          <span className="line-clamp-1">{step}</span>
                        </p>
                      ))}
                      {remainingCount > 0 && (
                        <p className="text-xs text-muted-foreground/60">+{remainingCount} mais</p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                      {steps.length} etapas
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredFrameworks.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold leading-tight mb-2">Nenhum framework encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Tente ajustar os filtros ou o termo de busca para encontrar o que procura.
            </p>
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={!!selectedFramework} onOpenChange={() => setSelectedFramework(null)}>
          {selectedFramework && (
            <DialogContent className="sm:max-w-[640px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedFramework.name}</DialogTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {selectedFramework.category && (
                        <Badge variant="outline" className={cn('rounded-full text-xs', categoryColors[selectedFramework.category])}>
                          {categoryLabels[selectedFramework.category] || selectedFramework.category}
                        </Badge>
                      )}
                      {selectedFramework.metadata?.recommendedFunnelStage && (
                        <Badge variant="outline" className={cn('rounded-full text-xs', funnelColors[selectedFramework.metadata.recommendedFunnelStage])}>
                          {funnelLabels[selectedFramework.metadata.recommendedFunnelStage]}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <DialogDescription className="pt-2">
                  {selectedFramework.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Primary Goal */}
                {selectedFramework.metadata?.primaryGoal && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Objetivo</h4>
                    <p className="text-sm text-muted-foreground">{selectedFramework.metadata.primaryGoal}</p>
                  </div>
                )}

                {/* Structure */}
                {selectedFramework.structure && selectedFramework.structure.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-sm">Estrutura</h4>
                    <div className="space-y-2">
                      {selectedFramework.structure.map((step, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-secondary rounded-lg">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-medium text-primary">{i + 1}</span>
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Best For */}
                {selectedFramework.metadata?.bestFor && selectedFramework.metadata.bestFor.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Melhor para</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFramework.metadata.bestFor.map((item, i) => (
                        <Badge key={i} variant="outline" className="rounded-full text-xs bg-primary/5 text-primary border-primary/20">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Avoid When */}
                {selectedFramework.metadata?.avoidWhen && selectedFramework.metadata.avoidWhen.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Evitar quando</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFramework.metadata.avoidWhen.map((item, i) => (
                        <Badge key={i} variant="outline" className="rounded-full text-xs bg-destructive/5 text-destructive border-destructive/20">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Example */}
                {selectedFramework.example && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Exemplo</h4>
                      <Button variant="ghost" size="sm" onClick={() => handleCopyExample(selectedFramework.example!)}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copiar
                      </Button>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg italic text-sm text-muted-foreground">
                      "{selectedFramework.example}"
                    </div>
                  </div>
                )}

                {/* Guidelines */}
                {(selectedFramework.metadata?.toneGuidelines || selectedFramework.metadata?.lengthGuidelines || selectedFramework.metadata?.ctaGuidelines) && (
                  <div>
                    <h4 className="font-medium mb-3 text-sm">Diretrizes</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {selectedFramework.metadata.toneGuidelines && (
                        <p><span className="font-medium text-foreground">Tom:</span> {selectedFramework.metadata.toneGuidelines}</p>
                      )}
                      {selectedFramework.metadata.lengthGuidelines && (
                        <p><span className="font-medium text-foreground">Tamanho:</span> {selectedFramework.metadata.lengthGuidelines}</p>
                      )}
                      {selectedFramework.metadata.ctaGuidelines && (
                        <p><span className="font-medium text-foreground">CTA:</span> {selectedFramework.metadata.ctaGuidelines}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedFramework(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </MainLayout>
  );
}
