"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

/* ---------------- Types ---------------- */

type User = {
  id?: number;
  username?: string;
  email?: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: { user: User; access?: string; refresh?: string }) => void;
  logout: () => void;
};

/* ---------------- Context ---------------- */

const AuthContext = createContext<AuthContextType | null>(null);

/* ---------------- Provider ---------------- */

export const AuthProvider = ({
                               children,
                             }: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Init (on reload) ---------------- */

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("access");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Auth load error:", err);
    } finally {
      setLoading(false); // ✅ critical fix
    }
  }, []);

  /* ---------------- Login ---------------- */

  const login = (data: {
    user: User;
    access?: string;
    refresh?: string;
  }) => {
    try {
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.access) {
        localStorage.setItem("access", data.access);
      }

      if (data.refresh) {
        localStorage.setItem("refresh", data.refresh);
      }

      setUser(data.user);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  /* ---------------- Logout ---------------- */

  const logout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /* ---------------- Provider ---------------- */

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ---------------- Hook ---------------- */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};