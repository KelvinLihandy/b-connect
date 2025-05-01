import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'

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
import { jwtDecode } from "jwt-decode";
import { AuthContext } from './contexts/AuthContext';
import ProtectedRoute from './components/protected_route/ProtectedRoute';

const App = () => {
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    const getTokenFromCookie = () => {
      const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));

      if (token) {
        return token.split('=')[1];
      }
      return null;
    };
    const token = getTokenFromCookie();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuth(decoded);
      } catch (err) {
        console.error('Invalid token:', err);
        setAuth(null);
      }
    }
  }, []);

  return (
    <>
      <Routes>
        {/* if not auth the default home */}
        <Route path='/home' index element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/detail' element={<Detail />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/sign-in/forget' element={<ForgotPassword />} />
        <Route path='sign-in/verify-otp' element={<InputOTP />} />
        <Route path='/sign-in/change-password' element={<ChangePassword />} />
        {/* restrcted auth*/}
        {/* if auth default catalog && home is restricted then redirected to catalog */}
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <CatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
      </Routes >
    </>
  )
}

export default App
