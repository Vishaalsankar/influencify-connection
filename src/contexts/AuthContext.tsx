
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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

// Sample user data for quick testing
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

  // Login function - now with Supabase integration
  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // First try Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        
        // Fallback to sample users for development
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
      } else if (data.user) {
        // Get user profile from database
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileData) {
          const userData: User = {
            id: data.user.id,
            email: data.user.email || "",
            name: profileData.name || data.user.email?.split('@')[0] || "",
            role: profileData.role as UserRole,
            avatar: `https://ui-avatars.com/api/?name=${profileData.name || data.user.email?.split('@')[0]}&background=8B5CF6&color=fff`
          };
          
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup function with Supabase
  const signup = async (email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: email.split('@')[0], // Default name from email
            role: role
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }
      
      if (data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email || "",
          name: email.split('@')[0],
          role: role,
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=8B5CF6&color=fff`,
        };
        
        // Auto login after Supabase signup
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });
      }
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  // Load user from local storage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Also check Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Get profile from Supabase
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            if (profileData) {
              const userData: User = {
                id: session.user.id,
                email: session.user.email || "",
                name: profileData.name || session.user.email?.split('@')[0] || "",
                role: profileData.role as UserRole,
                avatar: `https://ui-avatars.com/api/?name=${profileData.name || session.user.email?.split('@')[0]}&background=8B5CF6&color=fff`
              };
              
              setUser(userData);
              localStorage.setItem("user", JSON.stringify(userData));
            }
          });
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get profile from Supabase
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileData) {
            const userData: User = {
              id: session.user.id,
              email: session.user.email || "",
              name: profileData.name || session.user.email?.split('@')[0] || "",
              role: profileData.role as UserRole,
              avatar: `https://ui-avatars.com/api/?name=${profileData.name || session.user.email?.split('@')[0]}&background=8B5CF6&color=fff`
            };
            
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
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
