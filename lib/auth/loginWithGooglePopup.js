import { auth } from "/app/firebase/config";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";

const firestore = getFirestore();

export const loginWithGooglePopup = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Extract user details
    const { displayName, email, photoURL, uid } = user;

    // Save to Firestore
    const userRef = doc(firestore, "users", uid);
    await setDoc(
      userRef,
      {
        name: displayName,
        email: email,
        imageUrl: photoURL,
        createdAt: new Date().toISOString(),
        lastSignIn: new Date().toISOString(),
      },
      { merge: true }
    );

    console.log("User logged in and stored in Firestore");
  } catch (error) {
    console.error("Error during Google sign-in: ", error);
    throw error; // Re-throw the error to handle it in the UI
  }
};
