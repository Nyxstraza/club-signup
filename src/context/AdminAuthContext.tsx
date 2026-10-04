import { createContext, useContext, useState, type ReactNode } from "react";

type AdminAuthContextValue = {
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  async function login(username: string, password: string): Promise<boolean> {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const ok = res.ok;
    if (ok) setIsAdmin(true);
    return ok;
  }

  function logout() {
    setIsAdmin(false);
  }

  return (
    <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used inside an <AdminAuthProvider>");
  }
  return context;
}
