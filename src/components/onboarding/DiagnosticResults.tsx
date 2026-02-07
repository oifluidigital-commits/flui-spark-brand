import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DiagnosticResult } from '@/data/onboardingData';
import {
  User,
  Target,
  Users,
  Crown,
  MessageSquare,
  Layers,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';

interface DiagnosticResultsProps {
  result: DiagnosticResult;
  onComplete: (redirectTo?: string) => void;
}

export default function DiagnosticResults({ result, onComplete }: DiagnosticResultsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Diagnóstico Completo</span>
        </div>
        <h2 className="text-[28px] font-semibold leading-tight text-foreground mb-2">
          Seu Perfil Estratégico
        </h2>
        <p className="text-muted-foreground">
          Analisamos suas respostas e criamos um diagnóstico personalizado
        </p>
      </div>

      {/* Profile Analysis */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{result.profileAnalysis.title}</CardTitle>
            <CardDescription>{result.profileAnalysis.summary}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Pontos Fortes</p>
              <ul className="space-y-1">
                {result.profileAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <Check className="h-3 w-3 text-success" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Oportunidades</p>
              <ul className="space-y-1">
                {result.profileAnalysis.opportunities.map((opp, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-primary" />
                    {opp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Patterns */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{result.strategicPatterns.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.strategicPatterns.patterns.map((pattern, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{pattern.name}</span>
                <span className="text-sm text-primary">{pattern.match}%</span>
              </div>
              <Progress value={pattern.match} className="h-2" />
              <p className="text-xs text-muted-foreground">{pattern.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Two column layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Persona Map */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">{result.personaMap.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="mb-3 bg-primary">{result.personaMap.primaryPersona}</Badge>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Características</p>
                <div className="flex flex-wrap gap-1">
                  {result.personaMap.characteristics.map((char, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Preferências de Conteúdo</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {result.personaMap.contentPreferences.map((pref, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-success" />
                      {pref}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Archetype */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">{result.brandArchetype.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="mb-3 bg-warning text-warning-foreground">
              {result.brandArchetype.archetype}
            </Badge>
            <p className="text-sm text-muted-foreground mb-4">
              {result.brandArchetype.description}
            </p>
            <div className="flex flex-wrap gap-1">
              {result.brandArchetype.traits.map((trait, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {trait}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tone Calibration */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{result.toneCalibration.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {result.toneCalibration.dimensions.map((dim, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dim.name}</span>
                  <span className="text-xs text-muted-foreground">{dim.description}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/60"
                    style={{ width: `${dim.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Pillars */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{result.contentPillars.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {result.contentPillars.pillars.map((pillar, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-secondary/30"
                style={{ borderLeftColor: pillar.color, borderLeftWidth: '3px' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{pillar.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {pillar.percentage}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA - #9: Both buttons call onComplete */}
      <div className="pt-6">
        <Button onClick={() => onComplete('/strategy')} className="w-full" size="lg">
          <Sparkles className="h-4 w-4 mr-2" />
          Ver minha Estratégia Editorial
        </Button>
        <Button variant="outline" onClick={() => onComplete()} className="w-full mt-3" size="lg">
          Ir para o Dashboard
        </Button>
        <p className="text-center text-xs text-muted-foreground mt-3">
          Você poderá ajustar esses dados a qualquer momento nas configurações
        </p>
      </div>
    </div>
  );
}
