// Debug UserContext - Replace src/contexts/UserContext.tsx temporarily

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "client" | "staff";

interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  console.log("useUser called");
  const context = useContext(UserContext);
  if (context === undefined) {
    console.error("useUser must be used within a UserProvider");
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  console.log("UserProvider initializing");
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("UserProvider useEffect running");
    // Check for existing user session
    const savedUser = localStorage.getItem("communicare-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        console.log("Loaded user from localStorage");
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("communicare-user");
      }
    }
    setIsLoading(false);
    console.log("UserProvider initialization complete");
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Login attempt");
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo users (in real app this would come from backend)
      const isClientLogin = email.includes("client");
      
      const newUser: User = {
        id: isClientLogin ? "client-123" : "staff-456",
        name: isClientLogin ? "Jessie Smith" : "Case Manager Alex",
        role: isClientLogin ? "client" : "staff",
        avatar: isClientLogin ? "/avatar-client.png" : "/avatar-staff.png"
      };
      
      setUser(newUser);
      localStorage.setItem("communicare-user", JSON.stringify(newUser));
      
      console.log("Login successful");
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log("Logout");
    setUser(null);
    localStorage.removeItem("communicare-user");
  };

  const value = { 
    user, 
    isLoading, 
    login, 
    logout, 
    isAuthenticated: !!user 
  };

  console.log("UserProvider rendering with value:", value);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};