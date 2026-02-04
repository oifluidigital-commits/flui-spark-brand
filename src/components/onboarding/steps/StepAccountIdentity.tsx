import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, User } from 'lucide-react';
import { OnboardingFormData } from '@/data/onboardingData';

interface StepAccountIdentityProps {
  formData: OnboardingFormData;
  updateFormData: (updates: Partial<OnboardingFormData>) => void;
}

export default function StepAccountIdentity({
  formData,
  updateFormData,
}: StepAccountIdentityProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(formData.profilePhoto);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      updateFormData({ profilePhoto: url });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo Upload */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="w-24 h-24 border-2 border-border">
            <AvatarImage src={previewUrl || undefined} />
            <AvatarFallback className="bg-secondary text-2xl">
              {formData.name ? getInitials(formData.name) : <User className="h-10 w-10" />}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="photo-upload"
            className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Camera className="h-4 w-4 text-primary-foreground" />
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
        </div>
        <p className="text-sm text-muted-foreground">
          Clique para adicionar sua foto
        </p>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          placeholder="Como você gostaria de ser chamado(a)?"
          className="bg-secondary border-border"
        />
      </div>

      {/* Email (read-only) */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={formData.email}
          disabled
          className="bg-secondary/50 border-border text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground">
          Este é o email vinculado à sua conta
        </p>
      </div>
    </div>
  );
}
