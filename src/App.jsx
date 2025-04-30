import React from 'react';
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
import CatalogPager from './views/catalogPage/CatalogPager';
import Chat from './views/chat/Chat';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/detail' element={<Detail />} /> 
        <Route path='/about-us' element={<AboutUs />} />
        <Route path='/sign-in/forget' element={<ForgotPassword />} />
        <Route path='sign-in/verify-otp' element={<InputOTP />} />
        <Route path='/sign-in/change-password' element={<ChangePassword/>} />
        <Route path='/catalogPage' element={<CatalogPager />} />
        <Route path='/chat' element={<Chat />} />
        </Routes>
    </>
  )
}

export default App
