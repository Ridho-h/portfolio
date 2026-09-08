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
  apiKey: "AIzaSyCQPBVLyeog6b4UZA_On2xtvK1_lwWdxXQ",
  authDomain: "ridho-portfolio.firebaseapp.com",
  projectId: "ridho-portfolio",
  storageBucket: "ridho-portfolio.firebasestorage.app",
  messagingSenderId: "1075389826092",
  appId: "1:1075389826092:web:919329daf0592759d7fd89"
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
