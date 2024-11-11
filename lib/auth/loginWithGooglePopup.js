import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '/app/firebase/config'; // Adjust the path to your firebase.js

export const loginWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // The signed-in user info.
    const user = result.user;
    console.log("Google User:", user);
    // Handle user data or redirect, etc.
  } catch (error) {
    console.error("Error during Google Sign-in:", error);
  }
};