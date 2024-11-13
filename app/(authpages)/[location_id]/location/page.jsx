"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StarRatingDisplay from "/components/Reviews"; // Assuming you have this component

export default function LocationPage({ params }) {
  const { location_id } = params;
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch the location details from the custom API endpoint
    async function fetchLocationDetails() {
      try {
        const response = await fetch(`/api/detailed/overview?locationId=${location_id}`);
        const data = await response.json();

        if (data.error) {
          console.error("Error:", data.error);
          return;
        }

        setLocationData(data);
      } catch (error) {
        console.error("Failed to fetch location details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLocationDetails();
  }, [location_id]);

  if (loading) return <p>Loading...</p>;
  if (!locationData) return <p>Location not found</p>;

  const {
    name,
    distance,
    address_obj: { street1, city, state, postalcode, address_string } = {},
    photos = [],
  } = locationData;

  return (
    <div className="container mx-auto p-6 bg-base-100">
      {/* Location Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold">{name}</h1>
          <p className="text-green-500 font-semibold">Open</p>
          <p>{`${street1}, ${city}, ${state}, ${postalcode}`}</p>
          <StarRatingDisplay rating={4.4} reviewCount={662} /> {/* Example rating */}
        </div>
        <button className="btn btn-outline btn-secondary">Get Directions</button>
      </div>

      {/* Photos Carousel */}
      <div className="carousel rounded-box w-full max-w-4xl mb-6">
        {photos.slice(0, 5).map((photo, index) => (
          <div key={index} className="carousel-item">
            <Image
              src={photo.images.medium.url}
              alt={photo.caption || "Location photo"}
              width={150}
              height={150}
              className="rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Additional Details */}
      <div className="space-y-2">
        <p><strong>Distance:</strong> {distance} km</p>
        <p><strong>Noise Level:</strong> 2/5</p>
        <p><strong>Environment:</strong> Indoors</p>
        <p><strong>Outlets Available:</strong> Yes</p>
        <p><strong>Wi-Fi Available:</strong> Yes</p>
        <p><strong>Seating:</strong> Yes</p>
      </div>

      {/* Review and Favorite Buttons */}
      <div className="mt-4 flex space-x-2">
        <button className="btn btn-primary">Write a Review</button>
        <button className="btn btn-outline">Favorite</button>
      </div>
    </div>
  );
}
