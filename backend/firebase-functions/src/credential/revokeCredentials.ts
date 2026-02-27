import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { requireRole } from "../utils/roleGuard";

export const revokeCredential = functions.https.onCall(
  async (data, context) => {

    await requireRole(context, "university");

    const { credentialId } = data;

    if (!credentialId) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Credential ID required"
      );
    }

    const credentialRef = admin
      .firestore()
      .collection("credentials")
      .doc(credentialId);

    await credentialRef.update({
      status: "revoked",
      revokedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  }
);