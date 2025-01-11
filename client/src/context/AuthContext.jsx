import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ userID: 0, fname: "", lname: "", email: "", isAdmin: false });

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      console.log(jwtDecode(savedToken));
      setUser(jwtDecode(savedToken));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
