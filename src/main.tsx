// src/main.tsx
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('App is starting...');

const root = document.getElementById("root");
if (!root) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, rendering app...');
  createRoot(root).render(<App />);
}