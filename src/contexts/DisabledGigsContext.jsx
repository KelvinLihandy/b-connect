import React, { useState, createContext } from 'react'
import { gigAPI, orderAPI } from '../constants/APIRoutes';
import axios from 'axios';

export const DisabledGigsContext = createContext();

export const DisabledGigsProvider = ({ children }) => {
  const [disabledGigs, setDisabledGigs] = useState({});
  console.log("gigs disabled", disabledGigs);

  const getDisabledGigs = async () => {
    const res = await axios.get(`${orderAPI}/unfinished-contracts`,
      { withCredentials: true }
    )
    console.log("disabled gigs", res.data);
    const gigOrderMap = res.data.reduce((acc, item) => {
      acc[item.gigId] = item.orderId;
      return acc;
    }, {});
    setDisabledGigs(gigOrderMap);
  };

  return (
    <DisabledGigsContext.Provider value={{ disabledGigs, getDisabledGigs }}>
      {children}
    </DisabledGigsContext.Provider>
  );
};

export default DisabledGigsProvider;