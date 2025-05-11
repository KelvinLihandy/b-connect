import React, { useState, createContext } from 'react'

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notificationList, setNotificationList] = useState([]);

  return (
    <NotificationContext.Provider value={{ notificationList, setNotificationList }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider;