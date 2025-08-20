import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  user_id?: string;
}

interface SystemMetrics {
  cpu_usage?: number;
  memory_usage?: number;
  disk_usage?: number;
  active_connections: number;
  error_count: number;
  response_time: number;
}

export const useProductionMonitoring = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    active_connections: 0,
    error_count: 0,
    response_time: 0,
  });

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global error handler
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const errorLog: Omit<ErrorLog, 'id'> = {
        message: event.message,
        stack: event.error?.stack,
        timestamp: new Date(),
        level: 'error',
      };

      logError(errorLog);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorLog: Omit<ErrorLog, 'id'> = {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        timestamp: new Date(),
        level: 'error',
      };

      logError(errorLog);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const logError = async (error: Omit<ErrorLog, 'id'>) => {
    try {
      // Add to local state immediately
      const errorWithId = { ...error, id: Date.now().toString() };
      setErrors(prev => [errorWithId, ...prev.slice(0, 99)]);

      // Send to Supabase for persistence (in production)
      if (process.env.NODE_ENV === 'production') {
        await supabase
          .from('error_logs')
          .insert({
            message: error.message,
            stack: error.stack,
            level: error.level,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            created_at: error.timestamp.toISOString(),
          });
      }
    } catch (err) {
      console.error('Failed to log error:', err);
    }
  };

  const clearErrors = () => {
    setErrors([]);
  };

  // API response time monitoring
  const monitorApiCall = async <T>(
    apiCall: () => Promise<T>,
    endpoint?: string
  ): Promise<T> => {
    const startTime = performance.now();

    try {
      const result = await apiCall();
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      setMetrics(prev => ({
        ...prev,
        response_time: (prev.response_time + responseTime) / 2,
      }));

      return result;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      await logError({
        message: `API Error${endpoint ? ` (${endpoint})` : ''}: ${error}`,
        timestamp: new Date(),
        level: 'error',
      });

      setMetrics(prev => ({
        ...prev,
        error_count: prev.error_count + 1,
        response_time: (prev.response_time + responseTime) / 2,
      }));

      throw error;
    }
  };

  // Database health check
  const checkDatabaseHealth = async () => {
    try {
      const startTime = performance.now();
      await supabase.from('profiles').select('id').limit(1).single();
      const endTime = performance.now();

      return {
        status: 'healthy' as const,
        responseTime: endTime - startTime,
      };
    } catch (error) {
      await logError({
        message: `Database health check failed: ${error}`,
        timestamp: new Date(),
        level: 'error',
      });

      return {
        status: 'unhealthy' as const,
        responseTime: 0,
      };
    }
  };

  // Performance metrics collection
  const collectPerformanceMetrics = () => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        return {
          pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          firstByte: navigation.responseStart - navigation.requestStart,
        };
      }
    }

    return null;
  };

  // User activity tracking
  const trackUserActivity = async (activity: string, metadata?: Record<string, any>) => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (user) {
        await supabase.from('user_activity_logs').insert({
          user_id: user.id,
          activity_type: 'user_action',
          activity_description: activity,
          page_url: window.location.href,
          metadata: metadata || {},
        });
      }
    } catch (error) {
      console.error('Failed to track user activity:', error);
    }
  };

  return {
    isOnline,
    errors,
    metrics,
    clearErrors,
    logError,
    monitorApiCall,
    checkDatabaseHealth,
    collectPerformanceMetrics,
    trackUserActivity,
  };
};