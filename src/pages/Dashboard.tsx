import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Lightbulb,
  Zap,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  LayoutDashboard,
  AlertCircle,
} from 'lucide-react';
import { getStatusLabel, formatDatePTBR } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, sprints, ideas } = useApp();
  
  const activeSprint = sprints.find((s) => s.status === 'active');
  const pendingIdeas = ideas.filter((i) => i.status === 'review' || i.status === 'in_progress');
  const publishedCount = ideas.filter((i) => i.status === 'published').length;
  const consistencyRate = Math.round((publishedCount / (ideas.length || 1)) * 100);
  
  const suggestedIdeas = [
    { title: 'Thread sobre produtividade remota', format: 'Thread', pillar: 'Autoridade' },
    { title: 'Bastidores do meu processo criativo', format: 'Carrossel', pillar: 'Conexão' },
    { title: 'Como evitar burnout sendo creator', format: 'Vídeo', pillar: 'Educacional' },
  ];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-20 flex items-center justify-start gap-4 px-6 hover:border-primary/50 transition-colors"
            onClick={() => navigate('/content-lab/ideas')}
          >
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div className="text-left">
              <div className="font-medium">Criar Ideia</div>
              <div className="text-xs text-muted-foreground">Nova ideia de conteúdo</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex items-center justify-start gap-4 px-6 hover:border-primary/50 transition-colors"
            onClick={() => navigate('/content-lab/sprints')}
          >
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-success" />
            </div>
            <div className="text-left">
              <div className="font-medium">Iniciar Sprint</div>
              <div className="text-xs text-muted-foreground">Novo ciclo de conteúdo</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex items-center justify-start gap-4 px-6 hover:border-primary/50 transition-colors"
            onClick={() => navigate('/content-lab/frameworks')}
          >
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-warning" />
            </div>
            <div className="text-left">
              <div className="font-medium">Frameworks</div>
              <div className="text-xs text-muted-foreground">Templates de conteúdo</div>
            </div>
          </Button>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks & Sprint */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Sprint */}
            {activeSprint ? (
              <Card className="border-border hover:border-primary/30 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{activeSprint.title}</CardTitle>
                      <Badge variant="default" className="bg-success text-success-foreground">
                        {getStatusLabel(activeSprint.status)}
                      </Badge>
                    </div>
                    <CardDescription>{activeSprint.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/content-lab/sprints')}>
                    Ver Sprint <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Score de Alinhamento</span>
                      <span className="font-medium">{activeSprint.alignmentScore}%</span>
                    </div>
                    <Progress value={activeSprint.alignmentScore} className="h-2" />
                    
                    <div className="flex gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {activeSprint.contentsPublished}/{activeSprint.contentsPlanned} publicados
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          Até {formatDatePTBR(activeSprint.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Nenhum sprint ativo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Inicie um novo sprint para organizar seu conteúdo
                  </p>
                  <Button onClick={() => navigate('/content-lab/sprints')}>
                    Criar Sprint
                  </Button>
                </CardContent>
              </Card>
            )}
            
            {/* Pending Tasks */}
            <Card className="border-border hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  Tarefas Pendentes
                </CardTitle>
                <CardDescription>
                  Conteúdos aguardando sua ação
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingIdeas.length > 0 ? (
                  <div className="space-y-3">
                    {pendingIdeas.slice(0, 4).map((idea) => (
                      <div
                        key={idea.id}
                        className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-secondary/80 cursor-pointer transition-colors"
                        onClick={() => navigate('/content-lab/ideas')}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'h-2 w-2 rounded-full',
                              idea.status === 'review' && 'bg-warning',
                              idea.status === 'in_progress' && 'bg-primary'
                            )}
                          />
                          <div>
                            <div className="font-medium text-sm">{idea.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {idea.dueDate && `Até ${formatDatePTBR(idea.dueDate)}`}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {getStatusLabel(idea.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-success" />
                    <p>Nenhuma tarefa pendente!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Stats & Suggestions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="border-border hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm">Créditos Restantes</span>
                  </div>
                  <span className="font-medium">
                    {(user.aiCredits.total - user.aiCredits.used).toLocaleString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span className="text-sm">Publicados</span>
                  </div>
                  <span className="font-medium">{publishedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-warning" />
                    <span className="text-sm">Taxa de Consistência</span>
                  </div>
                  <span className="font-medium">{consistencyRate}%</span>
                </div>
              </CardContent>
            </Card>
            
            {/* AI Suggestions */}
            <Card className="border-border hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Sugestões da IA
                </CardTitle>
                <CardDescription>
                  Ideias geradas baseadas no seu perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suggestedIdeas.map((idea, index) => (
                    <div
                      key={index}
                      className="p-3 bg-secondary rounded-lg hover:bg-secondary/80 cursor-pointer transition-colors"
                      onClick={() => navigate('/content-lab/ideas')}
                    >
                      <div className="font-medium text-sm mb-1">{idea.title}</div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {idea.format}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {idea.pillar}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
