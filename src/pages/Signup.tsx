import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// Validation schema
const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: 'Nome deve ter no mínimo 2 caracteres' })
      .max(100, { message: 'Nome muito longo' }),
    email: z
      .string()
      .trim()
      .min(1, { message: 'Email é obrigatório' })
      .email({ message: 'Email inválido' })
      .max(255, { message: 'Email muito longo' }),
    password: z
      .string()
      .min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, isAuthenticated, profile, isLoading, isInitialized } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated && profile) {
      if (profile.onboarding_status === 'completed') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isInitialized, isAuthenticated, profile, navigate]);

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);

    const { error, needsEmailConfirmation } = await signUp(data.email, data.password, data.name);

    if (error) {
      setIsSubmitting(false);
      
      if (error.message.includes('já está cadastrado')) {
        setError('email', { message: error.message });
      } else if (error.message.includes('Senha')) {
        setError('password', { message: error.message });
      } else {
        setError('email', { message: error.message });
      }
      
      toast.error(error.message);
      return;
    }

    setIsSubmitting(false);

    if (needsEmailConfirmation) {
      setSubmittedEmail(data.email);
      setShowConfirmation(true);
    } else {
      toast.success('Conta criada com sucesso!');
      navigate('/onboarding');
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signInWithGoogle();
    setIsGoogleLoading(false);
  };

  // Show loading while checking session
  if (!isInitialized || isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    );
  }

  // Show email confirmation message
  if (showConfirmation) {
    return (
      <AuthLayout>
        <Card className="border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            </div>
            <CardTitle className="text-2xl">Verifique seu email</CardTitle>
            <CardDescription className="mt-2">
              Enviamos um link de confirmação para{' '}
              <span className="font-medium text-foreground">{submittedEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Clique no link do email para ativar sua conta e começar a usar o Flui.
            </p>
            <div className="pt-4">
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Voltar para o login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription>
            Comece a planejar sua estratégia de conteúdo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  {...register('name')}
                  className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                  disabled={isSubmitting || isGoogleLoading}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  disabled={isSubmitting || isGoogleLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                  disabled={isSubmitting || isGoogleLoading}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                  disabled={isSubmitting || isGoogleLoading}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || isGoogleLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              ou continue com
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isSubmitting || isGoogleLoading}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar com Google
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Fazer login
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
