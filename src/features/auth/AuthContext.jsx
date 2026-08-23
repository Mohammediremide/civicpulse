import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import * as authService from "../../services/authService.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { role: "citizen" | "admin", name, email }

  const login = useCallback(async (credentials) => {
    const result = await authService.login(credentials);
    setUser(result);
    return result;
  }, []);

  const signup = useCallback(async (details) => {
    const result = await authService.signup(details);
    setUser(result);
    return result;
  }, []);

  const loginAsDemoAdmin = useCallback(() => {
    setUser({ role: "admin", name: "Public Works Admin", email: "admin@demo.civicpulse.ng" });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, login, signup, logout, loginAsDemoAdmin }),
    [user, login, signup, logout, loginAsDemoAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
