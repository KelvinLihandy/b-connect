import React, { useState, createContext, useContext, useEffect } from 'react'
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { userAPI } from '../constants/APIRoutes';
import { RememberContext } from './RememberContext';

export const RequestedContext = createContext();

const RequestedProvider = ({ children }) => {
  const { auth, getAuth } = useContext(AuthContext);
  const { remember, setRemember } = useContext(RememberContext);
  const [requested, setRequested] = useState(true);

  const checkRequestStatus = async () => {
    if (auth) {
      try {
        await axios.post(`${userAPI}/check-request-status`,
          { remember: remember },
          { withCredentials: true }
        )
        await getAuth();
        setRemember(auth?.data.auth.remember);
      }
      catch (err) {
        console.log("error check status", err);
      }
    }
  }

  useEffect(() => {
    if (auth && auth?.data.auth.access === false) {
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