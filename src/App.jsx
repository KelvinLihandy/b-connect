import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'

import './App.css';
import SignUp from './views/sign_up/SignUp';
import SignIn from './views/sign_in/SignIn';
import Home from "./views/home/Home";
import Detail from "./views/detailpage/Detail";

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/detailpage' element={<Detail />} /> 
      </Routes>
    </>
  )
}

export default App
