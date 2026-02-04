import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  Target,
  ChevronRight,
} from 'lucide-react';

// Mock sprints data
const mockSprints = [
  {
    id: '1',
    name: 'Sprint Janeiro',
    theme: 'Planejamento de Carreira',
    status: 'active',
    progress: 65,
    startDate: '01/01/2024',
    endDate: '31/01/2024',
    contentCount: 12,
    completedCount: 8,
  },
  {
    id: '2',
    name: 'Sprint Fevereiro',
    theme: 'Product Discovery',
    status: 'planned',
    progress: 0,
    startDate: '01/02/2024',
    endDate: '29/02/2024',
    contentCount: 10,
    completedCount: 0,
  },
];

const mockUpcoming = [
  { date: 'Hoje', items: ['Post: 5 erros comuns em discovery', 'Story: Bastidores do meu dia'] },
  { date: 'Amanhã', items: ['Carrossel: Framework RICE', 'Live: Q&A sobre carreira'] },
  { date: 'Quarta', items: ['Artigo: Product-Led Growth na prática'] },
];

export default function Planejamento() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Planejamento
            </h1>
            <p className="text-muted-foreground mt-1">
              Organize seus sprints e calendário de conteúdo
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Sprint
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border bg-secondary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">2</p>
                  <p className="text-xs text-muted-foreground">Sprints ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-secondary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-xs text-muted-foreground">Publicados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-secondary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border bg-secondary">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">22</p>
                  <p className="text-xs text-muted-foreground">Total planejado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sprints Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Sprints</h2>
            {mockSprints.map((sprint) => (
              <Card
                key={sprint.id}
                className="border-border bg-secondary hover:border-zinc-700 transition-colors cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{sprint.name}</h3>
                        <Badge
                          variant="outline"
                          className={
                            sprint.status === 'active'
                              ? 'border-emerald-500/50 text-emerald-500'
                              : 'border-zinc-500/50 text-zinc-400'
                          }
                        >
                          {sprint.status === 'active' ? 'Ativo' : 'Planejado'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tema: {sprint.theme}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {sprint.completedCount}/{sprint.contentCount} conteúdos
                      </span>
                      <span className="text-foreground font-medium">{sprint.progress}%</span>
                    </div>
                    <Progress value={sprint.progress} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {sprint.startDate} - {sprint.endDate}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upcoming Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Próximos</h2>
            <Card className="border-border bg-secondary">
              <CardContent className="p-4 space-y-4">
                {mockUpcoming.map((day) => (
                  <div key={day.date} className="space-y-2">
                    <p className="text-sm font-medium text-foreground">{day.date}</p>
                    <div className="space-y-2">
                      {day.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground pl-3 border-l-2 border-zinc-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}