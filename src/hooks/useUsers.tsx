
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  avatar_url?: string;
  banned?: boolean;
}

export const useUsers = () => {
  const [users, setUsers] = useState<DatabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'owner' || user.role === 'root' || user.role === 'manager')) {
      fetchUsers();
    }
  }, [user]);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const updateUserInfo = async (userId: string, username: string, email: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ username, email })
        .eq('id', userId);

      if (error) throw error;
      
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  };

  return {
    users,
    setUsers,
    loading,
    fetchUsers,
    updateUserRole,
    updateUserInfo
  };
};
