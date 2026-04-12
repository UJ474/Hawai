import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string } | null;
  login: (token: string, userData: { id: string; name: string; email: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(authService.isAuthenticated());
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    // Optionally, parse user data from token or local storage on initial load
    // For now, we'll keep it simple and just check authentication status
    if (isAuthenticated) {
      // In a real app, you'd decode the token to get user info or fetch user profile
      // For this example, let's assume user info is part of the login response
      // and needs to be stored separately or decoded from the token.
    }
  }, [isAuthenticated]);

  const login = (token: string, userData: { id: string; name: string; email: string }) => {
    authService.setToken(token);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    authService.removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
