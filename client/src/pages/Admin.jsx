import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { SERVICES } from "../lib/registration";
import { PortalShell, errorText } from "./Portal";
export default function Admin() {
  const { user, admin, loading } = useAuth();
  const [service, setService] = useState("");
  const [email, setEmail] = useState("");
  const [rows, setRows] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [more, setMore] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    if (admin)
      Promise.all([
        getCountFromServer(collection(db, "users")),
        ...SERVICES.map((s) =>
          getCountFromServer(
            query(
              collection(db, "users"),
              where("serviceInterests", "array-contains", s),
            ),
          ),
        ),
      ])
        .then((results) => {
          if (active) setStats(results.map((r) => r.data().count));
        })
        .catch((e) => {
          if (active) setError(errorText(e));
        });
    return () => {
      active = false;
    };
  }, [admin]);
  async function search(next = false) {
    setBusy(true);
    setError("");
    try {
      const filters = [];
      if (service)
        filters.push(where("serviceInterests", "array-contains", service));
      if (email.trim()) filters.push(where("email", "==", email.trim()));
      filters.push(orderBy("createdAt", "desc"), limit(25));
      if (next && cursor) filters.push(startAfter(cursor));
      const result = await getDocs(query(collection(db, "users"), ...filters));
      setRows(result.docs.map((d) => d.data()));
      setCursor(result.docs.at(-1));
      setMore(result.size === 25);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }
  if (loading)
    return (
      <PortalShell title="Administration">
        <p role="status">Checking access…</p>
      </PortalShell>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (!admin)
    return (
      <PortalShell title="Administration">
        <p role="alert">Administrator access is required.</p>
      </PortalShell>
    );
  return (
    <PortalShell title="Waitlist administration">
      {error && <p role="alert">{error}</p>}
      {stats && (
        <>
          <p>Total registered profiles: {stats[0]}</p>
          <details>
            <summary>Service-interest statistics</summary>
            {SERVICES.map((s, i) => (
              <p key={s}>
                {s}: {stats[i + 1]}
              </p>
            ))}
          </details>
        </>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          search();
        }}
      >
        <label>
          Search by exact registered email
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMore(false);
            }}
          />
        </label>
        <label>
          Engineering service
          <select
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              setMore(false);
            }}
          >
            <option value="">All services</option>
            {SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <button disabled={busy}>Search users</button>
      </form>
      <p>Showing {rows.length} profiles on this page.</p>
      {rows.map((r) => (
        <article key={r.uid}>
          <h2>{r.email}</h2>
          <p>{r.phoneNumber}</p>
          <p>{r.serviceInterests.join(", ")}</p>
          <p>Registered: {r.createdAt?.toDate().toLocaleDateString()}</p>
        </article>
      ))}
      {more && (
        <button disabled={busy} onClick={() => search(true)}>
          Next 25 users
        </button>
      )}
    </PortalShell>
  );
}
