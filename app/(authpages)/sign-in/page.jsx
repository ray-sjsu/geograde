"use client";

import { useState } from "react";
import {
  useSignInWithEmailAndPassword,
  useAuthState,
} from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginWithGooglePopup } from "@/lib/auth/loginWithGooglePopup";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  if (user) {
    router.push("/"); // add profile page here later
  }

  const handleSignIn = async () => {
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log({ res });
      if (user) {
        setEmail("");
        setPassword("");
        router.push("/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 flex-col space-y-2">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button
          onClick={handleSignIn}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign In
        </button>
      </div>
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <button
          onClick={loginWithGooglePopup}
          className="flex items-center justify-center p-2 bg-white border border-gray-300 text-gray-700 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google Logo"
            className="w-6 h-6 mr-2"
          />
          Sign In with Google
        </button>
      </div>
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <Link href="/sign-up" className="p-2 bg-purple-400 text-xl rounded">
          Click here to create an account
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
