"use client";

import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import ProfilePageClient from "/components/Profile/ProfilePage";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ProfilePage = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>      
        <DotLottieReact
          src="https://lottie.host/d7b40a97-71fd-440e-b8e0-27d70c412526/pyLG2GiGIs.lottie"
          loop
          autoplay
        />
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>You need to be signed in to view this page.</p>
      </div>
    );
  }

  // Pass the user to the ProfilePageClient
  return <ProfilePageClient user={user} />;
};

export default ProfilePage;
