import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// VITE_PWA logic is handled mostly by the plugin, but we can add register logic if needed custom
// For now, the default import of 'virtual:pwa-register' is not strictly required if using autoUpdate
// but let's leave it clean.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
