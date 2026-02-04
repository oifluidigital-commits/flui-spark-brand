import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  ArrowUpRight,
} from 'lucide-react';

// Mock insights data
const mockInsights = {
  overview: {
    impressions: { value: '24.5K', change: +12, trend: 'up' },
    engagement: { value: '8.2%', change: +3.5, trend: 'up' },
    followers: { value: '+342', change: +15, trend: 'up' },
    posts: { value: '18', change: -2, trend: 'down' },
  },
  topContent: [
    { title: '5 lições que aprendi como PM', impressions: 4200, engagement: 12.5, format: 'Carrossel' },
    { title: 'Por que Product Discovery importa', impressions: 3800, engagement: 9.8, format: 'Post' },
    { title: 'Minha transição para tech', impressions: 3100, engagement: 11.2, format: 'Story' },
  ],
  pillarPerformance: [
    { name: 'Gestão de Produto', posts: 8, avgEngagement: 9.5 },
    { name: 'Carreira', posts: 5, avgEngagement: 11.2 },
    { name: 'Liderança', posts: 3, avgEngagement: 7.8 },
    { name: 'Bastidores', posts: 2, avgEngagement: 14.5 },
  ],
  recommendations: [
    'Aumente a frequência de posts sobre Carreira - alto engajamento',
    'Experimente mais conteúdos de Bastidores - sua audiência adora autenticidade',
    'Considere fazer lives semanais para aumentar conexão',
  ],
};

export default function Insights() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart className="h-6 w-6 text-primary" />
              Insights
            </h1>
            <p className="text-muted-foreground mt-1">
              Análise de performance e recomendações
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="py-1.5 px-3">
              <Calendar className="h-3 w-3 mr-1.5" />
              Últimos 30 dias
            </Badge>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Impressões', icon: Eye, ...mockInsights.overview.impressions },
            { label: 'Engajamento', icon: Heart, ...mockInsights.overview.engagement },
            { label: 'Novos Seguidores', icon: TrendingUp, ...mockInsights.overview.followers },
            { label: 'Posts', icon: MessageCircle, ...mockInsights.overview.posts },
          ].map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
            
            return (
              <Card key={stat.label} className="border-border bg-secondary">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      <TrendIcon className="h-3 w-3" />
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Content */}
          <Card className="border-border bg-secondary">
            <CardHeader>
              <CardTitle className="text-lg">Top Conteúdos</CardTitle>
              <CardDescription>Melhores performers do período</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockInsights.topContent.map((content, index) => (
                <div
                  key={content.title}
                  className="flex items-center gap-4 p-3 rounded-lg bg-background/50"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{content.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        <Eye className="inline h-3 w-3 mr-1" />
                        {content.impressions.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        <Heart className="inline h-3 w-3 mr-1" />
                        {content.engagement}%
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {content.format}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pillar Performance */}
          <Card className="border-border bg-secondary">
            <CardHeader>
              <CardTitle className="text-lg">Performance por Pilar</CardTitle>
              <CardDescription>Engajamento médio por tema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockInsights.pillarPerformance.map((pillar) => (
                <div key={pillar.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{pillar.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {pillar.posts} posts
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {pillar.avgEngagement}%
                      </span>
                    </div>
                  </div>
                  <Progress value={pillar.avgEngagement * 6} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recomendações da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockInsights.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <ArrowUpRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm text-foreground">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}