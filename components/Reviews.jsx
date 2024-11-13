// Reviews.jsx
"use client";
import React, { useState, useEffect } from "react";
import { firestore, auth } from "/app/firebase/config";
import { collection, getDocs, setDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";

export default function Reviews({ setAverageRating, setReviewCount }) {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [noiseLevel, setNoiseLevel] = useState(3);


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
    const reviewsCollection = collection(firestore, "reviews");
    const reviewSnapshot = await getDocs(reviewsCollection);
    const reviewsList = reviewSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReviews(reviewsList);

    // Calculate average rating and count
    const totalRating = reviewsList.reduce((sum, review) => sum + review.rating, 0);
    const reviewCount = reviewsList.length;
    const average = reviewCount > 0 ? totalRating / reviewCount : 0;

    // Pass data up to LocationPage
    setAverageRating(average);
    setReviewCount(reviewCount);
  };

  const addReview = async () => {
    if (!user) return;

    const newReview = {
      textContent: reviewText,
      rating: reviewRating,
      noiseLevel: noiseLevel, // Include noise level in review
      userID: user.uid,
      userEmail: userEmail,
      date: Timestamp.now(),
    };

    const newDocRef = doc(collection(firestore, "reviews"), `${Date.now()}`);
    await setDoc(newDocRef, newReview);
    setReviewText("");
    setReviewRating(5);
    setNoiseLevel(3); // Reset noise level after submission
    setOpen(false);
    fetchReviews();
  };

  const removeReview = async (id) => {
    const docRef = doc(collection(firestore, "reviews"), id);
    await deleteDoc(docRef);
    fetchReviews();
  };

  const handleRatingChange = (rating) => {
    setReviewRating(rating);
  };
  const handleNoiseLevelChange = (event) => {
    setNoiseLevel(event.target.value);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

   return (
    <div className="w-full max-w-4xl space-y-4 overflow-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Reviews for This Location</h1>
      {user ? (
        <button className="btn btn-primary mb-4" onClick={() => setOpen(true)}>
          Write a Review
        </button>
      ) : (
        <p className="text-red-500 mb-4">Please sign in to write a review.</p>
      )}

      {open && (
        <dialog id="review_modal" className="modal modal-open">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Write a review</h3>

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

            <label className="label">Review:</label>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Type your review here..."
            ></textarea>

            <div className="modal-action">
              <button className="btn" onClick={() => setOpen(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={addReview}>
                Post Review
              </button>
            </div>
          </form>
        </dialog>
      )}

      {reviews.map(({ id, rating, noiseLevel, textContent, userID, userEmail, date }) => (
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
            {user && user.uid === userID && (
              <div className="card-actions justify-end">
                <button
                  className="btn btn-outline btn-error"
                  onClick={() => removeReview(id)}
                >
                  Delete Review
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StarRatingDisplay({ rating, reviewCount }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center space-x-1">
      <div className="rating rating-lg rating-half">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <React.Fragment key={`${index}-full`}>
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-1 bg-yellow-500"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-2 bg-yellow-500"
                  checked
                  readOnly
                />
              </React.Fragment>
            );
          } else if (index === fullStars && hasHalfStar) {
            return (
              <React.Fragment key={`${index}-half`}>
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-1 bg-yellow-500"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-2 bg-yellow-500"
                  readOnly
                />
              </React.Fragment>
            );
          } else {
            return (
              <React.Fragment key={`${index}-empty`}>
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-1"
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-2"
                  readOnly
                />
              </React.Fragment>
            );
          }
        })}
      </div>
      <span className="text-lg font-semibold">{rating.toFixed(1)} ({reviewCount} reviews)</span>
    </div>
  );
}
