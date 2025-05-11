import React, { useContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import io from "socket.io-client";
import './App.css';
import SignUp from './views/sign_up/SignUp';
import SignIn from './views/sign_in/SignIn';
import Home from "./views/home/Home";
import Detail from "./views/detail/Detail";
import AboutUs from './views/about_us/AboutUs';
import ForgotPassword from './views/forgot_password/ForgotPassword';
import InputOTP from './views/input_otp/InputOTP';
import ChangePassword from './views/change_password/ChangePassword';
import CatalogPage from './views/catalogPage/CatalogPage';
import Chat from './views/chat/Chat';
import FreelancerProfile from './views/FreelancerProfile/FreelancerProfile';
import AuthRouting from './components/auth_routing/AuthRouting';
import { AuthContext } from './contexts/AuthContext';
import { NotificationContext } from './contexts/NotificationContext';

export const socket = io.connect("http://localhost:5000");

const App = () => {
  const { auth, getAuth } = useContext(AuthContext);
  const [ready, setReady] = useState(false);
  const { notificationList, setNotificationList } = useContext(NotificationContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleReceiveNotifications = (notificationsData) => {
      console.log("notifs data", notificationsData)
      setNotificationList(notificationsData);
    };
    socket.on("receive_notifications", handleReceiveNotifications);

    return () => {
      socket.off("receive_notifications", handleReceiveNotifications);
    };
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      await getAuth();
      setReady(true);
    }
    initAuth();
  }, []);

  if (!ready) {
    return <></>
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path='/home' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/sign-in/forget' element={<ForgotPassword />} />
        <Route path='/sign-in/verify-otp' element={<InputOTP />} />
        <Route path='/sign-in/change-password' element={<ChangePassword />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/detail/:gigId" element={<Detail />} />
        {/* restrcted auth*/}
        {/* if auth default catalog && home is restricted then redirected to catalog */}
        <Route path="/chat/:roomId" element={<AuthRouting component={Chat} />} />
      </Routes >
    </>
  )
}

export default App
