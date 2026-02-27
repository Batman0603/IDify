import * as functions from "firebase-functions";

export const requireRole = (requiredRole: string) => {
  return (context: functions.https.CallableContext) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required."
      );
    }

    const userRole = context.auth.token.role;

    if (userRole !== requiredRole) {
      throw new functions.https.HttpsError(
        "permission-denied",
        `Only ${requiredRole} can perform this action.`
      );
    }
  };
};
