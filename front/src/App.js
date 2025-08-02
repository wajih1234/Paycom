import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Home  from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Userdashbaord  from './pages/userdashbaord';
import Paybill from './pages/paybill';
import Dashboard from './pages/Dashboard';
import Addbill from "./pages/addbill";
import ResetPassword from './pages/ResetPassword';
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import Chart from "./pages/Chart";
import Profil from "./pages/profil";
function App() {
  return(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashbaord" element={<Userdashbaord />} />
      <Route path="/paybill/:id" element={<Paybill />} />
      <Route path="/admidashboard" element={<Dashboard />} />
      <Route path="/addbill" element={<Addbill />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/chart" element={<Chart />} />
      <Route path="/profil" element={<Profil />} />
    </Routes> 
  </Router>
  );
}

export default App;
