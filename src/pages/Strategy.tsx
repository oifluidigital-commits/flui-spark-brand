 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { useApp } from '@/contexts/AppContext';
 import { MainLayout } from '@/components/layout/MainLayout';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 import { Progress } from '@/components/ui/progress';
 import { StrategyLoadingState } from '@/components/strategy/StrategyLoadingState';
 import { StrategyBlockedState } from '@/components/strategy/StrategyBlockedState';
 import type { Strategy } from '@/data/strategyData';
  import { useStrategy } from '@/hooks/useStrategy';
  import { toast } from 'sonner';
 import {
   ChevronRight,
   Users,
   Target,
   Sparkles,
   MessageCircle,
   ArrowRight,
   Calendar,
   Layers,
   MousePointer,
   Flag,
   LayoutGrid,
   MessageSquare,
   Lightbulb,
   Video,
   FileText,
   CheckCircle2,
   Palette,
    RefreshCw,
 } from 'lucide-react';
 
 // Icon mapping for content types
 const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
   LayoutGrid,
   MessageSquare,
   Lightbulb,
   Video,
   FileText,
 };
 
export default function Strategy() {
    const navigate = useNavigate();
    const { user, setStrategy: setCachedStrategy } = useApp();
    const { generateStrategy, loadActiveStrategy, loadLatestDiagnosticResult, isLoading: isGenerating, error } = useStrategy();
    const [strategy, setLocalStrategy] = useState<Strategy | null>(null);
    const [hasError, setHasError] = useState(false);
    const [isLoadingFromDB, setIsLoadingFromDB] = useState(true);

    // Check if diagnostic is completed (onboarding completed = diagnostic done)
    const diagnosticCompleted = user.onboardingStatus === 'completed';

    // Load strategy from DB on mount
    useEffect(() => {
      if (!diagnosticCompleted) {
        setIsLoadingFromDB(false);
        return;
      }

      const load = async () => {
        setIsLoadingFromDB(true);
        try {
          // Try loading existing strategy from DB
          const existing = await loadActiveStrategy();
          if (existing) {
            setLocalStrategy(existing);
            setCachedStrategy(existing);
            return;
          }

          // No strategy in DB — load diagnostic and generate
          const diagResult = await loadLatestDiagnosticResult();
          if (diagResult) {
            const result = await generateStrategy(diagResult);
            if (result) {
              setLocalStrategy(result);
              setCachedStrategy(result);
            } else {
              setHasError(true);
            }
          } else {
            setHasError(true);
          }
        } catch (err) {
          console.error('Error loading strategy:', err);
          setHasError(true);
        } finally {
          setIsLoadingFromDB(false);
        }
      };

      load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [diagnosticCompleted]);

    const handleRetry = async () => {
      setHasError(false);
      const diagResult = await loadLatestDiagnosticResult();
      if (!diagResult) {
        toast.error('Diagnóstico não encontrado. Complete o onboarding primeiro.');
        setHasError(true);
        return;
      }
      
      const result = await generateStrategy(diagResult);
      if (result) {
        setLocalStrategy(result);
        setCachedStrategy(result);
      } else {
        setHasError(true);
      }
    };
 
   // Show blocked state if diagnostic not completed
   if (!diagnosticCompleted) {
     return <StrategyBlockedState />;
   }
 
    // Show loading state while generating or loading from DB
    if (isLoadingFromDB || isGenerating || (!strategy && !hasError)) {
     return <StrategyLoadingState />;
   }
 
   // Show error state with retry option
   if (hasError || !strategy) {
     return (
       <MainLayout>
         <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
           <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
             <RefreshCw className="h-10 w-10 text-destructive" />
           </div>
           <h3 className="text-xl font-semibold text-foreground mb-2">
             Erro ao gerar estratégia
           </h3>
           <p className="text-muted-foreground text-center mb-6 max-w-md">
             {error || 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
           </p>
           <div className="flex gap-3">
             <Button variant="outline" onClick={() => navigate('/dashboard')}>
               Voltar ao Dashboard
             </Button>
             <Button onClick={handleRetry} disabled={isGenerating}>
               {isGenerating ? (
                 <>
                   <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                   Gerando...
                 </>
               ) : (
                 'Tentar Novamente'
               )}
             </Button>
           </div>
         </div>
       </MainLayout>
     );
   }
 
   return (
     <MainLayout>
       <div className="max-w-4xl mx-auto space-y-8 pb-32">
         {/* Continuity Header */}
         <div className="space-y-2">
           <div className="flex items-center gap-2 text-sm text-muted-foreground">
             <span>Diagnóstico</span>
             <ChevronRight className="h-4 w-4" />
             <span className="text-foreground font-medium">Estratégia</span>
           </div>
           <p className="text-muted-foreground">
             Com base no seu diagnóstico, estruturamos a seguinte estratégia editorial.
           </p>
         </div>
 
         {/* Diagnostic Summary Cards */}
         <section className="space-y-4">
           <h2 className="text-lg font-semibold text-foreground">
             Resumo do Diagnóstico
           </h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <Card className="bg-card border-border">
               <CardContent className="p-4 space-y-1">
                 <div className="flex items-center gap-2 text-muted-foreground">
                   <Users className="h-4 w-4" />
                   <span className="text-xs">Público-alvo</span>
                 </div>
                 <p className="text-sm font-medium text-foreground">
                   {strategy.diagnosticSummary.targetAudience}
                 </p>
               </CardContent>
             </Card>
 
             <Card className="bg-card border-border">
               <CardContent className="p-4 space-y-1">
                 <div className="flex items-center gap-2 text-muted-foreground">
                   <Target className="h-4 w-4" />
                   <span className="text-xs">Objetivo</span>
                 </div>
                 <p className="text-sm font-medium text-foreground">
                   {strategy.diagnosticSummary.primaryGoal}
                 </p>
               </CardContent>
             </Card>
 
             <Card className="bg-card border-border">
               <CardContent className="p-4 space-y-1">
                 <div className="flex items-center gap-2 text-muted-foreground">
                   <Sparkles className="h-4 w-4" />
                   <span className="text-xs">Arquétipo</span>
                 </div>
                 <p className="text-sm font-medium text-foreground">
                   {strategy.diagnosticSummary.brandArchetype}
                 </p>
               </CardContent>
             </Card>
 
             <Card className="bg-card border-border">
               <CardContent className="p-4 space-y-1">
                 <div className="flex items-center gap-2 text-muted-foreground">
                   <MessageCircle className="h-4 w-4" />
                   <span className="text-xs">Tom de Voz</span>
                 </div>
                 <p className="text-sm font-medium text-foreground">
                   {strategy.diagnosticSummary.dominantTone}
                 </p>
               </CardContent>
             </Card>
           </div>
         </section>
 
         {/* Strategic Goal */}
         <section className="space-y-4">
           <h2 className="text-lg font-semibold text-foreground">
             Objetivo Estratégico
           </h2>
           <Card className="bg-card border-border border-l-4 border-l-primary">
             <CardContent className="p-6 space-y-3">
               <p className="text-lg font-semibold text-foreground">
                 {strategy.strategicGoal.statement}
               </p>
               <p className="text-muted-foreground">
                 {strategy.strategicGoal.description}
               </p>
             </CardContent>
           </Card>
         </section>
 
         {/* Content Pillars */}
         <section className="space-y-4">
           <h2 className="text-lg font-semibold text-foreground">
             Pilares de Conteúdo
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {strategy.contentPillars.map((pillar) => (
               <Card key={pillar.id} className="bg-card border-border">
                 <CardContent className="p-6 space-y-4">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <div
                         className="w-3 h-3 rounded-full"
                         style={{ backgroundColor: pillar.color }}
                       />
                       <span className="font-semibold text-foreground">
                         {pillar.name}
                       </span>
                     </div>
                     <Badge variant="secondary" className="text-xs">
                       {pillar.focusPercentage}%
                     </Badge>
                   </div>
 
                   <Progress value={pillar.focusPercentage} className="h-2" />
 
                   <p className="text-sm text-muted-foreground">
                     {pillar.description}
                   </p>
 
                   <div className="flex flex-wrap gap-2">
                     {pillar.exampleTopics.map((topic, index) => (
                       <Badge
                         key={index}
                         variant="outline"
                         className="text-xs border-border"
                       >
                         {topic}
                       </Badge>
                     ))}
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
         </section>
 
         {/* Content Types */}
         <section className="space-y-4">
           <h2 className="text-lg font-semibold text-foreground">
             Tipos de Conteúdo Recomendados
           </h2>
           <Card className="bg-card border-border">
             <CardContent className="p-6">
               <ul className="space-y-4">
                 {strategy.contentTypes.map((type) => {
                   const IconComponent = iconMap[type.icon] || FileText;
                   return (
                     <li
                       key={type.id}
                       className="flex items-center justify-between py-2 border-b border-border last:border-0"
                     >
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                           <IconComponent className="h-5 w-5 text-primary" />
                         </div>
                         <span className="font-medium text-foreground">
                           {type.name}
                         </span>
                       </div>
                       <div className="flex gap-2">
                         {type.relatedPillars.map((pillar, index) => (
                           <Badge
                             key={index}
                             variant="secondary"
                             className="text-xs"
                           >
                             {pillar}
                           </Badge>
                         ))}
                       </div>
                     </li>
                   );
                 })}
               </ul>
             </CardContent>
           </Card>
         </section>
 
         {/* Strategic Guidelines */}
         <section className="space-y-4">
           <h2 className="text-lg font-semibold text-foreground">
             Diretrizes Estratégicas
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="bg-card border-border">
               <CardContent className="p-4 flex items-start gap-3">
                 <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                   <Calendar className="h-5 w-5 text-emerald-500" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Frequência</p>
                   <p className="font-medium text-foreground">
                     {strategy.guidelines.frequency}
                   </p>
                 </div>
               </CardContent>
             </Card>
 
             <Card className="bg-card border-border">
               <CardContent className="p-4 flex items-start gap-3">
                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                   <Layers className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">
                     Nível de Profundidade
                   </p>
                   <p className="font-medium text-foreground">
                     {strategy.guidelines.depthLevel}
                   </p>
                 </div>
               </CardContent>
             </Card>
 
             <Card className="bg-card border-border">
               <CardContent className="p-4 flex items-start gap-3">
                 <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                   <MousePointer className="h-5 w-5 text-amber-500" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">Postura de CTA</p>
                   <p className="font-medium text-foreground">
                     {strategy.guidelines.ctaPosture}
                   </p>
                 </div>
               </CardContent>
             </Card>
 
             <Card className="bg-card border-border">
               <CardContent className="p-4 flex items-start gap-3">
                 <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                   <Flag className="h-5 w-5 text-purple-500" />
                 </div>
                 <div>
                   <p className="text-sm text-muted-foreground">
                     Posicionamento da Marca
                   </p>
                   <p className="font-medium text-foreground">
                     {strategy.guidelines.brandStance}
                   </p>
                 </div>
               </CardContent>
             </Card>
           </div>
         </section>

         {/* Brand Hub Link */}
         <section className="space-y-4">
           <Card className="border-border hover:border-primary/30 transition-colors cursor-pointer" onClick={() => navigate('/brand')}>
             <CardContent className="p-6 flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                   <Palette className="h-6 w-6 text-primary" />
                 </div>
                 <div>
                   <p className="font-semibold text-foreground">Hub da Marca</p>
                   <p className="text-sm text-muted-foreground">
                     Gerencie identidade visual, tom de voz e diretrizes da marca
                   </p>
                 </div>
               </div>
               <ArrowRight className="h-5 w-5 text-muted-foreground" />
             </CardContent>
           </Card>
         </section>
       </div>
 
       {/* Fixed Progression CTA */}
       <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4">
         <div className="max-w-4xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
             <CheckCircle2 className="h-5 w-5 text-emerald-500" />
             <span className="text-muted-foreground">
               Estratégia definida. Vamos transformar isso em planejamento.
             </span>
           </div>
           <Button onClick={() => navigate('/content-lab/sprints')} className="gap-2">
             Ir para Planejamento de Conteúdo
             <ArrowRight className="h-4 w-4" />
           </Button>
         </div>
       </div>
     </MainLayout>
   );
 }