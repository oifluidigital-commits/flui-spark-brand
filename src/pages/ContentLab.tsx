import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Lightbulb, BookOpen, Radar, ArrowRight, TrendingUp } from 'lucide-react';

export default function ContentLab() {
  const navigate = useNavigate();
  const { sprints, ideas, frameworks, trends } = useApp();
  
  const activeSprints = sprints.filter((s) => s.status === 'active').length;
  const pendingIdeas = ideas.filter((i) => i.status !== 'published' && i.status !== 'archived').length;
  const highRelevanceTrends = trends.filter((t) => t.relevance === 'high').length;
  
  const sections = [
    {
      title: 'Sprints',
      description: 'Organize conteúdo em ciclos focados',
      icon: Zap,
      path: '/content-lab/sprints',
      color: 'text-success',
      bgColor: 'bg-success/10',
      stats: [
        { label: 'Ativos', value: activeSprints },
        { label: 'Total', value: sprints.length },
      ],
    },
    {
      title: 'Ideias',
      description: 'Banco de ideias de conteúdo',
      icon: Lightbulb,
      path: '/content-lab/ideas',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      stats: [
        { label: 'Pendentes', value: pendingIdeas },
        { label: 'Total', value: ideas.length },
      ],
    },
    {
      title: 'Frameworks',
      description: 'Templates e estruturas prontas',
      icon: BookOpen,
      path: '/content-lab/frameworks',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      stats: [
        { label: 'Disponíveis', value: frameworks.length },
        { label: 'Customizados', value: frameworks.filter((f) => f.isCustom).length },
      ],
    },
    {
      title: 'Radar',
      description: 'Tendências e oportunidades',
      icon: Radar,
      path: '/content-lab/radar',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      stats: [
        { label: 'Alta Relevância', value: highRelevanceTrends },
        { label: 'Total', value: trends.length },
      ],
    },
  ];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Content Lab</h2>
          <p className="text-muted-foreground">
            Seu laboratório de criação de conteúdo estratégico
          </p>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeSprints}</div>
                  <div className="text-xs text-muted-foreground">Sprints Ativos</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{pendingIdeas}</div>
                  <div className="text-xs text-muted-foreground">Ideias Pendentes</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{frameworks.length}</div>
                  <div className="text-xs text-muted-foreground">Frameworks</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{highRelevanceTrends}</div>
                  <div className="text-xs text-muted-foreground">Tendências Hot</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Card
              key={section.path}
              className="border-border hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => navigate(section.path)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-lg ${section.bgColor} flex items-center justify-center`}>
                      <section.icon className={`h-6 w-6 ${section.color}`} />
                    </div>
                    <div>
                      <CardTitle>{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {section.stats.map((stat, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-mono">
                        {stat.value}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
