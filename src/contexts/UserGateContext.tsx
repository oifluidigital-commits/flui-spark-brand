 import React, { createContext, useContext, useState, ReactNode } from 'react';
 
 // Plan types
 export type PlanType = 'free' | 'pro' | 'studio';
 
 // User gate state interface
 export interface UserGateState {
   plan: PlanType;
   onboardingCompleted: boolean;
   activeSprints: number;
   contentCredits: number;
   totalCredits: number;
 }
 
 // Plan limits configuration
 export interface PlanLimits {
   maxActiveSprints: number;
   maxIdeasPerMonth: number;
   aiCredits: number;
   hasRadar: boolean;
   hasCompetitorAnalysis: boolean;
   hasAllFrameworks: boolean;
   hasMultipleBrands?: boolean;
   hasTeamCollaboration?: boolean;
   hasApiAccess?: boolean;
 }
 
 export const planLimits: Record<PlanType, PlanLimits> = {
   free: {
     maxActiveSprints: 1,
     maxIdeasPerMonth: 10,
     aiCredits: 500,
     hasRadar: false,
     hasCompetitorAnalysis: false,
     hasAllFrameworks: false,
   },
   pro: {
     maxActiveSprints: Infinity,
     maxIdeasPerMonth: Infinity,
     aiCredits: 5000,
     hasRadar: true,
     hasCompetitorAnalysis: true,
     hasAllFrameworks: true,
   },
   studio: {
     maxActiveSprints: Infinity,
     maxIdeasPerMonth: Infinity,
     aiCredits: 20000,
     hasRadar: true,
     hasCompetitorAnalysis: true,
     hasAllFrameworks: true,
     hasMultipleBrands: true,
     hasTeamCollaboration: true,
     hasApiAccess: true,
   },
 };
 
 // Context interface
 interface UserGateContextType {
   userGate: UserGateState;
   setUserGate: React.Dispatch<React.SetStateAction<UserGateState>>;
   getPlanLimits: () => PlanLimits;
 }
 
 const UserGateContext = createContext<UserGateContextType | undefined>(undefined);
 
 // Initial mock state - Free user near limit for demo
 const initialUserGate: UserGateState = {
   plan: 'free',
   onboardingCompleted: false,
   activeSprints: 1,
   contentCredits: 150,
   totalCredits: 500,
 };
 
 export function UserGateProvider({ children }: { children: ReactNode }) {
   const [userGate, setUserGate] = useState<UserGateState>(initialUserGate);
 
   const getPlanLimits = () => planLimits[userGate.plan];
 
   return (
     <UserGateContext.Provider value={{ userGate, setUserGate, getPlanLimits }}>
       {children}
     </UserGateContext.Provider>
   );
 }
 
 export function useUserGate() {
   const context = useContext(UserGateContext);
   if (context === undefined) {
     throw new Error('useUserGate must be used within a UserGateProvider');
   }
   return context;
 }