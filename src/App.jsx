import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import SignUp from './views/sign_up/SignUp';

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
