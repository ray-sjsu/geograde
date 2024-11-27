"use client";

import React, { useEffect, useState } from "react";
import { firestore, auth } from "/app/firebase/config";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // Import the Lottie component

const fetchLocationDetails = async (locationId) => {
  try {
    const response = await fetch(`/api/locations/simplified/overview?locationId=${locationId}`);
    if (response.ok) {
      const data = await response.json();
      return data.name || "Unknown Location";
    }
    return "Unknown Location";
  } catch (error) {
    console.error("Error fetching location details:", error);
    return "Unknown Location";
  }
};

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user) {
        setLoading(false); // No user, no loading
        return;
      }

      setLoading(true); // Start loading
      try {
        const reviewsCollection = collection(firestore, "reviews");
        const userReviewsQuery = query(reviewsCollection, where("userID", "==", user.uid));
        const reviewsSnapshot = await getDocs(userReviewsQuery);

        const userReviews = await Promise.all(
          reviewsSnapshot.docs.map(async (doc) => {
            const review = { id: doc.id, ...doc.data() };
            const locationName = await fetchLocationDetails(review.locationId);
            return { ...review, locationName };
          })
        );

        setReviews(userReviews);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchUserReviews();
  }, [user]);

  const handleDeleteReview = async (reviewId) => {
    try {
      const reviewDocRef = doc(firestore, "reviews", reviewId);
      await deleteDoc(reviewDocRef);
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleEditReview = (reviewId) => {
    // Implement edit functionality
    console.log(`Editing review with ID: ${reviewId}`);
    // You can open a modal or redirect to an edit page
  };

  return (
    <div className="w-full max-w-4xl space-y-4 overflow-auto">
      <h1 className="text-3xl font-bold mb-4 text-base-content">Your Reviews</h1>

      {/* Loader while reviews are being fetched */}
      {loading ? (
        <div className="flex justify-center items-center">
          <DotLottieReact
            src="https://lottie.host/d7b40a97-71fd-440e-b8e0-27d70c412526/pyLG2GiGIs.lottie"
            loop
            autoplay
          />
        </div>
      ) : reviews.length > 0 ? (
        reviews.map(({ id, rating, noiseLevel, textContent, locationName, date }) => (
          <div key={id} className="card bg-neutral shadow-lg w-full">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <h2 className="card-title text-xl font-bold text-neutral-content">
                  {locationName || "Unknown Location"}
                </h2>
                <p className="text-yellow-500">{Array(rating).fill("⭐️").join(" ")}</p>
              </div>
              <p className="text-neutral-content mt-2">{textContent || "No review text provided."}</p>
              <p className="text-neutral-content mt-2">Noise Level: {noiseLevel}/5</p>
              <div className="text-sm text-neutral-content text-right">
                Posted on:{" "}
                {date
                  ? new Date(date.seconds * 1000).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </div>

              {/* Dropdown Menu */}
              <div className="dropdown dropdown-end mt-4">
                <div tabIndex={0} role="button" className="btn btn-sm m-1">
                  Options
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li>
                    <a onClick={() => handleEditReview(id)}>Edit Review</a>
                  </li>
                  <li>
                    <a onClick={() => handleDeleteReview(id)}>Delete Review</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-neutral-content">You haven&#39;t written any reviews yet.</p>
      )}
    </div>
  );
};

export default UserReviews;
