import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SessionListPage } from './pages/SessionListPage';
import { SessionDashboardPage } from './pages/SessionDashboardPage';
import { Toaster } from './components/ui/sonner';

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
      </BrowserRouter>
   );
}

export default App;
