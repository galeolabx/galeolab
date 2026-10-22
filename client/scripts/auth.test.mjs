import test from "node:test";
import assert from "node:assert/strict";
import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  applyActionCode,
  reload,
  sendPasswordResetEmail,
  confirmPasswordReset,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
  updatePassword,
} from "firebase/auth";
test("Auth emulator: signup, duplicate, invalid login, verification, reset, password change, logout and deletion", async () => {
  const app = initializeApp(
    { apiKey: "demo-key", projectId: "demo-galeolab" },
    "integration",
  );
  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  const email = "integration-" + Date.now() + "@example.com",
    password = "Engineering!2026";
  try {
    await assert.rejects(
      createUserWithEmailAndPassword(auth, "invalid", password),
    );
    await assert.rejects(
      createUserWithEmailAndPassword(auth, "weak@example.com", "1"),
    );
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    assert.equal(user.emailVerified, false);
    await assert.rejects(createUserWithEmailAndPassword(auth, email, password));
    await sendEmailVerification(user);
    let codes = await fetch(
      "http://127.0.0.1:9099/emulator/v1/projects/demo-galeolab/oobCodes",
    ).then((r) => r.json());
    const verification = codes.oobCodes.find(
      (c) => c.email === email && c.requestType === "VERIFY_EMAIL",
    );
    assert.ok(verification);
    await applyActionCode(auth, verification.oobCode);
    await reload(user);
    assert.equal(user.emailVerified, true);
    await signOut(auth);
    assert.equal(auth.currentUser, null);
    await assert.rejects(signInWithEmailAndPassword(auth, email, "wrong"));
    await signInWithEmailAndPassword(auth, email, password);
    await sendPasswordResetEmail(auth, email);
    codes = await fetch(
      "http://127.0.0.1:9099/emulator/v1/projects/demo-galeolab/oobCodes",
    ).then((r) => r.json());
    const reset = codes.oobCodes.find(
      (c) => c.email === email && c.requestType === "PASSWORD_RESET",
    );
    assert.ok(reset);
    await confirmPasswordReset(auth, reset.oobCode, "NewEngineering!2026");
    await assert.rejects(
      confirmPasswordReset(auth, reset.oobCode, "AnotherEngineering!2026"),
    );
    await signOut(auth);
    await assert.rejects(signInWithEmailAndPassword(auth, email, password));
    const signed = await signInWithEmailAndPassword(
      auth,
      email,
      "NewEngineering!2026",
    );
    await reauthenticateWithCredential(
      signed.user,
      EmailAuthProvider.credential(email, "NewEngineering!2026"),
    );
    await updatePassword(signed.user, "FinalEngineering!2026");
    await deleteUser(signed.user);
    await assert.rejects(
      signInWithEmailAndPassword(auth, email, "FinalEngineering!2026"),
    );
  } finally {
    await deleteApp(app);
  }
});
