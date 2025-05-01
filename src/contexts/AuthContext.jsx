import { jwtDecode } from 'jwt-decode';
import React, { useState, createContext, useEffect } from 'react'

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const loadAuth = () => {
    const tokenCookie = document.cookie
      .split(';')
      .find(c => c.trim().startsWith('token='));

    if (tokenCookie) {
      const token = tokenCookie.split('=')[1];
      try {
        const decoded = jwtDecode(token);
        console.log("decoded", decoded);
        setAuth(decoded);
      } catch (err) {
        console.error('Invalid token:', err);
        setAuth(null);
      }
    }
  };

  useEffect(() => {
    if (auth) {
      console.log("auth changed:", auth);
    }
    loadAuth();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loadAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;