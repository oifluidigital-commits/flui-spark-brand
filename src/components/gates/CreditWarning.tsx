 import { useNavigate } from 'react-router-dom';
 import { AlertTriangle } from 'lucide-react';
 import { useCreditWarning } from '@/hooks/useGate';
 import { cn } from '@/lib/utils';
 
 export function CreditWarning() {
   const navigate = useNavigate();
   const { percentage, isLow, isExhausted } = useCreditWarning();
 
   // Only show warning if credits below 20%
   if (!isLow) return null;
 
   return (
     <div
       className={cn(
         'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
         isExhausted
           ? 'bg-destructive/10 border border-destructive/20 hover:bg-destructive/20'
           : 'bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20'
       )}
       onClick={() => navigate('/pricing')}
       role="button"
       tabIndex={0}
       onKeyDown={(e) => e.key === 'Enter' && navigate('/pricing')}
     >
       <AlertTriangle
         className={cn('h-4 w-4', isExhausted ? 'text-destructive' : 'text-amber-500')}
       />
       <span
         className={cn(
           'text-xs font-medium',
           isExhausted ? 'text-destructive' : 'text-amber-500'
         )}
       >
         {isExhausted ? 'Créditos esgotados' : `${percentage}% restante`}
       </span>
     </div>
   );
 }