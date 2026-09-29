// src/services/firebaseAuth.js
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);