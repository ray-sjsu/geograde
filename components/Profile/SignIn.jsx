"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "/app/firebase/config";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const handleGoogleSignIn = async () => {
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push(redirectPath);
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(redirectPath);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-orange-50 gap-16">
      {/* Form */}
      <div className="bg-white shadow-md rounded-box px-8 pt-6 pb-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold self-center mb-6">Log in</h1>
        <span className="self-center mb-4 block">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="link link-secondary">
            Register
          </a>
        </span>

        {/* Google Login Button */}
        <button
          className="btn btn-neutral flex items-center gap-2 w-full mb-4"
          onClick={handleGoogleSignIn}
        >
          <i className="fa-brands fa-google text-primary"></i>
          Log in with Google
        </button>

        <div className="divider">OR</div>

        <form onSubmit={handleEmailSignIn}>
          {/* Email Input */}
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="email"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>

          {/* Password Input */}
          <label className="form-control mb-4">
            <div className="label flex justify-between">
              <span className="label-text">Password</span>
            </div>
            <input
              type="password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button className="btn btn-primary w-full mt-4">Log in</button>
        </form>
      </div>

      {/* Image */}
      <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
        <img
          src="https://owlpin.wordpress.com/wp-content/uploads/2020/02/img_9575.jpg?w=823"
          alt="Study Spot"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignIn;
