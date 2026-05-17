'use client';

import { useEffect } from 'react';

export default function PWARegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
      const register = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('SW registered:', registration);

          registration.addEventListener('updatefound', () => {
            const installing = registration.installing;
            if (installing) {
              installing.addEventListener('statechange', () => {
                if (installing.state === 'activated') {
                  console.log('SW activated');
                }
              });
            }
          });
        } catch (error) {
          console.log('SW registration failed:', error);
        }
      };

      window.addEventListener('load', register);
    }
  }, []);

  return null;
}
