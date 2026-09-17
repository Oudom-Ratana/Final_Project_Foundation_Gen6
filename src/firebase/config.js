import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgWeKJeWESjGNGnudP6zYv_3YhbRoZAW4",
  authDomain: "filmzone-cinema.firebaseapp.com",
  projectId: "filmzone-cinema",
  storageBucket: "filmzone-cinema.firebasestorage.app",
  messagingSenderId: "37735659607",
  appId: "1:37735659607:web:7c21e8bf374ee0ec5ccb12",
  measurementId: "G-W0K21WQS2B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
