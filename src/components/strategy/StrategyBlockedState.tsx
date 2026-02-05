 import { Card, CardContent } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { AlertTriangle, ArrowLeft } from 'lucide-react';
 import { useNavigate } from 'react-router-dom';
 
 export function StrategyBlockedState() {
   const navigate = useNavigate();
 
   return (
     <div className="min-h-screen bg-background flex items-center justify-center p-6">
       <Card className="max-w-md w-full bg-card border-border">
         <CardContent className="p-8 text-center space-y-6">
           <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
             <AlertTriangle className="h-8 w-8 text-amber-500" />
           </div>
 
           <div className="space-y-2">
             <h2 className="text-xl font-semibold text-foreground">
               Diagnóstico não concluído
             </h2>
             <p className="text-muted-foreground">
               Para acessar sua estratégia editorial, você precisa primeiro completar
               o diagnóstico inicial. Ele é a base de toda a sua estratégia de
               conteúdo.
             </p>
           </div>
 
           <Button
             onClick={() => navigate('/onboarding')}
             className="w-full gap-2"
           >
             <ArrowLeft className="h-4 w-4" />
             Voltar ao Diagnóstico
           </Button>
         </CardContent>
       </Card>
     </div>
   );
 }