 import { useState, useCallback } from 'react';
 import { supabase } from '@/integrations/supabase/client';
 import { OnboardingFormData, DiagnosticResult } from '@/data/onboardingData';
 import { toast } from 'sonner';
 
 interface UseDiagnosticReturn {
   generateDiagnostic: (formData: OnboardingFormData) => Promise<DiagnosticResult | null>;
   isLoading: boolean;
   error: string | null;
 }
 
 export function useDiagnostic(): UseDiagnosticReturn {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
 
   const generateDiagnostic = useCallback(async (formData: OnboardingFormData): Promise<DiagnosticResult | null> => {
     setIsLoading(true);
     setError(null);
 
     try {
       // Prepare form data with resolved custom values
       const preparedData = {
         name: formData.name,
         role: formData.role === 'other' ? formData.customRole : formData.role,
         experienceLevel: formData.experienceLevel,
         primaryArea: formData.primaryArea === 'other' ? formData.customArea : formData.primaryArea,
         subareas: formData.subareas,
         primaryGoal: formData.primaryGoal === 'other' ? formData.customPrimaryGoal : formData.primaryGoal,
         secondaryGoal: formData.secondaryGoal === 'other' ? formData.customSecondaryGoal : formData.secondaryGoal,
         selectedTopics: [...formData.selectedTopics, ...formData.customTopics],
         customTopics: formData.customTopics,
         audienceType: formData.audienceType === 'other' ? formData.customAudience : formData.audienceType,
         challenges: formData.challenges.filter(c => c !== 'other'),
         communicationStyle: formData.communicationStyle,
       };
 
       const { data, error: invokeError } = await supabase.functions.invoke('generate-diagnostic', {
         body: { formData: preparedData }
       });
 
       if (invokeError) {
         console.error('Edge function error:', invokeError);
         
         // Check for specific error status codes
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
         
         const errorMsg = 'Erro ao gerar diagnóstico. Tente novamente.';
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
 
       // Add titles to sections if missing (for compatibility)
       const result: DiagnosticResult = {
         profileAnalysis: {
           title: 'Análise do Perfil Profissional',
           ...data.profileAnalysis,
         },
         strategicPatterns: {
           title: 'Padrões Estratégicos Identificados',
           ...data.strategicPatterns,
         },
         personaMap: {
           title: 'Mapa de Persona & Audiência',
           ...data.personaMap,
         },
         brandArchetype: {
           title: 'Arquétipo da Sua Marca',
           ...data.brandArchetype,
         },
         toneCalibration: {
           title: 'Calibração do Tom de Voz',
           ...data.toneCalibration,
         },
         contentPillars: {
           title: 'Pilares de Conteúdo Sugeridos',
           ...data.contentPillars,
         },
       };
 
       return result;
     } catch (err) {
       console.error('Diagnostic generation error:', err);
       const errorMsg = 'Erro inesperado ao gerar diagnóstico. Tente novamente.';
       setError(errorMsg);
       toast.error(errorMsg);
       return null;
     } finally {
       setIsLoading(false);
     }
   }, []);
 
   return {
     generateDiagnostic,
     isLoading,
     error,
   };
 }