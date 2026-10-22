import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { validateProfile } from "./registration";
export async function saveProfile(user, phoneNumber, serviceInterests) {
  validateProfile(phoneNumber, serviceInterests);
  const ref = doc(db, "users", user.uid);
  await runTransaction(db, async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists())
      tx.update(ref, {
        phoneNumber,
        serviceInterests,
        updatedAt: serverTimestamp(),
      });
    else
      tx.set(ref, {
        uid: user.uid,
        email: user.email,
        phoneNumber,
        serviceInterests,
        accountStatus: "active",
        waitlistStatus: "registered",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
  });
}
