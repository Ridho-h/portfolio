import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/*
 * ═══════════════════════════════════════════════════════
 *  FIREBASE CONFIG — GANTI DENGAN KONFIGURASI ANDA
 * ═══════════════════════════════════════════════════════
 *
 *  Cara mendapatkan config:
 *  1. Buka https://console.firebase.google.com/
 *  2. Buat project baru (gratis)
 *  3. Tambahkan Web App
 *  4. Copy konfigurasi ke bawah ini
 *  5. Aktifkan Firestore Database (mode test)
 *  6. Aktifkan Authentication > Email/Password
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "REPLACE_ME",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let app, db, auth;
let firebaseReady = false;

try {
  if (firebaseConfig.apiKey !== "REPLACE_ME") {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    firebaseReady = true;
  }
} catch (e) {
  console.warn('[Firebase] Not configured yet. Using fallback data.');
}

export { db, auth, firebaseReady };
