 import { useNavigate } from 'react-router-dom';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Progress } from '@/components/ui/progress';
 import { ClipboardList, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface OnboardingProgressCardProps {
   currentStep: number;
   onboardingStatus: 'not_started' | 'in_progress' | 'completed';
 }
 
 const steps = [
   { id: 1, label: 'Conta e Identidade' },
   { id: 2, label: 'Cargo e Experiência' },
   { id: 3, label: 'Área de Atuação' },
   { id: 4, label: 'Objetivos' },
   { id: 5, label: 'Tópicos de Conteúdo' },
   { id: 6, label: 'Audiência e Desafios' },
   { id: 7, label: 'Estilo de Comunicação' },
 ];
 
 const TOTAL_STEPS = 7;
 
 export function OnboardingProgressCard({ currentStep, onboardingStatus }: OnboardingProgressCardProps) {
   const navigate = useNavigate();
   
   // Calculate completed steps (steps before current)
   const completedSteps = onboardingStatus === 'not_started' ? 0 : Math.max(0, currentStep - 1);
   const progressPercentage = Math.round((completedSteps / TOTAL_STEPS) * 100);
   
   // Find the next pending step (the current step user should continue from)
   const nextPendingStep = onboardingStatus === 'not_started' ? 1 : currentStep;
   
   const handleContinue = () => {
     navigate(`/onboarding?step=${nextPendingStep}`);
   };
   
   return (
     <Card className="border-amber-500/30 bg-card">
       <CardHeader>
         <div className="flex items-start gap-4">
           <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
             <ClipboardList className="h-6 w-6 text-amber-500" />
           </div>
           <div className="flex-1 min-w-0">
             <CardTitle className="text-lg">
               Complete seu diagnóstico para aproveitar todo o potencial da Flui
             </CardTitle>
             <CardDescription className="mt-1">
               {completedSteps} de {TOTAL_STEPS} etapas concluídas
             </CardDescription>
           </div>
         </div>
       </CardHeader>
       <CardContent className="space-y-6">
         {/* Progress bar */}
         <Progress value={progressPercentage} className="h-2" />
         
         {/* Steps list */}
         <div className="space-y-3">
           {steps.map((step) => {
             const isCompleted = step.id < currentStep && onboardingStatus !== 'not_started';
             const isCurrent = step.id === currentStep && onboardingStatus === 'in_progress';
             
             return (
               <div
                 key={step.id}
                 className="flex items-center justify-between py-1"
               >
                 <div className="flex items-center gap-3">
                   {isCompleted ? (
                     <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                   ) : (
                     <Circle className={cn(
                       "h-5 w-5 shrink-0",
                       isCurrent ? "text-amber-500" : "text-muted-foreground/50"
                     )} />
                   )}
                   <span className={cn(
                     "text-sm",
                     isCompleted ? 'text-muted-foreground' : 'text-foreground'
                   )}>
                     {step.label}
                   </span>
                 </div>
                 <Badge 
                   variant={isCompleted ? 'secondary' : 'outline'}
                   className={cn(
                     "text-xs",
                     isCurrent && "border-amber-500/50 text-amber-500"
                   )}
                 >
                   {isCompleted ? 'Concluída' : isCurrent ? 'Em andamento' : 'Pendente'}
                 </Badge>
               </div>
             );
           })}
         </div>
         
         {/* CTA */}
         <Button 
           className="w-full" 
           onClick={handleContinue}
         >
           {onboardingStatus === 'not_started' ? 'Iniciar Diagnóstico' : 'Continuar Diagnóstico'}
           <ArrowRight className="h-4 w-4 ml-2" />
         </Button>
       </CardContent>
     </Card>
   );
 }