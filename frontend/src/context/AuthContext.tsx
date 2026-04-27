import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

interface UserData {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (token: string, userData: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Decode a JWT token to extract the payload (no verification - that's the server's job) */
function decodeToken(token: string): UserData | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return {
      id: decoded.id,
      name: decoded.name || decoded.email?.split("@")[0] || "User",
      email: decoded.email,
    };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);

  // On mount, check if we have a stored token and decode user from it
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      const userData = decodeToken(token);
      if (userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        // Invalid token, clear it
        authService.removeToken();
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  const login = (token: string, userData: UserData) => {
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
