"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  if (!user) {
    router.push("/sign-in");
  }

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to the Landing Page
        </h1>
        <p className="text-gray-600 mb-4">You are signed in</p>
        <button
          onClick={() => signOut(auth)}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors duration-300"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
