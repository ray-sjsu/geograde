import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FALLBACK_PLACEHOLDER_IMAGE_URL } from "@/lib/constants";

const getFirstAvailablePhoto = (photos) => {
  if (!photos?.data || photos.data.length === 0) {
    return FALLBACK_PLACEHOLDER_IMAGE_URL;
  }

  const sizeOrder = ["medium", "large", "original", "small", "thumbnail"];

  for (let photo of photos.data) {
    for (let size of sizeOrder) {
      const url = photo?.images?.[size]?.url;
      if (url) {
        return url;
      }
    }
  }

  return FALLBACK_PLACEHOLDER_IMAGE_URL;
};

const TrendingLocationCard = ({ location }) => {
  const { overview, photos } = location;
  const firstPhoto = getFirstAvailablePhoto(photos);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-sm">
      {/* Location Name */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {overview?.name || "Location Name Unavailable"}
      </h3>

      {/* Image */}
      <div className="w-full h-40 overflow-hidden rounded-lg mb-4">
        <Image
          src={firstPhoto}
          alt={overview?.name || "Image Unavailable"}
          width={250}
          height={188}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Full Address */}
      <p className="text-gray-600 text-sm mb-2">
        {overview?.address_obj?.address_string || "Address Unavailable"}
      </p>

      {/* Rating */}
      <p className="text-yellow-500 font-semibold mb-4">
        Rating: {overview?.rating ? `${overview.rating} ⭐` : "N/A"}
      </p>

      {/* Read More Button */}
      {overview?.location_id ? (
        <Link href={`/search/${overview.location_id}`}>
          <p className="block bg-blue-500 text-white text-center py-2 rounded-lg hover:bg-blue-600 transition duration-200">
            Read More
          </p>
        </Link>
      ) : (
        <p className="text-gray-400 text-center py-2 rounded-lg">
          Location ID Unavailable
        </p>
      )}

      {/* Location ID (For Testing) */}
      <p className="text-gray-600 text-sm mb-2">
        TESTING: Location ID: {overview?.location_id || "N/A"}
      </p>
    </div>
  );
};

export default TrendingLocationCard;
