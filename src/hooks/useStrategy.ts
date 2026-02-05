 import { useState, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { DiagnosticResult } from '@/data/onboardingData';
 import { Strategy } from '@/data/strategyData';
 import { toast } from 'sonner';
 
 interface UseStrategyReturn {
   generateStrategy: (diagnosticResult: DiagnosticResult) => Promise<Strategy | null>;
   isLoading: boolean;
   error: string | null;
 }
 
 export function useStrategy(): UseStrategyReturn {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const generateStrategy = useCallback(async (diagnosticResult: DiagnosticResult): Promise<Strategy | null> => {
     setIsLoading(true);
     setError(null);
 
     try {
       const { data, error: invokeError } = await supabase.functions.invoke('generate-strategy', {
         body: { diagnosticResult }
       });
 
       if (invokeError) {
         console.error('Edge function error:', invokeError);
         
         if (invokeError.message?.includes('429') || (invokeError as any).status === 429) {
           const errorMsg = 'Limite de requisições atingido. Aguarde alguns minutos.';
           setError(errorMsg);
           toast.error(errorMsg);
           return null;
         }
         
         if (invokeError.message?.includes('402') || (invokeError as any).status === 402) {
           const errorMsg = 'Créditos de IA esgotados. Adicione mais créditos para continuar.';
           setError(errorMsg);
           toast.error(errorMsg);
           return null;
         }
         
         const errorMsg = 'Erro ao gerar estratégia. Tente novamente.';
         setError(errorMsg);
         toast.error(errorMsg);
         return null;
       }
 
       // Check for error in response data
       if (data?.error) {
         setError(data.error);
         toast.error(data.error);
         return null;
       }
 
       // Build the strategy object with defaults
       const strategy: Strategy = {
         id: `strategy-${Date.now()}`,
         diagnosticId: `diagnostic-${Date.now()}`,
         createdAt: new Date().toISOString(),
         diagnosticSummary: data.diagnosticSummary,
         strategicGoal: data.strategicGoal,
         contentPillars: data.contentPillars,
         contentTypes: data.contentTypes,
         guidelines: data.guidelines,
       };
 
       return strategy;
     } catch (err) {
       console.error('Strategy generation error:', err);
       const errorMsg = 'Erro inesperado ao gerar estratégia. Tente novamente.';
       setError(errorMsg);
       toast.error(errorMsg);
       return null;
     } finally {
       setIsLoading(false);
     }
   }, []);
 
   return {
     generateStrategy,
     isLoading,
     error,
   };
 }