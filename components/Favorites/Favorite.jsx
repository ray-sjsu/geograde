"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import StarRatingDisplay from "../StarRatingDisplay";
import { collection, getDocs, query, where, doc, deleteDoc } from "firebase/firestore";
import { firestore, auth } from "/app/firebase/config";

const Favorite = ({ location, onRemove }) => {
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchAverageRating = async () => {
      const reviewsRef = collection(firestore, "reviews");
      const reviewsQuery = query(
        reviewsRef,
        where("locationId", "==", location.locationId)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);

      const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const count = reviews.length;

      setAverageRating(count > 0 ? totalRating / count : 0);
      setReviewCount(count);
    };

    fetchAverageRating();
  }, [location.locationId]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const photosRef = collection(firestore, `locations/${location.locationId}/photos`);
        const photosQuery = query(photosRef);
        const photosSnapshot = await getDocs(photosQuery);

        if (!photosSnapshot.empty) {
          const photoData = photosSnapshot.docs[0]?.data();
          setImage(photoData?.url || null);
        } else {
          setImage(null);
        }
      } catch (error) {
        console.error("Error fetching image from Firestore:", error);
      }
    };

    fetchImage();
  }, [location.locationId]);

  const handleRemoveFavorite = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        const favoriteDoc = doc(firestore, `users/${user.uid}/favorites/${location.locationId}`);
        await deleteDoc(favoriteDoc);
        if (onRemove) onRemove(location.locationId);
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    } else {
      alert("You need to be logged in to remove a favorite.");
    }
  };

  const locationDetailsLink = `/search/${location.locationId}`;

  return (
    <div className="p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 mb-6 border border-gray-200 hover:border-gray-300">
      <div className="flex items-center">
        {/* Image Section */}
        <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-200">
          {image ? (
            <Image
              src={image}
              alt={location.locationName}
              height={96}
              width={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="ml-6 flex-1">
          <Link href={locationDetailsLink}>
            <strong className="text-xl font-semibold text-gray-900 hover:underline">
              {location.locationName}
            </strong>
          </Link>
          <div className="mt-4">
            <StarRatingDisplay
              rating={averageRating || 0}
              reviewCount={reviewCount}
            />
          </div>
        </div>

        {/* Remove Button */}
        <div className="ml-4">
          <button
            onClick={handleRemoveFavorite}
            className="btn btn-error btn-sm"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorite;
