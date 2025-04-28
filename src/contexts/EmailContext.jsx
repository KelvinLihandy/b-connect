import React, { useState, createContext } from 'react'

export const EmailContext = createContext();

const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState("");

  return (
    <EmailContext.Provider value={{ email, setEmail }}>
      {children}
    </EmailContext.Provider>
  )
}

export default EmailProvider;