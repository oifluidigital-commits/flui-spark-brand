 import { useNavigate } from 'react-router-dom';
 import { Lock, Sparkles } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { cn } from '@/lib/utils';
 
 interface SprintLimitCardProps {
   currentSprints: number;
   maxSprints: number;
   className?: string;
 }
 
 export function SprintLimitCard({
   currentSprints,
   maxSprints,
   className,
 }: SprintLimitCardProps) {
   const navigate = useNavigate();
 
   return (
     <div
       className={cn(
         'flex flex-col items-center justify-center gap-3',
         'min-h-[240px] rounded-lg',
         'border border-amber-500/30',
         'bg-amber-500/5',
         className
       )}
     >
       <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
         <Lock className="h-6 w-6 text-amber-500" />
       </div>
       <div className="text-center space-y-1 px-4">
         <span className="text-foreground text-sm font-medium">
           Limite de sprints atingido
         </span>
         <p className="text-xs text-muted-foreground">
           Você está usando {currentSprints}/{maxSprints} sprint(s) do plano gratuito.
         </p>
       </div>
       <Button size="sm" onClick={() => navigate('/pricing')}>
         <Sparkles className="h-4 w-4 mr-2" />
         Fazer Upgrade
       </Button>
     </div>
   );
 }