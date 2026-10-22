const names = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
];
const missing = names.filter((name) => !process.env[name]);
if (missing.length) {
  console.error("Missing Firebase configuration: " + missing.join(", "));
  process.exit(1);
}
if (process.env.VITE_USE_FIREBASE_EMULATORS === "true") {
  console.error("Emulators cannot be enabled in deployment.");
  process.exit(1);
}
