import { useActivityTracker } from '@/hooks/useActivityTracker';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityTrackerWrapperProps {
  children: React.ReactNode;
}

const ActivityTrackerWrapper = ({ children }: ActivityTrackerWrapperProps) => {
  const { user } = useAuth();
  const { logActivity } = useActivityTracker();

  // Only track activity for authenticated users
  if (!user) {
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ActivityTrackerWrapper;