import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendEmailVerification,
  sendPasswordResetEmail,
  reload,
  getIdToken,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, configured } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import {
  SERVICES,
  validatePassword,
  validateProfile,
} from "../lib/registration";
import { saveProfile } from "../lib/profiles";
import styles from "../styles/Auth.module.css";
import "./Portal.css";

export function PortalShell({ title, children }) {
  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.infoPanel}>
          <p>GALEOLAB · EARLY ACCESS</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>
            Engineering ideas start here. Register your interests and join our
            engineering services waitlist.
          </p>
          <p>CAD · FEA · CFD · Research</p>
        </aside>
        <div className={styles.formPanel}>
          <div className="portal">{children}</div>
        </div>
      </div>
    </section>
  );
}
function Password({
  name = "password",
  label = "Password",
  value,
  onChange,
  fresh = false,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <label>
      {label}
      <span className="password-row">
        <input
          aria-label={label}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          required
          minLength={fresh ? 12 : undefined}
          maxLength={128}
          autoComplete={fresh ? "new-password" : "current-password"}
        />
        <button
          type="button"
          aria-label={(visible ? "Hide " : "Show ") + label.toLowerCase()}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </span>
    </label>
  );
}
export function Interests({ value, onChange }) {
  return (
    <fieldset>
      <legend>Engineering service interests (select at least one)</legend>
      {SERVICES.map((s) => (
        <label className="check" key={s}>
          <input
            type="checkbox"
            checked={value.includes(s)}
            onChange={(e) =>
              onChange(
                e.target.checked ? [...value, s] : value.filter((x) => x !== s),
              )
            }
          />
          {s}
        </label>
      ))}
    </fieldset>
  );
}
export function errorText(error) {
  const messages = {
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/email-already-in-use":
      "This email is already registered. Sign in or reset your password.",
    "auth/too-many-requests":
      "Too many attempts. Please wait before trying again.",
    "auth/network-request-failed":
      "Connection failed. Please check your internet and retry.",
    "auth/invalid-action-code":
      "This link is invalid or has already been used. Request a new link.",
    "auth/expired-action-code": "This link has expired. Request a new link.",
    "permission-denied":
      "Access denied. Verify your email, then sign in again.",
    "auth/requires-recent-login":
      "Please sign in again before changing your account.",
    "auth/weak-password": "The password does not meet the security policy.",
    "auth/invalid-email": "Enter a valid email address.",
  };
  return (
    messages[error.code] ||
    (error.code
      ? "The request could not be completed. Please retry."
      : error.message)
  );
}
export default function Portal() {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout, admin } = useAuth();
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirm: "",
    current: "",
    interests: [],
    remember: false,
  });
  const [profile, setProfile] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const signup = pathname === "/signup";
  const login = pathname === "/login";
  const forgot = pathname === "/forgot-password";
  const verify = pathname === "/verify-email";
  const account = pathname === "/dashboard" || pathname === "/profile";
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const run = async (task) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await task();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    setError("");
    setMessage("");
    setForm((f) => ({ ...f, password: "", confirm: "", current: "" }));
  }, [pathname]);
  useEffect(() => {
    if (!cooldown) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);
  useEffect(() => {
    let active = true;
    setLoaded(false);
    setProfile(null);
    if (account && user?.emailVerified)
      getDoc(doc(db, "users", user.uid))
        .then((snapshot) => {
          if (!active) return;
          const data = snapshot.exists() ? snapshot.data() : null;
          setProfile(data);
          setForm((f) => ({
            ...f,
            phone: data?.phoneNumber || "",
            interests: data?.serviceInterests || [],
          }));
          setLoaded(true);
        })
        .catch((e) => {
          if (active) setError(errorText(e));
        });
    return () => {
      active = false;
    };
  }, [account, user?.uid, user?.emailVerified]);
  if (loading)
    return (
      <PortalShell title="Your account">
        <p role="status">Restoring your session…</p>
      </PortalShell>
    );
  if ((account || verify) && !user) return <Navigate to="/login" replace />;
  if (account && !user.emailVerified)
    return <Navigate to="/verify-email" replace />;
  const resend = async () => {
    await sendEmailVerification(user, {
      url: window.location.origin + "/#/verify-email",
    });
    setCooldown(60);
    setMessage("Verification email sent. Check your inbox and spam folder.");
  };
  const submit = async (e) => {
    e.preventDefault();
    await run(async () => {
      if (!configured) throw new Error("Account access is not configured yet.");
      if (forgot) {
        await sendPasswordResetEmail(auth, form.email.trim(), {
          url: window.location.origin + "/#/login",
        });
        setMessage(
          "If an account exists for this email, a password reset link will be sent.",
        );
      } else if (signup) {
        validatePassword(form.password);
        validateProfile(form.phone.trim(), form.interests);
        if (form.password !== form.confirm)
          throw new Error("Passwords do not match.");
        await setPersistence(auth, browserLocalPersistence);
        const { user: created } = await createUserWithEmailAndPassword(
          auth,
          form.email.trim(),
          form.password,
        );
        setForm((f) => ({ ...f, password: "", confirm: "" }));
        let profileFailed = false,
          emailFailed = false;
        try {
          await setDoc(doc(db, "users", created.uid), {
            uid: created.uid,
            email: created.email,
            phoneNumber: form.phone.trim(),
            serviceInterests: form.interests,
            accountStatus: "active",
            waitlistStatus: "registered",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch {
          profileFailed = true;
        }
        try {
          await sendEmailVerification(created, {
            url: window.location.origin + "/#/verify-email",
          });
        } catch {
          emailFailed = true;
        }
        navigate("/verify-email", { state: { profileFailed, emailFailed } });
      } else if (login) {
        await setPersistence(
          auth,
          form.remember ? browserLocalPersistence : browserSessionPersistence,
        );
        const result = await signInWithEmailAndPassword(
          auth,
          form.email.trim(),
          form.password,
        );
        setForm((f) => ({ ...f, password: "" }));
        navigate(result.user.emailVerified ? "/dashboard" : "/verify-email");
      }
    });
  };
  const save = (e) => {
    e.preventDefault();
    run(async () => {
      await saveProfile(user, form.phone.trim(), form.interests);
      const snapshot = await getDoc(doc(db, "users", user.uid));
      setProfile(snapshot.data());
      setMessage("Your profile and waitlist interests have been saved.");
    });
  };
  const reauth = () =>
    reauthenticateWithCredential(
      user,
      EmailAuthProvider.credential(user.email, form.current),
    );
  return (
    <PortalShell
      title={
        signup
          ? "Join GaleoLab"
          : login
            ? "Welcome back"
            : forgot
              ? "Reset your password"
              : verify
                ? "Verify your email"
                : "Your engineering profile"
      }
    >
      {!configured && (
        <p role="alert">
          Account access is not configured yet. Please return later.
        </p>
      )}
      {error && (
        <p role="alert" className="portal-error">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {(signup || login || forgot) && (
        <form onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              name="email"
              required
              maxLength={254}
              autoComplete="email"
              value={form.email}
              onChange={change}
            />
          </label>
          {!forgot && (
            <Password value={form.password} onChange={change} fresh={signup} />
          )}
          {signup && (
            <>
              <p>
                Use 12–128 characters, with uppercase, lowercase, a number and a
                symbol.
              </p>
              <Password
                name="confirm"
                label="Confirm password"
                value={form.confirm}
                onChange={change}
                fresh
              />
              <label>
                Phone number
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+8801712345678"
                  required
                  value={form.phone}
                  onChange={change}
                />
              </label>
              <Interests
                value={form.interests}
                onChange={(interests) => setForm((f) => ({ ...f, interests }))}
              />
              <p>
                Your email is used for account security. Your phone and selected
                services are used to manage your early-access request. No SMS
                verification or marketing subscription is included. Your profile
                is available after verifying your email.{" "}
                <Link to="/privacy">Privacy information</Link>
              </p>
            </>
          )}
          {login && (
            <label className="check">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) =>
                  setForm({ ...form, remember: e.target.checked })
                }
              />
              Keep me signed in on this device
            </label>
          )}
          <button disabled={busy || !configured}>
            {busy
              ? "Please wait…"
              : signup
                ? "Create account"
                : login
                  ? "Sign in"
                  : "Send reset link"}
          </button>
        </form>
      )}
      {(signup || login || forgot) && (
        <nav>
          <Link to="/login">Sign in</Link>
          <Link to="/signup">Create account</Link>
          <Link to="/forgot-password">Forgot password</Link>
        </nav>
      )}
      {verify && (
        <>
          {state?.emailFailed && (
            <p role="alert">
              Your account was created, but the verification email could not be
              sent. Use Resend verification email below.
            </p>
          )}
          {state?.profileFailed && (
            <p role="alert">
              Your account was created, but the profile could not be saved.
              After verification, enter your phone number and interests on the
              profile page to finish registration.
            </p>
          )}
          <p>
            Welcome to GaleoLab! Your account has been created. Please verify
            your email to complete registration.
          </p>
          <p>{user.email}</p>
          <p>
            After verification, return here to review your phone number and
            engineering service interests.
          </p>
          <button disabled={busy || cooldown > 0} onClick={() => run(resend)}>
            {cooldown
              ? "Resend in " + cooldown + "s"
              : "Resend verification email"}
          </button>
          <button
            disabled={busy}
            onClick={() =>
              run(async () => {
                await reload(user);
                await getIdToken(user, true);
                if (user.emailVerified) navigate("/profile");
                else
                  setMessage(
                    "Your email is not verified yet. Open the link in your email first.",
                  );
              })
            }
          >
            I have verified my email
          </button>
          <button disabled={busy} onClick={() => run(logout)}>
            Sign out
          </button>
        </>
      )}
      {account && (
        <>
          <p>
            <strong>{user.email}</strong>
          </p>
          {!loaded ? (
            <p role="status">Loading profile…</p>
          ) : (
            <>
              <p>
                Waitlist status:{" "}
                {profile?.waitlistStatus || "Complete your profile to join"}
              </p>
              <form onSubmit={save}>
                <label>
                  Phone number
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={form.phone}
                    onChange={change}
                  />
                </label>
                <Interests
                  value={form.interests}
                  onChange={(interests) =>
                    setForm((f) => ({ ...f, interests }))
                  }
                />
                <button disabled={busy}>Save profile</button>
              </form>
            </>
          )}
          <hr />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                validatePassword(form.password);
                if (form.password !== form.confirm)
                  throw new Error("Passwords do not match.");
                await reauth();
                await updatePassword(user, form.password);
                setForm((f) => ({
                  ...f,
                  password: "",
                  confirm: "",
                  current: "",
                }));
                setMessage("Password changed.");
              });
            }}
          >
            <h2>Change password</h2>
            <Password
              name="current"
              label="Current password"
              value={form.current}
              onChange={change}
            />
            <Password
              label="New password"
              value={form.password}
              onChange={change}
              fresh
            />
            <Password
              name="confirm"
              label="Confirm new password"
              value={form.confirm}
              onChange={change}
              fresh
            />
            <button disabled={busy}>Change password</button>
          </form>
          <details>
            <summary>Delete account</summary>
            <p>
              This permanently removes your profile and sign-in account. Enter
              your current password above, then confirm deletion.
            </p>
            <button
              disabled={busy}
              onClick={() => {
                if (
                  window.confirm(
                    "Permanently delete your GaleoLab account and profile?",
                  )
                )
                  run(async () => {
                    await reauth();
                    await deleteDoc(doc(db, "users", user.uid));
                    try {
                      await deleteUser(user);
                    } catch {
                      throw new Error(
                        "Your profile was removed, but account deletion failed. Retry deletion with your current password. Your sign-in account still exists.",
                      );
                    }
                    navigate("/login");
                  });
              }}
            >
              Permanently delete account
            </button>
          </details>
          <button disabled={busy} onClick={() => run(logout)}>
            Sign out
          </button>
          {admin && <Link to="/admin">Administrator dashboard</Link>}
        </>
      )}
    </PortalShell>
  );
}
export function EmailAction() {
  const navigate = useNavigate();
  const [params] = useState(() => new URLSearchParams(window.location.search));
  useEffect(() => {
    window.history.replaceState(
      {},
      "",
      window.location.pathname + "#/auth/action",
    );
  }, []);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const mode = params.get("mode"),
    code = params.get("oobCode");
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (!auth || !code)
        throw new Error("This link is incomplete. Request a new email.");
      if (mode === "verifyEmail") {
        await applyActionCode(auth, code);
        setMessage(
          "Email verified. Return to sign in or refresh verification on your other tab.",
        );
      } else if (mode === "resetPassword") {
        validatePassword(password);
        if (password !== confirm) throw new Error("Passwords do not match.");
        await verifyPasswordResetCode(auth, code);
        await confirmPasswordReset(auth, code, password);
        if (auth.currentUser) await signOut(auth);
        navigate("/login", { replace: true });
      } else throw new Error("Unsupported email action. Request a new link.");
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <PortalShell title="Account verification">
      {error && <p role="alert">{error}</p>}
      {message ? (
        <p role="status">{message}</p>
      ) : (
        <form onSubmit={submit}>
          {mode === "resetPassword" && (
            <>
              <Password
                label="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fresh
              />
              <Password
                label="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                fresh
              />
            </>
          )}
          <button disabled={busy}>
            {busy
              ? "Please wait…"
              : mode === "resetPassword"
                ? "Save new password"
                : "Verify email"}
          </button>
        </form>
      )}
      <Link to="/login">Return to sign in</Link>
      <Link to="/forgot-password">Request a password reset</Link>
    </PortalShell>
  );
}
