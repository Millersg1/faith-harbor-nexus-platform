import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /**
   * SECURITY NOTE: This is for UI rendering ONLY.
   * - Client-side state can be manipulated via browser dev tools
   * - NEVER use for authorization decisions
   * - All authorization MUST be enforced server-side via:
   *   1. Edge functions verifying auth with getUser()
   *   2. RLS policies using has_role() function
   * - Treat as UI hint only, not security boundary
   */
  isAdmin: boolean;
  /**
   * SECURITY NOTE: This is for UI rendering ONLY.
   * - Same security considerations as isAdmin apply
   * - Server-side verification is authoritative
   */
  userRoles: string[];
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  // SECURITY: isAdmin and userRoles are for UI rendering ONLY - never trust for authorization
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  // SECURITY: This sets client-side state for UI rendering only
  // Authorization is enforced server-side via RLS policies and edge function checks
  const checkUserRoles = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('member_roles')
        .select('role_name')
        .eq('user_id', userId)
        .eq('active', true);
      
      const roles = data?.map(r => r.role_name) || [];
      setUserRoles(roles);
      setIsAdmin(roles.includes('admin'));
    } catch (error) {
      console.error('Error checking user roles:', error);
      setUserRoles([]);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await checkUserRoles(session.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            checkUserRoles(session.user.id);
          }, 0);
        } else {
          setUserRoles([]);
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData = {}) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUserRoles([]);
      setIsAdmin(false);
    }
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    userRoles,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};