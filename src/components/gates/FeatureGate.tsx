 import { ReactNode } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { useGate, GateType } from '@/hooks/useGate';
 import { UpgradePrompt } from './UpgradePrompt';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 import { ClipboardCheck } from 'lucide-react';
 
 interface FeatureGateProps {
   gate: GateType;
   children: ReactNode;
   fallback?: ReactNode;
   showUpgradePrompt?: boolean;
 }
 
 // Onboarding Required State Component
 function OnboardingRequiredState({ reason }: { reason?: string }) {
   const navigate = useNavigate();
 
   return (
     <Card className="border-primary/30 bg-primary/5">
       <CardContent className="p-6 text-center space-y-4">
         <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
           <ClipboardCheck className="h-7 w-7 text-primary" />
         </div>
         <div className="space-y-2">
           <h3 className="text-lg font-semibold text-foreground">
             Diagnóstico necessário
           </h3>
           <p className="text-muted-foreground text-sm">
             {reason || 'Complete o diagnóstico para desbloquear este recurso.'}
           </p>
         </div>
         <Button onClick={() => navigate('/onboarding')} className="w-full">
           <ClipboardCheck className="h-4 w-4 mr-2" />
           Iniciar Diagnóstico
         </Button>
       </CardContent>
     </Card>
   );
 }
 
 export function FeatureGate({
   gate,
   children,
   fallback,
   showUpgradePrompt = true,
 }: FeatureGateProps) {
   const gateResult = useGate(gate);
 
   if (gateResult.allowed) {
     return <>{children}</>;
   }
 
   if (fallback) {
     return <>{fallback}</>;
   }
 
   if (showUpgradePrompt && gateResult.action === 'upgrade') {
     return (
       <UpgradePrompt
         reason={gateResult.reason}
         requiredPlan={gateResult.requiredPlan || 'pro'}
       />
     );
   }
 
   if (gateResult.action === 'complete-onboarding') {
     return <OnboardingRequiredState reason={gateResult.reason} />;
   }
 
   return null;
 }