// src/firebaseConfig.ts
import { initializeApp, getApps, getApp, FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getVertexAI } from 'firebase/vertexai'; // Vertex AI SDK 임포트 추가
import {devLog} from '@/lib/utils/devLogger';

// 필요한 다른 Firebase 서비스 import (예: getAnalytics)

// .env.local 파일의 환경 변수를 사용하여 Firebase 설정 객체 생성
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL, 
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Google Analytics 사용 시 주석 해제 및 .env.local에 추가
};

// Firebase 앱 초기화 (서버/클라이언트 중복 초기화 방지)
let app;
devLog(">>>> Firebase Config: Attempting initialization..."); // 실행 시작 로그
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    devLog(">>>> Firebase Config: Initialized successfully:", app.name); // 성공 로그
  } catch (error) {
    console.error(">>>> Firebase Config: Error during initializeApp:", error); // 초기화 중 오류 로그
  }
} else {
  app = getApp();
  devLog(">>>> Firebase Config: App already exists, getting app:", app.name); // 이미 초기화됨 로그
}

// 필요한 Firebase 서비스 객체 생성
const auth = getAuth(app);
// app이 null이 아닐 때만 Firestore와 Storage 초기화 (초기화 오류 방지)
const db = app ? getFirestore(app) : null; 
const storage = app ? getStorage(app) : null; 
// Vertex AI 초기화 시 app 인스턴스 전달 (기본 리전 설정 없이)
const vertexAI = app ? getVertexAI(app) : null; 

// const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null; // Analytics (클라이언트 전용)

// 필요한 서비스 export
// vertexAI 인스턴스를 추가로 export 합니다.
export { app, auth, db, storage, vertexAI /*, analytics */ };