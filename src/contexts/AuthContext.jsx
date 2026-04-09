import React, { useEffect, useState, createContext } from 'react'
import { authAPI } from '../constants/APIRoutes';
import axios from 'axios';
import { connectSocket, disconnectSocket, socket } from '../socket';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const getAuth = async () => {
    try {
      const authResponse = await axios.post(`${authAPI}/auth`, {}, { withCredentials: true });
      connectSocket();
      socket.emit("login", authResponse.data.auth.id);
      setAuth(authResponse);
    } catch (err) {
      console.log("error", err);
      disconnectSocket();
    }
  }
  
  // const checkRequestStatus = async () => {
  //   if (auth) {
  //     const req = await axios.post(`${userAPI}/check-request-status`,
  //       { remember: remember },
  //       { withCredentials: true }
  //     )
  //     await getAuth();
  //     console.log(req);
  //     setRemember(auth?.data.auth.remember);
  //   }
    
  // }
  
  useEffect(() => {
    if (!auth?.data?.auth?.id) {
      disconnectSocket();
    }
  }, [auth?.data?.auth?.id]);

  useEffect(() => {
    if (!auth?.data?.auth?.id) return;

    connectSocket();
    socket.emit("retrieve_notifications", auth.data.auth.id);
  }, [auth?.data?.auth?.id]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, getAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;
