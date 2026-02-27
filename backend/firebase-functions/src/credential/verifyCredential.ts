import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { requireRole } from "../utils/roleGuard";

export const verifyCredential = functions.https.onCall(
  async (data, context) => {

    await requireRole(context, "merchant");

    const { credentialId } = data;

    if (!credentialId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Credential ID required"
      );
    }

    const credentialDoc = await admin
      .firestore()
      .collection("credentials")
      .doc(credentialId)
      .get();

    if (!credentialDoc.exists) {
      return { valid: false, reason: "Credential not found" };
    }

    const credential = credentialDoc.data();

    if (credential?.status !== "active") {
      return { valid: false, reason: "Credential revoked" };
    }

    return {
      valid: true,
      credential
    };
  }
);