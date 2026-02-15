import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const DUMMY_USERS = [
  { id: "u1", email: "officer@forensiq.gov", password: "forensiq123", name: "Insp. Ravi Sharma", role: "Investigating Officer", department: "Cyber Crime Cell — Mumbai", avatar: "RS" },
  { id: "u2", email: "admin@forensiq.gov", password: "admin123", name: "DSP Priya Mehta", role: "Case Supervisor", department: "Economic Offences Wing — Delhi", avatar: "PM" },
];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const found = DUMMY_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser({ id: found.id, name: found.name, email: found.email, role: found.role, department: found.department, avatar: found.avatar });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
