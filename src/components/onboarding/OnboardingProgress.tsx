import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export default function OnboardingProgress({
  currentStep,
  totalSteps,
  stepLabels,
}: OnboardingProgressProps) {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">
          Passo {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      
      {stepLabels && (
        <div className="flex justify-between mt-4 overflow-x-auto pb-2">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStep > stepNumber;
            const isCurrent = currentStep === stepNumber;
            
            return (
              <div
                key={index}
                className={cn(
                  'flex flex-col items-center gap-1 min-w-[60px]',
                  isCompleted || isCurrent ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-all',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isCurrent && 'border-primary text-primary',
                    !isCompleted && !isCurrent && 'border-border'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className="text-[10px] font-medium text-center hidden md:block">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
