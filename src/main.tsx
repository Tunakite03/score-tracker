import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LanguageProvider } from './i18n/LanguageContext';

// Register service worker for PWA
if ('serviceWorker' in navigator) {
   // Use the current path - vite-plugin-pwa will handle dev vs prod
   const swPath = import.meta.env.DEV ? '/dev-sw.js?dev-sw' : '/sw.js';

   window.addEventListener('load', () => {
      navigator.serviceWorker
         .register(swPath, {
            scope: '/',
            type: 'classic',
         })
         .then(() => {
            console.log('Service Worker registered successfully');
         })
         .catch((error) => {
            console.log('Service Worker registration failed:', error);
         });
   });
}

// // Fix iOS Safari viewport height issue with keyboard
// function setViewportHeight() {
//    // Get the actual viewport height
//    const vh = window.innerHeight * 0.01;
//    document.documentElement.style.setProperty('--vh', `${vh}px`);
// }

// // Set on load
// setViewportHeight();

// // Update on resize and orientation change
// window.addEventListener('resize', setViewportHeight);
// window.addEventListener('orientationchange', setViewportHeight);

// // iOS Safari specific: handle visual viewport changes
// if ('visualViewport' in window) {
//    window.visualViewport?.addEventListener('resize', setViewportHeight);
//    window.visualViewport?.addEventListener('scroll', () => {
//       // Prevent scroll when keyboard opens
//       window.scrollTo(0, 0);
//    });
// }

// // Handle input focus to prevent body scroll on iOS
// document.addEventListener('focusin', (e) => {
//    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
//       // Small delay to ensure keyboard is shown
//       setTimeout(() => {
//          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }, 300);
//    }
// });

// document.addEventListener('focusout', () => {
//    // Reset scroll position when keyboard closes
//    window.scrollTo(0, 0);
// });

// Hide splash screen after React app is mounted
function hideSplashScreen() {
   const splash = document.getElementById('splash-screen');
   if (splash) {
      splash.classList.add('fade-out');
      setTimeout(() => {
         splash.remove();
      }, 300);
   }
}

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <LanguageProvider>
         <App />
      </LanguageProvider>
   </StrictMode>,
);

// Hide splash screen after a brief delay to ensure content is rendered
setTimeout(hideSplashScreen, 100);
