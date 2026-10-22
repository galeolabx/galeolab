# Validation record — 2026-10-22

## Executed locally

- Production build passed on the final upgraded Vite 8.3.5 / React Router 7.18.4 dependency set. The generated main bundle is approximately 810 kB before gzip (249 kB gzip); Vite emits a non-fatal chunk-size warning.
- ESLint passed after introducing the lint configuration and fixing the new password-input accessible label.
- Four Node tests passed: valid profile inputs, malformed phones, unsupported/empty/duplicate interests, strong-password bounds.
- Five Firebase emulator tests passed: complete Auth lifecycle, owner create/read/update, anonymous/cross-user/admin access boundaries, unverified-user restrictions/schema abuse, recent-authentication deletion.
- Headless Microsoft Edge browser smoke test passed against local emulators: registration; unverified dashboard redirect; custom email action under React StrictMode; UID profile creation; editing interests; refresh persistence; unauthorized admin page; logout; logged-out route redirect; login; reauthenticated deletion; 390px profile and home overflow checks. No uncaught page errors were recorded. Screenshots were inspected separately.
- npm audit --omit=dev: zero reported vulnerabilities after upgrading React Router/Vite and overriding @grpc/grpc-js to 1.14.6.
- Full dependency audit: seven findings remain in Firebase CLI dev tooling (three high, four moderate including transitive parents). See dependency-audit.json. The underlying findings concern braces, OpenTelemetry core and uuid. These tools are not included in the browser bundle. Do not expose emulator/CLI services to untrusted networks; recheck upstream fixes. No unsafe force-downgrade was applied.

## Not established by these tests

Real Firebase project/domain configuration, real mailbox delivery, deployed indexes/rules, live legacy user counts, data migration, production deployment and live website behavior remain unverified. No such deployment was performed. Emulator Auth policy is not proof of production password-policy configuration.

The new verification workflow runs lint, unit tests, build and Auth/Firestore emulator tests for pull requests. There were no existing baseline test scripts to preserve.
