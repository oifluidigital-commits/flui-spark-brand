import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trend, TrendRelevance } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';

interface EdgeFunctionTrend {
  title: string;
  description: string;
  category: string;
  relevance: TrendRelevance;
  source: string;
  suggested_actions: string[];
  discovered_at: string;
  expires_at: string;
}

interface DiscoverTrendsResponse {
  success: boolean;
  trends: EdgeFunctionTrend[];
  generated_at: string;
  error?: string;
}

function mapEdgeFunctionTrendToTrend(trend: EdgeFunctionTrend): Trend {
  return {
    id: crypto.randomUUID(),
    title: trend.title,
    description: trend.description,
    source: trend.source,
    relevance: trend.relevance,
    category: trend.category,
    suggestedActions: trend.suggested_actions,
    discoveredAt: trend.discovered_at,
    expiresAt: trend.expires_at,
  };
}

export function useTrends() {
  const queryClient = useQueryClient();
  const { strategy } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTrendsFromEdgeFunction = useCallback(async (): Promise<Trend[]> => {
    if (!strategy) {
      return [];
    }

    const { data, error } = await supabase.functions.invoke<DiscoverTrendsResponse>('discover-trends', {
      body: {
        niche: strategy.strategicGoal.statement,
        keywords: strategy.contentPillars.map((p) => p.name),
        audience: strategy.diagnosticSummary.targetAudience,
        existingPillars: strategy.contentPillars.map((p) => ({
          name: p.name,
          description: p.description,
        })),
      },
    });

    if (error) {
      throw new Error(error.message || 'Erro ao buscar tendências');
    }

    if (!data?.success || !data.trends) {
      throw new Error(data?.error || 'Resposta inválida da API');
    }

    return data.trends.map(mapEdgeFunctionTrendToTrend);
  }, [strategy]);

  const {
    data: trends = [],
    isLoading,
    error,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['trends', strategy?.id],
    queryFn: fetchTrendsFromEdgeFunction,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: !!strategy,
  });

  const refreshTrends = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ['trends'] });
      await queryClient.refetchQueries({ queryKey: ['trends'] });
      toast({
        title: 'Radar atualizado!',
        description: 'Novas tendências foram descobertas.',
      });
    } catch (err) {
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível buscar novas tendências.',
        variant: 'destructive',
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  return {
    trends,
    isLoading,
    isRefreshing,
    error: error as Error | null,
    refreshTrends,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : null,
  };
}
