import { readFile } from "node:fs/promises";
import { before, after, test } from "node:test";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
let env;
const id = "demo-galeolab";
const data = (uid) => ({
  uid,
  email: uid + "@example.com",
  phoneNumber: "+8801712345678",
  serviceInterests: ["AI-Assisted CAD Design"],
  accountStatus: "active",
  waitlistStatus: "registered",
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
});
const db = (uid, extra = {}) =>
  env
    .authenticatedContext(uid, {
      email: uid + "@example.com",
      email_verified: true,
      auth_time: Math.floor(Date.now() / 1000),
      ...extra,
    })
    .firestore();
before(async () => {
  env = await initializeTestEnvironment({
    projectId: id,
    firestore: {
      rules: await readFile("../firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});
after(async () => {
  await env?.cleanup();
});
test("owner creation, verified read and allowed updates", async () => {
  const ref = doc(db("alice"), "users/alice");
  await assertSucceeds(setDoc(ref, data("alice")));
  await assertSucceeds(getDoc(ref));
  await assertSucceeds(
    updateDoc(ref, {
      phoneNumber: "+14155552671",
      updatedAt: serverTimestamp(),
    }),
  );
  await assertFails(
    updateDoc(ref, { accountStatus: "admin", updatedAt: serverTimestamp() }),
  );
  await assertFails(
    updateDoc(ref, { admin: true, updatedAt: serverTimestamp() }),
  );
  await assertFails(
    updateDoc(ref, {
      serviceInterests: ["invented"],
      updatedAt: serverTimestamp(),
    }),
  );
  await assertFails(
    updateDoc(ref, {
      email: "other@example.com",
      updatedAt: serverTimestamp(),
    }),
  );
});
test("anonymous and cross-user access denied; claims allow admin reads only", async () => {
  await assertFails(
    getDoc(doc(env.unauthenticatedContext().firestore(), "users/alice")),
  );
  await assertFails(getDoc(doc(db("bob"), "users/alice")));
  await assertFails(getDocs(collection(db("bob"), "users")));
  await assertSucceeds(
    getDocs(collection(db("staff", { admin: true }), "users")),
  );
  await assertFails(
    updateDoc(doc(db("staff", { admin: true }), "users/alice"), {
      phoneNumber: "+14155552671",
      updatedAt: serverTimestamp(),
    }),
  );
  await assertFails(
    getDocs(
      collection(db("staff", { admin: true, email_verified: false }), "users"),
    ),
  );
});
test("unverified registration may create but cannot read/update; recovery cannot add privileges", async () => {
  const ref = doc(db("new", { email_verified: false }), "users/new");
  await assertSucceeds(setDoc(ref, data("new")));
  await assertFails(getDoc(ref));
  await assertFails(
    updateDoc(ref, {
      phoneNumber: "+14155552671",
      updatedAt: serverTimestamp(),
    }),
  );
  await assertFails(
    setDoc(doc(db("evil"), "users/evil"), {
      ...data("evil"),
      accountStatus: "admin",
    }),
  );
  await assertFails(
    setDoc(doc(db("forged"), "users/forged"), {
      ...data("forged"),
      createdAt: new Date(0),
    }),
  );
  await assertFails(
    setDoc(doc(db("extra"), "users/extra"), {
      ...data("extra"),
      password: "secret",
    }),
  );
});
test("deletion requires recent reauthentication and ownership", async () => {
  await assertFails(
    deleteDoc(doc(db("alice", { auth_time: 1 }), "users/alice")),
  );
  await assertFails(deleteDoc(doc(db("bob"), "users/alice")));
  await assertSucceeds(deleteDoc(doc(db("alice"), "users/alice")));
});
