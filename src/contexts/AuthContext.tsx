
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define user roles
export type UserRole = "admin" | "influencer" | "brand" | null;

// Define user interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data (will connect to Supabase later)
const SAMPLE_USERS = [
  {
    id: "1",
    email: "admin@promopulse.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as UserRole,
    avatar: "https://ui-avatars.com/api/?name=Admin+User&background=8B5CF6&color=fff",
  },
  {
    id: "2",
    email: "brand@promopulse.com",
    password: "brand123",
    name: "Brand User",
    role: "brand" as UserRole,
    avatar: "https://ui-avatars.com/api/?name=Brand+User&background=8B5CF6&color=fff",
  },
  {
    id: "3",
    email: "influencer@promopulse.com",
    password: "influencer123",
    name: "Influencer User",
    role: "influencer" as UserRole,
    avatar: "https://ui-avatars.com/api/?name=Influencer+User&background=8B5CF6&color=fff",
  },
];

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user
      const foundUser = SAMPLE_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Create user object without password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Set user
      setUser(userWithoutPassword);
      
      // Store in local storage
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function 
  const signup = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const userExists = SAMPLE_USERS.some((u) => u.email === email);
      
      if (userExists) {
        throw new Error("User already exists");
      }
      
      // In real app, we'd create user in database
      // For now, just simulate successful signup
      
      // Auto-login after signup
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name: email.split('@')[0],
        role,
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=8B5CF6&color=fff`,
      };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Load user from local storage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
