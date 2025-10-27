// adopetme-frontend/src/context/SessionContext.tsx (MODIFICADO)

import React, { createContext, useContext, useState, useEffect } from "react";

export type SessionType = "LOGGED_IN" | "NONE";

interface SessionContextType {
  session: SessionType;
  token: string | null;
  userEmail: string | null;
  setSession: (s: SessionType, token: string | null, email: string | null) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSessionState] = useState<SessionType>("NONE");
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Carrega o token e o e-mail do localStorage ao iniciar
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedEmail = localStorage.getItem("userEmail");
      
      if (storedToken && storedEmail) {
        setToken(storedToken);
        setUserEmail(storedEmail);
        setSessionState("LOGGED_IN");
      }
    } catch (e) {
      // Falha silenciosa
    }
  }, []);

  const setSession = (s: SessionType, newToken: string | null, newEmail: string | null) => {
    setSessionState(s);
    setToken(newToken);
    setUserEmail(newEmail); // 👈 Define o e-mail

    try {
      if (newToken) {
        localStorage.setItem("token", newToken);
        localStorage.setItem("userEmail", newEmail || ''); // Salva o e-mail
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail"); // Remove o e-mail no logout
      }
    } catch (e) {
      // Falha silenciosa
    }
  };

  return (
    // Passa o userEmail para o contexto
    <SessionContext.Provider value={{ session, token, userEmail, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
};