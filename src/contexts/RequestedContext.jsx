import React, { useState, createContext, useContext, useEffect, useRef } from 'react'
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { userAPI } from '../constants/APIRoutes';
import { RememberContext } from './RememberContext';

export const RequestedContext = createContext();

const RequestedProvider = ({ children }) => {
  const { auth, getAuth } = useContext(AuthContext);
  const { remember, setRemember } = useContext(RememberContext);
  const [requested, setRequested] = useState(false);
  const hasCheckedRequestStatus = useRef(false);

  const checkRequestStatus = async () => {
    if (auth) {
      try {
        const response = await axios.post(`${userAPI}/check-request-status`,
          { remember: remember },
          { withCredentials: true }
        )
        const res = response.data;
        if (res.status == 0) setRequested(true);
        console.log("res req", res);
        await getAuth();
        setRemember(auth?.data.auth.remember);
      }
      catch (err) {
        console.log("error check status", err);
      }
    }
  }
  
  useEffect(() => {
    if (auth && auth.data.auth.access === false && !hasCheckedRequestStatus.current) {
      hasCheckedRequestStatus.current = true;
      checkRequestStatus();
    }
  }, [auth]);



  return (
    <RequestedContext.Provider value={{ requested, setRequested, checkRequestStatus }}>
      {children}
    </RequestedContext.Provider>
  )
}

export default RequestedProvider;