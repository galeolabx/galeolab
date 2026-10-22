import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
const [projectId, uid] = process.argv.slice(2);
if (!projectId || !uid)
  throw new Error("Usage: node scripts/grant-admin.mjs PROJECT_ID UID");
initializeApp({ credential: applicationDefault(), projectId });
const auth = getAuth();
const user = await auth.getUser(uid);
if (!user.emailVerified)
  throw new Error("Verify the intended administrator email first.");
await auth.setCustomUserClaims(uid, { ...user.customClaims, admin: true });
console.log(
  "Administrator claim granted. Sign out and sign in to refresh the token.",
);
