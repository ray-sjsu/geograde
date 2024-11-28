"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "/app/firebase/config";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PlaceDetails from "/components/search/PlaceDetails";
import Reviews from "@/components/reviews/PlaceReviews";

const LocationDetailsPage = ({ params }) => {
  const { locationId } = params; // Extract locationId from params
  const router = useRouter();

  const [locationData, setLocationData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchLocationDetailsFromFirestore = async () => {
      try {
        const docRef = doc(firestore, "locations", locationId); // Reference to the Firestore document
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          setLocationData({ id: locationId, ...docSnapshot.data() }); // Include locationId in the data
          setError(null);
        } else {
          setError("The specified location does not exist. Please try another location.");
        }
      } catch (error) {
        console.error("Error fetching location details from Firestore:", error);
        setError("Failed to load location details. Please try again.");
      } finally {
        setLoading(false); // Stop loading
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

  if (loading || !locationData) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/d7b40a97-71fd-440e-b8e0-27d70c412526/pyLG2GiGIs.lottie"
          loop
          autoplay
        />
      </div>
    );
  }

  const {
    name,
    opening_hours,
    address,
    website,
    price_level,
    photos,
    url,
    noiseLevel,
    environment,
    outletsAvailable,
    wifiAvailable,
    seating,
  } = locationData;

  return (
    <div className="min-h-screen bg-base-100 p-6">
      <PlaceDetails
        locationId={locationId}
        name={name}
        openingHours={opening_hours}
        address={address}
        website={website}
        priceLevel={price_level}
        noiseLevel={noiseLevel}
        environment={environment}
        outletsAvailable={outletsAvailable}
        wifiAvailable={wifiAvailable}
        seating={seating}
        photos={photos}
        url={url}
      />
      <div>
        <Reviews 
          locationId={locationId} // Ensure `location` is correctly populated
        />
      </div>
    </div>
  );
};

export default LocationDetailsPage;
