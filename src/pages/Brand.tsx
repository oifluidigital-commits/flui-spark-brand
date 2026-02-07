import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette,
  Type,
  MessageSquare,
  Target,
  LayoutGrid,
  Users,
  FileText,
  Upload,
  Plus,
  Pencil,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function Brand() {
  const navigate = useNavigate();
  const { brand, user, isAuthLoading } = useApp();
  const [activeTab, setActiveTab] = useState('identity');

  // Skeleton loading
  if (isAuthLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Empty state: no brand derived yet
  if (!brand) {
    const needsDiagnostic = user.onboardingStatus !== 'completed';
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Palette className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Hub da Marca</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {needsDiagnostic
              ? 'Complete seu diagnóstico estratégico para gerar automaticamente o perfil da sua marca, incluindo tom de voz, posicionamento e pilares de conteúdo.'
              : 'Gere sua estratégia editorial para desbloquear o Hub da Marca. Ele será preenchido automaticamente com base nos seus resultados.'}
          </p>
          <Button onClick={() => navigate(needsDiagnostic ? '/onboarding' : '/strategy')}>
            <Sparkles className="h-4 w-4 mr-2" />
            {needsDiagnostic ? 'Completar diagnóstico' : 'Gerar estratégia'}
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[28px] font-semibold leading-tight">Hub da Marca</h2>
            <p className="text-muted-foreground">
              Gerencie todos os aspectos da sua identidade de marca
            </p>
          </div>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Exportar Guidelines
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="identity">
              <Palette className="h-4 w-4 mr-2" />
              Identidade
            </TabsTrigger>
            <TabsTrigger value="voice">
              <MessageSquare className="h-4 w-4 mr-2" />
              Voz & Tom
            </TabsTrigger>
            <TabsTrigger value="positioning">
              <Target className="h-4 w-4 mr-2" />
              Posicionamento
            </TabsTrigger>
            <TabsTrigger value="pillars">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Pilares
            </TabsTrigger>
            <TabsTrigger value="competitors">
              <Users className="h-4 w-4 mr-2" />
              Concorrentes
            </TabsTrigger>
            <TabsTrigger value="guidelines">
              <FileText className="h-4 w-4 mr-2" />
              Diretrizes
            </TabsTrigger>
          </TabsList>
          
          {/* Identity Tab */}
          <TabsContent value="identity" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Logo</CardTitle>
                  <CardDescription>Logo principal da marca</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">PNG, SVG até 2MB</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-border hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Cores da Marca</CardTitle>
                  <CardDescription>Paleta de cores principal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(brand.colors).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-lg border border-border"
                          style={{ backgroundColor: value }}
                        />
                        <div>
                          <div className="font-medium capitalize">{key}</div>
                          <div className="text-xs text-muted-foreground">{value}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Cor
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-border hover:border-primary/30 transition-colors md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Tipografia
                  </CardTitle>
                  <CardDescription>Fontes utilizadas na marca</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Fonte de Títulos</Label>
                      <div className="p-4 bg-secondary rounded-lg">
                        <div className="text-2xl font-bold" style={{ fontFamily: brand.typography.headingFont }}>
                          {brand.typography.headingFont}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Fonte de Corpo</Label>
                      <div className="p-4 bg-secondary rounded-lg">
                        <div className="text-2xl" style={{ fontFamily: brand.typography.bodyFont }}>
                          {brand.typography.bodyFont}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Voice Tab */}
          <TabsContent value="voice" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Tom de Voz</CardTitle>
                  <CardDescription>Como sua marca se comunica</CardDescription>
                </CardHeader>
                <CardContent>
                  {brand.voice.tone.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {brand.voice.tone.map((tone) => (
                        <Badge key={tone} variant="default" className="bg-primary">
                          {tone}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Derivado da sua estratégia editorial.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-border hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Personalidade</CardTitle>
                  <CardDescription>Atributos da marca</CardDescription>
                </CardHeader>
                <CardContent>
                  {brand.voice.personality.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {brand.voice.personality.map((trait) => (
                        <Badge key={trait} variant="outline">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Derivado da sua estratégia editorial.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-border hover:border-primary/30 transition-colors md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Exemplos de Tom</CardTitle>
                  <CardDescription>Frases que representam sua voz</CardDescription>
                </CardHeader>
                <CardContent>
                  {brand.voice.examples.length > 0 ? (
                    <div className="space-y-3">
                      {brand.voice.examples.map((example, index) => (
                        <div key={index} className="p-4 bg-secondary rounded-lg italic">
                          "{example}"
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-muted-foreground mb-3">Nenhum exemplo adicionado ainda.</p>
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Exemplo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Positioning Tab */}
          <TabsContent value="positioning" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-border hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Proposta de Valor</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={brand.positioning.valueProposition}
                    className="min-h-[100px]"
                    readOnly
                  />
                </CardContent>
              </Card>
              
              <Card className="border-border hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Diferenciais</CardTitle>
                </CardHeader>
                <CardContent>
                  {brand.positioning.differentiators.length > 0 ? (
                    <div className="space-y-2">
                      {brand.positioning.differentiators.map((diff, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                            {index + 1}
                          </div>
                          <span>{diff}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nenhum diferencial definido ainda.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="border-border hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Público-Alvo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {brand.positioning.targetAudience || 'Definido a partir da sua estratégia editorial.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Pillars Tab */}
          <TabsContent value="pillars" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brand.pillars.map((pillar) => (
                <Card key={pillar.id} className="border-border hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: pillar.color }}
                        />
                        {pillar.name}
                      </CardTitle>
                      <Badge variant="outline">{pillar.percentage}%</Badge>
                    </div>
                    <CardDescription>{pillar.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={pillar.percentage} className="h-2" />
                  </CardContent>
                </Card>
              ))}
              
              {brand.pillars.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <LayoutGrid className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Pilares serão derivados da sua estratégia.</p>
                </div>
              )}

              <Card className="border-border border-dashed hover:border-primary/30 transition-colors">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Adicionar Pilar</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Competitors Tab */}
          <TabsContent value="competitors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brand.competitors.map((competitor) => (
                <Card key={competitor.id} className="border-border hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{competitor.name}</CardTitle>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription>{competitor.website}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-success">Pontos Fortes</Label>
                      <ul className="mt-2 space-y-1">
                        {competitor.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Label className="text-destructive">Pontos Fracos</Label>
                      <ul className="mt-2 space-y-1">
                        {competitor.weaknesses.map((w, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {brand.competitors.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Nenhum concorrente mapeado ainda.</p>
                </div>
              )}
              
              <Card className="border-border border-dashed hover:border-primary/30 transition-colors">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Adicionar Concorrente</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Guidelines Tab */}
          <TabsContent value="guidelines" className="space-y-6">
            <Card className="border-border hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg">Diretrizes da Marca</CardTitle>
                <CardDescription>
                  Documento consolidado com todas as guidelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-8 bg-secondary rounded-lg text-center">
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">Brand Guidelines PDF</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Gere um documento completo com todas as diretrizes da sua marca
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      Gerar PDF
                    </Button>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Manual
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
