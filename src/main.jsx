import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext.jsx';
import './index.css';
import App from './App.jsx';
import EmailProvider from './contexts/EmailContext.jsx';
import NotificationProvider from './contexts/NotificationContext.jsx';
import UserTypeProvider from './contexts/UserTypeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserTypeProvider>
          <NotificationProvider>
            <EmailProvider>
              <App />
            </EmailProvider>
          </NotificationProvider>
        </UserTypeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
