
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
      console.log('Fetching users from database...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Users fetched successfully:', data?.length || 0);
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'owner' || user.role === 'root' || user.role === 'manager')) {
      console.log('User has permission to fetch users, role:', user.role);
      fetchUsers();
    } else {
      console.log('User does not have permission to fetch users');
      setLoading(false);
    }
  }, [user]);

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      console.log('Updating user role:', userId, newRole);
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
      
      console.log('User role updated successfully');
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const updateUserInfo = async (userId: string, username: string, email: string) => {
    try {
      console.log('Updating user info:', userId, username, email);
      const { error } = await supabase
        .from('users')
        .update({ username, email })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user info:', error);
        throw error;
      }
      
      console.log('User info updated successfully');
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
