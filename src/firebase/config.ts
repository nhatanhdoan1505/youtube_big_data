import admin from "firebase-admin";
import serviceAccount from "../../firebase-admin.json";

export const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
});
