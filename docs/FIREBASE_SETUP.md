# Firebase setup and deployment checklist

No production Firebase project ID or credentials have been invented. Nothing here enables billing or deploys production automatically.

## Console setup

1. Create/select the intended Firebase project on Spark. Register a Web app, without Analytics unless separately required.
2. Enable Authentication > Email/Password. Do not enable Phone/SMS. Enable email enumeration protection. Set the password policy to require at least 12 characters, uppercase, lowercase, numeric and non-alphanumeric characters.
3. Add galeolab.com and any real preview domain to Authorized domains. Add localhost only for local work if needed.
4. Create Cloud Firestore Standard edition in production/locked mode, choosing the data region deliberately. Do not use test-mode public rules.
5. Copy the Web SDK config into `client/.env.local` using the exact four names in `.env.example`. These values are public. Do not put Admin keys or SMTP secrets into VITE variables.
6. In Authentication email templates, configure the custom action URL as `https://galeolab.com/` for verification and password reset. The app routes root query actions to its handler. Verify sender branding and actual mailbox delivery. The default Firebase hosted handler is not the application's custom reset flow.
7. After choosing the real project, deploy rules and indexes explicitly from the repo root using the client CLI: `client/node_modules/.bin/firebase deploy --only firestore:rules,firestore:indexes --project YOUR_REAL_PROJECT_ID`. This is a deployment step requiring the owner's approval. Wait for indexes to finish building.
8. Grant the first administrator only after manually confirming the UID and verified email in Firebase Console. In a trusted local/Cloud Shell environment, authenticate Application Default Credentials with the intended project and least privilege sufficient to manage Auth custom claims. From client, run `node scripts/grant-admin.mjs YOUR_REAL_PROJECT_ID VERIFIED_ADMIN_UID`. The script uses no hardcoded email or embedded service-account key. Sign out/in afterward. Grant/revoke permissions only through a trusted operator.
9. Configure these GitHub repository Actions variables: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_APP_ID. Keep VITE_USE_FIREBASE_EMULATORS unset/false in production.
10. Review the migration checklist before approving merge/deployment. The existing main-branch GitHub Pages workflow deploys on a push to main. A feature-branch push does not deploy. Protect the main branch and require review.

## Local emulator use

Use Node 24 and Java 21+. `cd client && npm ci && npm run test:rules` runs against demo-galeolab only.
For interactive testing, start `firebase emulators:start --config ../firebase.json --project demo-galeolab --only auth,firestore`; use the demo project ID, any non-secret demo web API key/app ID and VITE_USE_FIREBASE_EMULATORS=true in an ignored local env file. Never use production data for tests.
Emulators do not send real email: retrieve action links from emulator logs/API. They do not prove SMTP deliverability, hosted quotas, production indexes or actual domain authorization.

## Cost controls and limits

No SMS, paid extensions, Cloud Functions, Analytics, subscription or simulation infrastructure is introduced. Admin uses on-demand queries with 25-row pagination; profiles use one-time reads rather than realtime listeners. Statistics use aggregate count queries and are loaded on admin mount. Counts are registered Firestore profiles, not total Auth users; interrupted registrations without profiles are excluded. Exact-email search is case-sensitive to the stored email; no full-text search service is included.

As checked 2026-10-22, Firestore's documented free quota is one free database per project, 1 GiB stored data, 50,000 document reads/day, 20,000 writes/day, 20,000 deletes/day and 10 GiB outbound transfer/month. Aggregate queries and index reads have billing/quota rules; monitor usage. Authentication also has provider, IP and email-send quotas: verify https://firebase.google.com/docs/auth/limits for the configured plan before launch. Spark quotas can interrupt service when exhausted. No unlimited-capacity guarantee is made.
Source: https://firebase.google.com/docs/firestore/quotas

## Launch acceptance

- Back up and map existing identity/profile/project data before changing live identity systems.
- Confirm production rules and indexes, including negative cross-user/admin tests.
- Confirm real signup, verification delivery/action handler, login, refresh, password reset, profile update, logout and deletion in a separate staging project.
- Verify desktop/mobile pages and existing website links.
- Confirm privacy notice, retention policy, support contact and admin access with the site owner.
- Check current npm audit (including dev tools), build, lint and emulator tests.
- Obtain explicit approval for production deployment. Do not enable billing without separate approval.
