import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // This is how you correctly load styles in React
import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error("Failed to find root element");

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
