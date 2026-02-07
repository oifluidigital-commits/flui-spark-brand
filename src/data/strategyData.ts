// Strategy data types
// Derived from diagnostic results as a read-only strategic output

export interface DiagnosticSummary {
  targetAudience: string;
  primaryGoal: string;
  brandArchetype: string;
  dominantTone: string;
}

export interface StrategicGoal {
  statement: string;
  description: string;
}

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  focusPercentage: number;
  exampleTopics: string[];
  color: string;
}

export interface ContentType {
  id: string;
  name: string;
  icon: string;
  relatedPillars: string[];
}

export interface StrategicGuidelines {
  frequency: string;
  depthLevel: string;
  ctaPosture: string;
  brandStance: string;
}

export interface Strategy {
  id: string;
  diagnosticId: string;
  createdAt: string;
  diagnosticSummary: DiagnosticSummary;
  strategicGoal: StrategicGoal;
  contentPillars: ContentPillar[];
  contentTypes: ContentType[];
  guidelines: StrategicGuidelines;
}

// Loading messages for strategy page
export const strategyLoadingMessages = [
  'Processando seu diagnóstico...',
  'Estruturando pilares de conteúdo...',
  'Definindo diretrizes estratégicas...',
  'Calibrando tipos de conteúdo...',
  'Finalizando sua estratégia editorial...',
];
