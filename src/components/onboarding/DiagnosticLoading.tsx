 import { useEffect, useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
 import { diagnosticMessages, OnboardingFormData, DiagnosticResult } from '@/data/onboardingData';
 import { Sparkles, Brain, Target, Palette, MessageSquare, Layers, RefreshCw } from 'lucide-react';
 import { useDiagnostic } from '@/hooks/useDiagnostic';
 import { Button } from '@/components/ui/button';

const icons = [Sparkles, Brain, Target, Palette, MessageSquare, Layers];

interface DiagnosticLoadingProps {
   formData: OnboardingFormData;
   onComplete: (result: DiagnosticResult) => void;
   onError: () => void;
}

 export default function DiagnosticLoading({ formData, onComplete, onError }: DiagnosticLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
   const [hasError, setHasError] = useState(false);
   const { generateDiagnostic, isLoading, error } = useDiagnostic();
   const hasStarted = useRef(false);

   // Start diagnostic generation on mount
  useEffect(() => {
     if (hasStarted.current) return;
     hasStarted.current = true;

     const runDiagnostic = async () => {
       const result = await generateDiagnostic(formData);
       
       if (result) {
         // Complete progress and transition
         setProgress(100);
         setTimeout(() => onComplete(result), 500);
       } else {
         setHasError(true);
       }
     };
 
     runDiagnostic();
   }, [formData, generateDiagnostic, onComplete]);
 
   // Simulated progress based on loading state
   useEffect(() => {
     if (hasError) return;
 
     const progressInterval = setInterval(() => {
       setProgress((prev) => {
         // Stop at 90% until we get a response
         if (prev >= 90) {
           return 90;
         }
         // Progress more slowly as we approach 90%
         const increment = prev < 50 ? 2 : prev < 75 ? 1 : 0.5;
         return Math.min(prev + increment, 90);
       });
     }, 100);
 
     return () => clearInterval(progressInterval);
   }, [hasError]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % diagnosticMessages.length);
     }, 1200);

    return () => clearInterval(messageInterval);
  }, []);

    const handleRetry = async () => {
      setHasError(false);
      setProgress(0);
      // #10: Do NOT reset hasStarted - retry calls directly, not via useEffect
      
      const result = await generateDiagnostic(formData);
     
     if (result) {
       setProgress(100);
       setTimeout(() => onComplete(result), 500);
     } else {
       setHasError(true);
     }
   };
 
   const handleCancel = () => {
     onError();
   };
 
  const CurrentIcon = icons[currentMessageIndex];

   if (hasError) {
     return (
       <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
         <div className="relative mb-8">
           <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center border border-destructive/30">
             <RefreshCw className="h-10 w-10 text-destructive" />
           </div>
         </div>
 
         <h3 className="text-xl font-semibold text-foreground mb-2">
           Erro ao gerar diagnóstico
         </h3>
         <p className="text-muted-foreground text-center mb-6 max-w-md">
           {error || 'Ocorreu um erro inesperado. Por favor, tente novamente.'}
         </p>
 
         <div className="flex gap-3">
           <Button variant="outline" onClick={handleCancel}>
             Voltar
           </Button>
           <Button onClick={handleRetry} disabled={isLoading}>
             {isLoading ? (
               <>
                 <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                 Tentando...
               </>
             ) : (
               'Tentar Novamente'
             )}
           </Button>
         </div>
       </div>
     );
   }
 
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      {/* Animated Logo/Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        <div className="relative w-24 h-24 rounded-full bg-secondary flex items-center justify-center border border-border">
          <CurrentIcon className="h-10 w-10 text-primary animate-pulse" />
        </div>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <Progress value={progress} className="h-2 mb-4" />
        <p className="text-center text-sm text-muted-foreground">
          {progress}% concluído
        </p>
      </div>

      {/* Rotating Messages */}
      <div className="h-8 flex items-center justify-center">
        <p
          key={currentMessageIndex}
          className="text-lg font-medium text-foreground animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {diagnosticMessages[currentMessageIndex]}
        </p>
      </div>

      {/* Skeleton Cards Preview */}
      <div className="mt-12 w-full max-w-lg space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-24 flex-1" />
          <Skeleton className="h-24 flex-1" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-20 flex-1" />
          <Skeleton className="h-20 flex-1" />
          <Skeleton className="h-20 flex-1" />
        </div>
      </div>
    </div>
  );
}
