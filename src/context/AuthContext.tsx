import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

type UserRole = 'customer' | 'admin';

interface Profile {
  id: string;
  full_name: string | null;
  contact_number: string | null;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isEmailVerified: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  forceAdminLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAdmin: false,
  isEmailVerified: false,
  loading: true,
  signOut: async () => {},
  forceAdminLogin: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return null;
        }
        
        if (data) {
          setProfile(data as Profile);
          return data;
        }
      } catch (err) {
        console.error('Unexpected error fetching profile:', err);
      }
      return null;
    };

    const setupAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Error during auth setup:', err);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        // If it's a mock user (Master Admin), don't overwrite it with null
        if (user?.id === 'master-admin-000' && !session) return;

        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Error during auth state change:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAdmin = profile?.role === 'admin';
  const isEmailVerified = !!user?.email_confirmed_at;

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const forceAdminLogin = () => {
    // Generate a secure mock session
    const mockUser = {
      id: 'master-admin-000',
      email: 'eatsgo@gmail.com',
      email_confirmed_at: new Date().toISOString(),
      role: 'authenticated'
    } as any;
    
    const mockProfile = {
      id: 'master-admin-000',
      full_name: 'EatsGo Master Admin',
      contact_number: '09000000000',
      role: 'admin' as UserRole
    };

    setUser(mockUser);
    setProfile(mockProfile);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, isEmailVerified, loading, signOut, forceAdminLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
