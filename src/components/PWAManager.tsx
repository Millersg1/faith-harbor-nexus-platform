import { useEffect } from 'react';
import { toast } from 'sonner';

export const PWAManager = () => {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    toast.info('App update available!', {
                      description: 'Refresh the page to get the latest version.',
                      action: {
                        label: 'Refresh',
                        onClick: () => window.location.reload()
                      }
                    });
                  }
                });
              }
            });
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Request notification permission
    if ('Notification' in window && 'serviceWorker' in navigator) {
      if (Notification.permission === 'default') {
        setTimeout(() => {
          toast.info('Enable notifications?', {
            description: 'Get notified about prayer requests, events, and updates.',
            action: {
              label: 'Enable',
              onClick: () => {
                Notification.requestPermission().then((permission) => {
                  if (permission === 'granted') {
                    toast.success('Notifications enabled!');
                  }
                });
              }
            }
          });
        }, 5000);
      }
    }

    // Handle app install
    let deferredPrompt: any;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    window.addEventListener('appinstalled', () => {
      toast.success('Faith Harbor installed successfully!');
      deferredPrompt = null;
    });

  }, []);

  return null;
};