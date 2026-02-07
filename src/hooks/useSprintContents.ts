import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type ContentRow = Database['public']['Tables']['sprint_contents']['Row'];
type ContentStatus = Database['public']['Enums']['content_status'];
type ContentIntention = Database['public']['Enums']['content_intention'];
type FunnelStage = Database['public']['Enums']['funnel_stage'];
type FrameworkOrigin = Database['public']['Enums']['framework_origin'];

export interface SprintContentItem {
  id: string;
  sprintId: string;
  title: string;
  hook: string;
  description: string;
  format: string;
  status: ContentStatus;
  funnelStage: FunnelStage | null;
  targetDate?: string;
  framework: string;
  frameworkReason?: string;
  frameworkOrigin?: FrameworkOrigin | null;
  intention: ContentIntention | null;
  suggestedCta: string;
  generatedText: string | null;
  createdAt: string;
  updatedAt: string;
}

function rowToItem(row: ContentRow): SprintContentItem {
  return {
    id: row.id,
    sprintId: row.sprint_id,
    title: row.title,
    hook: row.hook || '',
    description: row.description || '',
    format: row.format,
    status: row.status || 'idea',
    funnelStage: row.funnel_stage,
    targetDate: row.target_date || undefined,
    framework: row.framework || '',
    frameworkReason: row.framework_reason || undefined,
    frameworkOrigin: row.framework_origin,
    intention: row.intention,
    suggestedCta: row.suggested_cta || '',
    generatedText: row.generated_text,
    createdAt: row.created_at || '',
    updatedAt: row.updated_at || '',
  };
}

export function useSprintContents(sprintId: string | undefined) {
  const [contents, setContents] = useState<SprintContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const loadContents = useCallback(async () => {
    if (!sprintId) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from('sprint_contents')
      .select('*')
      .eq('sprint_id', sprintId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading sprint contents:', error);
      toast({ title: 'Erro ao carregar conteúdos', variant: 'destructive' });
    } else {
      setContents((data || []).map(rowToItem));
    }
    setIsLoading(false);
  }, [sprintId]);

  const createContent = useCallback(async (data: {
    title: string;
    format: string;
    description?: string;
  }) => {
    if (!sprintId) return null;
    const { data: row, error } = await supabase
      .from('sprint_contents')
      .insert({
        sprint_id: sprintId,
        title: data.title,
        format: data.format,
        description: data.description || null,
        status: 'idea',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating content:', error);
      toast({ title: 'Erro ao criar conteúdo', variant: 'destructive' });
      return null;
    }
    const item = rowToItem(row);
    setContents((prev) => [...prev, item]);
    return item;
  }, [sprintId]);

  const updateContent = useCallback(async (id: string, updates: Partial<{
    title: string;
    hook: string;
    description: string;
    format: string;
    status: ContentStatus;
    funnel_stage: FunnelStage | null;
    target_date: string | null;
    framework: string | null;
    framework_reason: string | null;
    framework_origin: FrameworkOrigin | null;
    intention: ContentIntention | null;
    suggested_cta: string | null;
    generated_text: string | null;
  }>) => {
    const { error } = await supabase
      .from('sprint_contents')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating content:', error);
      toast({ title: 'Erro ao atualizar conteúdo', variant: 'destructive' });
      return false;
    }

    // Update local state
    setContents((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, updatedAt: new Date().toISOString() };
        if (updates.title !== undefined) updated.title = updates.title;
        if (updates.hook !== undefined) updated.hook = updates.hook || '';
        if (updates.description !== undefined) updated.description = updates.description || '';
        if (updates.format !== undefined) updated.format = updates.format;
        if (updates.status !== undefined) updated.status = updates.status || 'idea';
        if (updates.funnel_stage !== undefined) updated.funnelStage = updates.funnel_stage;
        if (updates.target_date !== undefined) updated.targetDate = updates.target_date || undefined;
        if (updates.framework !== undefined) updated.framework = updates.framework || '';
        if (updates.framework_reason !== undefined) updated.frameworkReason = updates.framework_reason || undefined;
        if (updates.framework_origin !== undefined) updated.frameworkOrigin = updates.framework_origin;
        if (updates.intention !== undefined) updated.intention = updates.intention;
        if (updates.suggested_cta !== undefined) updated.suggestedCta = updates.suggested_cta || '';
        if (updates.generated_text !== undefined) updated.generatedText = updates.generated_text;
        return updated;
      })
    );
    return true;
  }, []);

  const deleteContent = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('sprint_contents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting content:', error);
      toast({ title: 'Erro ao remover conteúdo', variant: 'destructive' });
      return false;
    }
    setContents((prev) => prev.filter((c) => c.id !== id));
    return true;
  }, []);

  const generateText = useCallback(async (
    contentId: string,
    frameworkStructure: string[] | null,
    brand?: { name?: string; voice?: unknown; positioning?: unknown } | null,
    strategy?: { strategicGoal?: { statement?: string }; diagnosticSummary?: { brandArchetype?: string } } | null,
  ) => {
    const content = contents.find((c) => c.id === contentId);
    if (!content) throw new Error('Conteúdo não encontrado');
    if (!content.framework) throw new Error('Selecione um framework antes de gerar texto');

    setIsGenerating(contentId);

    try {
      const { data, error } = await supabase.functions.invoke('generate-content-text', {
        body: {
          content: {
            title: content.title,
            hook: content.hook,
            description: content.description,
            format: content.format,
            framework: content.framework,
            frameworkStructure,
            funnelStage: content.funnelStage,
            intention: content.intention,
            suggestedCta: content.suggestedCta,
          },
          brand: brand || undefined,
          strategy: strategy || undefined,
        },
      });

      if (error) {
        // Check for rate limit / payment errors
        const msg = error.message || '';
        if (msg.includes('429')) {
          toast({ title: 'Limite de requisições excedido. Tente novamente em instantes.', variant: 'destructive' });
        } else if (msg.includes('402')) {
          toast({ title: 'Créditos de IA esgotados.', variant: 'destructive' });
        } else {
          toast({ title: 'Erro ao gerar texto', description: msg, variant: 'destructive' });
        }
        return null;
      }

      const generatedText = data?.generatedText || '';

      // Persist generated text and update status to review
      await updateContent(contentId, {
        generated_text: generatedText,
        status: 'review',
      });

      toast({ title: 'Texto gerado com sucesso!' });
      return data;
    } catch (err) {
      console.error('Error generating text:', err);
      toast({ title: 'Erro ao gerar texto. Tente novamente.', variant: 'destructive' });
      return null;
    } finally {
      setIsGenerating(null);
    }
  }, [contents, updateContent]);

  return {
    contents,
    isLoading,
    isGenerating,
    loadContents,
    createContent,
    updateContent,
    deleteContent,
    generateText,
  };
}
