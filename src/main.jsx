import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext.jsx';
import './index.css';
import App from './App.jsx';
import EmailProvider from './contexts/EmailContext.jsx';
import NotificationProvider from './contexts/NotificationContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <EmailProvider>
            <App />
          </EmailProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
