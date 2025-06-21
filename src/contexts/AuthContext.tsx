
import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'customer' | 'developer' | 'manager' | 'owner' | 'root';
  createdAt: string;
  banned?: boolean;
  discordId?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, discordId: string) => Promise<boolean>;
  logout: () => void;
  updateUserRole: (userId: string, newRole: string) => void;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  adminChangePassword: (userId: string, newPassword: string) => void;
  adminChangeUserInfo: (userId: string, username: string, email: string) => void;
  banUser: (userId: string) => void;
  unbanUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  getAllUsers: () => any[];
  logAction: (action: string, performedBy: string) => void;
  getActionLogs: () => any[];
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Add cleanup function for auth state
const cleanupAuthState = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Defer user profile fetching to prevent deadlocks
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('email', session.user.email)
                .single();
              
              if (profile) {
                const userData: User = {
                  id: profile.id,
                  username: profile.username,
                  email: profile.email,
                  role: profile.role as any,
                  createdAt: profile.created_at,
                  discordId: session.user.user_metadata?.discord_id,
                  avatar_url: profile.avatar_url
                };
                setUser(userData);
                console.log('User profile loaded:', userData);
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
              setUser(null);
            }
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('Existing session found:', session.user?.email);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      // Clean up any existing auth state
      cleanupAuthState();
      
      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Sign out before login (expected):', err);
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful:', data.user?.email);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, discordId: string): Promise<boolean> => {
    try {
      console.log('Attempting registration for:', email, username);
      
      // Clean up any existing auth state
      cleanupAuthState();
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username,
            discord_id: discordId
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (data.user) {
        console.log('User created:', data.user.email);
        
        // Create user profile in the users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            username,
            email,
            role: 'customer'
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return false;
        }

        console.log('User profile created successfully');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('Logout error (ignoring):', err);
      }
      
      setUser(null);
      setSession(null);
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      logAction(`Role changed for user: ${newRole}`, user?.username || 'Admin');
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (error) throw error;

      setUser({ ...user, avatar_url: avatarUrl });
      logAction(`Avatar updated for ${user.username}`, user.username);
    } catch (error) {
      console.error('Error updating avatar:', error);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  };

  const adminChangePassword = async (userId: string, newPassword: string) => {
    // This would require admin privileges in Supabase
    console.log('Admin password change not implemented yet');
  };

  const adminChangeUserInfo = async (userId: string, username: string, email: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ username, email })
        .eq('id', userId);

      if (error) throw error;
      
      logAction(`User info changed for ${username}`, user?.username || 'Admin');
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const banUser = async (userId: string) => {
    // This would require custom logic
    console.log('Ban user not implemented yet');
  };

  const unbanUser = async (userId: string) => {
    // This would require custom logic
    console.log('Unban user not implemented yet');
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      logAction(`User deleted`, user?.username || 'Admin');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getAllUsers = () => {
    // This will be handled by a separate hook
    return [];
  };

  const logAction = (action: string, performedBy: string) => {
    const logs = JSON.parse(localStorage.getItem('botforge_action_logs') || '[]');
    const newLog = {
      id: Date.now().toString(),
      action,
      performedBy,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    if (logs.length > 100) {
      logs.splice(100);
    }
    localStorage.setItem('botforge_action_logs', JSON.stringify(logs));
  };

  const getActionLogs = () => {
    return JSON.parse(localStorage.getItem('botforge_action_logs') || '[]');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      login, 
      register, 
      logout, 
      updateUserRole,
      updateUserAvatar,
      changePassword,
      adminChangePassword,
      adminChangeUserInfo,
      banUser,
      unbanUser,
      deleteUser,
      getAllUsers,
      logAction,
      getActionLogs
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
