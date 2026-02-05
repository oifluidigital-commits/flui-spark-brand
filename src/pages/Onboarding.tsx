 import { useState, useCallback, useEffect } from 'react';
 import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

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

type OnboardingPhase = 'wizard' | 'loading' | 'results';

const stepConfig = [
  { 
    id: 1, 
    title: 'Conta e Identidade', 
    description: 'Vamos começar com o básico sobre você',
    label: 'Identidade'
  },
  { 
    id: 2, 
    title: 'Cargo e Experiência', 
    description: 'Nos conte sobre sua trajetória profissional',
    label: 'Cargo'
  },
  { 
    id: 3, 
    title: 'Área de Atuação', 
    description: 'Qual é o seu campo de expertise?',
    label: 'Área'
  },
  { 
    id: 4, 
    title: 'Objetivos', 
    description: 'O que você quer alcançar com conteúdo?',
    label: 'Objetivos'
  },
  { 
    id: 5, 
    title: 'Tópicos de Conteúdo', 
    description: 'Sobre o que você vai falar?',
    label: 'Tópicos'
  },
  { 
    id: 6, 
    title: 'Audiência e Desafios', 
    description: 'Para quem você cria e quais suas dificuldades?',
    label: 'Audiência'
  },
  { 
    id: 7, 
    title: 'Estilo de Comunicação', 
    description: 'Como você prefere se expressar?',
    label: 'Estilo'
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const { completeOnboarding, setUser, user } = useApp();
  
  const [phase, setPhase] = useState<OnboardingPhase>('wizard');
   const [currentStep, setCurrentStep] = useState(() => {
     const stepParam = searchParams.get('step');
     if (stepParam) {
       const parsedStep = parseInt(stepParam, 10);
       if (!isNaN(parsedStep) && parsedStep >= 1 && parsedStep <= stepConfig.length) {
         return parsedStep;
       }
     }
     // Fall back to user's current step if available
     return user.onboardingStep >= 1 ? Math.min(user.onboardingStep, stepConfig.length) : 1;
   });
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
   const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
 
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
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.name.trim().length >= 2;
      case 2:
        return formData.role !== '';
      case 3:
        // Allow "other" if customArea is filled, or any non-other area
        return formData.primaryArea !== '' && 
          (formData.primaryArea !== 'other' || formData.customArea.trim().length > 0);
      case 4:
        // Allow "other" if customPrimaryGoal is filled, or any non-other goal
        return formData.primaryGoal !== '' &&
          (formData.primaryGoal !== 'other' || formData.customPrimaryGoal.trim().length > 0);
      case 5:
        return (formData.selectedTopics.length + formData.customTopics.length) >= 1;
      case 6:
        // Allow "other" if customAudience is filled, or any non-other audience
        return formData.audienceType !== '' &&
          (formData.audienceType !== 'other' || formData.customAudience.trim().length > 0);
      case 7:
        return true; // Sliders always have values
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < stepConfig.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Start diagnostic generation
      setPhase('loading');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkipOnboarding = () => {
    setUser((prev) => ({
      ...prev,
      name: formData.name,
      onboardingStatus: 'in_progress',
      onboardingStep: currentStep,
    }));
    
    navigate('/dashboard');
  };

   const handleDiagnosticComplete = (result: DiagnosticResult) => {
     setDiagnosticResult(result);
    setPhase('results');
  };

   const handleDiagnosticError = () => {
     setPhase('wizard');
   };
 
  const handleFinishOnboarding = () => {
    // Update user with form data
    setUser((prev) => ({
      ...prev,
      name: formData.name,
      onboardingStatus: 'completed',
      onboardingStep: 4,
    }));
    
    completeOnboarding();
    navigate('/dashboard');
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
   if (phase === 'results' && diagnosticResult) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="w-full max-w-3xl mx-auto">
           <DiagnosticResults result={diagnosticResult} onComplete={handleFinishOnboarding} />
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

      {/* Skip for demo */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="text-xs text-muted-foreground">
          Passo {currentStep} de {stepConfig.length}
        </p>
        
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
