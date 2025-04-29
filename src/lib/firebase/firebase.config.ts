import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// 필요한 다른 Firebase 서비스 import (예: getAnalytics)

// .env.local 파일의 환경 변수를 사용하여 Firebase 설정 객체 생성
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, // Realtime Database 사용 시 주석 해제
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Google Analytics 사용 시 주석 해제 및 .env.local에 추가
};

// Firebase 앱 초기화 (서버/클라이언트 중복 초기화 방지)
let app;
console.log(">>>> Firebase Config: Attempting initialization..."); // 실행 시작 로그
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    console.log(">>>> Firebase Config: Initialized successfully:", app.name); // 성공 로그
  } catch (error) {
    console.error(">>>> Firebase Config: Error during initializeApp:", error); // 초기화 중 오류 로그
  }
} else {
  app = getApp();
  console.log(">>>> Firebase Config: App already exists, getting app:", app.name); // 이미 초기화됨 로그
}

// 필요한 Firebase 서비스 객체 생성
const auth = getAuth(app);
const db = getFirestore(app); // Firestore
const storage = getStorage(app); // Storage
// const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null; // Analytics (클라이언트 전용)

// 필요한 서비스 export
export { app, auth, db, storage /*, analytics */ };
