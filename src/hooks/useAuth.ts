import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { toast } from 'sonner';

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  onboarding_status: 'not_started' | 'in_progress' | 'completed';
  onboarding_step: number;
  plan: 'free' | 'pro' | 'studio';
  ai_credits_total: number;
  ai_credits_used: number;
  company: string | null;
  role: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface SignInResult {
  error: AuthError | Error | null;
  profile?: Profile | null;
}

interface SignUpResult {
  error: AuthError | Error | null;
  needsEmailConfirmation?: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isInitialized: false,
  });

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile not found - trigger should have created it
          console.warn('Profile not found for user:', userId);
          return null;
        }
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (err) {
      console.error('Exception fetching profile:', err);
      return null;
    }
  }, []);

  // Update profile in database
  const updateProfile = useCallback(async (userId: string, updates: Partial<Profile>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
    } catch (err) {
      console.error('Exception updating profile:', err);
      return false;
    }
  }, []);

  // Handle session changes
  const handleSession = useCallback(async (session: Session | null) => {
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      setState({
        user: session.user,
        session,
        profile,
        isLoading: false,
        isInitialized: true,
      });
    } else {
      setState({
        user: null,
        session: null,
        profile: null,
        isLoading: false,
        isInitialized: true,
      });
    }
  }, [fetchProfile]);

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        // Use setTimeout to avoid potential deadlocks with Supabase client
        setTimeout(() => {
          handleSession(session);
        }, 0);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [handleSession]);

  // Sign in with email and password
  const signInWithEmail = useCallback(async (email: string, password: string): Promise<SignInResult> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setState(prev => ({ ...prev, isLoading: false }));
        
        // Map error messages to user-friendly Portuguese
        let message = 'Erro ao fazer login. Tente novamente.';
        if (error.message.includes('Invalid login credentials')) {
          message = 'Email ou senha incorretos';
        } else if (error.message.includes('Email not confirmed')) {
          message = 'Por favor, confirme seu email antes de fazer login';
        }
        
        return { error: new Error(message) };
      }

      // Profile will be fetched by onAuthStateChange
      return { error: null };
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      return { error: err instanceof Error ? err : new Error('Erro desconhecido') };
    }
  }, []);

  // Sign in with Google OAuth
  const signInWithGoogle = useCallback(async (): Promise<SignInResult> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (error) {
        setState(prev => ({ ...prev, isLoading: false }));
        toast.error('Erro ao conectar com Google');
        return { error };
      }

      // If we get here without redirect, something went wrong
      return { error: null };
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      return { error: err instanceof Error ? err : new Error('Erro ao conectar com Google') };
    }
  }, []);

  // Sign up with email and password
  const signUp = useCallback(async (email: string, password: string, name: string): Promise<SignUpResult> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            name: name.trim(),
          },
        },
      });

      if (error) {
        setState(prev => ({ ...prev, isLoading: false }));
        
        let message = 'Erro ao criar conta. Tente novamente.';
        if (error.message.includes('already registered')) {
          message = 'Este email já está cadastrado';
        } else if (error.message.includes('Password')) {
          message = 'Senha muito fraca. Use pelo menos 6 caracteres';
        }
        
        return { error: new Error(message) };
      }

      setState(prev => ({ ...prev, isLoading: false }));

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return { error: null, needsEmailConfirmation: true };
      }

      // If session exists, user is logged in
      return { error: null, needsEmailConfirmation: false };
    } catch (err) {
      setState(prev => ({ ...prev, isLoading: false }));
      return { error: err instanceof Error ? err : new Error('Erro desconhecido') };
    }
  }, []);

  // Sign out
  const signOut = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await supabase.auth.signOut();
      setState({
        user: null,
        session: null,
        profile: null,
        isLoading: false,
        isInitialized: true,
      });
    } catch (err) {
      console.error('Error signing out:', err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Refresh profile data
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id);
      setState(prev => ({ ...prev, profile }));
    }
  }, [state.user, fetchProfile]);

  return {
    // State
    user: state.user,
    session: state.session,
    profile: state.profile,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    isAuthenticated: !!state.session,

    // Methods
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
    fetchProfile,
    updateProfile,
    refreshProfile,
  };
}
