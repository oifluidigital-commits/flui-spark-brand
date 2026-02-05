 // Strategy data types and mock data
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
 
 // Mock strategy derived from the diagnostic assessment
 export const mockStrategy: Strategy = {
   id: 'strategy-1',
   diagnosticId: 'diagnostic-1',
   createdAt: '2024-02-10T15:00:00Z',
 
   diagnosticSummary: {
     targetAudience: 'Profissionais em Ascensão (28-40 anos)',
     primaryGoal: 'Construir autoridade no mercado',
     brandArchetype: 'O Sábio',
     dominantTone: 'Profissional mas acessível',
   },
 
   strategicGoal: {
     statement:
       'Posicionar-se como referência em Product Management através de conteúdo educacional de alta densidade.',
     description:
       'Sua estratégia foca em construir autoridade consistente, educando profissionais intermediários sobre práticas avançadas de gestão de produto. O objetivo é ser reconhecido como voz de referência no seu nicho.',
   },
 
   contentPillars: [
     {
       id: 'pillar-1',
       name: 'Autoridade Técnica',
       description: 'Demonstrar expertise profunda em sua área de atuação',
       focusPercentage: 40,
       exampleTopics: [
         'Frameworks de priorização',
         'Métricas de produto',
         'Roadmap estratégico',
         'Discovery contínuo',
       ],
       color: 'hsl(239 84% 67%)', // indigo-500
     },
     {
       id: 'pillar-2',
       name: 'Educação Prática',
       description: 'Ensinar conceitos aplicáveis com exemplos reais',
       focusPercentage: 30,
       exampleTopics: [
         'Tutoriais passo a passo',
         'Cases reais',
         'Erros comuns',
         'Ferramentas e templates',
       ],
       color: 'hsl(160 84% 39%)', // emerald-500
     },
     {
       id: 'pillar-3',
       name: 'Visão de Mercado',
       description: 'Analisar tendências e movimentos do setor',
       focusPercentage: 20,
       exampleTopics: [
         'Tendências de produto',
         'Análise de players',
         'Previsões do mercado',
         'Novidades tech',
       ],
       color: 'hsl(38 92% 50%)', // amber-500
     },
     {
       id: 'pillar-4',
       name: 'Bastidores & Jornada',
       description: 'Compartilhar experiências pessoais e aprendizados',
       focusPercentage: 10,
       exampleTopics: [
         'Lições aprendidas',
         'Rotina profissional',
         'Desafios enfrentados',
         'Reflexões de carreira',
       ],
       color: 'hsl(280 68% 60%)', // purple-400
     },
   ],
 
   contentTypes: [
     {
       id: 'type-1',
       name: 'Carrossel Educativo',
       icon: 'LayoutGrid',
       relatedPillars: ['Autoridade Técnica', 'Educação Prática'],
     },
     {
       id: 'type-2',
       name: 'Thread de Análise',
       icon: 'MessageSquare',
       relatedPillars: ['Autoridade Técnica', 'Visão de Mercado'],
     },
     {
       id: 'type-3',
       name: 'Post Único com Insight',
       icon: 'Lightbulb',
       relatedPillars: ['Autoridade Técnica', 'Bastidores & Jornada'],
     },
     {
       id: 'type-4',
       name: 'Vídeo Curto Tutorial',
       icon: 'Video',
       relatedPillars: ['Educação Prática'],
     },
     {
       id: 'type-5',
       name: 'Artigo Longo',
       icon: 'FileText',
       relatedPillars: ['Autoridade Técnica', 'Educação Prática', 'Visão de Mercado'],
     },
   ],
 
   guidelines: {
     frequency: '3-4 publicações por semana',
     depthLevel: 'Conteúdo intermediário a avançado',
     ctaPosture: 'Soft CTAs em 20% do conteúdo',
     brandStance: 'Opinativo com embasamento',
   },
 };
 
 // Loading messages for strategy page
 export const strategyLoadingMessages = [
   'Processando seu diagnóstico...',
   'Estruturando pilares de conteúdo...',
   'Definindo diretrizes estratégicas...',
   'Calibrando tipos de conteúdo...',
   'Finalizando sua estratégia editorial...',
 ];