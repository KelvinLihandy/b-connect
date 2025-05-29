import React, { useState, createContext, useEffect, useContext } from 'react'
import { authAPI, userAPI } from '../constants/APIRoutes';
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
  
  if (auth) {
    // if(auth?.data.auth.access === false) checkRequestStatus();
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