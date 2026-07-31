import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { adminGet, apiPost } from "../api/client";
import { getAdminToken, setAdminToken, clearAdminToken } from "../api/client";

interface AdminAuthValue {
  isAuthenticated: boolean;
  username: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  // Start as checked when there is no token — no verification needed
  const [checked, setChecked] = useState(() => !getAdminToken());

  useEffect(() => {
    if (checked) return;
    adminGet<{ name: string; email: string }>("/api/auth/me")
      .then((u) => setUsername(u.name || u.email))
      .catch(() => clearAdminToken())
      .finally(() => setChecked(true));
  }, [checked]);

  const login = async (email: string, password: string) => {
    const res = await apiPost<{ token: string; user: { name: string; email: string } }>(
      "/api/auth/login",
      { email, password }
    );
    setAdminToken(res.token);
    setUsername(res.user.name || res.user.email);
  };

  const logout = () => {
    clearAdminToken();
    setUsername(null);
  };

  // Avoid flash of unauthenticated content while token is being verified
  if (!checked) return null;

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
