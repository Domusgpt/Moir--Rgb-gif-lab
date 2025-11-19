/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🚀 Starting Music-Responsive GIF Animator...');
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', import.meta.env.BASE_URL);

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Could not find root element');
  document.body.innerHTML = '<div style="color: white; padding: 20px; font-family: sans-serif;"><h1>Error: Root element not found</h1><p>The app could not initialize. Please refresh the page.</p></div>';
  throw new Error("Could not find root element to mount to");
}

console.log('✅ Root element found, mounting React app...');

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ React app mounted successfully');
} catch (error) {
  console.error('❌ Error mounting React app:', error);
  document.body.innerHTML = `
    <div style="color: white; padding: 20px; font-family: sans-serif; max-width: 800px; margin: 0 auto;">
      <h1>⚠️ App Loading Error</h1>
      <p>The app failed to load. Please check the browser console for details.</p>
      <pre style="background: #222; padding: 10px; border-radius: 5px; overflow: auto;">${error}</pre>
      <p><a href="${window.location.href}" style="color: #60a5fa;">Refresh Page</a></p>
    </div>
  `;
}
