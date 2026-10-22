export const SERVICES = [
  "AI-Assisted CAD Design",
  "FEA / Structural Simulation",
  "CFD / Aerodynamics Simulation",
  "Aerospace Engineering Solutions",
  "Mechanical Engineering Solutions",
  "Manufacturing Engineering",
  "CAM / CNC Programming",
  "AI-Powered Engineering Research",
  "Other Engineering Services",
];
export function validateProfile(phone, interests) {
  if (!/^\+[1-9]\d{7,14}$/.test(phone))
    throw new Error(
      "Enter an international phone number, for example +8801712345678.",
    );
  if (
    !Array.isArray(interests) ||
    !interests.length ||
    new Set(interests).size !== interests.length ||
    interests.some((s) => !SERVICES.includes(s))
  )
    throw new Error("Select at least one engineering service.");
}
export function validatePassword(password) {
  if (
    password.length < 12 ||
    password.length > 128 ||
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[^A-Za-z0-9]/.test(password)
  )
    throw new Error(
      "Use 12–128 characters including uppercase, lowercase, a number and a symbol.",
    );
}
