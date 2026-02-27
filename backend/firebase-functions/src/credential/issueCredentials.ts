import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {requireRole} from "../middleware/requireRole";

export const issueCredential = functions.https.onCall(
  async (data, context) => {
    // 🔐 Only university allowed
    requireRole("university")(context);

    const {studentId, type, metadata} = data;

    if (!studentId || !type) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required fields"
      );
    }

    const universityId = context.auth!.uid;
    const credentialRef = admin.firestore().collection("credentials").doc();

    await credentialRef.set({
      studentId,
      universityId,
      type,
      metadata: metadata || {},
      status: "active",
      issuedAt: admin.firestore.FieldValue.serverTimestamp(),
      revokedAt: null,
    });

    return {
      success: true,
      credentialId: credentialRef.id,
    };
  }
);
