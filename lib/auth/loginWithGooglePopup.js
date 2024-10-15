import { googleProvider, auth } from "@/app/firebase/config";
import { signInWithPopup } from "firebase/auth";
import { prisma } from "@/lib/prisma";

export const loginWithGooglePopup = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Extract user details from Google sign-in
    const { email, displayName, uid } = user;

    // Check if the user already exists in the database
    let dbUser = await prisma.user.findUnique({
      where: { googleId: uid },
    });

    // If not, create a new user
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          googleId: uid,
          email: email,
          name: displayName,
        },
      });
    }

    // Now you can use dbUser for any further logic, like setting session data, etc.
    console.log("User authenticated and stored:", dbUser);
  } catch (error) {
    console.error("Error during Google sign-in:", error);
  }
};
