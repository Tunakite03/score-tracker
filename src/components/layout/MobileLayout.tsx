import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { SettingsDialog } from '../settings/SettingsDialog';
import { PathIndicator } from './PathIndicator';

interface MobileLayoutProps {
   children: ReactNode;
   title?: string;
   showBackButton?: boolean;
   headerAction?: ReactNode;
   showSettings?: boolean;
}

export function MobileLayout({ children, title, showBackButton, headerAction, showSettings }: MobileLayoutProps) {
   const navigate = useNavigate();
   const location = useLocation();
   const { t } = useLanguage();
   const [settingsOpen, setSettingsOpen] = useState(false);
   const isHome = location.pathname === '/';

   return (
      <div className='flex flex-col h-full bg-neutral-50'>
         {/* Header */}
         <header className='shrink-0 z-40 bg-white border-b border-neutral-200 shadow-sm'>
            <div className='flex items-center justify-between px-4 h-14'>
               {(showSettings || (isHome && !headerAction)) && (
                  <button
                     onClick={() => setSettingsOpen(true)}
                     className='text-neutral-600 hover:text-neutral-900 p-2 -mr-2'
                  >
                     <Settings className='w-5 h-5' />
                  </button>
               )}
               {showBackButton && (
                  <button
                     onClick={() => navigate(-1)}
                     className='text-neutral-600 hover:text-neutral-900 -ml-2 p-2'
                  >
                     <svg
                        className='w-6 h-6'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                     >
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           strokeWidth={2}
                           d='M15 19l-7-7 7-7'
                        />
                     </svg>
                  </button>
               )}
               <h1 className='text-lg font-bold text-neutral-900 truncate'>{title || t('scoreTracker')}</h1>
               <div className='flex items-center gap-1'>
                  {headerAction}
                  {!headerAction && !showSettings && !isHome && <div className='w-8' />}
               </div>
            </div>
         </header>
         {/* Path Indicator (PWD) */}
         <PathIndicator />
         {/* Main Content - Scrollable */}
         <main className='flex-1 overflow-y-auto min-h-1'>{children}</main>

         {/* Bottom Navigation - Only on home */}
         {/* {isHome && (
            <nav className='shrink-0 bg-white border-t border-neutral-200 shadow-lg'>
               <div className='flex items-center justify-around h-16'>
                  <button
                     className={`flex flex-col items-center justify-center flex-1 h-full ${
                        isHome ? 'text-neutral-900' : 'text-neutral-400'
                     }`}
                     onClick={() => navigate('/')}
                  >
                     <Home className='w-6 h-6' />
                     <span className='text-xs mt-1'>{t('sessions')}</span>
                  </button>

                  <button
                     className='flex flex-col items-center justify-center flex-1 h-full text-neutral-400'
                     disabled
                  >
                     <Trophy className='w-6 h-6' />
                     <span className='text-xs mt-1'>{t('stats')}</span>
                  </button>
               </div>
            </nav>
         )} */}

         <SettingsDialog
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
         />
      </div>
   );
}
