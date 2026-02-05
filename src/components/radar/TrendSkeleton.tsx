 import { Card, CardContent, CardHeader } from '@/components/ui/card';
 import { Skeleton } from '@/components/ui/skeleton';
 
 export function TrendSkeleton() {
   return (
     <Card className="border-border">
       <CardHeader>
         <div className="flex items-start justify-between">
           <div className="flex-1 space-y-3">
             <div className="flex items-center gap-3">
               <Skeleton className="h-6 w-48" />
               <Skeleton className="h-5 w-16" />
               <Skeleton className="h-5 w-20" />
             </div>
             <Skeleton className="h-4 w-full max-w-lg" />
           </div>
           <Skeleton className="h-8 w-8 rounded" />
         </div>
       </CardHeader>
       <CardContent>
         <div className="space-y-4">
           <div>
             <Skeleton className="h-4 w-24 mb-2" />
             <div className="flex flex-wrap gap-2">
               <Skeleton className="h-6 w-32 rounded-full" />
               <Skeleton className="h-6 w-40 rounded-full" />
               <Skeleton className="h-6 w-28 rounded-full" />
             </div>
           </div>
           <div className="flex items-center justify-between">
             <Skeleton className="h-3 w-32" />
             <Skeleton className="h-3 w-40" />
           </div>
         </div>
       </CardContent>
     </Card>
   );
 }
 
 export function StatsSkeleton() {
   return (
     <Card className="border-border">
       <CardContent className="pt-6">
         <div className="flex items-center justify-between">
           <div className="space-y-2">
             <Skeleton className="h-8 w-12" />
             <Skeleton className="h-4 w-24" />
           </div>
           <Skeleton className="h-10 w-10 rounded-lg" />
         </div>
       </CardContent>
     </Card>
   );
 }