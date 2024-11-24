import React from "react";

export default function StarRatingDisplay({ rating, reviewCount }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center space-x-1">
      <div className="rating rating-lg rating-half">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            // Full Star
            return (
              <React.Fragment key={`${index}-full`}>
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-1 bg-yellow-500"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-2 bg-yellow-500"
                  checked
                  readOnly
                />
              </React.Fragment>
            );
          } else if (index === fullStars && hasHalfStar) {
            // Half Star
            return (
              <React.Fragment key={`${index}-half`}>
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-1 bg-yellow-500"
                  checked
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-2 bg-gray-300"
                />
              </React.Fragment>
            );
          } else {
            // Empty Star
            return (
              <React.Fragment key={`${index}-empty`}>
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-1 bg-gray-300"
                  readOnly
                />
                <input
                  type="radio"
                  name="rating-display"
                  className="mask mask-star-2 mask-half-2 bg-gray-300" 
                  readOnly
                />
              </React.Fragment>
            );
          }
        })}
      </div>
      <span className="text-lg text-base-content font-semibold">
        {rating.toFixed(1)} ({reviewCount} reviews)
      </span>
    </div>
  );
}
