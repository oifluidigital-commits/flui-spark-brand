import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Target,
  Users,
  Compass,
  Sparkles,
  Edit,
  ChevronRight,
} from 'lucide-react';

// Mock strategy data
const mockStrategy = {
  positioning: {
    title: 'Especialista em Product Management',
    description: 'Profissional experiente que traduz complexidade em insights práticos para PMs em ascensão.',
    strengths: ['Experiência hands-on', 'Visão estratégica', 'Comunicação clara'],
  },
  audience: {
    primary: 'Product Managers Júnior/Pleno',
    characteristics: ['2-5 anos de experiência', 'Buscam crescimento', 'Ativos no LinkedIn'],
    size: '~50k potenciais seguidores',
  },
  pillars: [
    { name: 'Gestão de Produto', percentage: 40, color: 'bg-primary' },
    { name: 'Carreira em Tech', percentage: 30, color: 'bg-emerald-500' },
    { name: 'Liderança', percentage: 20, color: 'bg-amber-500' },
    { name: 'Bastidores', percentage: 10, color: 'bg-zinc-500' },
  ],
  archetype: {
    name: 'O Sábio',
    description: 'Você busca entender e compartilhar conhecimento profundo.',
    traits: ['Analítico', 'Mentor natural', 'Credível'],
  },
};

export default function Estrategia() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Estratégia
            </h1>
            <p className="text-muted-foreground mt-1">
              Seu posicionamento e direcionamento estratégico
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Editar Estratégia
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Positioning Card */}
          <Card className="border-border bg-secondary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Compass className="h-5 w-5 text-primary" />
                  Posicionamento
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {mockStrategy.positioning.title}
                </h3>
                <p className="text-muted-foreground mt-2">
                  {mockStrategy.positioning.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockStrategy.positioning.strengths.map((strength) => (
                  <Badge key={strength} variant="secondary">
                    {strength}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audience Card */}
          <Card className="border-border bg-secondary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Audiência Alvo
                </CardTitle>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  {mockStrategy.audience.primary}
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {mockStrategy.audience.size}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockStrategy.audience.characteristics.map((char) => (
                  <Badge key={char} variant="outline">
                    {char}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Pillars Card */}
          <Card className="border-border bg-secondary">
            <CardHeader>
              <CardTitle className="text-lg">Pilares de Conteúdo</CardTitle>
              <CardDescription>
                Distribuição estratégica dos seus temas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockStrategy.pillars.map((pillar) => (
                <div key={pillar.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{pillar.name}</span>
                    <span className="text-muted-foreground">{pillar.percentage}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2">
                    <div
                      className={`${pillar.color} h-2 rounded-full transition-all`}
                      style={{ width: `${pillar.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Archetype Card */}
          <Card className="border-border bg-secondary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Arquétipo de Marca
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {mockStrategy.archetype.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {mockStrategy.archetype.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockStrategy.archetype.traits.map((trait) => (
                  <Badge key={trait} variant="secondary" className="bg-primary/10 text-primary">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}