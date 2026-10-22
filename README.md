# GaleoLab website and early-access portal

Existing React/Vite website, with Firebase Authentication and Cloud Firestore for early-access registration. Branding, home sections, HashRouter and GitHub Pages hosting are retained.

## Development

Use Node.js 24. From `client`: `npm ci`, copy `.env.example` to `.env.local`, fill in the Firebase web configuration, then `npm run dev`.
No account service is initialized when configuration is missing. Marketing pages remain available.

## Checks

From `client`:

- `npm run lint`
- `npm test`
- `npm run build`
- `npm run test:rules` (Java 21+, Firebase Auth/Firestore emulators; demo project only)

See [Firebase setup and deployment](docs/FIREBASE_SETUP.md), [authentication architecture](docs/AUTHENTICATION.md), and [migration and security review](docs/MIGRATION.md).
