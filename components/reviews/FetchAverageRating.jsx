import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "/app/firebase/config";

export const fetchAverageRating = async (locationId) => {
  try {
    const reviewsRef = collection(firestore, "reviews");
    const reviewsQuery = query(reviewsRef, where("locationId", "==", locationId));
    const reviewsSnapshot = await getDocs(reviewsQuery);

    const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const reviewCount = reviews.length;

    return {
      averageRating: reviewCount > 0 ? totalRating / reviewCount : 0,
      reviewCount,
    };
  } catch (error) {
    console.error("Error fetching average rating:", error);
    return { averageRating: 0, reviewCount: 0 };
  }
};
