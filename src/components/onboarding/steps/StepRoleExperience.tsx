import { useState, useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { roleOptions, experienceLevels, OnboardingFormData } from '@/data/onboardingData';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

interface StepRoleExperienceProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

const MAX_CUSTOM_LENGTH = 60;

export default function StepRoleExperience({
  formData,
  updateFormData,
}: StepRoleExperienceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter roles based on search query
  const filteredRoles = useMemo(() => {
    if (!searchQuery.trim()) return roleOptions;
    const query = searchQuery.toLowerCase();
    return roleOptions.filter(
      (role) => role.label.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Check if user typed something not in the list
  const showCustomOption = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const query = searchQuery.toLowerCase();
    const exactMatch = roleOptions.some(
      (role) => role.label.toLowerCase() === query
    );
    return !exactMatch && searchQuery.length >= 2;
  }, [searchQuery]);

  const handleRoleSelect = (roleValue: string, roleLabel: string) => {
    updateFormData({ role: roleValue, customRole: '' });
    setSearchQuery(roleLabel);
    setIsSearchFocused(false);
  };

  const handleCustomRole = () => {
    updateFormData({ role: 'custom', customRole: searchQuery.trim() });
    setIsSearchFocused(false);
  };

  const handleClearRole = () => {
    updateFormData({ role: '', customRole: '' });
    setSearchQuery('');
  };

  const getExperienceLabel = (value: number) => {
    const level = experienceLevels[value];
    return level?.label || '0-2 anos';
  };

  const getExperienceDescription = (value: number) => {
    switch (value) {
      case 0:
        return 'Ótimo momento para começar a construir sua marca pessoal!';
      case 1:
        return 'Você já tem bagagem para compartilhar insights valiosos.';
      case 2:
        return 'Sua experiência é um diferencial competitivo forte.';
      case 3:
        return 'Você tem autoridade natural para liderar conversas.';
      default:
        return '';
    }
  };

  const selectedRoleLabel = useMemo(() => {
    if (formData.role === 'custom') return formData.customRole;
    const role = roleOptions.find((r) => r.value === formData.role);
    return role?.label || '';
  }, [formData.role, formData.customRole]);

  return (
    <div className="space-y-8">
      {/* Role Autocomplete */}
      <div className="space-y-3">
        <Label htmlFor="role">Qual é o seu cargo ou função?</Label>
        
        {/* Selected Role Display */}
        {formData.role && !isSearchFocused && (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="py-2 px-4 text-sm bg-primary">
              {selectedRoleLabel}
              <button
                onClick={handleClearRole}
                className="ml-2 hover:text-primary-foreground/80"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}

        {/* Search Input */}
        {(!formData.role || isSearchFocused) && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="role"
              type="text"
              placeholder="Digite ou busque seu cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                // Delay to allow click on options
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
              className="pl-10 bg-secondary border-border"
              maxLength={MAX_CUSTOM_LENGTH}
            />
            
            {/* Character counter for custom input */}
            {showCustomOption && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {searchQuery.length}/{MAX_CUSTOM_LENGTH}
              </span>
            )}
          </div>
        )}

        {/* Dropdown Options */}
        {isSearchFocused && (
          <Card className="border-border bg-secondary p-2 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Custom Option */}
            {showCustomOption && (
              <button
                className="w-full text-left px-3 py-2 rounded-md hover:bg-primary/10 transition-colors flex items-center gap-2 border-b border-border mb-2 pb-3"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleCustomRole}
              >
                <Badge variant="outline" className="text-xs">Personalizado</Badge>
                <span className="text-sm text-foreground">"{searchQuery}"</span>
              </button>
            )}

            {/* Filtered Roles */}
            {filteredRoles.length > 0 ? (
              <div className="space-y-1">
                {filteredRoles.map((role) => (
                  <button
                    key={role.value}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-md transition-colors text-sm',
                      formData.role === role.value
                        ? 'bg-primary/20 text-foreground'
                        : 'hover:bg-secondary-foreground/10 text-muted-foreground hover:text-foreground'
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleRoleSelect(role.value, role.label)}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            ) : (
              !showCustomOption && (
                <p className="text-sm text-muted-foreground px-3 py-2">
                  Nenhum cargo encontrado
                </p>
              )
            )}
          </Card>
        )}
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
            {getExperienceDescription(formData.experienceLevel)}
          </p>
        </div>
      </div>
    </div>
  );
}