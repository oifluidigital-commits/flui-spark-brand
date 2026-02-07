import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  Plus,
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
  Plus,
};

interface StepAudienceChallengesProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const MAX_CUSTOM_LENGTH = 60;
const MAX_CHALLENGES = 3;

export default function StepAudienceChallenges({
  formData,
  updateFormData,
}: StepAudienceChallengesProps) {
  const [showAudienceCustom, setShowAudienceCustom] = useState(formData.audienceType === 'other');
  const [showChallengeCustom, setShowChallengeCustom] = useState(formData.challenges.includes('other'));

  const handleAudienceSelect = (audienceId: string) => {
    if (formData.audienceType === audienceId) {
      updateFormData({ audienceType: '', customAudience: '' });
      setShowAudienceCustom(false);
    } else {
      updateFormData({ audienceType: audienceId });
      setShowAudienceCustom(audienceId === 'other');
      if (audienceId !== 'other') {
        updateFormData({ customAudience: '' });
      }
    }
  };

  const handleChallengeToggle = (challengeId: string) => {
    const currentChallenges = formData.challenges;
    
    if (currentChallenges.includes(challengeId)) {
      updateFormData({
        challenges: currentChallenges.filter((c) => c !== challengeId),
      });
      if (challengeId === 'other') {
        setShowChallengeCustom(false);
        updateFormData({ customChallenge: '' });
      }
    } else if (currentChallenges.length < MAX_CHALLENGES) {
      updateFormData({
        challenges: [...currentChallenges, challengeId],
      });
      if (challengeId === 'other') {
        setShowChallengeCustom(true);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Audience Type Selection - Card Grid */}
      <div className="space-y-3">
        <Label>Para quem você quer criar conteúdo?</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {audienceTypes.map((audience) => {
            const Icon = iconMap[audience.icon];
            const isSelected = formData.audienceType === audience.id;
            const isOther = audience.id === 'other';
            
            return (
              <Card
                key={audience.id}
                onClick={() => handleAudienceSelect(audience.id)}
                className={cn(
                  'p-4 cursor-pointer transition-all hover:border-primary/50',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary',
                  isOther && 'border-dashed'
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

        {/* Custom Audience Input */}
        {showAudienceCustom && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Label htmlFor="customAudience">
              Descreva sua audiência <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <div className="relative">
              <Input
                id="customAudience"
                type="text"
                placeholder="Ex: Mães empreendedoras..."
                value={formData.customAudience}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CUSTOM_LENGTH) {
                    updateFormData({ customAudience: e.target.value });
                  }
                }}
                className="bg-secondary border-border pr-16"
                maxLength={MAX_CUSTOM_LENGTH}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {formData.customAudience.length}/{MAX_CUSTOM_LENGTH}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Challenges Selection - Checklist Grid */}
      <div className="space-y-3">
        <Label>Quais são seus maiores desafios com conteúdo? (até {MAX_CHALLENGES})</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {challengeOptions.map((challenge) => {
            const Icon = iconMap[challenge.icon];
            const isSelected = formData.challenges.includes(challenge.id);
            const isDisabled = formData.challenges.length >= MAX_CHALLENGES && !isSelected;
            const isOther = challenge.id === 'other';
            
            return (
              <div
                key={challenge.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-all',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-secondary/50',
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:border-primary/50',
                  isOther && !isSelected && 'border-dashed'
                )}
                onClick={() => !isDisabled && handleChallengeToggle(challenge.id)}
              >
                <Checkbox
                  id={challenge.id}
                  checked={isSelected}
                  disabled={isDisabled}
                  className="pointer-events-none"
                />
                {Icon && (
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      isSelected ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                )}
                <span
                  className={cn(
                    'text-sm',
                    isSelected ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {challenge.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">
          {formData.challenges.length}/{MAX_CHALLENGES} selecionados
        </p>

        {/* Custom Challenge Input */}
        {showChallengeCustom && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Label htmlFor="customChallenge">
              Descreva seu desafio <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <div className="relative">
              <Input
                id="customChallenge"
                type="text"
                placeholder="Ex: Equilibrar conteúdo técnico e acessível..."
                value={formData.customChallenge}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CUSTOM_LENGTH) {
                    updateFormData({ customChallenge: e.target.value });
                  }
                }}
                className="bg-secondary border-border pr-16"
                maxLength={MAX_CUSTOM_LENGTH}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {formData.customChallenge.length}/{MAX_CUSTOM_LENGTH}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}