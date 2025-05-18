import React, { useState, createContext } from 'react'

export const RememberContext = createContext();

const RememberProvider = ({ children }) => {
  const [remember, setRemember] = useState(false);

  return (
    <RememberContext.Provider value={{ remember, setRemember }}>
      {children}
    </RememberContext.Provider>
  )
}

export default RememberProvider;