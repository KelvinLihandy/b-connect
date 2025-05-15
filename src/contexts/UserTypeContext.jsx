import React, { useState, createContext } from 'react'

export const UserTypeContext = createContext();

const UserTypeProvider = ({ children }) => {
  const [isFreelancer, setIsFreelancer] = useState(false);

  return (
    <UserTypeContext.Provider value={{ isFreelancer, setIsFreelancer }}>
      {children}
    </UserTypeContext.Provider>
  )
}

export default UserTypeProvider;