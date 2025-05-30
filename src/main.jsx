import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext.jsx';
import './index.css';
import App from './App.jsx';
import EmailProvider from './contexts/EmailContext.jsx';
import NotificationProvider from './contexts/NotificationContext.jsx';
import UserTypeProvider from './contexts/UserTypeContext.jsx';
import RememberProvider from './contexts/RememberContext.jsx';
import { DisabledGigsProvider } from './contexts/DisabledGigsContext.jsx';
import RequestedProvider from './contexts/RequestedContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RememberProvider>
          <RequestedProvider>
            <DisabledGigsProvider>
              <UserTypeProvider>
                <NotificationProvider>
                  <EmailProvider>
                    <App />
                  </EmailProvider>
                </NotificationProvider>
              </UserTypeProvider>
            </DisabledGigsProvider>
          </RequestedProvider>
        </RememberProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
