import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionListPage } from './pages/SessionListPage';
import { SessionDashboardPage } from './pages/SessionDashboardPage';
import { Toaster } from './components/ui/sonner';
import { InstallPWA } from './components/pwa/InstallPWA';

function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route
               path='/'
               element={<SessionListPage />}
            />
            <Route
               path='/session/:sessionId'
               element={<SessionDashboardPage />}
            />
         </Routes>
         <Toaster />
         <InstallPWA />
      </BrowserRouter>
   );
}

export default App;
