import { createContext, useContext, useState, type ReactNode } from "react";
import type { SignUpFormData } from "../types/SignUpFormData";

type UserContextValue = {
  user: SignUpFormData | null;
  setUser: (user: SignUpFormData) => void;
};

// Step 1: create a data "channel"
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Step 2: broadcast the value to everything nested inside it
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SignUpFormData | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Step 3: a way to "listen in" from any component
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside a <UserProvider>");
  }
  return context;
}
