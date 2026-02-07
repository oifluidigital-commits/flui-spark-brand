import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { topicCategories, OnboardingFormData } from '@/data/onboardingData';
import { cn } from '@/lib/utils';
import { Sparkles, Plus, X } from 'lucide-react';

interface StepContentTopicsProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const MAX_TOPICS = 5;
const MAX_CUSTOM_TOPICS = 2;
const MAX_CUSTOM_LENGTH = 60;

export default function StepContentTopics({
  formData,
  updateFormData,
}: StepContentTopicsProps) {
  const [customTopicInput, setCustomTopicInput] = useState('');

  const totalSelected = formData.selectedTopics.length + formData.customTopics.length;
  const canSelectMore = totalSelected < MAX_TOPICS;
  const canAddCustom = formData.customTopics.length < MAX_CUSTOM_TOPICS && canSelectMore;

  const handleTopicToggle = (topic: string) => {
    const currentTopics = formData.selectedTopics;
    if (currentTopics.includes(topic)) {
      updateFormData({
        selectedTopics: currentTopics.filter((t) => t !== topic),
      });
    } else if (canSelectMore) {
      updateFormData({
        selectedTopics: [...currentTopics, topic],
      });
    }
  };

  const handleAddCustomTopic = () => {
    const trimmedTopic = customTopicInput.trim();
    if (
      trimmedTopic &&
      trimmedTopic.length <= MAX_CUSTOM_LENGTH &&
      !formData.customTopics.includes(trimmedTopic) &&
      !formData.selectedTopics.includes(trimmedTopic) &&
      canAddCustom
    ) {
      updateFormData({
        customTopics: [...formData.customTopics, trimmedTopic],
      });
      setCustomTopicInput('');
    }
  };

  const handleRemoveCustomTopic = (topic: string) => {
    updateFormData({
      customTopics: formData.customTopics.filter((t) => t !== topic),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTopic();
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <Label>Escolha seus tópicos de conteúdo</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Selecione até {MAX_TOPICS} tópicos que você deseja abordar. Você pode adicionar até {MAX_CUSTOM_TOPICS} tópicos personalizados.
        </p>
      </div>

      {/* Topics by Category */}
      <div className="space-y-4">
        {topicCategories.map((category) => (
          <div key={category.category} className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {category.category}
            </p>
            <div className="flex flex-wrap gap-2">
              {category.topics.map((topic) => {
                const isSelected = formData.selectedTopics.includes(topic);
                const isDisabled = !canSelectMore && !isSelected;
                
                return (
                  <Badge
                    key={topic}
                    variant={isSelected ? 'default' : 'outline'}
                    className={cn(
                      'cursor-pointer transition-all py-2 px-3 text-sm',
                      isSelected
                        ? 'bg-primary hover:bg-primary/90'
                        : 'hover:border-primary/50',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => !isDisabled && handleTopicToggle(topic)}
                  >
                    {topic}
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Topics */}
      <div className="space-y-3 pt-4 border-t border-border">
        <Label>
          Adicionar tópico personalizado{' '}
          <span className="text-muted-foreground">
            ({formData.customTopics.length}/{MAX_CUSTOM_TOPICS})
          </span>
        </Label>
        
        {/* Custom topic input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Ex: Inteligência Emocional..."
              value={customTopicInput}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CUSTOM_LENGTH) {
                  setCustomTopicInput(e.target.value);
                }
              }}
              onKeyPress={handleKeyPress}
              className="bg-secondary border-border pr-16"
              disabled={!canAddCustom}
              maxLength={MAX_CUSTOM_LENGTH}
            />
            {customTopicInput && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {customTopicInput.length}/{MAX_CUSTOM_LENGTH}
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAddCustomTopic}
            disabled={!customTopicInput.trim() || !canAddCustom}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Display custom topics */}
        {formData.customTopics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.customTopics.map((topic) => (
              <Badge
                key={topic}
                variant="default"
                className="bg-primary/80 py-2 px-3 flex items-center gap-2"
              >
                {topic}
                <button
                  onClick={() => handleRemoveCustomTopic(topic)}
                  className="hover:text-primary-foreground/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalSelected}/{MAX_TOPICS} tópicos selecionados
        </p>
        {totalSelected >= 1 && (
          <p className="text-sm text-success">
            ✓ Mínimo atingido
          </p>
        )}
      </div>

      {/* Selected Topics Preview */}
      {totalSelected > 0 && (
        <div className="bg-secondary p-4 rounded-lg animate-in fade-in duration-300">
          <p className="text-sm font-medium mb-2">Seus tópicos:</p>
          <div className="flex flex-wrap gap-2">
            {formData.selectedTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="bg-background">
                {topic}
              </Badge>
            ))}
            {formData.customTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="bg-background border-primary/30">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}