import test from "node:test";
import assert from "node:assert/strict";
import {
  SERVICES,
  validatePassword,
  validateProfile,
} from "../src/lib/registration.js";
test("accepts supported services and international phone", () =>
  assert.doesNotThrow(() =>
    validateProfile("+8801712345678", SERVICES.slice(0, 2)),
  ));
test("rejects malformed phones", () => {
  for (const phone of ["01712345678", "+0", "<script>", "+1234567890123456"])
    assert.throws(() => validateProfile(phone, [SERVICES[0]]));
});
test("rejects absent, invented and duplicate interests", () => {
  for (const value of [[], ["admin"], [SERVICES[0], SERVICES[0]], null])
    assert.throws(() => validateProfile("+8801712345678", value));
});
test("requires strong bounded passwords", () => {
  assert.doesNotThrow(() => validatePassword("Engineering!2026"));
  for (const password of [
    "short",
    "abcdefghijkl",
    "ABCDEFGHIJK1!",
    "Abcdefghijk12",
    "A".repeat(129) + "a1!",
  ])
    assert.throws(() => validatePassword(password));
});
