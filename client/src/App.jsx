import React from 'react'
import { useState,useEffect } from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import EmailVerify from './Pages/EmailVerify'
import ResetPass from './Pages/ResetPass'
import { ToastContainer, toast } from "react-toastify";
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route
          path="/emailVerify"
          element={
            <ProtectedRoute onlyForVerified={true}>
              <EmailVerify />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/reset" element={<ResetPass></ResetPass>}></Route>
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App