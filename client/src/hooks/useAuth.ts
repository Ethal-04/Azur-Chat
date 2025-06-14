import { useState, useEffect } from "react";
import { mockUser } from "@/lib/mockData";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const logged = localStorage.getItem("isLoggedIn");
    setIsAuthenticated(logged === "true");
    setIsLoading(false);
  }, []);

  const login = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsAuthenticated(false);
  };

  return {
    user: isAuthenticated ? mockUser : null,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };
}
