import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface FrameworkDB {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  structure: string[] | null;
  example: string | null;
  isCustom: boolean;
}

export function useFrameworksDB() {
  const [frameworks, setFrameworks] = useState<FrameworkDB[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('frameworks')
        .select('id, name, description, category, structure, example, is_custom')
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
          }))
        );
      }
      setIsLoading(false);
    }
    load();
  }, []);

  return { frameworks, isLoading };
}
