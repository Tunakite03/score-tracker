import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LanguageProvider } from './i18n/LanguageContext';

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

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <LanguageProvider>
         <App />
      </LanguageProvider>
   </StrictMode>,
);
