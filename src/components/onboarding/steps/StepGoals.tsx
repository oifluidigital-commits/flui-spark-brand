import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { goalOptions, OnboardingFormData } from '@/data/onboardingData';
import { cn } from '@/lib/utils';
import {
  Award,
  Users,
  Target,
  ShoppingBag,
  Heart,
  Star,
  Plus,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Users,
  Target,
  ShoppingBag,
  Heart,
  Star,
  Plus,
};

interface StepGoalsProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const MAX_CUSTOM_LENGTH = 60;

export default function StepGoals({
  formData,
  updateFormData,
}: StepGoalsProps) {
  const [showPrimaryCustom, setShowPrimaryCustom] = useState(formData.primaryGoal === 'other');
  const [showSecondaryCustom, setShowSecondaryCustom] = useState(formData.secondaryGoal === 'other');

  const handlePrimaryGoalSelect = (goalId: string) => {
    if (formData.primaryGoal === goalId) {
      updateFormData({ primaryGoal: '', customPrimaryGoal: '' });
      setShowPrimaryCustom(false);
    } else {
      // If selecting a new primary goal that was the secondary, clear secondary
      if (formData.secondaryGoal === goalId) {
        updateFormData({ primaryGoal: goalId, secondaryGoal: '', customSecondaryGoal: '' });
        setShowSecondaryCustom(false);
      } else {
        updateFormData({ primaryGoal: goalId });
      }
      setShowPrimaryCustom(goalId === 'other');
      if (goalId !== 'other') {
        updateFormData({ customPrimaryGoal: '' });
      }
    }
  };

  const handleSecondaryGoalSelect = (goalId: string) => {
    if (formData.secondaryGoal === goalId) {
      updateFormData({ secondaryGoal: '', customSecondaryGoal: '' });
      setShowSecondaryCustom(false);
    } else if (goalId !== formData.primaryGoal) {
      updateFormData({ secondaryGoal: goalId });
      setShowSecondaryCustom(goalId === 'other');
      if (goalId !== 'other') {
        updateFormData({ customSecondaryGoal: '' });
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Primary Goal */}
      <div className="space-y-3">
        <Label>Qual é seu objetivo principal com conteúdo?</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {goalOptions.map((goal) => {
            const Icon = iconMap[goal.icon];
            const isSelected = formData.primaryGoal === goal.id;
            const isOther = goal.id === 'other';
            
            return (
              <Card
                key={goal.id}
                onClick={() => handlePrimaryGoalSelect(goal.id)}
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
                    {goal.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {goal.description}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Custom Primary Goal Input */}
        {showPrimaryCustom && (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Label htmlFor="customPrimaryGoal">
              Defina seu objetivo <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <div className="relative">
              <Input
                id="customPrimaryGoal"
                type="text"
                placeholder="Ex: Educar sobre finanças pessoais..."
                value={formData.customPrimaryGoal}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CUSTOM_LENGTH) {
                    updateFormData({ customPrimaryGoal: e.target.value });
                  }
                }}
                className="bg-secondary border-border pr-16"
                maxLength={MAX_CUSTOM_LENGTH}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {formData.customPrimaryGoal.length}/{MAX_CUSTOM_LENGTH}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Secondary Goal */}
      {formData.primaryGoal && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Label>
            Objetivo secundário <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {goalOptions
              .filter((goal) => goal.id !== formData.primaryGoal)
              .map((goal) => {
                const Icon = iconMap[goal.icon];
                const isSelected = formData.secondaryGoal === goal.id;
                const isOther = goal.id === 'other';
                
                return (
                  <Card
                    key={goal.id}
                    onClick={() => handleSecondaryGoalSelect(goal.id)}
                    className={cn(
                      'p-3 cursor-pointer transition-all hover:border-primary/50',
                      isSelected
                        ? 'border-primary/60 bg-primary/5'
                        : 'border-border bg-secondary/50',
                      isOther && 'border-dashed'
                    )}
                  >
                    <div className="flex items-center gap-3">
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
                        {goal.label}
                      </span>
                    </div>
                  </Card>
                );
              })}
          </div>

          {/* Custom Secondary Goal Input */}
          {showSecondaryCustom && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Label htmlFor="customSecondaryGoal">
                Defina seu objetivo secundário <span className="text-muted-foreground">(opcional)</span>
              </Label>
              <div className="relative">
                <Input
                  id="customSecondaryGoal"
                  type="text"
                  placeholder="Ex: Inspirar jovens empreendedores..."
                  value={formData.customSecondaryGoal}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CUSTOM_LENGTH) {
                      updateFormData({ customSecondaryGoal: e.target.value });
                    }
                  }}
                  className="bg-secondary border-border pr-16"
                  maxLength={MAX_CUSTOM_LENGTH}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {formData.customSecondaryGoal.length}/{MAX_CUSTOM_LENGTH}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}