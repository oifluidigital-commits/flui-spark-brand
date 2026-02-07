import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
  Target,
  BarChart,
  Settings,
  Users,
  Award,
  Crown,
  Sparkles,
  Plus,
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
  Target,
  BarChart,
  Settings,
  Users,
  Award,
  Crown,
  Sparkles,
  Plus,
};

interface StepExpertiseAreaProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const MAX_CUSTOM_LENGTH = 60;

export default function StepExpertiseArea({
  formData,
  updateFormData,
}: StepExpertiseAreaProps) {
  const [showCustomInput, setShowCustomInput] = useState(formData.primaryArea === 'other');
  
  const selectedArea = expertiseAreas.find((area) => area.id === formData.primaryArea);

  const handleAreaSelect = (areaId: string) => {
    if (formData.primaryArea === areaId) {
      updateFormData({ primaryArea: '', customArea: '', subareas: [] });
      setShowCustomInput(false);
    } else {
      updateFormData({ primaryArea: areaId, subareas: [] });
      setShowCustomInput(areaId === 'other');
      if (areaId !== 'other') {
        updateFormData({ customArea: '' });
      }
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

  const handleCustomAreaChange = (value: string) => {
    if (value.length <= MAX_CUSTOM_LENGTH) {
      updateFormData({ customArea: value });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Area Selection - Card Grid */}
      <div className="space-y-3">
        <Label>Qual é sua principal área de atuação?</Label>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {expertiseAreas.map((area) => {
            const Icon = iconMap[area.icon];
            const isSelected = formData.primaryArea === area.id;
            const isOther = area.id === 'other';
            
            return (
              <Card
                key={area.id}
                onClick={() => handleAreaSelect(area.id)}
                className={cn(
                  'p-3 cursor-pointer transition-all hover:border-primary/50',
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary',
                  isOther && 'border-dashed'
                )}
              >
                <div className="flex flex-col items-center gap-2 text-center">
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
                      'text-xs font-medium',
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

      {/* Custom Area Input - Conditional */}
      {showCustomInput && (
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Label htmlFor="customArea">
            Especifique sua área <span className="text-muted-foreground">(opcional)</span>
          </Label>
          <div className="relative">
            <Input
              id="customArea"
              type="text"
              placeholder="Ex: Sustentabilidade, Saúde Mental..."
              value={formData.customArea}
              onChange={(e) => handleCustomAreaChange(e.target.value)}
              className="bg-secondary border-border pr-16"
              maxLength={MAX_CUSTOM_LENGTH}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {formData.customArea.length}/{MAX_CUSTOM_LENGTH}
            </span>
          </div>
        </div>
      )}

      {/* Subareas Selection - Multi-select chips */}
      {selectedArea && selectedArea.subareas.length > 0 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Label>
            Selecione até 3 subáreas em {selectedArea.label}
          </Label>
          <div className="flex flex-wrap gap-2">
            {selectedArea.subareas.map((subarea) => {
              const isSelected = formData.subareas.includes(subarea);
              const isDisabled = formData.subareas.length >= 3 && !isSelected;
              
              return (
                <Badge
                  key={subarea}
                  variant={isSelected ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer transition-all py-2 px-3',
                    isSelected
                      ? 'bg-primary hover:bg-primary/90'
                      : 'hover:border-primary/50',
                    isDisabled && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => !isDisabled && handleSubareaToggle(subarea)}
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