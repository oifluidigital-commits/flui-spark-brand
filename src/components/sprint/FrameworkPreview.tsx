import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, User, Lock, RefreshCw } from 'lucide-react';

interface FrameworkPreviewProps {
  frameworkName: string;
  frameworkOrigin: 'ai' | 'manual' | string | null;
  frameworkReason?: string;
  structure: string[] | null;
  hasGeneratedText: boolean;
  onChangeFramework: () => void;
  onClearFrameworkAndText: () => void;
}

export function FrameworkPreview({
  frameworkName,
  frameworkOrigin,
  frameworkReason,
  structure,
  hasGeneratedText,
  onChangeFramework,
  onClearFrameworkAndText,
}: FrameworkPreviewProps) {
  return (
    <div className="rounded-lg border border-border bg-secondary p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {frameworkOrigin === 'ai' ? (
            <Bot className="h-4 w-4 text-primary" />
          ) : (
            <User className="h-4 w-4 text-primary" />
          )}
          <span className="font-medium text-foreground">{frameworkName}</span>
          <Lock className="h-3 w-3 text-muted-foreground" />
        </div>
        <Badge
          variant="outline"
          className={
            frameworkOrigin === 'ai'
              ? 'text-xs bg-primary/20 text-primary border-primary/30'
              : 'text-xs bg-success/20 text-success border-success/30'
          }
        >
          {frameworkOrigin === 'ai' ? 'Sugerido pela IA' : 'Definido manualmente'}
        </Badge>
      </div>

      {/* Steps (read-only, no hover/click affordance) */}
      {structure && structure.length > 0 && (
        <div className="space-y-1">
          {structure.map((step, i) => (
            <p key={i} className="text-xs text-muted-foreground flex gap-2">
              <span className="text-primary font-mono font-medium">{i + 1}.</span>
              {step}
            </p>
          ))}
        </div>
      )}

      {/* Framework reason */}
      {frameworkReason && (
        <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
          "{frameworkReason}"
        </p>
      )}

      {/* Change button */}
      {hasGeneratedText ? (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onClearFrameworkAndText}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Trocar Framework (limpa texto gerado)
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onChangeFramework}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Alterar framework
        </Button>
      )}
    </div>
  );
}
