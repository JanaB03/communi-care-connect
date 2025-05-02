
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
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const savedUser = localStorage.getItem("communicare-user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user", error);
        localStorage.removeItem("communicare-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would validate credentials with a backend
    setIsLoading(true);
    
    // Mock authentication
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
      
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("communicare-user");
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
