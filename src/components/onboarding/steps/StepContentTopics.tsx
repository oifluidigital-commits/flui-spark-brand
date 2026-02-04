import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { topicsByArea, OnboardingFormData } from '@/data/onboardingData';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

interface StepContentTopicsProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

export default function StepContentTopics({
  formData,
  updateFormData,
}: StepContentTopicsProps) {
  const topics = formData.primaryArea
    ? topicsByArea[formData.primaryArea] || []
    : Object.values(topicsByArea).flat().slice(0, 15);

  const handleTopicToggle = (topic: string) => {
    const currentTopics = formData.selectedTopics;
    if (currentTopics.includes(topic)) {
      updateFormData({
        selectedTopics: currentTopics.filter((t) => t !== topic),
      });
    } else if (currentTopics.length < 5) {
      updateFormData({
        selectedTopics: [...currentTopics, topic],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <Label>Tópicos sugeridos para você</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Baseado na sua área de atuação, selecionamos tópicos relevantes. Escolha até 5 que mais combinam com você.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => {
          const isSelected = formData.selectedTopics.includes(topic);
          
          return (
            <Badge
              key={topic}
              variant={isSelected ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-all py-2 px-4 text-sm',
                isSelected
                  ? 'bg-primary hover:bg-primary/90'
                  : 'hover:border-zinc-700',
                formData.selectedTopics.length >= 5 && !isSelected && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => handleTopicToggle(topic)}
            >
              {topic}
            </Badge>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {formData.selectedTopics.length}/5 tópicos selecionados
        </p>
        {formData.selectedTopics.length >= 3 && (
          <p className="text-sm text-success">
            ✓ Mínimo atingido
          </p>
        )}
      </div>

      {formData.selectedTopics.length > 0 && (
        <div className="bg-secondary p-4 rounded-lg animate-in fade-in duration-300">
          <p className="text-sm font-medium mb-2">Seus tópicos:</p>
          <div className="flex flex-wrap gap-2">
            {formData.selectedTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="bg-background">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
