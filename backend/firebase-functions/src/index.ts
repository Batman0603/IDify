import * as admin from "firebase-admin";

admin.initializeApp();

export { issueCredential } from "./credential/issueCredentials";
export { verifyCredential } from "./credential/verifyCredential";
export { revokeCredential } from "./credential/revokeCredentials";

export { setUserRole } from "./auth/setUserRole";
