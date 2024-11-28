"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "/app/firebase/config";
import Image from "next/image";
import Reviews from "/components/Reviews";
import FavoriteButton from "/components/Favorites/FavoriteButton";
import StarRatingDisplay from "/components/StarRatingDisplay";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const LocationDetailsPage = ({ params }) => {
  const { locationId } = params; // Extract locationId from params
  const router = useRouter();

  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);

  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchLocationDetailsFromFirestore = async () => {
      try {
        const docRef = doc(firestore, "locations", locationId); // Reference to the Firestore document
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          setLocationData(docSnapshot.data()); // Retrieve data from Firestore
          setError(null);
        } else {
          setError("The specified location does not exist. Please try another location.");
        }
      } catch (error) {
        console.error("Error fetching location details from Firestore:", error);
        setError("Failed to load location details. Please try again.");
      }
    };

    fetchLocationDetailsFromFirestore();
  }, [locationId]);

  const handleGoBack = () => {
    router.push("/search");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleGoBack}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Go to Search Page
          </button>
        </div>
      </div>
    );
  }

  if (!locationData) {
    return <div className="min-h-screen bg-base-100 items-center">        
      <DotLottieReact
        src="https://lottie.host/d7b40a97-71fd-440e-b8e0-27d70c412526/pyLG2GiGIs.lottie"
        loop
        autoplay
      />
    </div>;
  }

  const {
    name,
    address,
    formatted_phone_number,
    website,
    opening_hours,
    price_level,
    photo_reference,
  } = locationData;

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <div>
        {/* Location Header */}
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-4">
          {name || "Unknown Location"}
          <FavoriteButton locationId={locationId} locationName={name || "Unknown Location"} />
        </h1>

        {/* Rating and Reviews */}
        <div className="flex items-center mb-4">
          <StarRatingDisplay rating={averageRating} reviewCount={reviewCount} />
        </div>

        {/* Address and Contact Info */}
        <div className="mb-6">
          <p className="text-gray-600">
            <strong>Address:</strong> {address || "No address available"}
          </p>
          {formatted_phone_number && (
            <p className="text-gray-600">
              <strong>Phone:</strong> {formatted_phone_number}
            </p>
          )}
          {website && (
            <p className="text-gray-600">
              <strong>Website:</strong>{" "}
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {website}
              </a>
            </p>
          )}
          {price_level && (
            <p className="text-gray-600">
              <strong>Price Level:</strong> {"$".repeat(price_level)}
            </p>
          )}
        </div>

        {/* Features (Opening Hours) */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Opening Hours</h2>
          {opening_hours?.periods ? (
            <ul className="list-disc list-inside text-gray-600">
              {opening_hours.periods.map((period, index) => (
                <li key={index}>{`${period.open_day}: ${period.open_time} - ${period.close_time}`}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No opening hours available</p>
          )}
        </div>

        {/* Photos */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Photos</h2>
          <div className="carousel carousel-center bg-neutral rounded-box space-x-4 p-4">
            {photo_reference ? (
              <Image
                src={`/assets/andrew-neel-cckf4TsHAuw-unsplash.jpg`}
                alt={name}
                height={200}
                width={200}
              />
            ) : (
              <p className="text-gray-600">No photos available</p>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8">
          <Reviews
            locationId={locationId}
            setAverageRating={setAverageRating}
            setReviewCount={setReviewCount}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationDetailsPage;
