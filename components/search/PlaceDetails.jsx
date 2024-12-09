"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import FavoriteButton from "/components/Favorites/FavoriteButton";
import StarRatingDisplay from "../StarRatingDisplay";
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firestore } from "/app/firebase/config";
import UploadPhotoModal from "../image-kit/UploadImage";
import PlaceBadges from "../PlaceBadges";
import { v4 as uuidv4 } from "uuid";

const isOpenNow = (periods) => {
  if (!periods || periods.length === 0) return false;

  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = parseInt(
    now.toTimeString().slice(0, 2) + now.toTimeString().slice(3, 5)
  );

  for (const period of periods) {
    if (period.open.day === currentDay) {
      const openTime = parseInt(period.open.time);
      const closeTime = parseInt(period.close.time);

      if (openTime <= currentTime && (closeTime > currentTime || closeTime < openTime)) {
        return true;
      }
    }
  }
  return false;
};

const PlaceDetails = ({
  locationId,
  name,
  openingHours,
  address,
  website,
  priceLevel,
  url,
}) => {
  const openStatus = isOpenNow(openingHours?.periods);
  const [photos, setPhotos] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showToast, setShowToast] = useState(false); // Toast visibility state

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPhotos = useCallback(async () => {
    try {
      const photosCollection = collection(firestore, "locations", locationId, "photos");
      const photosSnapshot = await getDocs(photosCollection);
      const photosData = photosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPhotos(photosData);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  }, [locationId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const reviewsRef = collection(firestore, "reviews");
        const reviewsQuery = query(reviewsRef, where("locationId", "==", locationId));
        const reviewsSnapshot = await getDocs(reviewsQuery);

        const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const count = reviews.length;

        setAverageRating(count > 0 ? totalRating / count : 0);
        setReviewCount(count);
      } catch (error) {
        console.error("Error fetching average rating:", error);
      }
    };

    fetchAverageRating();
  }, [locationId]);

  const handleUploadSuccess = async (photoData) => {
    try {
      const photoId = uuidv4();

      const photoWithLocationId = {
        ...photoData,
        photoId,
        locationId,
      };

      const locationPhotosCollection = collection(
        firestore,
        "locations",
        locationId,
        "photos"
      );
      await setDoc(doc(locationPhotosCollection, photoId), photoWithLocationId);

      if (userId) {
        const userPhotosCollection = collection(
          firestore,
          "users",
          userId,
          "photos"
        );
        await setDoc(doc(userPhotosCollection, photoId), photoWithLocationId);
      }

      setPhotos((prev) => [...prev, photoWithLocationId]);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000); 
    } catch (error) {
      console.error("Error saving photo to Firestore:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-base-100 rounded-lg shadow-md text-base-content">
      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-center fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="alert alert-success">
            <span>Photo uploaded successfully!</span>
          </div>
        </div>
      )}

      {/* Left Section */}
      <div className="flex flex-col items-start space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">
          {name || "Unknown Location"}
        </h1>
        <StarRatingDisplay rating={averageRating} reviewCount={reviewCount} />
        {priceLevel && (
          <p className="ml-1 text-gray-800 font-semibold text-xl">
            {Array(priceLevel)
              .fill("$")
              .join("")}
          </p>
        )}
        <div className="flex flex-row">
          <PlaceBadges locationId={locationId} />
        </div>
        <p
          className={`ml-1 text-lg font-semibold ${openStatus ? "text-green-600" : "text-red-600"}`}
        >
          {openStatus ? "Open Now" : "Closed"}
        </p>
        <FavoriteButton locationId={locationId} locationName={name || "Unknown Location"} />
      </div>

      {/* Right Section */}
      <div className="space-y-2">
        <p className="text-gray-600">
          <strong>Address:</strong> {address || "No address available"}
        </p>
        {website && (
          <p className="text-gray-600">
            <strong>Website:</strong>{" "}
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {website || "Website Unavailable"}
            </a>
          </p>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="btn btn-success">Get Directions</button>
          </a>
        )}
      </div>

      {/* Photos Section */}
      <div className="lg:col-span-2">
        <div className="flex items-center mb-4">
          <p className="text-2xl text-base-content font-semibold ml-2">Photos</p>
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary btn-outline ml-4"
          >
            Add a Photo
          </button>
        </div>
        <div className="carousel carousel-center bg-neutral rounded-box space-x-4 p-4">
          {photos && photos.length > 0 ? (
            photos.map((photo, index) => (
              <div key={index} className="carousel-item">
                <Image
                  src={photo.url}
                  alt={`Photo of ${name}`}
                  height={200}
                  width={300}
                  className="rounded-md w-full"
                />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center bg-gray-200 h-28 w-full rounded-md">
              <p className="text-gray-500">No photos available. Be the first to upload!</p>
            </div>
          )}
        </div>
        <UploadPhotoModal
          locationId={locationId}
          userId={userId}
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>
    </div>
  );
};

export default PlaceDetails;
