import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { roleOptions, experienceLevels, OnboardingFormData } from '@/data/onboardingData';
import { cn } from '@/lib/utils';

interface StepRoleExperienceProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

export default function StepRoleExperience({
  formData,
  updateFormData,
}: StepRoleExperienceProps) {
  const getExperienceLabel = (value: number) => {
    const level = experienceLevels[value];
    return level?.label || '0-2 anos';
  };

  return (
    <div className="space-y-8">
      {/* Role Select */}
      <div className="space-y-2">
        <Label htmlFor="role">Qual é o seu cargo ou função?</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => updateFormData({ role: value })}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Selecione seu cargo" />
          </SelectTrigger>
          <SelectContent>
            {roleOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Experience Slider */}
      <div className="space-y-4">
        <Label>Tempo de experiência na área</Label>
        <div className="px-2">
          <Slider
            value={[formData.experienceLevel]}
            onValueChange={(value) => updateFormData({ experienceLevel: value[0] })}
            min={0}
            max={3}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between mt-3">
            {experienceLevels.map((level, index) => (
              <span
                key={level.value}
                className={cn(
                  'text-xs transition-colors',
                  formData.experienceLevel === index
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                )}
              >
                {level.label}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-secondary p-4 rounded-lg mt-4">
          <p className="text-sm text-foreground font-medium">
            {getExperienceLabel(formData.experienceLevel)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formData.experienceLevel === 0 && 'Ótimo momento para começar a construir sua marca pessoal!'}
            {formData.experienceLevel === 1 && 'Você já tem bagagem para compartilhar insights valiosos.'}
            {formData.experienceLevel === 2 && 'Sua experiência é um diferencial competitivo forte.'}
            {formData.experienceLevel === 3 && 'Você tem autoridade natural para liderar conversas.'}
          </p>
        </div>
      </div>
    </div>
  );
}
