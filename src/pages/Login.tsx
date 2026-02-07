import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

// Login schema
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email é obrigatório' })
    .email({ message: 'Email inválido' })
    .max(255, { message: 'Email muito longo' }),
  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória' }),
});

// Signup schema
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
      .min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Você precisa aceitar os termos' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

// Google icon SVG component
function GoogleIcon() {
  return (
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
  );
}

// Password input with show/hide toggle
function PasswordInput({
  id,
  placeholder = '••••••••',
  error,
  disabled,
  ...props
}: {
  id: string;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> & { register?: any }) {
  const [show, setShow] = useState(false);
  const { register: _reg, ...rest } = props as any;

  return (
    <div className="relative">
      <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className={`pl-10 pr-10 rounded-lg bg-white dark:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-violet-600 ${error ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-700'}`}
        disabled={disabled}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 transition-colors"
        tabIndex={-1}
        aria-label={show ? 'Ocultar senha' : 'Mostrar senha'}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// Verification modal
function VerificationModal({
  open,
  onClose,
  email,
  onSkip,
}: {
  open: boolean;
  onClose: () => void;
  email: string;
  onSkip: () => void;
}) {
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCountdown(60);
    setCanResend(false);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);

  const handleResend = () => {
    toast.success('Email reenviado com sucesso!');
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader className="text-center items-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
            <Mail className="h-6 w-6 text-violet-600" />
          </div>
          <DialogTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Verifique seu email
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400">
            Enviamos um link de confirmação para{' '}
            <span className="font-medium text-zinc-900 dark:text-zinc-50">{email}</span>.
            Clique no link para desbloquear todas as funcionalidades.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-2">
          {canResend ? (
            <Button
              variant="outline"
              className="w-full rounded-lg border-zinc-200 dark:border-zinc-700"
              onClick={handleResend}
            >
              Reenviar email
            </Button>
          ) : (
            <p className="text-center text-sm text-zinc-400">
              Reenviar em {countdown}s
            </p>
          )}

          <Button
            variant="ghost"
            className="w-full text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            onClick={onSkip}
          >
            Pular verificação por agora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, signUp, isAuthenticated, profile, isLoading, isInitialized } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Signup form
  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { acceptTerms: undefined },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated && profile) {
      if (!profile.name || profile.name.trim() === '') {
        navigate('/complete-profile', { replace: true });
      } else if (profile.onboarding_status === 'completed') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [isInitialized, isAuthenticated, profile, navigate]);

  const onLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const { error } = await signInWithEmail(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes('Email ou senha')) {
        loginForm.setError('password', { message: error.message });
      } else {
        loginForm.setError('email', { message: error.message });
      }
      toast.error(error.message);
      return;
    }

    toast.success('Login realizado com sucesso!');
  };

  const onSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    const { error } = await signUp(data.email, data.password, data.name);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes('já está cadastrado') || error.message.includes('already')) {
        signupForm.setError('email', { message: 'Este email já está cadastrado' });
      } else if (error.message.includes('Senha') || error.message.includes('Password')) {
        signupForm.setError('password', { message: error.message });
      } else {
        signupForm.setError('email', { message: error.message });
      }
      toast.error(error.message);
      return;
    }

    // Show soft verification modal
    setVerificationEmail(data.email);
    setShowVerification(true);
    toast.success('Conta criada com sucesso!');
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    await signInWithGoogle();
    setIsGoogleLoading(false);
  };

  const handleSkipVerification = () => {
    setShowVerification(false);
    navigate('/onboarding', { replace: true });
  };

  const switchMode = useCallback((newMode: 'login' | 'signup') => {
    setMode(newMode);
    loginForm.clearErrors();
    signupForm.clearErrors();
  }, [loginForm, signupForm]);

  const anyLoading = isSubmitting || isGoogleLoading;

  // Loading while checking session
  if (!isInitialized || isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-[400px] mx-auto">
        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-md p-6 space-y-6">
          {/* Tab Toggle */}
          <div className="flex rounded-lg bg-zinc-100 dark:bg-zinc-800 p-1">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'login'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'signup'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              Criar conta
            </button>
          </div>

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-zinc-700 dark:text-zinc-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    {...loginForm.register('email')}
                    className={`pl-10 rounded-lg bg-white dark:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-violet-600 ${loginForm.formState.errors.email ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                    disabled={anyLoading}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-rose-600">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" className="text-zinc-700 dark:text-zinc-300">Senha</Label>
                  <button type="button" className="text-xs text-violet-600 hover:underline">
                    Esqueceu a senha?
                  </button>
                </div>
                <PasswordInput
                  id="login-password"
                  error={!!loginForm.formState.errors.password}
                  disabled={anyLoading}
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-rose-600">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white min-h-[44px]"
                disabled={anyLoading}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
          )}

          {/* Signup Form */}
          {mode === 'signup' && (
            <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-zinc-700 dark:text-zinc-300">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu nome completo"
                    {...signupForm.register('name')}
                    className={`pl-10 rounded-lg bg-white dark:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-violet-600 ${signupForm.formState.errors.name ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                    disabled={anyLoading}
                  />
                </div>
                {signupForm.formState.errors.name && (
                  <p className="text-sm text-rose-600">{signupForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-zinc-700 dark:text-zinc-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    {...signupForm.register('email')}
                    className={`pl-10 rounded-lg bg-white dark:bg-zinc-900 focus-visible:ring-2 focus-visible:ring-violet-600 ${signupForm.formState.errors.email ? 'border-rose-500' : 'border-zinc-200 dark:border-zinc-700'}`}
                    disabled={anyLoading}
                  />
                </div>
                {signupForm.formState.errors.email && (
                  <p className="text-sm text-rose-600">{signupForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-zinc-700 dark:text-zinc-300">Senha</Label>
                <PasswordInput
                  id="signup-password"
                  error={!!signupForm.formState.errors.password}
                  disabled={anyLoading}
                  {...signupForm.register('password')}
                />
                {signupForm.formState.errors.password && (
                  <p className="text-sm text-rose-600">{signupForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-confirm" className="text-zinc-700 dark:text-zinc-300">Confirmar senha</Label>
                <PasswordInput
                  id="signup-confirm"
                  error={!!signupForm.formState.errors.confirmPassword}
                  disabled={anyLoading}
                  {...signupForm.register('confirmPassword')}
                />
                {signupForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-rose-600">{signupForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={signupForm.watch('acceptTerms') === true}
                  onCheckedChange={(checked) => signupForm.setValue('acceptTerms', checked === true ? true : undefined as any, { shouldValidate: true })}
                  disabled={anyLoading}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="text-sm text-zinc-600 dark:text-zinc-400 leading-snug cursor-pointer">
                  Li e concordo com a{' '}
                  <Link to="/privacy-policy" className="text-violet-600 hover:underline">
                    Política de Privacidade
                  </Link>
                </Label>
              </div>
              {signupForm.formState.errors.acceptTerms && (
                <p className="text-sm text-rose-600">{signupForm.formState.errors.acceptTerms.message}</p>
              )}

              <Button
                type="submit"
                className="w-full rounded-lg bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white min-h-[44px]"
                disabled={anyLoading}
              >
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
          )}

          {/* Divider */}
          <div className="relative">
            <Separator className="bg-zinc-200 dark:bg-zinc-700" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 px-3 text-xs text-zinc-400">
              ou continue com
            </span>
          </div>

          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full rounded-lg border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 min-h-[44px] text-zinc-700 dark:text-zinc-300"
            onClick={handleGoogleLogin}
            disabled={anyLoading}
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <GoogleIcon />
                Continuar com Google
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Link
            to="/privacy-policy"
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Política de Privacidade
          </Link>
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        open={showVerification}
        onClose={() => setShowVerification(false)}
        email={verificationEmail}
        onSkip={handleSkipVerification}
      />
    </AuthLayout>
  );
}
