# GaleoLab login and signup setup

This change adds account screens to the existing React/Vite website. GitHub Pages continues to host the website; Supabase Auth manages registration, password verification, email links, and sessions.

The pages are ready to connect to a Supabase project. Without valid configuration, the forms are disabled and display an account-unavailable message. No demo credentials or simulated successful logins are included.

## Pages

The existing HashRouter is retained, so the public page URLs include #.

| Page | URL |
| --- | --- |
| Login | https://galeolab.com/#/login |
| Signup | https://galeolab.com/#/signup |
| Email confirmation instructions | https://galeolab.com/#/verify-email |
| Request a password reset | https://galeolab.com/#/forgot-password |
| Set a new password | https://galeolab.com/#/reset-password |
| Account and sign out | https://galeolab.com/#/account |

Signup collects a name, email, password, and matching password confirmation. The account page displays details returned by the Auth server. There is no projects database, billing system, or API-key management in this change.

## 1. Create and configure Supabase

1. Create a project in the [Supabase dashboard](https://supabase.com/dashboard). Choose a region suitable for your users.
2. In Authentication, enable the Email provider and keep email confirmation enabled.
3. Set the server-side minimum password length to 12 characters to match the form. Enable any additional password protections appropriate for your project.
4. Set the Auth Site URL to https://galeolab.com/.
5. Add the exact redirect URLs below under Authentication URL Configuration.

| Environment | Allowed confirmation redirect | Allowed recovery redirect |
| --- | --- | --- |
| Production | https://galeolab.com/?auth=confirm | https://galeolab.com/?auth=recovery |
| Local Vite development | http://localhost:5173/?auth=confirm | http://localhost:5173/?auth=recovery |

If you serve a separate www hostname or use a different local port, add that origin explicitly too. The callback URLs intentionally use a query parameter at the site root; do not replace them with hash routes.

Keep the email templates' confirmation link based on Supabase's ConfirmationURL variable so that the requested redirect is preserved. Configure a custom SMTP sender before accepting public registrations. Supabase's default sender is for testing, has strict limits, and does not send to arbitrary public signup addresses.

References: [password authentication](https://supabase.com/docs/guides/auth/passwords), [redirect configuration](https://supabase.com/docs/guides/auth/redirect-urls), [custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp).

## 2. Connect local development

Copy client/.env.example to client/.env.local, then fill in:

    VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
    VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_PUBLIC_KEY

Copy the project URL and publishable key from the project's Connect dialog or Settings > API Keys. This implementation accepts the current sb_publishable_ key format. Never use an sb_secret_ key, a service_role key, a database password, or an SMTP password in these fields.

From the client directory:

    npm ci
    npm run dev

Restart Vite after editing the environment file. The existing .gitignore excludes local environment files.

## 3. Connect the GitHub Pages build

In the galeolabx/galeolab repository, open Settings > Secrets and variables > Actions > Variables. Add two repository variables:

- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

Use the same public values as local development. The deployment workflow passes them into Vite at build time. VITE_ values are visible in the built website, so they must not contain secrets.

After the draft has been reviewed, merge it and let the normal Pages deployment run. Changing variables later requires a fresh build/deployment.

The GitHub Pages configuration and public audience are unchanged by this draft.

## 4. Check the complete user journey

Use an email address you control and a unique test password.

| Check | Expected result |
| --- | --- |
| Open login/signup at a narrow mobile width | Form fits without horizontal scrolling; every field has a label. |
| Toggle the existing light/dark theme | Inputs, labels, and buttons remain readable. |
| Submit mismatched passwords | Signup stops with a useful error. |
| Submit a valid registration | Email confirmation instructions appear; password fields are cleared. |
| Open the newest confirmation link in the same browser | The account page opens; callback code is removed from the URL. |
| Log out, then use a wrong password | Login remains unsuccessful with a generic error. |
| Log in with the confirmed account | The Auth server verifies the account and its details are displayed. |
| Refresh the account page | The SDK restores the session and account details are re-verified. |
| Request a reset for a registered and an unregistered email | Both successful requests show the same generic confirmation text. |
| Complete a reset, then log in | The new password works; the old password does not. |
| Reuse an expired/rejected email callback | An explanatory login message appears, without exposing a reset form. |
| Sign out and open the account URL directly | The user is sent to login. |
| Remove the public auth configuration and rebuild | Forms are disabled; no account is fabricated. |
| Open a homepage section from an account page | Navigation returns to the correct homepage section. |

The Check GaleoLab workflow runs the callback tests, the existing Vite build, and a reachability check for the pinned Auth SDK. These checks do not replace email-delivery and real-account testing.

## Implementation and limits

- Passwords go directly to Supabase Auth over HTTPS. GaleoLab does not save passwords in its source code, localStorage, or a custom users table.
- The official SDK manages session tokens in browser storage and refreshes sessions. That does not make browser storage a security boundary. Keep the site free of unsafe script injection.
- Email callbacks use PKCE. A link must be completed in the same browser/device where that signup or recovery request began. Opening a later link is preferable if multiple requests were made. See [PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow).
- The SDK is loaded from a version-pinned jsDelivr ESM URL at runtime. Login depends on that CDN being reachable. The npm and pnpm dependency files are unchanged. If migrating to an npm-bundled SDK later, update the relevant lockfiles and replace the dynamic import in client/src/auth/client.js.
- The UI's account redirect is for navigation. Future private projects/files must be protected by server-side authorization and database/storage policies. A hidden route cannot protect files already shipped in a static site's bundle.
- Full name in user_metadata is display data only. Do not use editable user metadata to grant admin roles.
- No public database tables are introduced. When you add per-user data, enable Row Level Security and scope access to the authenticated user's ID. See [API keys and RLS](https://supabase.com/docs/guides/api/api-keys).
- Google login, organization memberships, payments, and MFA are separate follow-up features.
- Sign out uses the SDK's local scope. This change does not claim to instantly revoke every access token on every device.

The Supabase project, SMTP configuration, and public build variables must be configured by the project owner before real user testing and launch.
