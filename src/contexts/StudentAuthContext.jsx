import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { API_BASE } from "../api/base";
const TOKEN_KEY = "ewe_student_token";
const USER_KEY  = "ewe_student_user";

const StudentAuthContext = createContext(null);

export function StudentAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!token && !!user;

  const persist = useCallback((t, u) => {
    setToken(t); setUser(u);
    if (t) { localStorage.setItem(TOKEN_KEY, t); localStorage.setItem(USER_KEY, JSON.stringify(u)); }
    else   { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json();
      if (!res.ok) throw body;
      persist(body.token, body.user);
      return body.user;
    } finally {
      setLoading(false);
    }
  }, [persist]);

  const logout = useCallback(async () => {
    if (token) {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    persist(null, null);
  }, [token, persist]);

  const value = useMemo(
    () => ({ user, token, isAuthenticated, loading, login, logout }),
    [user, token, isAuthenticated, loading, login, logout]
  );

  return <StudentAuthContext.Provider value={value}>{children}</StudentAuthContext.Provider>;
}

export function useStudentAuth() {
  const ctx = useContext(StudentAuthContext);
  if (!ctx) throw new Error("useStudentAuth must be used inside StudentAuthProvider");
  return ctx;
}
