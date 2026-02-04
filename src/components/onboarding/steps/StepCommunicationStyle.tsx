import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { communicationDimensions, OnboardingFormData } from '@/data/onboardingData';
import { cn } from '@/lib/utils';
import {
  Coffee,
  Briefcase,
  BookOpen,
  BarChart,
  Shield,
  Zap,
  Volume1,
  Volume2,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Coffee,
  Briefcase,
  BookOpen,
  BarChart,
  Shield,
  Zap,
  Volume1,
  Volume2,
};

interface StepCommunicationStyleProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

export default function StepCommunicationStyle({
  formData,
  updateFormData,
}: StepCommunicationStyleProps) {
  const handleSliderChange = (dimension: string, value: number[]) => {
    updateFormData({
      communicationStyle: {
        ...formData.communicationStyle,
        [dimension]: value[0],
      },
    });
  };

  const getPositionLabel = (value: number): string => {
    if (value <= 25) return 'Muito à esquerda';
    if (value <= 40) return 'À esquerda';
    if (value <= 60) return 'Equilibrado';
    if (value <= 75) return 'À direita';
    return 'Muito à direita';
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Label>Como você prefere se comunicar?</Label>
        <p className="text-sm text-muted-foreground">
          Ajuste os sliders para definir seu estilo de comunicação ideal.
        </p>
      </div>

      <div className="space-y-8">
        {communicationDimensions.map((dimension) => {
          const LeftIcon = iconMap[dimension.leftIcon];
          const RightIcon = iconMap[dimension.rightIcon];
          const value = formData.communicationStyle[dimension.id as keyof typeof formData.communicationStyle];

          return (
            <div key={dimension.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {LeftIcon && (
                    <LeftIcon
                      className={cn(
                        'h-4 w-4',
                        value < 50 ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      value < 50 ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {dimension.left}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-sm font-medium',
                      value > 50 ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {dimension.right}
                  </span>
                  {RightIcon && (
                    <RightIcon
                      className={cn(
                        'h-4 w-4',
                        value > 50 ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  )}
                </div>
              </div>

              <Slider
                value={[value]}
                onValueChange={(val) => handleSliderChange(dimension.id, val)}
                min={0}
                max={100}
                step={5}
                className="w-full"
              />

              <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary/30 via-primary to-primary/30 transition-all"
                  style={{
                    width: `${value}%`,
                    marginLeft: value > 50 ? 'auto' : '0',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-secondary p-4 rounded-lg">
        <p className="text-sm font-medium mb-3">Seu perfil de comunicação:</p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Formalidade:</span>
            <span className="ml-2 text-foreground">
              {formData.communicationStyle.formality < 40 ? 'Casual' : 
               formData.communicationStyle.formality > 60 ? 'Formal' : 'Equilibrado'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Abordagem:</span>
            <span className="ml-2 text-foreground">
              {formData.communicationStyle.approach < 40 ? 'Storyteller' : 
               formData.communicationStyle.approach > 60 ? 'Data-driven' : 'Híbrido'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Tom:</span>
            <span className="ml-2 text-foreground">
              {formData.communicationStyle.tone < 40 ? 'Seguro' : 
               formData.communicationStyle.tone > 60 ? 'Provocativo' : 'Moderado'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Expressão:</span>
            <span className="ml-2 text-foreground">
              {formData.communicationStyle.expression < 40 ? 'Reservado' : 
               formData.communicationStyle.expression > 60 ? 'Expressivo' : 'Neutro'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
