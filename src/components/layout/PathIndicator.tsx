import { useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db/schema';

export function PathIndicator() {
   const location = useLocation();
   const { t } = useLanguage();

   // Extract session ID from path if present
   const sessionIdMatch = location.pathname.match(/\/session\/(\d+)/);
   const sessionId = sessionIdMatch ? parseInt(sessionIdMatch[1], 10) : null;

   // Fetch session name if we're on a session page
   const session = useLiveQuery(() => (sessionId ? db.sessions.get(sessionId) : undefined), [sessionId]);

   // Build breadcrumb based on current path
   const getBreadcrumbs = () => {
      if (location.pathname === '/') {
         return [{ label: t('pwd.home'), path: '/' }];
      }

      if (location.pathname.startsWith('/session/')) {
         return [
            { label: t('pwd.home'), path: '/' },
            { label: session?.name || '...', path: location.pathname },
         ];
      }

      return [{ label: location.pathname, path: location.pathname }];
   };

   const breadcrumbs = getBreadcrumbs();

   return (
      <div className='px-4 py-2 bg-neutral-100 border-b border-neutral-200'>
         <div className='flex items-center gap-1 text-xs text-neutral-600 font-mono'>
            <Home className='w-3 h-3' />
            <span className='text-neutral-400'>/</span>
            {breadcrumbs.map((crumb) => (
               <div
                  key={crumb.path}
                  className='flex items-center gap-1'
               >
                  {crumb.path !== '/' && <ChevronRight className='w-3 h-3 text-neutral-400' />}
                  <span className={crumb.path === location.pathname ? 'text-neutral-900 font-medium' : ''}>
                     {crumb.label}
                  </span>
               </div>
            ))}
         </div>
      </div>
   );
}
