"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import Link from "next/link";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to the Landing Page
        </h1>
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
    </div>
  );
}
