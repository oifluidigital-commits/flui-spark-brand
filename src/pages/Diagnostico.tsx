import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  CheckCircle,
  Clock,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

// Mock diagnostic data
const mockDiagnostic = {
  status: 'em_andamento' as const,
  progress: 75,
  completedSteps: 6,
  totalSteps: 8,
  lastUpdated: '2 horas atrás',
  sections: [
    { name: 'Perfil Profissional', status: 'completed', score: 92 },
    { name: 'Tom de Voz', status: 'completed', score: 85 },
    { name: 'Pilares de Conteúdo', status: 'completed', score: 88 },
    { name: 'Análise de Audiência', status: 'completed', score: 78 },
    { name: 'Padrões Estratégicos', status: 'completed', score: 90 },
    { name: 'Arquétipo de Marca', status: 'completed', score: 82 },
    { name: 'Análise Competitiva', status: 'in_progress', score: 45 },
    { name: 'Recomendações Finais', status: 'pending', score: 0 },
  ],
};

export default function Diagnostico() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              Diagnóstico
            </h1>
            <p className="text-muted-foreground mt-1">
              Análise completa do seu perfil e estratégia de conteúdo
            </p>
          </div>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar Diagnóstico
          </Button>
        </div>

        {/* Progress Card */}
        <Card className="border-border bg-secondary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Progresso do Diagnóstico</CardTitle>
                <CardDescription>
                  Última atualização: {mockDiagnostic.lastUpdated}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="border-amber-500/50 text-amber-500"
              >
                <Clock className="h-3 w-3 mr-1" />
                Em andamento
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {mockDiagnostic.completedSteps} de {mockDiagnostic.totalSteps} etapas concluídas
                </span>
                <span className="font-medium text-foreground">
                  {mockDiagnostic.progress}%
                </span>
              </div>
              <Progress value={mockDiagnostic.progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockDiagnostic.sections.map((section, index) => (
            <Card
              key={section.name}
              className="border-border bg-secondary hover:border-zinc-700 transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{section.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {section.status === 'completed' && (
                          <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Concluído
                          </Badge>
                        )}
                        {section.status === 'in_progress' && (
                          <Badge variant="outline" className="border-amber-500/50 text-amber-500 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Em progresso
                          </Badge>
                        )}
                        {section.status === 'pending' && (
                          <Badge variant="outline" className="text-muted-foreground text-xs">
                            Pendente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {section.status !== 'pending' && (
                    <div className="text-right">
                      <span className="text-2xl font-bold text-foreground">
                        {section.score}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        pontos
                      </span>
                    </div>
                  )}
                </div>
                {section.status !== 'pending' && (
                  <Progress value={section.score} className="h-1 mt-4" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Card */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Próximo Passo: Análise Competitiva
                </h3>
                <p className="text-muted-foreground mt-1">
                  Complete a análise para desbloquear recomendações personalizadas
                </p>
              </div>
              <Button className="gap-2">
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}