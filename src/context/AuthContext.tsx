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

// Master Admin Mock Constants
const getMasterEmail = () => localStorage.getItem('eatsgo_admin_email') || 'eatsgo@gmail.com';
const getMasterName = () => localStorage.getItem('eatsgo_admin_name') || 'EatsGo Master Admin';

const MASTER_ADMIN_ID = 'master-admin-000';
const MASTER_ADMIN_USER = () => ({
  id: MASTER_ADMIN_ID,
  email: getMasterEmail(),
  email_confirmed_at: new Date(2024, 0, 1).toISOString(),
  role: 'authenticated'
} as any);

const MASTER_ADMIN_PROFILE = (): Profile => ({
  id: MASTER_ADMIN_ID,
  full_name: getMasterName(),
  contact_number: '09000000000',
  role: 'admin'
});

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
  // Synchronous recovery from localStorage to prevent loading flash
  const [user, setUser] = useState<User | null>(() => {
    const isMaster = localStorage.getItem('eatsgo_master_session') === 'true';
    return isMaster ? MASTER_ADMIN_USER() : null;
  });
  
  const [profile, setProfile] = useState<Profile | null>(() => {
    const isMaster = localStorage.getItem('eatsgo_master_session') === 'true';
    return isMaster ? MASTER_ADMIN_PROFILE() : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Safety Watchdog - Ensure loading state never hangs indefinitely
    const watchdog = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4 seconds max wait

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

        // If we're already in Master Admin mode from localStorage, don't overwrite with null
        const isMaster = localStorage.getItem('eatsgo_master_session') === 'true';
        if (isMaster) {
          setUser(MASTER_ADMIN_USER());
          setProfile(MASTER_ADMIN_PROFILE());
          setLoading(false);
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Error during auth setup:', err);
        // Only clear if not in Master mode
        if (localStorage.getItem('eatsgo_master_session') !== 'true') {
          setUser(null);
          setProfile(null);
        }
      } finally {
        setLoading(false);
        clearTimeout(watchdog);
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const isMaster = localStorage.getItem('eatsgo_master_session') === 'true';
        if (isMaster && !session) return; // Keep master session alive

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

    return () => {
      subscription.unsubscribe();
      clearTimeout(watchdog);
    };
  }, []);

  const isAdmin = profile?.role === 'admin';
  const isEmailVerified = !!user?.email_confirmed_at;

  const signOut = async () => {
    localStorage.removeItem('eatsgo_master_session');
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const forceAdminLogin = () => {
    localStorage.setItem('eatsgo_master_session', 'true');
    setUser(MASTER_ADMIN_USER());
    setProfile(MASTER_ADMIN_PROFILE());
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, isEmailVerified, loading, signOut, forceAdminLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
