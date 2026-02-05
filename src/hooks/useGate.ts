 import { useUserGate, planLimits, PlanType } from '@/contexts/UserGateContext';
 
 // Gate types
 export type GateType =
   | 'create-sprint'
   | 'use-ai'
   | 'access-radar'
   | 'access-competitor-analysis'
   | 'use-advanced-frameworks'
   | 'access-strategy';
 
 // Gate result interface
 export interface GateResult {
   allowed: boolean;
   reason?: string;
   requiredPlan?: PlanType;
   action?: 'upgrade' | 'complete-onboarding' | 'wait-credits';
   creditPercentage?: number;
 }
 
 export function useGate(gateType: GateType): GateResult {
   const { userGate, getPlanLimits } = useUserGate();
   const limits = getPlanLimits();
 
   switch (gateType) {
     case 'create-sprint':
       if (userGate.activeSprints >= limits.maxActiveSprints) {
         return {
           allowed: false,
           reason: 'Você atingiu o limite de sprints ativos do seu plano.',
           requiredPlan: 'pro',
           action: 'upgrade',
         };
       }
       return { allowed: true };
 
     case 'use-ai':
       if (userGate.contentCredits <= 0) {
         return {
           allowed: false,
           reason: 'Seus créditos de IA acabaram.',
           requiredPlan: 'pro',
           action: 'upgrade',
           creditPercentage: 0,
         };
       }
       const percentage = Math.round((userGate.contentCredits / userGate.totalCredits) * 100);
       return { 
         allowed: true,
         creditPercentage: percentage,
       };
 
     case 'access-radar':
       if (!limits.hasRadar) {
         return {
           allowed: false,
           reason: 'O Radar de Tendências é exclusivo para planos Pro e Studio.',
           requiredPlan: 'pro',
           action: 'upgrade',
         };
       }
       return { allowed: true };
 
     case 'access-competitor-analysis':
       if (!limits.hasCompetitorAnalysis) {
         return {
           allowed: false,
           reason: 'A análise de concorrentes é exclusiva para planos Pro e Studio.',
           requiredPlan: 'pro',
           action: 'upgrade',
         };
       }
       return { allowed: true };
 
     case 'use-advanced-frameworks':
       if (!limits.hasAllFrameworks) {
         return {
           allowed: false,
           reason: 'Frameworks avançados são exclusivos para planos Pro e Studio.',
           requiredPlan: 'pro',
           action: 'upgrade',
         };
       }
       return { allowed: true };
 
     case 'access-strategy':
       if (!userGate.onboardingCompleted) {
         return {
           allowed: false,
           reason: 'Complete o diagnóstico para acessar sua estratégia.',
           action: 'complete-onboarding',
         };
       }
       return { allowed: true };
 
     default:
       return { allowed: true };
   }
 }
 
 // Helper hook to check credit warning state
 export function useCreditWarning() {
   const { userGate } = useUserGate();
   const percentage = Math.round((userGate.contentCredits / userGate.totalCredits) * 100);
   const isLow = percentage <= 20;
   const isExhausted = userGate.contentCredits <= 0;
 
   return {
     percentage,
     isLow,
     isExhausted,
     currentCredits: userGate.contentCredits,
     totalCredits: userGate.totalCredits,
   };
 }