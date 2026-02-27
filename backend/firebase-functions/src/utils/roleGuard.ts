import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export async function requireRole(context: any, role: string) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be authenticated"
    );
  }

  const uid = context.auth.uid;
  const userDoc = await admin.firestore().collection("users").doc(uid).get();

  if (!userDoc.exists || userDoc.data()?.role !== role) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Insufficient permissions"
    );
  }

  return uid;
}