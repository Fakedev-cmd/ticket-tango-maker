import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Package, MessageSquare, FileText, Settings, Activity, Mail, Terminal, UserCheck, Eye } from 'lucide-react';
import UserManager from '@/components/UserManager';
import ProductManager from '@/components/ProductManager';
import ReviewManager from '@/components/ReviewManager';
import UpdateManager from '@/components/UpdateManager';
import OrderManager from '@/components/OrderManager';
import ActionLog from '@/components/ActionLog';
import EmailComposer from '@/components/EmailComposer';
import RootPanel from '@/components/RootPanel';
import AccessControl from '@/components/AccessControl';
import ToSHistoryManager from '@/components/ToSHistoryManager';

const AdminPanel = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user || !['manager', 'developer', 'owner', 'root'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-red-500/20 shadow-xl">
          <CardContent className="p-8 text-center">
            <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{t('admin.accessDenied')}</h2>
            <p className="text-red-300">{t('admin.accessDeniedDesc')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'root': return 'bg-red-600';
      case 'owner': return 'bg-blue-500';
      case 'manager': return 'bg-purple-600';
      case 'developer': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{t('admin.title')}</h1>
              <p className="text-blue-300 text-lg">{t('admin.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${getRoleColor(user.role)} text-white px-4 py-2 text-sm font-medium`}>
                {user.role.toUpperCase()}
              </Badge>
              <div className="text-right">
                <p className="text-white font-medium">{user.username}</p>
                <p className="text-blue-300 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 mb-8">
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              {t('admin.users')}
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              {t('admin.products')}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4 mr-2" />
              {t('admin.reviews')}
            </TabsTrigger>
            <TabsTrigger value="updates" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              {t('admin.updates')}
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              {t('admin.orders')}
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" />
              {t('admin.logs')}
            </TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            {user.role === 'root' && (
              <TabsTrigger value="root" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                <Terminal className="h-4 w-4 mr-2" />
                Root
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <UserManager />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductManager />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <ReviewManager />
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <UpdateManager />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrderManager />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <ActionLog />
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <EmailComposer />
          </TabsContent>

          {user.role === 'root' && (
            <TabsContent value="root" className="space-y-6">
              <RootPanel />
              <AccessControl />
              <ToSHistoryManager />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
