import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { goalOptions, OnboardingFormData } from '@/data/onboardingData';
import { cn } from '@/lib/utils';
import {
  Award,
  Users,
  Target,
  ShoppingBag,
  Heart,
  Star,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award,
  Users,
  Target,
  ShoppingBag,
  Heart,
  Star,
};

interface StepGoalsProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

export default function StepGoals({
  formData,
  updateFormData,
}: StepGoalsProps) {
  const handlePrimaryGoalSelect = (goalId: string) => {
    if (formData.primaryGoal === goalId) {
      updateFormData({ primaryGoal: '' });
    } else {
      // If selecting a new primary goal that was the secondary, clear secondary
      if (formData.secondaryGoal === goalId) {
        updateFormData({ primaryGoal: goalId, secondaryGoal: '' });
      } else {
        updateFormData({ primaryGoal: goalId });
      }
    }
  };

  const handleSecondaryGoalSelect = (goalId: string) => {
    if (formData.secondaryGoal === goalId) {
      updateFormData({ secondaryGoal: '' });
    } else if (goalId !== formData.primaryGoal) {
      updateFormData({ secondaryGoal: goalId });
    }
  };

  return (
    <div className="space-y-8">
      {/* Primary Goal */}
      <div className="space-y-3">
        <Label>Qual é seu objetivo principal com conteúdo?</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {goalOptions.map((goal) => {
            const Icon = iconMap[goal.icon];
            const isSelected = formData.primaryGoal === goal.id;
            
            return (
              <Card
                key={goal.id}
                onClick={() => handlePrimaryGoalSelect(goal.id)}
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
                
                return (
                  <Card
                    key={goal.id}
                    onClick={() => handleSecondaryGoalSelect(goal.id)}
                    className={cn(
                      'p-3 cursor-pointer transition-all hover:border-zinc-700',
                      isSelected
                        ? 'border-primary/60 bg-primary/5'
                        : 'border-border bg-secondary/50'
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
        </div>
      )}
    </div>
  );
}
