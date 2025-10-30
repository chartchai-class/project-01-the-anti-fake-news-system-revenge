// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYDpN4qVb9PL-nP3hHzLWeSvU8RhORTjM",
  authDomain: "se331project.firebaseapp.com",
  projectId: "se331project",
  storageBucket: "se331project.firebasestorage.app",
  messagingSenderId: "1063821145347",
  appId: "1:1063821145347:web:5ec4e3ad5cd83366f2a536",
  measurementId: "G-34629W63FC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (仅在浏览器环境中)
let analytics: Analytics | undefined;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
