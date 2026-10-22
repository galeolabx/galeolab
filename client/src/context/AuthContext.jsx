import React, { createContext, useContext, useEffect, useState } from "react";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
const Context = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    for (const storage of [localStorage, sessionStorage]) {
      storage.removeItem("galeolab-auth-users");
      storage.removeItem("galeolab-auth-session");
      for (const key of Object.keys(storage))
        if (/^sb-.*-auth-token/.test(key)) storage.removeItem(key);
    }
    if (!auth) return;
    let generation = 0;
    const unsubscribe = onIdTokenChanged(auth, async (next) => {
      const current = ++generation;
      setLoading(true);
      try {
        const token = next ? await next.getIdTokenResult() : null;
        if (generation !== current) return;
        setUser(next);
        setAdmin(next?.emailVerified === true && token?.claims.admin === true);
      } catch {
        if (generation === current) {
          setUser(null);
          setAdmin(false);
        }
      } finally {
        if (generation === current) setLoading(false);
      }
    });
    return () => {
      generation++;
      unsubscribe();
    };
  }, []);
  return (
    <Context.Provider
      value={{ user, loading, admin, logout: () => signOut(auth) }}
    >
      {children}
    </Context.Provider>
  );
}
export const useAuth = () => useContext(Context);
