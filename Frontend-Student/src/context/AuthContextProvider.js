import React, { createContext, useContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated:", user);
    }
  }, [isAuthenticated, user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loginWithRedirect, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log("Context from useAuth:", context); // Add this line
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
