// LocationPage.jsx
"use client";

import { useState, useEffect } from "react";
import { auth } from "/app/firebase/config";
import Reviews from "/components/Reviews";
import { StarRatingDisplay } from "/components/Reviews";

export default function LocationPage() {
  const [user, setUser] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-base-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">Location Details</h1>
      <StarRatingDisplay rating={averageRating} reviewCount={reviewCount} />
      
      <Reviews user={user} setAverageRating={setAverageRating} setReviewCount={setReviewCount} />
    </div>
  );
}
