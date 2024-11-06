"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";
import Link from "next/link";

const SignInOutSection = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      <p className="text-gray-600 mb-4">
        {user ? "You are signed in" : "You are signed out"}
      </p>
      {user ? (
        <button
          onClick={() => signOut(auth)}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors duration-300"
        >
          Log Out
        </button>
      ) : (
        <Link
          href="sign-in"
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors duration-300"
        >
          Sign In
        </Link>
      )}
    </div>
  );
};

export default SignInOutSection;
