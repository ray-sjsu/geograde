"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  // Navigate to the search page with preloaded parameters
  const navigateToSearch = (params) => {
    const queryString = new URLSearchParams(params).toString();
    router.push(`/search?${queryString}`);
  };

  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center p-6 bg-white rounded-lg shadow-lg">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">
            Geograde
          </h1>
          <p className="text-gray-800 text-lg font-semibold">
            Find your place to become an academic weapon
          </p>
          <button
            onClick={() => navigateToSearch({})}
            className="btn btn-secondary mt-6"
          >
            Find your study spot!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
