# 🎓 Decentralized Student ID System

A cross-platform Web + Android application for managing digital student identities, college administration, and merchant verification using Firebase services.

## 🚀 Project Overview

The Decentralized Student ID System enables:

- 🎓 Students to access and manage their digital ID
- 🏫 College Admin to manage student records
- 🏪 Merchants to verify student identity
- 🔐 Secure authentication and role-based access control
- ☁️ Cloud-based storage and real-time database

Built using:

- Web Application (Frontend)
- Android Application
- Firebase Backend Services (Free Spark Plan)

## 🏗 Architecture

### 🔹 Frontend

- Web App (React / HTML / JS)
- Android App (Java / Kotlin)

### 🔹 Backend (Firebase Services)

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- ❌ No Cloud Functions
- ❌ No Paid Plan Required

## 🔐 Authentication System

Supported Login Methods:

- Email/Password
- Google Sign-In

Each user is assigned a role:

- student
- admin
- merchant

## 🗂 Firestore Database Structure

```text
users (collection)
   ├── userId
   │     ├── name
   │     ├── email
   │     ├── role (student | admin | merchant)
   │     ├── collegeId
   │
colleges (collection)
   ├── collegeId
   │     ├── name
   │     ├── address
   │
transactions (collection)
   ├── transactionId
         ├── studentId
         ├── merchantId
         ├── timestamp
```

## 📁 Folder Structure (Backend)

```text
backend/
│
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── .firebaserc
└── storage.rules
```

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd decentralized-student-id
```

### 2️⃣ Firebase Setup

```bash
firebase login
firebase init
```

Select:
- Firestore
- Authentication
- Storage

Do NOT select:
- Functions

### 3️⃣ Run Locally (Web)

```bash
npm install
npm start
```

### 4️⃣ Android Setup

1. Add Android app in Firebase Console
2. Download `google-services.json`
3. Place inside: `android/app/`
4. Sync Gradle and run app.

## 🔒 Firestore Security Rules (Basic Example)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read, write: if request.auth != null 
      && request.auth.uid == userId;
    }
  }
}
```

## 🎯 Phase 1 Features

- User Registration & Login
- Role-Based Redirection
- Student Profile Creation

- Admin Dashboard
- Merchant Verification Screen

## 🌟 Future Enhancements

- QR Code-based Student Verification
- Blockchain Integration
- Payment Gateway Integration
- Advanced Analytics Dashboard

## 🛠 Tech Stack

- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- JavaScript (Web)
- Kotlin/Java (Android)

## 📌 Plan Used

- Firebase Spark Plan (Free Tier)

## 👨‍💻 Author

Batman0603

## 🏫
Karthikeyan K R
Meenakshi Sundararajan Engineering College
IIIrd year / AI&DS department