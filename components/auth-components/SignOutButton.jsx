"use client";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { URL_SIGN_IN } from "@/lib/CONSTANTS";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
      router.push(URL_SIGN_IN); // Redirect to sign-in page (this is optional)
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg transition-all duration-300 ease-in-out"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
