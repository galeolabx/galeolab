# Migration and security review — 2026-10-22

## Audited baseline

Repository: galeolabx/galeolab, baseline commit 6a12cb9. Existing framework: React 18, Vite 5, HashRouter, GitHub Pages. There was no README or test/lint command in the baseline package manifest.

Old authentication entry points were AuthContext.jsx, authActions.js, supabase.js, supabaseConfig.js and authCallback.js. The SDK used PKCE, persistent sessions and automatic refresh. AuthContext restored getSession and subscribed to onAuthStateChange; sessionUser required an access_token and user ID. Login sent email/password to Supabase; registration required an actual returned session before treating the user as signed in. Password reset sent an email and updated the password after a verified recovery session. OAuth options included Google/GitHub. Callback handling exchanged query codes or accepted legacy fragment tokens, verified the user through Auth and cleared callback parameters from history. Passwords were not stored in the new session implementation; retired demo storage containing readable passwords was explicitly removed.

The old dashboard queried profiles, projects and project_activities with user-ID filters. The checked-in SQL migration provided the data model/RLS. Client-side filters alone were not authorization; hosted RLS/configuration was not verified in this task.

## What changed

The Firebase portal replaces old account pages and the project-oriented dashboard with the explicitly requested early-access waitlist. Marketing/home sections, brand assets and section redirects are retained. No simulations or billing features are added. The old migration and obsolete Supabase modules, dependency, env references and stale pnpm lockfile are removed from the active tree; they remain recoverable in Git history. The active lockfile is npm package-lock.json, matching deployment.

## Live-data boundary

No live Supabase project has been modified or deleted. Existing user counts and records were not available from this Git checkout and have not been claimed absent.
Before cutover:

1. Identify the real Supabase project and export Auth identities and relevant application tables securely.
2. Record UID mappings. Existing project ownership/foreign keys cannot be assumed to match new Firebase UIDs.
3. Decide whether supported password-hash import is viable with a trusted migration tool, or require users to reset/recreate credentials. Never copy passwords into Firestore.
4. Migrate only consented/minimum contact and interest data. Existing project/activity data needs its own retention/migration decision; the waitlist portal does not display it.
5. Test migration in staging, notify affected users through an approved process, and keep rollback backups.
6. Retire the old hosted service only after explicit approval, verified migration and retention review.

## Credential history check

A local scan of 78 text blobs reachable through the fetched Git refs found no matches for recognized private-key headers, Supabase secret-key patterns, GitHub token patterns or JWT literals. This is a bounded pattern scan, not proof no secret ever existed. GitHub Actions secret values cannot be read from repository source. The baseline used public frontend configuration references. No history rewrite or force push was performed.
If a privileged key was exposed outside this scan, rotate it at its issuer and audit usage; deleting a file is insufficient. Firebase public web config and old public anon keys are not private admin credentials, but still require correct access rules.

## Operational limitations

- Hosted Firebase configuration, real email delivery, production rules/index deployment and data migration require the actual project and owner approval.
- Account deletion spans two services and is retryable, not atomic; see AUTHENTICATION.md.
- Security-rules tests use emulated claims; real custom-claim provisioning must also be verified in staging.
- The existing contact form is outside this account migration; this work does not claim to repair or verify live contact-message delivery.
- Browser-local sessions remain subject to same-origin script compromise; avoid third-party scripts and keep dependencies current.
