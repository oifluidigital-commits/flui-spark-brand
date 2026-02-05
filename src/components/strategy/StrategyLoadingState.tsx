 import { useEffect, useState } from 'react';
 import { Card, CardContent } from '@/components/ui/card';
 import { Skeleton } from '@/components/ui/skeleton';
 import { strategyLoadingMessages } from '@/data/strategyData';
 import { Loader2 } from 'lucide-react';
 
 export function StrategyLoadingState() {
   const [messageIndex, setMessageIndex] = useState(0);
 
   useEffect(() => {
     const interval = setInterval(() => {
       setMessageIndex((prev) => (prev + 1) % strategyLoadingMessages.length);
     }, 2000);
 
     return () => clearInterval(interval);
   }, []);
 
   return (
     <div className="min-h-screen bg-background p-6">
       <div className="max-w-4xl mx-auto space-y-8">
         {/* Header skeleton */}
         <div className="space-y-2">
           <Skeleton className="h-4 w-48" />
           <Skeleton className="h-5 w-96" />
         </div>
 
         {/* Loading indicator */}
         <div className="flex flex-col items-center justify-center py-12 space-y-4">
           <Loader2 className="h-12 w-12 text-primary animate-spin" />
           <p className="text-muted-foreground text-lg animate-pulse">
             {strategyLoadingMessages[messageIndex]}
           </p>
         </div>
 
         {/* Diagnostic summary skeleton */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[1, 2, 3, 4].map((i) => (
             <Card key={i} className="bg-card border-border">
               <CardContent className="p-4 space-y-2">
                 <Skeleton className="h-4 w-20" />
                 <Skeleton className="h-5 w-full" />
               </CardContent>
             </Card>
           ))}
         </div>
 
         {/* Strategic goal skeleton */}
         <Card className="bg-card border-border">
           <CardContent className="p-6 space-y-3">
             <Skeleton className="h-6 w-48" />
             <Skeleton className="h-5 w-full" />
             <Skeleton className="h-5 w-3/4" />
           </CardContent>
         </Card>
 
         {/* Pillars skeleton */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[1, 2, 3, 4].map((i) => (
             <Card key={i} className="bg-card border-border">
               <CardContent className="p-6 space-y-3">
                 <div className="flex items-center justify-between">
                   <Skeleton className="h-5 w-32" />
                   <Skeleton className="h-5 w-12" />
                 </div>
                 <Skeleton className="h-2 w-full rounded-full" />
                 <Skeleton className="h-4 w-full" />
                 <div className="flex gap-2">
                   <Skeleton className="h-6 w-20 rounded-full" />
                   <Skeleton className="h-6 w-24 rounded-full" />
                   <Skeleton className="h-6 w-16 rounded-full" />
                 </div>
               </CardContent>
             </Card>
           ))}
         </div>
       </div>
     </div>
   );
 }