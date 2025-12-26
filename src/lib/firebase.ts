import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth as getFirebaseAuth, type Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Internal state for lazy initialization
// eslint-disable-next-line prefer-const
let app: FirebaseApp | undefined;
// eslint-disable-next-line prefer-const
let auth: Auth | undefined;

/**
 * Get Firebase App instance (lazy initialization)
 * Only initializes on the client side when first called
 */
export function getApp(): FirebaseApp {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (globalThis.window === undefined) {
    throw new TypeError('Firebase can only be initialized on the client side');
  }

  if (!app) {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  }

  return app;
}

/**
 * Get Firebase Auth instance (lazy initialization)
 * Only initializes on the client side when first called
 */
export function getAuth(): Auth {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (globalThis.window === undefined) {
    throw new TypeError('Firebase Auth can only be initialized on the client side');
  }

  if (!auth) {
    const firebaseApp = getApp();
    auth = getFirebaseAuth(firebaseApp);
  }

  return auth;
}

// Note: app and auth are not exported to avoid SSG issues
// All components should use getApp() and getAuth() instead
