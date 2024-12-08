"use client";

import React, { useEffect, useState, useCallback } from "react";
import { firestore } from "@/app/firebase/config";
import { collection, getDocs, query, where } from "firebase/firestore";
import PlaceCard from "./PlaceCard";
import { isOpenNow } from "./CalculateStatus";

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

const FirestoreSearchResults = ({
  userCoordinates,
  radius,
  pageSize = 10,
  searchQuery,
  sortBy,
  openNow = false,
}) => {
  const [results, setResults] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const resultsRef = collection(firestore, "locations");
      const querySnapshot = await getDocs(resultsRef);

      const locations = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const processedLocations = await Promise.all(
        locations.map(async (location) => {
          const distance = calculateDistance(
            userCoordinates.latitude,
            userCoordinates.longitude,
            location.location.lat,
            location.location.lng
          );

          const reviewsRef = collection(firestore, "reviews");
          const reviewsQuery = query(reviewsRef, where("locationId", "==", location.id));
          const reviewsSnapshot = await getDocs(reviewsQuery);

          const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const reviewCount = reviews.length;
          const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

          return {
            ...location,
            distance,
            reviewCount,
            averageRating,
            openNowStatus: isOpenNow(location.opening_hours), // Check if location is open now
          };
        })
      );

      const filtered = processedLocations.filter((location) => {
        const matchesOpenNow = !openNow || location.openNowStatus; // Apply openNow filter
        return matchesOpenNow && location.distance <= radius;
      });

      setFilteredLocations(filtered);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
    setLoading(false);
  }, [radius, userCoordinates, openNow]);

  const sortLocations = (locations, sortBy) => {
    switch (sortBy) {
      case "average_rating":
        return [...locations].sort((a, b) => b.averageRating - a.averageRating);
      case "total_reviews":
        return [...locations].sort((a, b) => b.reviewCount - a.reviewCount);
      default: // Distance
        return [...locations].sort((a, b) => a.distance - b.distance);
    }
  };

  const updateResults = useCallback(() => {
    const queryLower = searchQuery.toLowerCase();
    let filtered = filteredLocations.filter((location) => {
      const nameMatch = location.name?.toLowerCase().includes(queryLower);
      const typeMatch = location.types?.some((type) => type.toLowerCase().includes(queryLower));
      return nameMatch || typeMatch;
    });

    // Sort the filtered locations
    filtered = sortLocations(filtered, sortBy);

    // Paginate results
    const startIndex = (currentPage - 1) * pageSize;
    setResults(filtered.slice(startIndex, startIndex + pageSize));
  }, [filteredLocations, searchQuery, currentPage, pageSize, sortBy]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  useEffect(() => {
    updateResults();
  }, [filteredLocations, searchQuery, sortBy, currentPage]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div className="grid gap-6">
          {results.map((location) => (
            <PlaceCard
              key={location.id}
              id={location.id}
              name={location.name}
              address={location.address}
              rating={location.averageRating}
              reviewCount={location.reviewCount}
              distance={location.distance.toFixed(2)}
              openingHours={location.opening_hours}
              imageUrl={location.photos ? location.photos[0]?.url : null}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10">No results found.</p>
      )}
    </div>
  );
};

export default FirestoreSearchResults;
