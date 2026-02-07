import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, User } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '@/contexts/AppContext';

// Validation schema
const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
    .max(200, { message: 'Nome muito longo' }),
});

type NameFormData = z.infer<typeof nameSchema>;

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { profile, updateProfile, refreshProfile } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
  });

  const onSubmit = async (data: NameFormData) => {
    if (!profile) return;

    setIsSubmitting(true);

    const success = await updateProfile(profile.user_id, {
      name: data.name.trim(),
      onboarding_status: 'not_started',
    });

    if (success) {
      await refreshProfile();
      toast.success('Nome salvo com sucesso!');
      navigate('/onboarding', { replace: true });
    } else {
      toast.error('Erro ao salvar nome. Tente novamente.');
    }

    setIsSubmitting(false);
  };

  return (
    <AuthLayout>
      <Card className="border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Qual é o seu nome?</CardTitle>
          <CardDescription>
            Precisamos do seu nome para personalizar sua experiência
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* User email (read-only) */}
          {profile?.email && (
            <p className="text-sm text-muted-foreground text-center mb-6">
              Conectado como <span className="font-medium text-foreground">{profile.email}</span>
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  {...register('name')}
                  className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                  disabled={isSubmitting}
                  autoFocus
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Continuar diagnóstico'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
