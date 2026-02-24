import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
   prompt(): Promise<void>;
   userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPWA() {
   const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
   // Check if app is already installed
   const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
   const [showInstallPrompt, setShowInstallPrompt] = useState(!isInstalled);

   useEffect(() => {
      // Don't set up listener if already installed
      if (isInstalled) {
         console.log('App is already installed');
         return;
      }

      const handler = (e: Event) => {
         console.log('beforeinstallprompt event fired!');
         // Prevent the mini-infobar from appearing on mobile
         e.preventDefault();
         // Save the event so it can be triggered later
         setDeferredPrompt(e as BeforeInstallPromptEvent);
         // Show the install button
         setShowInstallPrompt(true);
         console.log('Install prompt is now available');
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => {
         window.removeEventListener('beforeinstallprompt', handler);
      };
   }, [isInstalled]);

   const handleInstallClick = async () => {
      if (!deferredPrompt) {
         console.warn('Install prompt not available');
         return;
      }

      console.log('Showing install prompt...');
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      console.log('User choice:', outcome);
      if (outcome === 'accepted') {
         console.log('✅ User accepted the install prompt');
      } else {
         console.log('❌ User dismissed the install prompt');
      }

      // Clear the deferredPrompt so it can only be used once
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
   };

   const handleDismiss = () => {
      setShowInstallPrompt(false);
   };

   if (!showInstallPrompt) {
      return null;
   }

   console.log('Rendering InstallPWA component');

   return (
      <div
         className='fixed bottom-4 left-4 right-4 z-9999 md:left-auto md:right-4 md:max-w-sm'
         style={{ position: 'fixed' }}
      >
         <Card className='p-4 shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
            <div className='space-y-3'>
               <div>
                  <h3 className='font-semibold'>Cài đặt ứng dụng</h3>
                  <p className='text-sm text-muted-foreground mt-1'>
                     Cài đặt Score Tracker trên thiết bị để truy cập nhanh như một ứng dụng
                  </p>
               </div>
               <div className='flex gap-2'>
                  <Button
                     onClick={handleInstallClick}
                     className='flex-1'
                  >
                     Cài đặt
                  </Button>
                  <Button
                     onClick={handleDismiss}
                     variant='outline'
                  >
                     Đóng
                  </Button>
               </div>
            </div>
         </Card>
      </div>
   );
}
