import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FrameworkMetadata {
  primaryGoal?: string;
  recommendedFunnelStage?: 'tofu' | 'mofu' | 'bofu';
  bestFor?: string[];
  avoidWhen?: string[];
  toneGuidelines?: string;
  lengthGuidelines?: string;
  ctaGuidelines?: string;
}

export interface FrameworkDB {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  structure: string[] | null;
  example: string | null;
  isCustom: boolean;
  metadata: FrameworkMetadata | null;
}

export function useFrameworksDB() {
  const [frameworks, setFrameworks] = useState<FrameworkDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('frameworks')
          .select('id, name, description, category, structure, example, is_custom, metadata')
          .order('name');

        if (error) {
          console.error('Error loading frameworks:', error);
        } else {
          setFrameworks(
            (data || []).map((f) => ({
              id: f.id,
              name: f.name,
              description: f.description,
              category: f.category,
              structure: f.structure,
              example: f.example,
              isCustom: f.is_custom ?? false,
              metadata: (f.metadata as FrameworkMetadata) ?? null,
            }))
          );
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return { frameworks, isLoading };
}
