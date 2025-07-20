import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import AdminActivityMonitor from '@/components/AdminActivityMonitor';
import Navigation from '@/components/Navigation';

const AdminActivityMonitorPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingPermissions, setCheckingPermissions] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setCheckingPermissions(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('member_roles')
          .select('role_name')
          .eq('user_id', user.id)
          .eq('active', true)
          .in('role_name', ['admin', 'pastor', 'staff']);

        if (error) throw error;
        
        const hasAdminRole = data && data.length > 0;
        setIsAdmin(hasAdminRole);
        
        if (!hasAdminRole) {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        navigate('/dashboard');
      } finally {
        setCheckingPermissions(false);
      }
    };

    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else {
        checkAdminRole();
      }
    }
  }, [user, loading, navigate]);

  if (loading || checkingPermissions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AdminActivityMonitor />
    </div>
  );
};

export default AdminActivityMonitorPage;