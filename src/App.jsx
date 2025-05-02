import React, { useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

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
import AuthRouting from './components/auth_routing/AuthRouting';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const { auth, getAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      await getAuth();
      console.log("init", auth);
      // if (auth) navigate("/catalog");
      // else navigate("/home");
    }
    initAuth();
  }, []);

  return (
    <>
      <Routes>
        <Route path='/home' element={<AuthRouting component={Home} />} />
        <Route path='/sign-in' element={<SignIn/>} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/sign-in/forget' element={<ForgotPassword />} />
        <Route path='/sign-in/verify-otp' element={<InputOTP />} />
        <Route path='/sign-in/change-password' element={<ChangePassword />} />
        {/* restrcted auth*/}
        {/* if auth default catalog && home is restricted then redirected to catalog */}
        <Route path="/catalog" element={<AuthRouting component={CatalogPage} />} />
        <Route path="/detail/:gigId" element={<AuthRouting component={Detail} />} />
        <Route path="/chat" element={<AuthRouting component={Chat} />} />

      </Routes >
    </>
  )
}

export default App
