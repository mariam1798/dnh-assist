import React, { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../utils/axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [user, setUser] = useState(null);
  const [failedAuth, setFailedAuth] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!authToken) {
        setFailedAuth(true);
        return;
      }

      try {
        const profileData = await getProfile(authToken);
        setUser(profileData.data);
        setFailedAuth(false);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setFailedAuth(true);
        handleLogout();
      }
    };

    loadData();
  }, [authToken]);

  const handleLogin = async (token) => {
    try {
      localStorage.setItem("authToken", token);
      setAuthToken(token);

      const { data } = await getProfile(token);
      setUser(data);
      setFailedAuth(false);
    } catch (error) {
      console.error("Failed to login:", error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");

    setUser(null);
    setAuthToken(null);
    setFailedAuth(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        handleLogin,
        handleLogout,
        failedAuth,
        setFailedAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
