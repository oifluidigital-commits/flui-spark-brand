import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DiagnosticResult } from '@/data/onboardingData';
import { Strategy } from '@/data/strategyData';
import { toast } from 'sonner';

interface UseStrategyReturn {
  generateStrategy: (diagnosticResult: DiagnosticResult) => Promise<Strategy | null>;
  loadActiveStrategy: () => Promise<Strategy | null>;
  loadLatestDiagnosticResult: () => Promise<DiagnosticResult | null>;
  isLoading: boolean;
  error: string | null;
}

async function saveStrategyToDB(strategy: Strategy): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get latest diagnostic ID
  const { data: latestDiagnostic } = await supabase
    .from('diagnostics')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // Archive existing active strategies
  await supabase
    .from('strategies')
    .update({ is_active: false })
    .eq('user_id', user.id)
    .eq('is_active', true);

  // Insert new active strategy
  const { error } = await supabase
    .from('strategies')
    .insert({
      user_id: user.id,
      diagnostic_id: latestDiagnostic?.id || null,
      data: strategy as any,
      is_active: true,
    });

  if (error) {
    console.error('Error saving strategy to DB:', error);
    throw error;
  }
}

export function useStrategy(): UseStrategyReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadActiveStrategy = useCallback(async (): Promise<Strategy | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error: fetchError } = await supabase
      .from('strategies')
      .select('data')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (fetchError) {
      console.error('Error loading strategy:', fetchError);
      return null;
    }

    return data ? (data.data as unknown as Strategy) : null;
  }, []);

  const loadLatestDiagnosticResult = useCallback(async (): Promise<DiagnosticResult | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error: fetchError } = await supabase
      .from('diagnostics')
      .select('result')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error('Error loading diagnostic:', fetchError);
      return null;
    }

    return data?.result ? (data.result as unknown as DiagnosticResult) : null;
  }, []);

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

      if (data?.error) {
        setError(data.error);
        toast.error(data.error);
        return null;
      }

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

      // Persist to database
      try {
        await saveStrategyToDB(strategy);
      } catch (saveErr) {
        console.error('Failed to persist strategy to DB:', saveErr);
        // Strategy was generated successfully, just failed to persist — still return it
      }

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
    loadActiveStrategy,
    loadLatestDiagnosticResult,
    isLoading,
    error,
  };
}
