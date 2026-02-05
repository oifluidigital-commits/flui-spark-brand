import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  TrendingUp,
  ExternalLink,
  Zap,
  Clock,
   Lightbulb,
} from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
import { TrendRelevance } from '@/types';
import { formatDatePTBR } from '@/data/mockData';
import { cn } from '@/lib/utils';
 import { useGate } from '@/hooks/useGate';
 import { UpgradePrompt } from '@/components/gates/UpgradePrompt';

const relevanceColors: Record<TrendRelevance, string> = {
  high: 'bg-destructive text-destructive-foreground',
  medium: 'bg-warning text-warning-foreground',
  low: 'bg-secondary text-secondary-foreground',
};

const relevanceLabels: Record<TrendRelevance, string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa',
};

export default function Radar() {
  const { trends } = useApp();
   const navigate = useNavigate();
   const radarGate = useGate('access-radar');
  const [searchQuery, setSearchQuery] = useState('');
  const [relevanceFilter, setRelevanceFilter] = useState<string>('all');
  
   // If user doesn't have access to Radar, show upgrade prompt
   if (!radarGate.allowed) {
     return (
       <MainLayout>
         <div className="space-y-6">
           <div>
             <h2 className="text-2xl font-bold">Radar</h2>
             <p className="text-muted-foreground">
               Tendências e oportunidades de conteúdo
             </p>
           </div>
           
           <div className="max-w-md mx-auto mt-12">
             <UpgradePrompt
               reason={radarGate.reason}
               requiredPlan="pro"
               variant="card"
             />
           </div>
         </div>
       </MainLayout>
     );
   }
 
  const filteredTrends = trends.filter((trend) => {
    const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trend.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRelevance = relevanceFilter === 'all' || trend.relevance === relevanceFilter;
    return matchesSearch && matchesRelevance;
  });
  
  const sortedTrends = [...filteredTrends].sort((a, b) => {
    const order: Record<TrendRelevance, number> = { high: 0, medium: 1, low: 2 };
    return order[a.relevance] - order[b.relevance];
  });
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Radar</h2>
            <p className="text-muted-foreground">
              Tendências e oportunidades de conteúdo
            </p>
          </div>
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Atualizar Radar
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-destructive">
                    {trends.filter((t) => t.relevance === 'high').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Alta Relevância</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {trends.filter((t) => t.relevance === 'medium').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Média Relevância</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{trends.length}</div>
                  <div className="text-sm text-muted-foreground">Total de Tendências</div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tendências..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={relevanceFilter} onValueChange={setRelevanceFilter}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Relevância" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Trends List */}
        <div className="space-y-4">
          {sortedTrends.map((trend) => (
            <Card
              key={trend.id}
              className={cn(
                'border-border hover:border-primary/30 transition-colors',
                trend.relevance === 'high' && 'border-l-4 border-l-destructive'
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{trend.title}</CardTitle>
                      <Badge className={relevanceColors[trend.relevance]}>
                        {relevanceLabels[trend.relevance]}
                      </Badge>
                      <Badge variant="outline">{trend.category}</Badge>
                    </div>
                    <CardDescription>{trend.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Ações Sugeridas</h4>
                    <div className="flex flex-wrap gap-2">
                      {trend.suggestedActions.map((action, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-sm"
                        >
                          <Zap className="h-3 w-3 text-primary" />
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <span>Fonte: {trend.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>Descoberto em {formatDatePTBR(trend.discoveredAt)}</span>
                    </div>
                  </div>

                     {/* Create Idea CTA */}
                     <div className="pt-4 border-t border-border mt-4">
                       <Button
                         size="sm"
                         variant="outline"
                         className="gap-2"
                         onClick={() => navigate(`/content-lab/ideas?trend=${trend.id}`)}
                       >
                         <Lightbulb className="h-4 w-4" />
                         Criar Ideia com esta Tendência
                       </Button>
                     </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {sortedTrends.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma tendência encontrada</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
