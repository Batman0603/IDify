import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

type UserRole = "student" | "merchant" | "university";

export const setUserRole = functions.https.onCall(
  async (data, context) => {
    try {
      // 🔐 Ensure only authenticated user
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User must be authenticated."
        );
      }

      const {uid, role} = data as {uid: string; role: UserRole};

      if (!uid || !role) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "UID and role are required."
        );
      }

      const allowedRoles: UserRole[] = ["student", "merchant", "university"];

      if (!allowedRoles.includes(role)) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Invalid role specified."
        );
      }

      // 👑 Only university can assign roles
      if (context.auth.token.role !== "university") {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Only university can assign roles."
        );
      }

      await admin.auth().setCustomUserClaims(uid, {role});

      return {
        success: true,
        message: `Role ${role} assigned successfully.`,
      };
    } catch (error: unknown) {
      console.error("Error setting role:", error);

      throw new functions.https.HttpsError(
        "internal",
        (error as Error).message || "Unexpected error occurred."
      );
    }
  }
);
