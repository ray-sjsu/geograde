"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "/app/firebase/config";
import { useRouter } from "next/navigation";
import { loginWithGooglePopup } from "/lib/auth/loginWithGooglePopup";
import Image from "next/image";
import { useEffect } from "react";
import { URL_PROFILE } from "/lib/CONSTANTS";

const SignIn = () => {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      console.log("Redirecting to profile page...");
      router.push(URL_PROFILE);
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl flex flex-col items-center space-y-6">
        <h1 className="text-2xl font-bold text-white">Sign In / Sign Up</h1>
        <button
          onClick={loginWithGooglePopup}
          className="flex items-center justify-center px-4 py-2 bg-white text-gray-700 text-lg font-medium rounded-lg shadow-md border border-gray-300 hover:shadow-lg transition-shadow"
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google Logo"
            width={100}
            height={100}
            className="mr-2"
          />
          Sign in with Google
        </button>
        {loading && <p className="text-gray-400">Loading...</p>}
        {error && (
          <p className="text-red-500 text-sm">
            An error occurred: {error.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SignIn;
