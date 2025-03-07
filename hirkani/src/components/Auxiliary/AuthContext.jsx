import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("access_token"));

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      localStorage.setItem("access_token", token);
    } else {
      setIsLoggedIn(false);
      localStorage.removeItem("access_token");
    }
    // Listen for logout event and trigger logout
    const handleLogout = () => {
      setToken("");
      setIsLoggedIn(false);
      localStorage.removeItem("access_token");
    };

    // Add event listener
    window.addEventListener("logout", handleLogout);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("logout", handleLogout);
    };
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
