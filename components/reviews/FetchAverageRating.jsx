import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { firestore } from "/app/firebase/config";

export const fetchAndUpdateAverageRating = async (locationId) => {
  try {
    // Query reviews for the given locationId
    const reviewsRef = collection(firestore, "reviews");
    const reviewsQuery = query(reviewsRef, where("locationId", "==", locationId));
    const reviewsSnapshot = await getDocs(reviewsQuery);

    // Extract reviews data
    const reviews = reviewsSnapshot.docs.map((doc) => doc.data());
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const reviewCount = reviews.length;

    // Calculate average rating
    const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

    // Update the `locations` collection
    const locationDocRef = doc(firestore, "locations", locationId);
    await updateDoc(locationDocRef, {
      average_rating: averageRating,
      total_reviews: reviewCount,
    });

    return {
      averageRating,
      reviewCount,
    };
  } catch (error) {
    console.error("Error updating average rating:", error);
    return { averageRating: 0, reviewCount: 0 };
  }
};
