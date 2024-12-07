"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";
import StarRatingDisplay from "../StarRatingDisplay";

const PlaceCard = ({ id, name, address, price }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

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

  // Fetch thumbnail image from Firestore
  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const photosRef = collection(firestore, "locations", id, "photos");
        const photosQuery = query(photosRef, limit(1)); // Limit to the first photo
        const photosSnapshot = await getDocs(photosQuery);

        if (!photosSnapshot.empty) {
          const photoData = photosSnapshot.docs[0].data();
          setThumbnailUrl(photoData.url); // Use the `url` field from the photo document
        }
      } catch (error) {
        console.error("Error fetching thumbnail for PlaceCard:", error);
      }
    };

    fetchThumbnail();
  }, [id]);

  return (
    <div className="card card-side bg-base-100 shadow-xl rounded-xl">
      {/* Image Section */}
      <figure>
        <img
          src={
            thumbnailUrl ||
            "https://fakeimg.pl/500x500?text=No+Images" // Placeholder if no image
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
            <p className="ml-1 text-gray-800 text-sm">
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
