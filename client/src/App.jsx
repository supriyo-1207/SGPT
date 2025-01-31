import React from 'react'
import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Contact from './pages/Contact';
import PageNotFound from './pages/PageNotFound';
function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>

  )
}

export default App
