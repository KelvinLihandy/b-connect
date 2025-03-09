import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css';
import SignUp from './views/SignUp';

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<SignUp />} />
        {/* <Route path='/support' element={<Support />} />
        <Route path='/support/:id' element={<Ticket />} /> */}
      </Routes>
    </Router>
    </>
  )
}

export default App
