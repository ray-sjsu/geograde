"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/app/firebase/config";

const PlaceBadges = ({ locationId }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const reviewsRef = collection(firestore, "reviews");
        const reviewsQuery = query(reviewsRef, where("locationId", "==", locationId));
        const reviewsSnapshot = await getDocs(reviewsQuery);

        const reviews = reviewsSnapshot.docs.map((doc) => doc.data());

        // Aggregate feedback counts
        const feedbackCounts = reviews.reduce((acc, review) => {
          const feedback = review.additionalFeedback || {};
          for (const [key, value] of Object.entries(feedback)) {
            if (value) {
              acc[key] = (acc[key] || 0) + 1;
            }
          }
          return acc;
        }, {});

        // Sort feedback by frequency in descending order
        const sortedBadges = Object.entries(feedbackCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 4)
          .map(([key]) => key);

        setBadges(sortedBadges);
      } catch (error) {
        console.error("Error fetching feedback data for PlaceBadges:", error);
      }
    };

    fetchFeedbackData();
  }, [locationId]);

  return (
    <div className="flex flex-wrap gap-2">
      {badges.length > 0 ? (
        badges.map((badge, index) => (
          <div key={index} className="badge badge-primary badge-outline">
            {badge.replace(/([A-Z])/g, " $1").trim()} {/* Format camelCase */}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">No feedback available.</p>
      )}
    </div>
  );
};

export default PlaceBadges;
