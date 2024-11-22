// components/Listings.js
"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Listings({ searchQuery, latLong, searchLimit }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/locations/simplified/search`,
          {
            params: {
              searchQuery,
              latLong,
              searchLimit,
            },
          }
        );
        setLocations(response.data.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [searchQuery, latLong, searchLimit]);

  return (
    <div className="p-4 bg-base-200 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">Nearby Listings</h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div key={location.location_id} className="card bg-base-100 shadow-md">
              <figure>
                <img
                  src={location.photos[0]?.images.medium.url || "/default-image.jpg"}
                  alt={location.name}
                  className="object-cover h-48 w-full"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-lg font-bold">{location.name}</h3>
                <p className="text-sm text-gray-600">{location.address_obj.address_string}</p>
                <p className="text-sm text-gray-500">Distance: {parseFloat(location.distance).toFixed(2)} miles</p>
                <div className="card-actions mt-3">
                  <button className="btn btn-sm btn-primary">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
