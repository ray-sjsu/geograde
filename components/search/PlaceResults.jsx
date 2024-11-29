"use client";

import React, { useEffect, useState } from "react";
import { firestore } from "@/app/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import PlaceCard from "./PlaceCard";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const FirestoreSearchResults = ({ userCoordinates, radius, pageSize = 10, searchQuery = "" }) => {
  const [results, setResults] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]); // Filtered locations based on query and radius
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch and process all locations
  const fetchResults = async () => {
    setLoading(true);
    try {
      const resultsRef = collection(firestore, "locations");
      const querySnapshot = await getDocs(resultsRef);
      const locations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Calculate distances and filter by radius
      const processedLocations = locations
        .map((location) => ({
          ...location,
          distance: calculateDistance(
            userCoordinates.latitude,
            userCoordinates.longitude,
            location.location.lat,
            location.location.lng
          ),
        }))
        .filter((location) => location.distance <= radius) // Filter by radius
        .sort((a, b) => a.distance - b.distance); // Sort by distance

      // Save processed locations for later filtering
      setFilteredLocations(processedLocations);
      setCurrentPage(1); // Reset to the first page
    } catch (error) {
      console.error("Error fetching Firestore results:", error);
    }
    setLoading(false);
  };

  // Filter locations by search query and paginate
  const updateResults = () => {
    const queryLower = searchQuery.toLowerCase();
    const filtered = filteredLocations.filter((location) => {
      const nameMatch = location.name?.toLowerCase().includes(queryLower);
      const typeMatch = location.types?.some((type) => type.toLowerCase().includes(queryLower));
      return nameMatch || typeMatch;
    });

    // Paginate results
    const startIndex = (currentPage - 1) * pageSize;
    setResults(filtered.slice(startIndex, startIndex + pageSize));
  };

  // Handle pagination
  const handleNextPage = () => {
    const startIndex = currentPage * pageSize;
    if (startIndex < filteredLocations.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [userCoordinates, radius]);

  useEffect(() => {
    updateResults();
  }, [filteredLocations, searchQuery, currentPage]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <div className="grid gap-6">
            {results.map((location) => (
              <PlaceCard
                key={location.id}
                id={location.id}
                name={location.name}
                address={location.address}
                imageUrl={location.photos ? location.photos[0]?.url : null}
                rating={location.rating}
                distance={location.distance.toFixed(2)}
                price={location.price_level}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <div className="join">
              <button
                className={`join-item btn ${currentPage === 1 ? "btn-disabled" : ""}`}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                « Previous
              </button>
              <button className="join-item btn">Page {currentPage}</button>
              <button
                className={`join-item btn ${
                  results.length < pageSize ? "btn-disabled" : ""
                }`}
                onClick={handleNextPage}
                disabled={results.length < pageSize}
              >
                Next »
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirestoreSearchResults;
