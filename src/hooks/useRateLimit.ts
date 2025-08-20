import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  onRateLimit?: () => void;
}

interface RateLimitHook {
  isRateLimited: boolean;
  makeRequest: () => boolean;
  reset: () => void;
  requestsRemaining: number;
}

export const useRateLimit = ({
  maxRequests,
  windowMs,
  onRateLimit
}: RateLimitConfig): RateLimitHook => {
  const [requestTimes, setRequestTimes] = useState<number[]>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const cleanOldRequests = useCallback((now: number) => {
    return requestTimes.filter(time => now - time < windowMs);
  }, [requestTimes, windowMs]);

  const makeRequest = useCallback(() => {
    const now = Date.now();
    const validRequests = cleanOldRequests(now);

    if (validRequests.length >= maxRequests) {
      setIsRateLimited(true);
      onRateLimit?.();
      
      // Clear rate limit after window expires
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      const oldestRequest = Math.min(...validRequests);
      const timeUntilReset = windowMs - (now - oldestRequest);
      
      timeoutRef.current = setTimeout(() => {
        setIsRateLimited(false);
      }, timeUntilReset);

      return false;
    }

    const newRequests = [...validRequests, now];
    setRequestTimes(newRequests);
    setIsRateLimited(false);
    
    return true;
  }, [cleanOldRequests, maxRequests, onRateLimit, windowMs]);

  const reset = useCallback(() => {
    setRequestTimes([]);
    setIsRateLimited(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const requestsRemaining = Math.max(0, maxRequests - cleanOldRequests(Date.now()).length);

  return {
    isRateLimited,
    makeRequest,
    reset,
    requestsRemaining
  };
};

// Edge function rate limiting helper
export const createRateLimitedRequest = <T extends any[], R>(
  requestFn: (...args: T) => Promise<R>,
  config: RateLimitConfig
) => {
  return (...args: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      const rateLimit = useRateLimit(config);
      
      if (!rateLimit.makeRequest()) {
        reject(new Error('Rate limit exceeded. Please try again later.'));
        return;
      }

      requestFn(...args)
        .then(resolve)
        .catch(reject);
    });
  };
};