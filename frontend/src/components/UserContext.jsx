// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const UserContext = createContext();

// Hook to use context
export function useUser() {
  return useContext(UserContext);
}

// Provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // On mount, try to load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Persist user in localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const value = { user, setUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
