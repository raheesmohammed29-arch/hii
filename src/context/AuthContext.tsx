import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isSupabaseActive: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, pass: string, fullName: string, district: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'findback_current_user_v1';

// Default initial demo user so users can test immediately
const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-colombo-01',
  email: 'kasun.perera@example.lk',
  fullName: 'Kasun Perera',
  phone: '+94 77 987 6543',
  district: 'Colombo',
  role: 'user',
  createdAt: '2026-09-12T10:00:00Z',
};

const DEFAULT_ADMIN_USER: UserProfile = {
  id: 'usr-admin-01',
  email: 'admin@findback.lk',
  fullName: 'Dhammika Alwis (Staff Moderator)',
  phone: '+94 11 234 5678',
  district: 'Colombo',
  role: 'admin',
  createdAt: '2026-08-01T08:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isSupabaseActive = isSupabaseConfigured();

  useEffect(() => {
    const initAuth = async () => {
      if (isSupabaseActive && supabase) {
        // Listen to Supabase auth state
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                fullName: profile.full_name,
                phone: profile.phone,
                district: profile.district,
                role: profile.role || 'user',
                createdAt: profile.created_at,
              });
            } else {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                fullName: session.user.user_metadata?.full_name || 'Member',
                role: 'user',
                createdAt: session.user.created_at,
              });
            }
          }
        } catch (e) {
          console.warn('Error fetching Supabase session:', e);
        }
      } else {
        // Check local storage for persistent demo session
        const saved = localStorage.getItem(LOCAL_USER_KEY);
        if (saved) {
          try {
            setUser(JSON.parse(saved));
          } catch {
            setUser(DEFAULT_DEMO_USER);
          }
        } else {
          // Pre-set user so the user can immediately experience the verified portal
          setUser(DEFAULT_DEMO_USER);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [isSupabaseActive]);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseActive && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });
        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const newUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: prof?.full_name || data.user.user_metadata?.full_name || 'Member',
            phone: prof?.phone,
            district: prof?.district,
            role: prof?.role || 'user',
            createdAt: data.user.created_at,
          };
          setUser(newUser);
          setLoading(false);
          return { success: true };
        }
      }

      // Local sandbox auth logic
      if (email.toLowerCase().includes('admin')) {
        setUser(DEFAULT_ADMIN_USER);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEFAULT_ADMIN_USER));
      } else {
        const standardUser: UserProfile = {
          id: `usr-${Date.now()}`,
          email,
          fullName: email.split('@')[0].replace('.', ' '),
          role: 'user',
          createdAt: new Date().toISOString(),
        };
        setUser(standardUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(standardUser));
      }
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: (err as Error).message };
    }
  };

  const register = async (
    email: string,
    pass: string,
    fullName: string,
    district: string,
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (isSupabaseActive && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { full_name: fullName, district, phone },
          },
        });
        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            email,
            fullName,
            district,
            phone,
            role: 'user',
            createdAt: data.user.created_at,
          };
          setUser(newUser);
          setLoading(false);
          return { success: true };
        }
      }

      // Local register
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        fullName,
        district,
        phone,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      setUser(newUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: (err as Error).message };
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseActive && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (isSupabaseActive && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        return { success: false, message: error.message };
      }
    }
    return {
      success: true,
      message: `Password reset instructions sent to ${email}. Please check your inbox.`,
    };
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));

    if (isSupabaseActive && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({
            full_name: updated.fullName,
            phone: updated.phone,
            district: updated.district,
          })
          .eq('id', user.id);
      } catch (err) {
        console.warn('Failed to update Supabase profile:', err);
      }
    }
    return { success: true };
  };

  const switchDemoRole = (role: UserRole) => {
    if (role === 'admin') {
      setUser(DEFAULT_ADMIN_USER);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEFAULT_ADMIN_USER));
    } else {
      setUser(DEFAULT_DEMO_USER);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabaseActive,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
