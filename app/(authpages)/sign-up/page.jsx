"use client";

import React, { useState } from "react";
import { auth } from "/app/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { firestore } from "/app/firebase/config";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Save user to Firestore
  const saveUserToFirestore = async (user) => {
    const userRef = doc(firestore, "users", user.uid);
    const userData = {
      email: user.email,
      name: name || user.displayName || "Anonymous User",
      imageUrl: user.photoURL || "https://avatar.iran.liara.run/public/12",
      createdAt: Timestamp.now().toDate().toISOString(),
      lastSignIn: user.metadata.lastSignInTime,
    };

    try {
      await setDoc(userRef, userData);
      console.log("User saved to Firestore successfully!");
    } catch (err) {
      console.error("Error saving user to Firestore:", err);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save the user to Firestore
      await saveUserToFirestore(user);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setSuccess(false);
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Save the user to Firestore
      await saveUserToFirestore(user);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm mb-4">
            Account created successfully!
          </p>
        )}
        <form onSubmit={handleEmailSignUp}>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input with "Show Password" */}
          <div className="mb-6 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 px-3 py-2 text-sm text-blue-500 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
          >
            Sign Up with Email
          </button>
        </form>
        <div className="my-4 text-center text-gray-500">OR</div>
        <button
          onClick={handleGoogleSignUp}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring"
        >
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
