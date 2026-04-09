import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from "@mui/material";
import AuthProvider from './contexts/AuthContext.jsx';
import './index.css';
import App from './App.jsx';
import EmailProvider from './contexts/EmailContext.jsx';
import NotificationProvider from './contexts/NotificationContext.jsx';
import UserTypeProvider from './contexts/UserTypeContext.jsx';
import RememberProvider from './contexts/RememberContext.jsx';
import { DisabledGigsProvider } from './contexts/DisabledGigsContext.jsx';
import RequestedProvider from './contexts/RequestedContext.jsx';
import muiTheme from "./theme/muiTheme.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
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
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
