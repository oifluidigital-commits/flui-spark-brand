import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { audienceTypes, challengeOptions, OnboardingFormData } from '@/data/onboardingData';
import { cn } from '@/lib/utils';
import {
  Sprout,
  TrendingUp,
  Rocket,
  Crown,
  Briefcase,
  RefreshCw,
  Calendar,
  Lightbulb,
  Clock,
  MessageCircle,
  Compass,
  Sparkles,
  Pen,
  DollarSign,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sprout,
  TrendingUp,
  Rocket,
  Crown,
  Briefcase,
  RefreshCw,
  Calendar,
  Lightbulb,
  Clock,
  MessageCircle,
  Compass,
  Sparkles,
  Pen,
  DollarSign,
};

interface StepAudienceChallengesProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

export default function StepAudienceChallenges({
  formData,
  updateFormData,
}: StepAudienceChallengesProps) {
  const handleAudienceSelect = (audienceId: string) => {
    if (formData.audienceType === audienceId) {
      updateFormData({ audienceType: '' });
    } else {
      updateFormData({ audienceType: audienceId });
    }
  };

  const handleChallengeToggle = (challengeId: string) => {
    const currentChallenges = formData.challenges;
    if (currentChallenges.includes(challengeId)) {
      updateFormData({
        challenges: currentChallenges.filter((c) => c !== challengeId),
      });
    } else if (currentChallenges.length < 3) {
      updateFormData({
        challenges: [...currentChallenges, challengeId],
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Audience Type Selection */}
      <div className="space-y-3">
        <Label>Para quem você quer criar conteúdo?</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {audienceTypes.map((audience) => {
            const Icon = iconMap[audience.icon];
            const isSelected = formData.audienceType === audience.id;
            
            return (
              <Card
                key={audience.id}
                onClick={() => handleAudienceSelect(audience.id)}
                className={cn(
                  'p-4 cursor-pointer transition-all hover:border-zinc-700',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary'
                )}
              >
                <div className="flex flex-col gap-2">
                  {Icon && (
                    <Icon
                      className={cn(
                        'h-5 w-5',
                        isSelected ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      isSelected ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {audience.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {audience.description}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Challenges Selection */}
      <div className="space-y-3">
        <Label>Quais são seus maiores desafios com conteúdo? (até 3)</Label>
        <div className="flex flex-wrap gap-2">
          {challengeOptions.map((challenge) => {
            const Icon = iconMap[challenge.icon];
            const isSelected = formData.challenges.includes(challenge.id);
            
            return (
              <Badge
                key={challenge.id}
                variant={isSelected ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-all py-2 px-3 flex items-center gap-2',
                  isSelected
                    ? 'bg-primary hover:bg-primary/90'
                    : 'hover:border-zinc-700',
                  formData.challenges.length >= 3 && !isSelected && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => handleChallengeToggle(challenge.id)}
              >
                {Icon && <Icon className="h-3 w-3" />}
                {challenge.label}
              </Badge>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {formData.challenges.length}/3 selecionados
        </p>
      </div>
    </div>
  );
}
