"use client";
import React, { useState, useEffect } from "react";
import { firestore, auth } from "/app/firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import Review from "./PlaceReview";

export default function Reviews({ locationId, setAverageRating, setReviewCount }) {
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [open, setOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [noiseLevel, setNoiseLevel] = useState(3);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [additionalFeedback, setAdditionalFeedback] = useState({
    nearbyOutlets: false,
    lotsOfSeating: false,
    limitedSeating: false,
    noOutlets: false,
    freeWater: false,
    fastInternet: false,
    purchaseRequired: false,
  });

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

    try {
      const reviewsCollection = collection(firestore, "reviews");
      const q = query(reviewsCollection, where("locationId", "==", locationId));
      const reviewSnapshot = await getDocs(q);

      const reviewsList = reviewSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsList);

      if (user) {
        const userReview = reviewsList.find((review) => review.userID === user.uid);
        setUserReview(userReview || null);

        if (userReview) {
          setReviewText(userReview.textContent);
          setReviewRating(userReview.rating);
          setNoiseLevel(userReview.noiseLevel);
          setAdditionalFeedback(userReview.additionalFeedback || {});
        }
      }

      const totalRating = reviewsList.reduce((sum, review) => sum + review.rating, 0);
      const reviewCount = reviewsList.length;
      const average = reviewCount > 0 ? totalRating / reviewCount : 0;

      setAverageRating(average);
      setReviewCount(reviewCount);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const saveReview = async () => {
    if (!user || !locationId) {
      console.error("User or location ID is missing.");
      return;
    }

    try {
      const locationDocRef = doc(firestore, "locations", locationId);
      const locationDoc = await getDoc(locationDocRef);

      if (!locationDoc.exists()) {
        console.error("Location not found in Firestore!");
        return;
      }

      const locationData = locationDoc.data();
      const locationName = locationData?.name || "Unknown Location";

      const reviewData = {
        textContent: reviewText,
        rating: reviewRating,
        noiseLevel,
        locationId,
        locationName,
        userID: user.uid,
        userEmail,
        date: Timestamp.now(),
        additionalFeedback,
      };

      const reviewDocRef = userReview
        ? doc(firestore, "reviews", userReview.id)
        : doc(collection(firestore, "reviews"), `${user.uid}_${locationId}`);

      await setDoc(reviewDocRef, reviewData);

      console.log("Review saved successfully.");
      setOpen(false);
      fetchReviews();
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const handleFeedbackChange = (key) => {
    setAdditionalFeedback((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    fetchReviews();
  }, [locationId, user]);

  return (
    <div className="w-full max-w-4xl space-y-4 overflow-auto mt-5">
      <h1 className="text-3xl font-bold mb-4 text-base-content">Reviews</h1>

      {user && userReview ? (
        <div className="flex justify-between">
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            Edit Your Review
          </button>
          <button
            className="btn btn-error"
            onClick={async () => {
              const reviewDocRef = doc(firestore, "reviews", userReview.id);
              await deleteDoc(reviewDocRef);
              fetchReviews();
            }}
          >
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

            <label className="label">Review:</label>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Type your review here..."
            ></textarea>

            <div className="mt-4">
              <h4 className="font-bold">Additional Feedback</h4>
              {Object.keys(additionalFeedback).map((key) => (
                <label key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={additionalFeedback[key]}
                    onChange={() => handleFeedbackChange(key)}
                  />
                  <span>{key.replace(/([A-Z])/g, " $1")}</span>
                </label>
              ))}
            </div>

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

      {reviews.length > 0 ? (
        reviews.map((review) => <Review key={review.id} {...review} />)
      ) : (
        <p className="text-gray-500 text-center">No Reviews. Be the first to write one! </p>
      )}
    </div>
  );
}
