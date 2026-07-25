"use client";

import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseOptions,
} from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const missingConfiguration = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingConfiguration.length > 0) {
  throw new Error(
    `Firebase client authentication is not configured. Missing: ${missingConfiguration.join(", ")}`,
  );
}

export const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);

export const firebaseClientConfigurationStatus = {
  apiKeyMatchesApp:
    firebaseAuth.config.apiKey === firebaseApp.options.apiKey,

  authDomainMatchesApp:
    firebaseAuth.config.authDomain === firebaseApp.options.authDomain,

  projectIdMatchesEnvironment:
    firebaseApp.options.projectId ===
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};