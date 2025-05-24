import React, { useState, createContext } from 'react'
import { gigAPI } from '../constants/APIRoutes';
import axios from 'axios';

export const DisabledGigsContext = createContext();

export const DisabledGigsProvider = ({ children }) => {
  const [disabledGigs, setDisabledGigs] = useState({});
  console.log("gigs disabled", disabledGigs);

  const getDisabledGigs = async () => {
    const res = await axios.post(`${gigAPI}/get-disabled-gig-ids`,
      {},
      { withCredentials: true }
    )
    setDisabledGigs(res.data);
  };

  return (
    <DisabledGigsContext.Provider value={{ disabledGigs, getDisabledGigs }}>
      {children}
    </DisabledGigsContext.Provider>
  );
};

export default DisabledGigsProvider;