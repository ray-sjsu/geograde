"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Navigate to the search page with preloaded parameters
  const navigateToSearch = (params) => {
    const queryString = new URLSearchParams(params).toString();
    router.push(`/search?${queryString}`);
  };

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome to the Landing Page
        </h1>
        <p className="text-gray-600 mb-6">
          Select one of the predefined categories below to find your perfect spot.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigateToSearch({ category: "library" })}
            className="btn btn-primary"
          >
            Library
          </button>
          <button
            onClick={() => navigateToSearch({ category: "coffee shop" })}
            className="btn btn-primary"
          >
            Coffee Shop
          </button>
          <button
            onClick={() => navigateToSearch({ category: "study room" })}
            className="btn btn-primary"
          >
            Study Room
          </button>
        </div>

        <button
          onClick={() => navigateToSearch({})}
          className="btn btn-accent mt-6"
        >
          Find your study spot!
        </button>
      </div>
    </div>
  );
}
