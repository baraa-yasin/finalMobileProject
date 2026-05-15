import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCT1FY_ap6UoBXVZBZwgwHU_CEPenCT7oc",
  authDomain: "mobileproject-b056a.firebaseapp.com",
  projectId: "mobileproject-b056a",
  storageBucket: "mobileproject-b056a.firebasestorage.app",
  messagingSenderId: "216375085487",
  appId: "1:216375085487:web:de3b2f38a10f313684c75a",
  measurementId: "G-WHTRN9J0HW"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);

// تهيئة الـ Auth مع خاصية حفظ الجلسة في الهاتف (Persistence)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// تهيئة قاعدة البيانات Firestore
export const db = getFirestore(app);

export default app;