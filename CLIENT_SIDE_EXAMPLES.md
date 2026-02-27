# Client-Side Implementation Guide (Firestore-only Architecture)

Firestore rules now act as your backend. All security is enforced in the database.

## 1. Rules to Publish in Console

Open the Firebase console, go to Firestore → Rules and replace everything with:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    match /credentials/{credentialId} {

      // University can create credentials
      allow create: if request.auth != null
        && getUserRole() == "university"
        && request.resource.data.universityId == request.auth.uid
        && request.resource.data.status == "active";

      // Student can read their own credentials
      allow read: if request.auth != null
        && (
            getUserRole() == "merchant"
            || resource.data.studentId == request.auth.uid
           );

      // University can revoke
      allow update: if request.auth != null
        && getUserRole() == "university"
        && resource.data.universityId == request.auth.uid;

      allow delete: if false;
    }
  }
}
```

Publish the rules. They enforce:

| Role       | Allowed Actions                    |
|------------|------------------------------------|
| University | Create credentials, revoke theirs  |
| Student    | Read their own credentials         |
| Merchant   | Read any credential by ID          |
| Others     | Blocked                            |

---

## 2. University Issues Credential (Frontend)

```javascript
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

async function issueCredential(studentId) {
  const user = auth.currentUser;

  await addDoc(collection(db, "credentials"), {
    studentId: studentId,
    universityId: user.uid,
    type: "StudentID",
    metadata: { program: "Computer Science" },
    status: "active",
    issuedAt: serverTimestamp(),
    revokedAt: null
  });
}
```

If the caller isn’t a university, the add will be rejected by Firestore.

---

## 3. Student Reads Their Credentials

```javascript
import { query, where, collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";

async function getMyCredentials() {
  const user = auth.currentUser;

  const q = query(
    collection(db, "credentials"),
    where("studentId", "==", user.uid)
  );

  const snapshot = await getDocs(q);
  snapshot.forEach(doc => console.log(doc.data()));
}
```


---

## 4. Merchant Verification

```javascript
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

async function verifyCredential(credentialId) {
  const docRef = doc(db, "credentials", credentialId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return "Invalid";
  }

  if (docSnap.data().status !== "active") {
    return "Revoked";
  }

  return "Valid";
}
```

Only merchants (and the credential owner) can read via rules.

---

## 5. University Revokes a Credential

```javascript
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

async function revokeCredential(credentialId) {
  const docRef = doc(db, "credentials", credentialId);

  await updateDoc(docRef, {
    status: "revoked",
    revokedAt: serverTimestamp()
  });
}
```

Updates by non‑universities are blocked by Firestore.

---

## 6. Deployment

```bash
# Rules only
firebase deploy --only firestore:rules
```

You’re fully on the free Spark plan—no functions, no billing.

---

This file now reflects the new “Firestore‑as‑backend” architecture. Feel free to copy these snippets directly into your frontend code.