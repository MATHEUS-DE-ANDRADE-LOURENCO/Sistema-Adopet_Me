// adopetme-frontend/src/context/SessionContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";

export type SessionType = "LOGGED_IN" | "NONE";

interface SessionContextType {
  session: SessionType;
  token: string | null;
  userEmail: string | null;
  userRole: string | null; // 1. Adiciona userRole
  setSession: (s: SessionType, token: string | null, email: string | null, role: string | null) => void; // 2. Adiciona role ao setter
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSessionState] = useState<SessionType>("NONE");
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // 3. Adiciona estado para role

  // Carrega dados do localStorage ao iniciar
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("userEmail");
      const storedRole = localStorage.getItem("userRole"); // 4. Carrega role
      
      if (storedToken && storedEmail && storedRole) {
        setToken(storedToken);
        setUserEmail(storedEmail);
        setUserRole(storedRole); // 5. Seta a role
        setSessionState("LOGGED_IN");
      }
    } catch (e) {
      // Falha silenciosa
    }
  }, []);

  const setSession = (s: SessionType, newToken: string | null, newEmail: string | null, newRole: string | null) => { // 6. Recebe newRole
    setSessionState(s);
    setToken(newToken);
    setUserEmail(newEmail);
    setUserRole(newRole); // 7. Seta a role no estado

    try {
      if (newToken && newEmail && newRole) {
        localStorage.setItem("token", newToken);
        localStorage.setItem("userEmail", newEmail);
        localStorage.setItem("userRole", newRole); // 8. Salva a role
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole"); // 9. Remove a role no logout
      }
    } catch (e) {
      // Falha silenciosa
    }
  };

  return (
    // 10. Passa userRole para o contexto
    <SessionContext.Provider value={{ session, token, userEmail, userRole, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
};