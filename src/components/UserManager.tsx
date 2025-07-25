
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Edit, Settings, Hammer, Star, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';

const UserManager = () => {
  const { user } = useAuth();
  const { users, loading, updateUserRole, updateUserInfo } = useUsers();
  const [editingUser, setEditingUser] = useState<{[key: string]: {username: string, email: string}}>({});

  const handleUserRoleChange = async (userId: string, newRole: string) => {
    await updateUserRole(userId, newRole);
    toast({
      title: "Role Updated",
      description: "User role has been updated successfully.",
    });
  };

  const handleUserEdit = async (userId: string) => {
    const userInfo = editingUser[userId];
    if (!userInfo) return;
    
    await updateUserInfo(userId, userInfo.username, userInfo.email);
    setEditingUser({ ...editingUser, [userId]: { username: '', email: '' } });
    
    toast({
      title: "User Updated",
      description: "User information has been updated successfully.",
    });
  };

  const getRoleDisplay = (role: string, username: string) => {
    switch (role) {
      case 'root':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">{username}</span>
            <Badge className="bg-red-600/30 text-red-200 border border-red-600/50">System ✓</Badge>
          </div>
        );
      case 'owner':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">{username}</span>
            <Badge className="bg-blue-500/30 text-blue-300 border border-blue-500/50">Owner ✓</Badge>
          </div>
        );
      case 'manager':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">{username}</span>
            <Badge className="bg-purple-600/30 text-purple-200 border border-purple-600/50 flex items-center gap-1">
              Manager <Settings className="h-3 w-3" />
            </Badge>
          </div>
        );
      case 'developer':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">{username}</span>
            <Badge className="bg-orange-500/30 text-orange-200 border border-orange-500/50 flex items-center gap-1">
              Developer <Hammer className="h-3 w-3" />
            </Badge>
          </div>
        );
      case 'customer':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">{username}</span>
            <Badge className="bg-green-500/30 text-green-200 border border-green-500/50 flex items-center gap-1">
              Customer <Star className="h-3 w-3" />
            </Badge>
          </div>
        );
      default:
        return <span className="text-white font-medium">{username}</span>;
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 backdrop-blur-sm border-blue-500/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white text-2xl">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            <span className="ml-2 text-blue-300">Loading users...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-blue-500/20 shadow-xl">
      <CardHeader>
        <CardTitle className="text-white text-2xl">User Management</CardTitle>
        <p className="text-blue-300">Manage user roles and information ({users.length} users)</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((usr) => (
            <div key={usr.id} className="p-4 border border-blue-500/20 rounded-lg bg-gray-900/30 backdrop-blur-sm hover:bg-gray-900/50 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getRoleDisplay(usr.role, usr.username)}
                  </div>
                  <p className="text-blue-300 text-sm">{usr.email}</p>
                  <p className="text-blue-400/70 text-sm">Joined: {new Date(usr.created_at).toLocaleDateString()}</p>
                  <p className="text-blue-400/70 text-sm">User ID: {usr.id}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {usr.role !== 'root' && (user?.role === 'owner' || user?.role === 'root') && (
                    <>
                      <Select
                        value={usr.role}
                        onValueChange={(value) => handleUserRoleChange(usr.id, value)}
                      >
                        <SelectTrigger className="bg-gray-700/50 backdrop-blur-sm border-blue-500/30 text-white w-32 shadow-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-blue-500/30">
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="developer">Developer</SelectItem>
                          {user?.role === 'root' && <SelectItem value="owner">Owner</SelectItem>}
                        </SelectContent>
                      </Select>
                      
                      <div className="flex items-center space-x-1">
                        <Input
                          placeholder="New username"
                          value={editingUser[usr.id]?.username || ''}
                          onChange={(e) => setEditingUser({
                            ...editingUser,
                            [usr.id]: { ...editingUser[usr.id], username: e.target.value, email: editingUser[usr.id]?.email || usr.email }
                          })}
                          className="bg-gray-700/50 backdrop-blur-sm border-blue-500/30 text-white w-24 h-8 text-xs shadow-lg"
                        />
                        <Input
                          placeholder="New email"
                          value={editingUser[usr.id]?.email || ''}
                          onChange={(e) => setEditingUser({
                            ...editingUser,
                            [usr.id]: { ...editingUser[usr.id], email: e.target.value, username: editingUser[usr.id]?.username || usr.username }
                          })}
                          className="bg-gray-700/50 backdrop-blur-sm border-blue-500/30 text-white w-24 h-8 text-xs shadow-lg"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUserEdit(usr.id)}
                          disabled={!editingUser[usr.id]?.username && !editingUser[usr.id]?.email}
                          className="bg-blue-600 hover:bg-blue-700 h-8 px-2 shadow-lg"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="text-center py-8">
              <p className="text-blue-300">No users found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManager;
