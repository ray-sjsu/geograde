"use client";

import { useState, useEffect } from "react";
import { firestore, auth } from "/app/firebase/config";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

export default function LocationPage() {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5); // Default rating is set to 5
  const [user, setUser] = useState(null); // Track logged-in user
  const [userEmail, setUserEmail] = useState(null); // Track user email

  // Check user authentication state and get email
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUserEmail(currentUser.email); // Set the user's email
      } else {
        setUser(null);
        setUserEmail(null);
      }
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Fetch reviews from Firestore
  const fetchReviews = async () => {
    const reviewsCollection = collection(firestore, "reviews");
    const reviewSnapshot = await getDocs(reviewsCollection);
    const reviewsList = reviewSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReviews(reviewsList);
  };

  const addReview = async () => {
    if (!user) return; // Prevent posting review if no user is logged in

    const newReview = {
      textContent: reviewText,
      rating: reviewRating,
      userID: user.uid, // Store the UID of the logged-in user
      userEmail: userEmail, // Store the email of the logged-in user
      date: Timestamp.now(), // Add timestamp
    };

    const newDocRef = doc(collection(firestore, "reviews"), `${Date.now()}`);
    await setDoc(newDocRef, newReview);
    setReviewText("");
    setReviewRating(5); // Reset rating after submission
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

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-base-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Reviews for This Location
      </h1>

      {/* Only allow writing a review if the user is logged in */}
      {user ? (
        <button className="btn btn-primary mb-4" onClick={() => setOpen(true)}>
          Write a Review
        </button>
      ) : (
        <p className="text-red-500 mb-4">
          Please sign in to write a review.
        </p>
      )}

      {/* Review Modal */}
      {open && (
        <dialog id="review_modal" className="modal modal-open">
          <form method="dialog" className="modal-box">
            <h3 className="font-bold text-lg">Write a review</h3>

            {/* Rating Component */}
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

            {/* Review Text Area */}
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
              <button type="button" className="btn btn-primary" onClick={addReview}>
                Post Review
              </button>
            </div>
          </form>
        </dialog>
      )}

      {/* Reviews List */}
      <div className="w-full max-w-4xl space-y-4 overflow-auto">
        {reviews.map(({ id, rating, textContent, userID, userEmail, date }) => (
          <div key={id} className="card bg-neutral shadow-lg w-full">
            <div className="card-body">
              {/* Review Header */}
              <div className="flex justify-between items-center">
                <h2 className="card-title text-xl font-bold">
                  User: {userEmail || "Anonymous"}
                </h2>
                <p className="text-yellow-500">
                  {Array(rating).fill("⭐️").join(" ")}
                </p>
              </div>

              {/* Review Content */}
              <p className="text-neutral-content mt-2">{textContent}</p>

              {/* Timestamp */}
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

              {/* Review Actions */}
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
    </div>
  );
}
