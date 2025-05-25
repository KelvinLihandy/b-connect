import React, { useState, createContext, useEffect } from 'react'
import { authAPI } from '../constants/APIRoutes';
import axios from 'axios';
import { socket } from '../App';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const getAuth = async () => {
    try {
      console.log("called get auth")
      const authResponse = await axios.post(`${authAPI}/auth`, {}, { withCredentials: true });
      socket.emit("login", authResponse.data.auth.id);
      console.log("emit login");
      setAuth(authResponse);
    } catch (err) {
      console.log("error", err);
    }
  }

  if (auth) {
    console.log("auth", auth);
    console.log("retrieving notif");
    socket.emit("retrieve_notifications", auth.data.auth.id)
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, getAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;