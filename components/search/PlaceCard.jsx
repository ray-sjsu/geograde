"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import StarRatingDisplay from "../StarRatingDisplay";

const PlaceCard = ({ id, name, address, imageUrl, price }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Fetch average rating and review count
  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const reviewsRef = collection(firestore, "reviews");
        const reviewsQuery = query(reviewsRef, where("locationId", "==", id));
        const reviewsSnapshot = await getDocs(reviewsQuery);

        const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const count = reviews.length;

        setAverageRating(count > 0 ? totalRating / count : 0);
        setReviewCount(count);
      } catch (error) {
        console.error("Error fetching reviews for PlaceCard:", error);
      }
    };

    fetchAverageRating();
  }, [id]);

  return (
    <div className="card card-side bg-base-100 shadow-xl rounded-xl">
      {/* Image Section */}
      <figure>
        <img
          src={
            imageUrl ||
            "https://fastly.picsum.photos/id/42/3456/2304.jpg?hmac=dhQvd1Qp19zg26MEwYMnfz34eLnGv8meGk_lFNAJR3g" // Placeholder if no image
          }
          alt={name}
          className="w-60 h-60 object-cover"
        />
      </figure>

      {/* Content Section */}
      <div className="card-body text-base-content">
        <h2 className="card-title">{name}</h2>
        <p>{address || "No address available"}</p>
        <p>
            {price && (
            <p className=" ml-1 text-gray-800 text-sm">
                {Array(price)
                .fill("$")
                .join("")}
            </p>
            )}
        </p>
        <div>
          <StarRatingDisplay rating={averageRating} reviewCount={reviewCount} />
        </div>

        <div className="card-actions justify-end">
          <a
            href={`/search/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
