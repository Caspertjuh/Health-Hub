
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Get the root element from the HTML
const rootElement = document.getElementById('root');

// Make sure the element exists
if (!rootElement) {
  throw new Error('Root element not found in HTML');
}

// Create a React root
const root = createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log application information
console.log(
  `%cDagplanning Applicatie v1.0.0`,
  'color: #3b82f6; font-size: 16px; font-weight: bold;'
);
console.log(
  `%cOntwikkeld door: Jesse Hummel, Remco Pruim, Tjitte Timmerman, Casper Oudman`,
  'color: #6b7280; font-size: 14px;'
);
console.log(
  `%cAfleverdatum: 23 juni 2025`,
  'color: #6b7280; font-size: 14px;'
);

// Register for performance monitoring if needed
if ('performance' in window && 'measure' in window.performance) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      const paintTiming = performance.getEntriesByType('paint');
      
      if (navigationTiming) {
        console.log(`Pagina laadtijd: ${navigationTiming.duration.toFixed(0)}ms`);
      }

      const fpEntry = paintTiming.find(entry => entry.name === 'first-paint');
      if (fpEntry) {
        console.log(`First Paint: ${fpEntry.startTime.toFixed(0)}ms`);
      }
    }, 0);
  });
}
