import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
   prompt(): Promise<void>;
   userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Extend Navigator interface for iOS standalone mode
interface NavigatorStandalone extends Navigator {
   standalone?: boolean;
}

// Detect if user is on iOS
const isIOS = () => {
   return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
   );
};

// Detect if user is on iOS Safari (not installed as PWA)
const isIOSWithoutPWA = () => {
   return isIOS() && !(window.navigator as NavigatorStandalone).standalone;
};

// Check if app is installed
const checkIsInstalled = (): boolean => {
   // Check standard display mode
   if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
   }
   // Check iOS standalone mode
   if ((window.navigator as NavigatorStandalone).standalone === true) {
      return true;
   }
   // Check if running as TWA (Trusted Web Activity) on Android
   if (document.referrer.includes('android-app://')) {
      return true;
   }
   return false;
};

const DISMISSED_KEY = 'pwa-install-dismissed';

export function InstallPWA() {
   const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
   const isInstalled = checkIsInstalled();
   const isDismissed = localStorage.getItem(DISMISSED_KEY) === 'true';
   const [showInstallPrompt, setShowInstallPrompt] = useState(!isInstalled && !isDismissed);
   const [showIOSInstructions, setShowIOSInstructions] = useState(false);

   useEffect(() => {
      // Don't set up listener if already installed or dismissed
      if (isInstalled || isDismissed) {
         console.log(isInstalled ? 'App is already installed' : 'Install prompt was dismissed');
         return;
      }

      // For iOS, show prompt after a delay if not installed
      if (isIOSWithoutPWA()) {
         const timer = setTimeout(() => {
            setShowInstallPrompt(true);
         }, 2000); // Show after 2 seconds
         return () => clearTimeout(timer);
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
   }, [isInstalled, isDismissed]);

   const handleInstallClick = async () => {
      // For iOS showing instructions, dismiss when clicking "Đã hiểu"
      if (showIOSInstructions) {
         localStorage.setItem(DISMISSED_KEY, 'true');
         setShowInstallPrompt(false);
         setShowIOSInstructions(false);
         return;
      }

      // For iOS, show instructions instead of prompt
      if (isIOSWithoutPWA()) {
         setShowIOSInstructions(true);
         return;
      }

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
      // Save to localStorage that user dismissed the prompt
      localStorage.setItem(DISMISSED_KEY, 'true');
      setShowInstallPrompt(false);
      setShowIOSInstructions(false);
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
                  <h3 className='font-semibold'>
                     {showIOSInstructions ? 'Hướng dẫn cài đặt trên iOS' : 'Cài đặt ứng dụng'}
                  </h3>
                  {showIOSInstructions ? (
                     <div className='text-sm text-muted-foreground mt-2 space-y-2'>
                        <p>Để cài đặt ứng dụng trên iOS, vui lòng làm theo các bước sau:</p>
                        <ol className='list-decimal list-inside space-y-1 ml-2'>
                           <li>
                              Nhấn vào nút <strong>Chia sẻ</strong> (
                              <svg
                                 className='inline w-4 h-4 mx-1'
                                 fill='currentColor'
                                 viewBox='0 0 24 24'
                              >
                                 <path d='M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z' />
                                 <path d='M12 5V1M12 5l-4 4M12 5l4 4' />
                              </svg>
                              ) ở thanh công cụ dưới cùng
                           </li>
                           <li>
                              Cuộn xuống và chọn <strong>"Thêm vào Màn hình chính"</strong>
                           </li>
                           <li>
                              Nhấn <strong>"Thêm"</strong> để hoàn tất
                           </li>
                        </ol>
                     </div>
                  ) : (
                     <p className='text-sm text-muted-foreground mt-1'>
                        {isIOSWithoutPWA()
                           ? 'Nhấn nút bên dưới để xem hướng dẫn cài đặt'
                           : 'Cài đặt Score Tracker trên thiết bị để truy cập nhanh như một ứng dụng'}
                     </p>
                  )}
               </div>
               <div className='flex gap-2'>
                  <Button
                     onClick={handleInstallClick}
                     className='flex-1'
                  >
                     {showIOSInstructions ? 'Đã hiểu' : isIOSWithoutPWA() ? 'Xem hướng dẫn' : 'Cài đặt'}
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
