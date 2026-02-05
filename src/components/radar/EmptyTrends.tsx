 import { TrendingUp, RefreshCw } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent } from '@/components/ui/card';
 
 interface EmptyTrendsProps {
   onDiscover: () => void;
   isLoading?: boolean;
 }
 
 export function EmptyTrends({ onDiscover, isLoading }: EmptyTrendsProps) {
   return (
     <Card className="border-border border-dashed">
       <CardContent className="flex flex-col items-center justify-center py-16 text-center">
         <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
           <TrendingUp className="h-8 w-8 text-primary" />
         </div>
         
         <h3 className="text-xl font-semibold mb-2">
           Nenhuma tendência descoberta
         </h3>
         
         <p className="text-muted-foreground max-w-md mb-6">
           Clique no botão abaixo para descobrir tendências relevantes para o seu nicho 
           usando inteligência artificial.
         </p>
         
         <Button onClick={onDiscover} disabled={isLoading} className="gap-2">
           <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
           Descobrir Tendências
         </Button>
       </CardContent>
     </Card>
   );
 }