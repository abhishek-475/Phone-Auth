import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import { Routes,Route } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Login /> } />
      <Route path='/reg' element={<Register /> } />
      <Route path='/home' element={<Home /> } />
      
    </Routes>
    <ToastContainer />



    </>
  )
}

export default App
