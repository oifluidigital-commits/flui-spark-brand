import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { diagnosticMessages } from '@/data/onboardingData';
import { Sparkles, Brain, Target, Palette, MessageSquare, Layers } from 'lucide-react';

const icons = [Sparkles, Brain, Target, Palette, MessageSquare, Layers];

interface DiagnosticLoadingProps {
  onComplete: () => void;
}

export default function DiagnosticLoading({ onComplete }: DiagnosticLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % diagnosticMessages.length);
    }, 800);

    return () => clearInterval(messageInterval);
  }, []);

  const CurrentIcon = icons[currentMessageIndex];

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      {/* Animated Logo/Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        <div className="relative w-24 h-24 rounded-full bg-secondary flex items-center justify-center border border-border">
          <CurrentIcon className="h-10 w-10 text-primary animate-pulse" />
        </div>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <Progress value={progress} className="h-2 mb-4" />
        <p className="text-center text-sm text-muted-foreground">
          {progress}% concluído
        </p>
      </div>

      {/* Rotating Messages */}
      <div className="h-8 flex items-center justify-center">
        <p
          key={currentMessageIndex}
          className="text-lg font-medium text-foreground animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          {diagnosticMessages[currentMessageIndex]}
        </p>
      </div>

      {/* Skeleton Cards Preview */}
      <div className="mt-12 w-full max-w-lg space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-24 flex-1" />
          <Skeleton className="h-24 flex-1" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-20 flex-1" />
          <Skeleton className="h-20 flex-1" />
          <Skeleton className="h-20 flex-1" />
        </div>
      </div>
    </div>
  );
}
