import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import './App.css';
import SignIn from './views/SignIn';

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Navigate to="/sign-in" />} />
      <Route path='/sign-in' element={<SignIn />} />
    </Routes>
    </>
  )
}

export default App
