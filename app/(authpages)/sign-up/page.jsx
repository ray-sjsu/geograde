"use client";
import { useState } from "react";
import {
  useCreateUserWithEmailAndPassword,
  useAuthState,
} from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  if (user) {
    router.push("/"); // add profile page here later
  }

  const handleSignUp = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      setEmail("");
      setPassword("");
      router.push("/sign-in");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 flex-col space-y-2">
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-white text-2xl mb-5">Sign Up</h1>
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
          onClick={handleSignUp}
          className="w-full p-3 bg-indigo-600 rounded text-white hover:bg-indigo-500"
        >
          Sign Up
        </button>
      </div>
      <div className="bg-gray-800 p-10 rounded-lg shadow-xl w-96">
        <Link href="/sign-in" className="p-2 bg-purple-400 text-xl rounded">
          Click here if you have an account
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
