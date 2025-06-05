// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAi6PdAXWyPafkF_v9t53IDMSH6T3cpqZA",
  authDomain: "liyatree-bc82d.firebaseapp.com",
  projectId: "liyatree-bc82d",
  storageBucket: "liyatree-bc82d.firebasestorage.app",
  messagingSenderId: "612460831135",
  appId: "1:612460831135:web:cfea97808d2c31f67d1daa",
  measurementId: "G-2T0R1HZLVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics (only on client side)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app; 