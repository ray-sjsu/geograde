"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "/app/firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { firestore } from "/app/firebase/config";
import Image from "next/image";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignUp = async () => {
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Save the user to Firestore
      await saveUserToFirestore(user);
      router.push("/"); // Redirect to homepage
    } catch (err) {
      setError("Google sign-up failed. Please try again.");
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save the user to Firestore
      await saveUserToFirestore(user);
      router.push("/"); // Redirect to homepage
    } catch (err) {
      setError(err.message);
    }
  };

  const saveUserToFirestore = async (user) => {
    const userRef = doc(firestore, "users", user.uid);
    const userData = {
      email: user.email,
      name: user.displayName || "Anonymous User",
      imageUrl: user.photoURL || "https://avatar.iran.liara.run/public/12",
      createdAt: Timestamp.now().toDate().toISOString(),
    };

    try {
      await setDoc(userRef, userData);
    } catch (err) {
      console.error("Error saving user to Firestore:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-orange-50 gap-16">
      {/* Form */}
      <div className="bg-white shadow-md rounded-box px-8 pt-6 pb-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold self-center mb-6">Create an account</h1>
        <span className="self-center mb-4 block">
          Already have an account?{" "}
          <a href="/sign-in" className="link link-secondary">
            Log in
          </a>
        </span>

        {/* Google Sign Up Button */}
        <button className="btn btn-neutral flex items-center gap-2 w-full mb-4" onClick={handleGoogleSignUp}>
          <i className="fa-brands fa-google text-primary"></i>
          Sign up with Google
        </button>

        <div className="divider">OR</div>

        <form onSubmit={handleEmailSignUp}>
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
              style={{ color: "black" }}
            />
          </label>

          {/* Password Input */}
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Password (should be 6+ characters)</span>
            </div>
            <input
              type="password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ color: "black" }}
            />
          </label>

          {/* Confirm Password Input */}
          <label className="form-control mb-4">
            <div className="label">
              <span className="label-text">Confirm password</span>
            </div>
            <input
              type="password"
              className="input input-bordered"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              style={{ color: "black" }}
            />
          </label>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button className="btn btn-primary w-full mt-4">Create</button>
        </form>
      </div>

      {/* Image */}
      <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
        <Image
          src="https://owlpin.wordpress.com/wp-content/uploads/2020/02/img_9575.jpg?w=823"
          alt="Study Spot"
          className="w-full h-full object-cover"
          height={500}
          width={500}
        />
      </div>
    </div>
  );
};

export default SignUp;
