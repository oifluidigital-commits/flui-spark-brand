import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { expertiseAreas, OnboardingFormData } from '@/data/onboardingData';
import { cn } from '@/lib/utils';
import {
  Code,
  Megaphone,
  Briefcase,
  Package,
  Palette,
  Heart,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Megaphone,
  Briefcase,
  Package,
  Palette,
  Heart,
  GraduationCap,
  TrendingUp,
};

interface StepExpertiseAreaProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

export default function StepExpertiseArea({
  formData,
  updateFormData,
}: StepExpertiseAreaProps) {
  const selectedArea = expertiseAreas.find((area) => area.id === formData.primaryArea);

  const handleAreaSelect = (areaId: string) => {
    if (formData.primaryArea === areaId) {
      updateFormData({ primaryArea: '', subareas: [] });
    } else {
      updateFormData({ primaryArea: areaId, subareas: [] });
    }
  };

  const handleSubareaToggle = (subarea: string) => {
    const currentSubareas = formData.subareas;
    if (currentSubareas.includes(subarea)) {
      updateFormData({
        subareas: currentSubareas.filter((s) => s !== subarea),
      });
    } else if (currentSubareas.length < 3) {
      updateFormData({
        subareas: [...currentSubareas, subarea],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Area Selection */}
      <div className="space-y-3">
        <Label>Qual é sua principal área de atuação?</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {expertiseAreas.map((area) => {
            const Icon = iconMap[area.icon];
            const isSelected = formData.primaryArea === area.id;
            
            return (
              <Card
                key={area.id}
                onClick={() => handleAreaSelect(area.id)}
                className={cn(
                  'p-4 cursor-pointer transition-all hover:border-zinc-700',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary'
                )}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  {Icon && (
                    <Icon
                      className={cn(
                        'h-6 w-6',
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
                    {area.label}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Subareas Selection */}
      {selectedArea && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Label>
            Selecione até 3 subáreas em {selectedArea.label}
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedArea.subareas.map((subarea) => {
              const isSelected = formData.subareas.includes(subarea);
              
              return (
                <Badge
                  key={subarea}
                  variant={isSelected ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all py-2 px-3',
                    isSelected
                      ? 'bg-primary hover:bg-primary/90'
                      : 'hover:border-zinc-700'
                  )}
                  onClick={() => handleSubareaToggle(subarea)}
                >
                  {subarea}
                </Badge>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            {formData.subareas.length}/3 selecionadas
          </p>
        </div>
      )}
    </div>
  );
}
