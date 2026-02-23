import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

interface LayoutProps {
   children: ReactNode;
   title?: string;
   backTo?: string;
}

export function Layout({ children, title, backTo }: LayoutProps) {
   const { t } = useLanguage();

   return (
      <div className='min-h-screen bg-neutral-50'>
         <header className='border-b bg-white'>
            <div className='container mx-auto px-4 py-4'>
               <div className='flex items-center gap-4'>
                  {backTo && (
                     <Link
                        to={backTo}
                        className='text-sm text-neutral-600 hover:text-neutral-900'
                     >
                        ← {t('back')}
                     </Link>
                  )}
                  <h1 className='text-2xl font-bold text-neutral-900'>{title || t('scoreTracker')}</h1>
               </div>
            </div>
         </header>
         <main className='container mx-auto px-4 py-6'>{children}</main>
      </div>
   );
}
