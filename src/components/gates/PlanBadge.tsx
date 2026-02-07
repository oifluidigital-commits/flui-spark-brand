 import { Crown } from 'lucide-react';
 import { Badge } from '@/components/ui/badge';
 import { cn } from '@/lib/utils';
 import { PlanType } from '@/contexts/UserGateContext';
 
 interface PlanBadgeProps {
   requiredPlan: Exclude<PlanType, 'free'>;
   size?: 'sm' | 'md';
 }
 
 const planConfig = {
  pro: { 
    label: 'Pro', 
    className: 'bg-violet-500/20 text-violet-400 border-violet-500/30' 
  },
   studio: { 
     label: 'Studio', 
     className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' 
   },
 };
 
 export function PlanBadge({ requiredPlan, size = 'sm' }: PlanBadgeProps) {
   const config = planConfig[requiredPlan];
 
   return (
     <Badge
       variant="outline"
       className={cn(
         config.className,
         size === 'sm' ? 'text-xs px-1.5 py-0' : 'text-sm px-2 py-0.5'
       )}
     >
       <Crown className={cn(size === 'sm' ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1')} />
       {config.label}
     </Badge>
   );
 }