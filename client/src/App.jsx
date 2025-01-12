import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LogIn from "./Pages/LogIn";
import Dashboard from "./Pages/Dashboard";
import Admin from "./Pages/Admin";
import Register from "./Pages/Register";
import Event from "./Pages/Event";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event/:eid" element={<Event />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
