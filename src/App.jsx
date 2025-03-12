import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import SignUp from './views/sign_up/SignUp';
import SignIn from './views/sign_in/SignIn';

const App = () => {
  return (
    <>
    <Router>
      <Routes>
      <Route path='/' element={<Navigate to="/sign-in" />} />
      <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
