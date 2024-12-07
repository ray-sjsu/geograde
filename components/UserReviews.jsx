"use client";

import React, { useEffect, useState } from "react";
import { firestore, auth } from "@/app/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [noiseLevel, setNoiseLevel] = useState(3);
  const router = useRouter(); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user's reviews
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const reviewsCollection = collection(firestore, "reviews");
        const userReviewsQuery = query(reviewsCollection, where("userID", "==", user.uid));
        const reviewsSnapshot = await getDocs(userReviewsQuery);

        const userReviews = reviewsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setReviews(userReviews);
      } catch (error) {
        console.error("Error fetching user reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [user]);

  const saveReview = async () => {
    if (!user || !reviewToEdit) return;

    try {
      const reviewData = {
        ...reviewToEdit,
        textContent: reviewText,
        rating: reviewRating,
        noiseLevel,
        date: Timestamp.now(),
      };

      const reviewDocRef = doc(firestore, "reviews", reviewToEdit.id);
      await setDoc(reviewDocRef, reviewData);

      setReviews((prev) =>
        prev.map((review) => (review.id === reviewToEdit.id ? reviewData : review))
      );
      setOpen(false);
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      const reviewDocRef = doc(firestore, "reviews", reviewId);
      await deleteDoc(reviewDocRef);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const openEditModal = (review) => {
    setReviewToEdit(review);
    setReviewText(review.textContent || "");
    setReviewRating(review.rating || 5);
    setNoiseLevel(review.noiseLevel || 3);
    setOpen(true);
  };

  const navigateToLocation = (locationId) => {
    router.push(`/search/${locationId}`);
  };

  return (
    <div className="w-full max-w-4xl space-y-4 overflow-auto">
      <h1 className="text-3xl font-bold mb-4 text-base-content">Your Reviews</h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <DotLottieReact
            src="https://lottie.host/d7b40a97-71fd-440e-b8e0-27d70c412526/pyLG2GiGIs.lottie"
            loop
            autoplay
          />
        </div>
      ) : reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="card bg-neutral w-full">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <button
                  className="card-title text-xl text-neutral-content font-bold hover:underline"
                  onClick={() => navigateToLocation(review.locationId)}
                >
                  {review.locationName || "Unknown Location"}
                </button>
                <p className="text-yellow-500 ml-2">
                  {Array(review.rating).fill("⭐️").join(" ")}
                </p>
              </div>
              <p className="text-neutral-content mt-2">{review.textContent}</p>
              <p className="text-neutral-content mt-2">Noise Level: {review.noiseLevel}/5</p>
              <div className="text-sm text-neutral-content text-right">
                Posted on:{" "}
                {review.date
                  ? new Date(review.date.seconds * 1000).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </div>
              <div className="mt-4 flex space-x-4">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => openEditModal(review)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => deleteReview(review.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>
          <p className="text-neutral-content">You haven&#39;t written any reviews yet.</p>
        </div>
      )}

      {open && reviewToEdit && (
        <dialog id="review_modal" className="modal modal-open">
          <form method="dialog" className="modal-box text-base-content">
            <h3 className="font-bold text-lg">Edit Your Review</h3>

            {/* Star Rating */}
            <div className="rating mb-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <input
                  key={value}
                  type="radio"
                  name="rating"
                  value={value}
                  className="mask mask-star-2 bg-orange-400"
                  checked={reviewRating === value}
                  onChange={() => setReviewRating(value)}
                />
              ))}
            </div>

            {/* Noise Level Selection */}
            <label className="label">Noise Level: {noiseLevel}/5</label>
            <input
              type="range"
              min="1"
              max="5"
              value={noiseLevel}
              className="range"
              step="1"
              onChange={(e) => setNoiseLevel(Number(e.target.value))}
            />

            {/* Review Text */}
            <label className="label">Review:</label>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>

            <div className="modal-action">
              <button className="btn" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveReview}
              >
                Save Changes
              </button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default UserReviews;
