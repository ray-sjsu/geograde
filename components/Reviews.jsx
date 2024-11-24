"use client";
import React, { useState, useEffect } from "react";
import { firestore, auth } from "/app/firebase/config";
import { collection, query, where, getDocs, setDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";

export default function Reviews({ locationId, setAverageRating, setReviewCount }) {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null); // The user's review for this location
  const [open, setOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [noiseLevel, setNoiseLevel] = useState(3); // Noise level rating
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserEmail(currentUser.email);
      } else {
        setUser(null);
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchReviews = async () => {
    if (!locationId) return;

    // Query reviews for the specific locationId
    const reviewsCollection = collection(firestore, "reviews");
    const q = query(reviewsCollection, where("locationId", "==", locationId));
    const reviewSnapshot = await getDocs(q);
    const reviewsList = reviewSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReviews(reviewsList);

    // Check if the current user has a review for this location
    if (user) {
      const userReview = reviewsList.find((review) => review.userID === user.uid);
      setUserReview(userReview || null);
      if (userReview) {
        setReviewText(userReview.textContent);
        setReviewRating(userReview.rating);
        setNoiseLevel(userReview.noiseLevel);
      }
    }

    // Calculate average rating and count
    const totalRating = reviewsList.reduce((sum, review) => sum + review.rating, 0);
    const reviewCount = reviewsList.length;
    const average = reviewCount > 0 ? totalRating / reviewCount : 0;

    // Pass data up to LocationPage
    setAverageRating(average);
    setReviewCount(reviewCount);
  };

  const saveReview = async () => {
    if (!user || !locationId) return;

    const reviewData = {
      textContent: reviewText,
      rating: reviewRating,
      noiseLevel, // Include noise level in review
      locationId, // Attach the locationId to the review
      userID: user.uid,
      userEmail: userEmail,
      date: Timestamp.now(),
    };

    const reviewDocRef = userReview
      ? doc(firestore, "reviews", userReview.id) // Update existing review
      : doc(collection(firestore, "reviews"), `${user.uid}_${locationId}`); // New review ID pattern

    await setDoc(reviewDocRef, reviewData);
    setOpen(false);
    fetchReviews(); // Refresh reviews for the current location
  };

  const removeReview = async () => {
    if (!user || !userReview) return;

    const reviewDocRef = doc(firestore, "reviews", userReview.id);
    await deleteDoc(reviewDocRef);
    setUserReview(null); // Clear user's review state
    fetchReviews(); // Refresh reviews for the current location
  };

  const handleRatingChange = (rating) => {
    setReviewRating(rating);
  };

  const handleNoiseLevelChange = (event) => {
    setNoiseLevel(event.target.value); // Update noise level state
  };

  useEffect(() => {
    fetchReviews();
  }, [locationId, user]);

  return (
    <div className="w-full max-w-4xl space-y-4 overflow-auto">
      <h1 className="text-3xl font-bold mb-4 text-base-content">Reviews</h1>

      {user && userReview ? (
        <div className="flex justify-between">
          <button
            className="btn btn-primary"
            onClick={() => {
              setOpen(true); // Open the modal to edit the review
            }}
          >
            Edit Your Review
          </button>
          <button className="btn btn-error" onClick={removeReview}>
            Delete Your Review
          </button>
        </div>
      ) : (
        user && (
          <button className="btn btn-primary mb-4" onClick={() => setOpen(true)}>
            Write a Review
          </button>
        )
      )}

      {open && (
        <dialog id="review_modal" className="modal modal-open">
          <form method="dialog" className="modal-box text-base-content">
            <h3 className="font-bold text-lg">{userReview ? "Edit Your Review" : "Write a Review"}</h3>

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
                  onChange={() => handleRatingChange(value)}
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
              onChange={handleNoiseLevelChange}
            />
            <div className="flex w-full justify-between px-2 text-xs">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>

            {/* Review Text */}
            <label className="label">Review:</label>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Type your review here..."
            ></textarea>
            <div className="modal-action">
              <button className="btn" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={saveReview}>
                {userReview ? "Update Review" : "Post Review"}
              </button>
            </div>
          </form>
        </dialog>
      )}

      {reviews.map(({ id, rating, noiseLevel, textContent, userEmail, date }) => (
        <div key={id} className="card bg-neutral shadow-lg w-full">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h2 className="card-title text-xl font-bold">
                User: {userEmail || "Anonymous"}
              </h2>
              <p className="text-yellow-500">
                {Array(rating).fill("⭐️").join(" ")}
              </p>
            </div>
            <p className="text-neutral-content mt-2">{textContent}</p>
            <p className="text-neutral-content mt-2">Noise Level: {noiseLevel}/5</p>
            <div className="text-sm text-gray-500 text-right">
              Posted on:{" "}
              {date
                ? new Date(date.seconds * 1000).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
