import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { apiPost } from "../api/client";
import { getAdminToken, setAdminToken, clearAdminToken } from "../api/client";

interface AdminAuthValue {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(
    getAdminToken() ? "admin" : null
  );

  const login = async (u: string, p: string) => {
    const res = await apiPost<{ token: string; username: string }>(
      "/api/admin/login",
      { username: u, password: p }
    );
    setAdminToken(res.token);
    setUsername(res.username);
  };

  const logout = () => {
    clearAdminToken();
    setUsername(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ isAuthenticated: !!username, username, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
