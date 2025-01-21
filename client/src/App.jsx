import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createContext, useContext, useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import LogIn from "./Pages/LogIn";
import Dashboard from "./Pages/Dashboard";
import Register from "./Pages/Register";
import Event from "./Pages/Event";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminEvent from "./Pages/AdminEvent";
import BugForm from "./Pages/BugForm";
import Otp from "./Pages/OTP";
import ChangePasswordForm from "./Pages/ChangePasswordForm";

export const recoveryContext = createContext();

function App() {
  const [ email, setEmail]  = useState();
  const [ otp, setOtp ] = useState();

  return (
    // don't really need setOtp
  <recoveryContext.Provider
  value={{email, setEmail, otp, setOtp}}>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event/:eid" element={<Event />} />
          <Route path="/admin-event/:eid" element={<AdminEvent />} />
          <Route path="/bug-form" element={<BugForm />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/change-password" element={<ChangePasswordForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  </recoveryContext.Provider>
  );
}

export default App;
