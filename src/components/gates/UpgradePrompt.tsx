 import { useNavigate } from 'react-router-dom';
 import { Lock, Sparkles } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { PlanBadge } from './PlanBadge';
 import { PlanType } from '@/contexts/UserGateContext';
 import { cn } from '@/lib/utils';
 
 interface UpgradePromptProps {
   reason?: string;
   requiredPlan?: Exclude<PlanType, 'free'>;
   variant?: 'card' | 'inline' | 'banner';
   className?: string;
 }
 
 export function UpgradePrompt({
   reason = 'Este recurso é exclusivo para planos pagos.',
   requiredPlan = 'pro',
   variant = 'card',
   className,
 }: UpgradePromptProps) {
   const navigate = useNavigate();
 
   if (variant === 'banner') {
     return (
        <div
          className={cn(
            'p-3 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-between gap-4',
            className
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Lock className="h-4 w-4 text-violet-400 shrink-0" />
           <span className="text-sm text-foreground truncate">{reason}</span>
         </div>
         <Button size="sm" onClick={() => navigate('/pricing')}>
           Ver Planos
         </Button>
       </div>
     );
   }
 
   if (variant === 'inline') {
     return (
       <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
         <Lock className="h-4 w-4 shrink-0" />
         <span className="truncate">{reason}</span>
         <Button
           variant="link"
           size="sm"
           className="h-auto p-0 shrink-0"
           onClick={() => navigate('/pricing')}
         >
           Fazer upgrade
         </Button>
       </div>
     );
   }
 
   // Card variant (default)
   return (
      <Card className={cn('border-violet-500/30 bg-violet-500/5', className)}>
        <CardContent className="p-6 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-violet-400" />
         </div>
         <div className="space-y-2">
           <h3 className="text-lg font-semibold text-foreground">Recurso exclusivo</h3>
           <p className="text-muted-foreground text-sm">{reason}</p>
         </div>
         <div className="flex items-center justify-center gap-2">
           <PlanBadge requiredPlan={requiredPlan} size="md" />
         </div>
         <Button onClick={() => navigate('/pricing')} className="w-full">
           <Sparkles className="h-4 w-4 mr-2" />
           Fazer Upgrade
         </Button>
       </CardContent>
     </Card>
   );
 }