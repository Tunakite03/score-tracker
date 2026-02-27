import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { InstallPWA } from './components/pwa/InstallPWA';
import { SessionListSkeleton, SessionDashboardSkeleton } from './components/loading/PageSkeletons';

// Lazy load pages for better initial load performance
const SessionListPage = lazy(() =>
   import('./pages/SessionListPage').then((module) => ({ default: module.SessionListPage })),
);
const SessionDashboardPage = lazy(() =>
   import('./pages/SessionDashboardPage').then((module) => ({ default: module.SessionDashboardPage })),
);

function App() {
   return (
      <BrowserRouter>
         <Suspense fallback={<SessionListSkeleton />}>
            <Routes>
               <Route
                  path='/'
                  element={<SessionListPage />}
               />
               <Route
                  path='/session/:sessionId'
                  element={
                     <Suspense fallback={<SessionDashboardSkeleton />}>
                        <SessionDashboardPage />
                     </Suspense>
                  }
               />
            </Routes>
         </Suspense>
         <Toaster />
         <InstallPWA />
      </BrowserRouter>
   );
}

export default App;
