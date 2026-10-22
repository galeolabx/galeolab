# Authentication architecture

## Components

- `client/src/lib/firebase.js`: initializes the modular Firebase Web SDK from public Vite configuration. Emulator connections are allowed only in a Vite development build.
- `client/src/context/AuthContext.jsx`: observes ID-token changes, restores the SDK session and resolves custom claims. Its admin flag controls navigation only.
- `client/src/pages/Portal.jsx`: registration, login, verification, password-reset email, custom email-action handler, profile/dashboard, password changes and deletion.
- `client/src/lib/registration.js`: shared phone, service-interest and password validation.
- `client/src/lib/profiles.js`: transaction-based create-or-update of the current user's profile. A missing document is recoverable after sign-in.
- `client/src/pages/Admin.jsx`: 25-row cursor pagination, exact-email search, service filtering, total registered profile count and per-service aggregate counts.
- `firestore.rules`: actual authorization boundary. Firebase validates the user's token; rules check UID ownership, verified email, immutable fields and the admin custom claim.
- `client/scripts/grant-admin.mjs`: trusted operator-only Admin SDK command. Never imported into the browser.

## Request flow

1. Registration validates email through the browser/Firebase, international-format contact phone, password confirmation and one or more allowed interests.
2. The browser sends the password directly to Firebase Authentication with `createUserWithEmailAndPassword`. Firebase creates the UID and session.
3. A Firestore `users/{uid}` document is created with the selected contact data and server timestamps. An unverified owner may create this narrowly validated document, but cannot read or update it.
4. A verification email is sent. Either email-send or profile-write failure is displayed without pretending registration fully completed. Verification can be resent; missing profiles can be created after verification.
5. The verification link enters `/?mode=verifyEmail&oobCode=...`. Main routes to `#/auth/action`; the action component keeps the one-use code in memory and removes the query from browser history. Firebase validates the code. No arbitrary continue URL is followed.
6. The user refreshes verification; the app reloads the Firebase user and forces a fresh ID token. Both UI and Firestore require verified email for protected profile access.
7. Login uses `signInWithEmailAndPassword` and routes to the dashboard (or verification page). Profile reads/writes go directly to Firestore with SDK-managed identity.
8. Logout calls Firebase `signOut`. It ends the current browser session; it does not claim to revoke every previously issued token or other devices.

## Passwords, credentials and tokens

Passwords are held only in form state and submitted to Firebase Auth. They are not written to Firestore, logs, URLs or application browser storage. Forms clear password state after relevant actions or route changes. Firebase stores and verifies password credentials internally.

Firebase web configuration is public application identification, not an administrative secret. Access depends on rules, not hiding the API key. The Admin SDK uses Application Default Credentials only in an operator environment.

Firebase manages ID and refresh tokens. Registration uses local persistence. Login offers local persistence when Keep me signed in is checked, otherwise session persistence (survives refresh within the tab). No application-generated JWTs or copied tokens are used. Firestore uses its default memory cache; persistent offline profile caching is not enabled.

Password reset requests use `sendPasswordResetEmail`. The configured custom email handler verifies the action code and confirms the new password, signs out the local session if present, and routes to Login. Password changes and deletion require the current password through `reauthenticateWithCredential`.

## Authorization and deletion

An owner can create only a prescribed schema, read only after email verification, and update only phoneNumber/serviceInterests/updatedAt. accountStatus and waitlistStatus are fixed on creation and cannot be edited by the browser. Unknown fields (including passwords and admin flags) are rejected.

Only a verified token with `admin: true` can list users. A user-editable profile field or hardcoded email never grants access. Firebase Security Rules execute on Google's backend, so no continuously hosted application server or paid function is needed for admin reads. The first claim is granted using the operator script.

Deletion reauthenticates, removes the profile, then deletes the Auth user. Rules require auth_time within five minutes for profile deletion. These two Firebase products cannot participate in one atomic transaction. If Auth deletion fails after profile removal, the UI reports the partial result and allows retry; no data is silently restored. Operators must review interrupted deletions before making stronger retention guarantees. Previously issued tokens can remain valid until expiry; deletion is not a substitute for global token revocation. A managed backend would be needed for stronger atomic/revocation guarantees.

## Routes

The existing HashRouter is retained: actual URLs are `/#/signup`, `/#/login`, `/#/forgot-password`, `/#/verify-email`, `/#/dashboard`, `/#/profile`, `/#/admin`, and `/#/privacy`. Firebase email links use the root query handler above. Clean non-hash routes require a separate hosting/router migration.

## Documentation

- https://firebase.google.com/docs/auth/web/manage-users
- https://firebase.google.com/docs/auth/web/auth-state-persistence
- https://firebase.google.com/docs/auth/custom-email-handler
- https://firebase.google.com/docs/auth/admin/custom-claims
- https://firebase.google.com/docs/rules/rules-and-auth
