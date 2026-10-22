import React from "react";
import { HashRouter, Navigate, Routes, Route } from "react-router-dom";
import BaseLayout from "./components/layout/BaseLayout";
import Home from "./pages/Home/Home";
import Portal, { EmailAction, PortalShell } from "./pages/Portal";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
const sections = {
  platform: "platform",
  solutions: "solutions",
  services: "solutions",
  technology: "technology",
  research: "research",
  pricing: "pricing",
  developers: "developers",
  company: "company",
  about: "company",
  career: "company",
  portfolio: "solutions",
  contact: "contact",
};
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          {[
            "login",
            "signup",
            "forgot-password",
            "verify-email",
            "dashboard",
            "profile",
          ].map((path) => (
            <Route key={path} path={path} element={<Portal />} />
          ))}
          <Route
            path="update-password"
            element={<Navigate to="/forgot-password" replace />}
          />
          <Route path="auth/action" element={<EmailAction />} />
          <Route path="admin" element={<Admin />} />
          <Route
            path="privacy"
            element={
              <PortalShell title="Account privacy">
                <p>
                  We collect your email, contact phone number and selected
                  engineering interests to manage your account and early-access
                  waitlist. Firebase Authentication manages passwords; passwords
                  are never stored in your profile. Authorized GaleoLab
                  administrators can view registration information. No SMS
                  verification or marketing subscription is included. You can
                  update or delete your profile from your account. Existing
                  project records, if any, require a separate migration and
                  retention review.
                </p>
              </PortalShell>
            }
          />
          {Object.entries(sections).map(([path, section]) => (
            <Route
              key={path}
              path={path}
              element={<Navigate to={"/#" + section} replace />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
