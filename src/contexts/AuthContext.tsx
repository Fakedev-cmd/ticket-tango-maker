
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
  login: (username: string, password: string) => Promise<boolean>;
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

const defaultOwners = [
  { username: 'Emanuele', email: 'emanuele@botforge.com', password: 'raccu123' },
  { username: 'Salisphere', email: 'salisphere@botforge.com', password: 'toto123' }
];

const rootAccount = {
  username: 'root',
  email: 'root@botforge.com',
  password: 'ninniannavincenzoalessia29102009'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);

  React.useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        // Fetch user data from our custom users table
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();

          if (error) {
            console.error('Error fetching user data:', error);
            return;
          }

          if (userData) {
            const userWithoutPassword = {
              id: userData.id,
              username: userData.username,
              email: userData.email,
              role: userData.role as any,
              createdAt: userData.created_at,
              avatar_url: userData.avatar_url
            };
            setUser(userWithoutPassword);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
        }
      } else {
        setUser(null);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Initialize default accounts in localStorage for fallback
    initializeDefaultAccounts();

    return () => subscription.unsubscribe();
  }, []);

  const initializeDefaultAccounts = () => {
    const users = JSON.parse(localStorage.getItem('botforge_users') || '[]');
    if (users.length === 0) {
      const initialUsers = [
        {
          id: 'root-0',
          username: rootAccount.username,
          email: rootAccount.email,
          password: rootAccount.password,
          role: 'root' as const,
          createdAt: new Date().toISOString(),
          discordId: 'root_discord_id'
        },
        ...defaultOwners.map((owner, index) => ({
          id: `owner-${index + 1}`,
          username: owner.username,
          email: owner.email,
          password: owner.password,
          role: 'owner' as const,
          createdAt: new Date().toISOString(),
          discordId: `${owner.username.toLowerCase()}_discord_id`
        }))
      ];
      localStorage.setItem('botforge_users', JSON.stringify(initialUsers));
    }

    // Initialize action logs
    const logs = localStorage.getItem('botforge_action_logs');
    if (!logs) {
      localStorage.setItem('botforge_action_logs', JSON.stringify([]));
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // First try to find user in database by username
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('username', username)
        .maybeSingle();

      let email = username;
      if (userData && !userError) {
        email = userData.email;
      } else if (username.includes('@')) {
        email = username;
      } else {
        // Fallback to localStorage for special accounts
        const localUsers = JSON.parse(localStorage.getItem('botforge_users') || '[]');
        const localUser = localUsers.find((u: any) => u.username === username && u.password === password);
        if (localUser) {
          email = localUser.email;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, discordId: string): Promise<boolean> => {
    if (!discordId || discordId.trim() === '') {
      return false;
    }

    try {
      // First, sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Registration error:', error);
        return false;
      }

      if (data.user) {
        // Create user record in our custom users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            username,
            email,
            role: 'user'
          });

        if (insertError) {
          console.error('Error creating user record:', insertError);
          return false;
        }

        logAction(`New user registered: ${username}`, 'System');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        return;
      }

      logAction(`Role changed for user ${userId}: → ${newRole}`, user?.username || 'Unknown');
      
      // Update local state if it's the current user
      if (user && user.id === userId) {
        setUser({ ...user, role: newRole as any });
      }
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

      if (error) {
        console.error('Error updating avatar:', error);
        return;
      }

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

      if (error) {
        console.error('Error changing password:', error);
        return false;
      }

      logAction(`Password changed for ${user?.username}`, user?.username || 'Unknown');
      return true;
    } catch (error) {
      console.error('Error changing password:', error);
      return false;
    }
  };

  const adminChangePassword = async (userId: string, newPassword: string) => {
    // This would require admin privileges - not directly possible with Supabase client
    // Would need to implement via Edge Function with service role key
    console.log('Admin password change not implemented for Supabase');
  };

  const adminChangeUserInfo = async (userId: string, username: string, email: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ username, email })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user info:', error);
        return;
      }

      logAction(`User info changed for ${userId} → ${username}`, user?.username || 'Admin');
      
      if (user && user.id === userId) {
        setUser({ ...user, username, email });
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  const banUser = async (userId: string) => {
    // This would require custom implementation
    console.log('Ban user not implemented for Supabase');
  };

  const unbanUser = async (userId: string) => {
    // This would require custom implementation
    console.log('Unban user not implemented for Supabase');
  };

  const deleteUser = async (userId: string) => {
    if (user?.role !== 'root') return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Error deleting user:', error);
        return;
      }

      logAction(`User deleted: ${userId}`, user.username);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getAllUsers = () => {
    // This is a legacy function - would need to be replaced with proper Supabase query
    return JSON.parse(localStorage.getItem('botforge_users') || '[]');
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
