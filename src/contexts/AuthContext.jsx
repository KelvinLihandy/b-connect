import { jwtDecode } from 'jwt-decode';
import React, { useState, createContext, useEffect } from 'react'
import { authAPI } from '../constants/APIRoutes';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  const getAuth = async () => {
    try{
      console.log("called")
      const authResponse = await axios.get(`${authAPI}/auth`, { withCredentials: true });
      setAuth(authResponse);
    } catch (err){
      console.log("error", err);
    }
  }

  console.log(auth);
  return (
    <AuthContext.Provider value={{ auth, setAuth, getAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;