import { googleProvider, auth } from "/app/firebase/config";
import { signInWithPopup } from "firebase/auth";

export const loginWithGooglePopup = async () => {
  try {
    // Perform Google sign-in using Firebase
    const result = await signInWithPopup(auth, googleProvider);
    const googleUser = result.user;

    // Extract user details from Google sign-in
    const {
      uid: googleId,
      email,
      displayName: name,
      photoURL: imageUrl,
    } = googleUser;

    console.log("Google user:", { googleId, email, name, imageUrl }); // Log Google user data

    // Make POST request to your API route to store user in Prisma DB
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        googleId,
        email,
        name,
        imageUrl,
        lastSignIn: new Date(), // Pass the current time as last sign-in
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("User created/updated in DB:", data.user);
    } else {
      console.error("Failed to create or update user:", await response.text());
    }
  } catch (error) {
    // Handle different types of errors more specifically if needed
    if (error.code === "auth/popup-closed-by-user") {
      console.error("Google sign-in popup was closed before completion.");
    } else {
      console.error("Error during Google sign-in:", error);
    }
  }
};
