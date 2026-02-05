// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  role?: string;
  onboardingStatus: 'not_started' | 'in_progress' | 'completed';
  onboardingStep: number;
  plan: 'free' | 'pro' | 'studio';
  aiCredits: {
    total: number;
    used: number;
  };
  createdAt: string;
}

// Brand Types
export interface Brand {
  id: string;
  userId: string;
  name: string;
  logo?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
  };
  voice: {
    tone: string[];
    personality: string[];
    examples: string[];
  };
  positioning: {
    valueProposition: string;
    differentiators: string[];
    targetAudience: string;
  };
  pillars: ContentPillar[];
  competitors: Competitor[];
}

export interface ContentPillar {
  id: string;
  name: string;
  description: string;
  percentage: number;
  color: string;
}

export interface Competitor {
  id: string;
  name: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
}

// Sprint Types
export type SprintStatus = 'draft' | 'active' | 'completed' | 'archived';

export interface Sprint {
  id: string;
  title: string;
  description: string;
  status: SprintStatus;
  theme: string;
  startDate: string;
  endDate: string;
  alignmentScore: number;
  contentsPlanned: number;
  contentsPublished: number;
  pillarId?: string;
  createdAt: string;
  updatedAt: string;
}

// Idea Types
export type IdeaStatus = 'backlog' | 'planned' | 'in_progress' | 'review' | 'published' | 'archived';
export type ContentFormat = 'post' | 'carousel' | 'video' | 'story' | 'article' | 'thread' | 'newsletter';

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: IdeaStatus;
  format: ContentFormat;
  pillarId?: string;
  sprintId?: string;
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Framework Types
export type FrameworkCategory = 'storytelling' | 'educational' | 'sales' | 'engagement' | 'authority' | 'personal';

export interface Framework {
  id: string;
  name: string;
  description: string;
  category: FrameworkCategory;
  structure: string[];
  example: string;
  isCustom: boolean;
  createdAt: string;
}

// Radar/Trend Types
export type TrendRelevance = 'high' | 'medium' | 'low';

export interface Trend {
  id: string;
  title: string;
  description: string;
  source: string;
  relevance: TrendRelevance;
  category: string;
  suggestedActions: string[];
  discoveredAt: string;
  expiresAt?: string;
}

// Pricing Types
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  aiCredits: number;
  isPopular?: boolean;
  isCurrent?: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// Activity Types
export interface Activity {
  id: string;
  action: string;
  target: string;
  targetType: 'sprint' | 'idea' | 'content' | 'brand';
  timestamp: string;
}
