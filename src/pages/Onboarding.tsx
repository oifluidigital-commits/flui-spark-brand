import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Components
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import StepAccountIdentity from '@/components/onboarding/steps/StepAccountIdentity';
import StepRoleExperience from '@/components/onboarding/steps/StepRoleExperience';
import StepExpertiseArea from '@/components/onboarding/steps/StepExpertiseArea';
import StepGoals from '@/components/onboarding/steps/StepGoals';
import StepContentTopics from '@/components/onboarding/steps/StepContentTopics';
import StepAudienceChallenges from '@/components/onboarding/steps/StepAudienceChallenges';
import StepCommunicationStyle from '@/components/onboarding/steps/StepCommunicationStyle';
import DiagnosticLoading from '@/components/onboarding/DiagnosticLoading';
import DiagnosticResults from '@/components/onboarding/DiagnosticResults';

// Data
import { OnboardingFormData, DiagnosticResult, initialFormData } from '@/data/onboardingData';

const STORAGE_KEY = 'flui_onboarding_form';

type OnboardingPhase = 'wizard' | 'loading' | 'results';

const stepConfig = [
  { id: 1, title: 'Conta e Identidade', description: 'Vamos começar com o básico sobre você', label: 'Identidade' },
  { id: 2, title: 'Cargo e Experiência', description: 'Nos conte sobre sua trajetória profissional', label: 'Cargo' },
  { id: 3, title: 'Área de Atuação', description: 'Qual é o seu campo de expertise?', label: 'Área' },
  { id: 4, title: 'Objetivos', description: 'O que você quer alcançar com conteúdo?', label: 'Objetivos' },
  { id: 5, title: 'Tópicos de Conteúdo', description: 'Sobre o que você vai falar?', label: 'Tópicos' },
  { id: 6, title: 'Audiência e Desafios', description: 'Para quem você cria e quais suas dificuldades?', label: 'Audiência' },
  { id: 7, title: 'Estilo de Comunicação', description: 'Como você prefere se expressar?', label: 'Estilo' },
];

function loadFormDataFromStorage(): OnboardingFormData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function saveFormDataToStorage(data: OnboardingFormData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

function clearFormDataStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch { /* ignore */ }
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeOnboarding, setUser, user, setDiagnosticResult: setGlobalDiagnosticResult, profile, refreshProfile } = useApp();

  const [phase, setPhase] = useState<OnboardingPhase>('wizard');
  const [currentStep, setCurrentStep] = useState(() => {
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const parsedStep = parseInt(stepParam, 10);
      if (!isNaN(parsedStep) && parsedStep >= 1 && parsedStep <= stepConfig.length) {
        return parsedStep;
      }
    }
    return user.onboardingStep >= 1 ? Math.min(user.onboardingStep, stepConfig.length) : 1;
  });

  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    // #1: Restore from localStorage if available
    const stored = loadFormDataFromStorage();
    return stored || initialFormData;
  });
  const [localDiagnosticResult, setLocalDiagnosticResult] = useState<DiagnosticResult | null>(null);

  // #2 & #11: Pre-populate name and email from authenticated profile
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || profile.name || '',
        email: profile.email || prev.email || '',
      }));
    }
  }, [profile]);

  // Update user's onboarding status when step changes
  useEffect(() => {
    if (phase === 'wizard' && currentStep >= 1) {
      setUser((prev) => ({
        ...prev,
        onboardingStatus: prev.onboardingStatus === 'completed' ? 'completed' : 'in_progress',
        onboardingStep: currentStep,
      }));
    }
  }, [currentStep, phase, setUser]);

  const updateFormData = useCallback((updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates };
      // #1: Persist to localStorage on every update
      saveFormDataToStorage(next);
      return next;
    });
  }, []);

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length >= 2;
      case 2:
        // #7: Validate customRole when role is 'custom'
        return formData.role !== '' && (formData.role !== 'custom' || formData.customRole.trim().length > 0);
      case 3:
        return formData.primaryArea !== '' &&
          (formData.primaryArea !== 'other' || formData.customArea.trim().length > 0);
      case 4:
        return formData.primaryGoal !== '' &&
          (formData.primaryGoal !== 'other' || formData.customPrimaryGoal.trim().length > 0);
      case 5:
        return (formData.selectedTopics.length + formData.customTopics.length) >= 1;
      case 6:
        return formData.audienceType !== '' &&
          (formData.audienceType !== 'other' || formData.customAudience.trim().length > 0);
      case 7:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < stepConfig.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setPhase('loading');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // #3: Persist skip to database
  const handleSkipOnboarding = async () => {
    setUser((prev) => ({
      ...prev,
      name: formData.name,
      onboardingStatus: 'in_progress',
      onboardingStep: currentStep,
    }));

    // Persist to DB
    if (user.id) {
      await supabase.from('profiles').update({
        name: formData.name,
        onboarding_status: 'in_progress' as const,
        onboarding_step: currentStep,
      }).eq('user_id', user.id);
    }

    navigate('/dashboard');
  };

  const handleDiagnosticComplete = async (result: DiagnosticResult) => {
    setLocalDiagnosticResult(result);
    setGlobalDiagnosticResult(result);

    // #6: Persist diagnostic result to database
    if (user.id) {
      await supabase.from('diagnostics').insert({
        user_id: user.id,
        form_data: formData as any,
        result: result as any,
      });
    }

    setPhase('results');
  };

  const handleDiagnosticError = () => {
    setPhase('wizard');
  };

  // #5 & #4 & #9: Persist onboarding completion to DB, accept optional redirect
  const handleFinishOnboarding = async (redirectTo?: string) => {
    const totalSteps = stepConfig.length;

    setUser((prev) => ({
      ...prev,
      name: formData.name,
      onboardingStatus: 'completed',
      onboardingStep: totalSteps,
    }));

    completeOnboarding();

    // Persist to DB
    if (user.id) {
      await supabase.from('profiles').update({
        name: formData.name,
        onboarding_status: 'completed' as const,
        onboarding_step: totalSteps,
      }).eq('user_id', user.id);

      // Refresh profile so AppContext has latest data
      await refreshProfile();
    }

    // #1: Clear localStorage after completion
    clearFormDataStorage();

    navigate(redirectTo || '/dashboard');
  };

  // Render loading phase
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <DiagnosticLoading
            formData={formData}
            onComplete={handleDiagnosticComplete}
            onError={handleDiagnosticError}
          />
        </div>
      </div>
    );
  }

  // Render results phase
  if (phase === 'results' && localDiagnosticResult) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="w-full max-w-3xl mx-auto">
          <DiagnosticResults result={localDiagnosticResult} onComplete={handleFinishOnboarding} />
        </div>
      </div>
    );
  }

  // Render wizard phase
  const currentConfig = stepConfig[currentStep - 1];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">Flui</h1>
        <p className="text-muted-foreground">Configure sua estratégia de conteúdo</p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-[720px]">
        <OnboardingProgress
          currentStep={currentStep}
          totalSteps={stepConfig.length}
          stepLabels={stepConfig.map((s) => s.label)}
        />
      </div>

      {/* Card */}
      <Card className="w-full max-w-[720px] border-border">
        <CardHeader>
          <CardTitle>{currentConfig.title}</CardTitle>
          <CardDescription>{currentConfig.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step Content */}
          <div className="min-h-[320px]">
            {currentStep === 1 && (
              <StepAccountIdentity formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 2 && (
              <StepRoleExperience formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 3 && (
              <StepExpertiseArea formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 4 && (
              <StepGoals formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 5 && (
              <StepContentTopics formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 6 && (
              <StepAudienceChallenges formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 7 && (
              <StepCommunicationStyle formData={formData} updateFormData={updateFormData} />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="gap-2"
            >
              {currentStep === stepConfig.length ? 'Gerar Diagnóstico' : 'Continuar'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skip for demo - #12: removed duplicate step counter */}
      <div className="flex flex-col items-center gap-2 mt-4">
        {formData.name.trim().length >= 2 && (
          <button
            onClick={handleSkipOnboarding}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Pular e ir para o dashboard
          </button>
        )}
      </div>
    </div>
  );
}
