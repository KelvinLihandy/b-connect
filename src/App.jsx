import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'

import './App.css';
import SignUp from './views/sign_up/SignUp';
import SignIn from './views/sign_in/SignIn';
import AboutUs from './views/about_us/AboutUs';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/sign-in" />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about-us' element={<AboutUs />} />
      </Routes>
    </>
  )
}

export default App
