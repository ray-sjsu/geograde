"use client";
import TrendingLocationCard from "@/components/homepage/TrendingLocationCard";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_CURRENCY,
  DEFAULT_PHOTO_OFFSET,
  DEFAULT_PHOTO_LIMIT,
} from "@/lib/tripadvisor-api/constants";
import { HOMEPAGE_STUDY_SPOTS } from "@/lib/constants"; // Import location IDs
import { useState, useEffect } from "react";

const locationDetailsAPI = async (locationId, params) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `/api/locations/simplified/overview?locationId=${locationId}&${queryString}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch location details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const HomePage = () => {
  const [locationData, setLocationData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllLocationDetails = async () => {
      setLoading(true);
      try {
        const details = await Promise.all(
          HOMEPAGE_STUDY_SPOTS.map(async (locationId) => {
            const data = await locationDetailsAPI(locationId, {
              language: DEFAULT_LANGUAGE,
              currency: DEFAULT_CURRENCY,
              limit: DEFAULT_PHOTO_LIMIT,
              offset: DEFAULT_PHOTO_OFFSET,
            });

            if (data && data.overview) {
              return data;
            } else {
              return null;
            }
          })
        );

        setLocationData(details.filter((detail) => detail !== null));
        setError(null);
      } catch (err) {
        setError("An error occurred while fetching location details.");
      }
      setLoading(false);
    };

    fetchAllLocationDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to the Landing Page
          </h1>

          {loading && (
            <p className="text-red-600">Currently loading please wait</p>
          )}
        </div>
      </div>
    );
  }

  if (error || !locationData) {
    return (
      <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to the Landing Page
          </h1>

          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome to the Landing Page
        </h1>

        {/* Display Trending Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {locationData.map((location) => (
            <TrendingLocationCard
              key={location.overview.location_id}
              location={location}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
