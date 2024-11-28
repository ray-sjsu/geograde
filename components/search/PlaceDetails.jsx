import React from "react";
import Image from "next/image";
import FavoriteButton from "/components/Favorites/FavoriteButton";

const isOpenNow = (periods) => {
  if (!periods || periods.length === 0) return false;

  const now = new Date();
  const currentDay = now.getDay(); // Get the current day (0 = Sunday, 6 = Saturday)
  const currentTime = parseInt(
    now.toTimeString().slice(0, 2) + now.toTimeString().slice(3, 5)
  ); // Get time in HHMM format

  for (const period of periods) {
    if (period.open.day === currentDay) {
      const openTime = parseInt(period.open.time); // Opening time in HHMM format
      const closeTime = parseInt(period.close.time); // Closing time in HHMM format

      if (openTime <= currentTime && (closeTime > currentTime || closeTime < openTime)) {
        return true;
      }
    }
  }
  return false; // Not open if no matching period is found
};

const PlaceDetails = ({
  locationId,
  name,
  openingHours,
  address,
  website,
  priceLevel,
  noiseLevel,
  environment,
  outletsAvailable,
  wifiAvailable,
  seating,
  photos,
  url,
}) => {
  const openStatus = isOpenNow(openingHours?.periods);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-base-100 rounded-lg shadow-md">
  {/* Left Section */}
  <div className="flex flex-col items-start space-y-4">
    <h1 className="text-4xl font-bold text-gray-800">{name || "Unknown Location"}</h1>
    <p
      className={`text-lg font-semibold ${
        openStatus ? "text-green-600" : "text-red-600"
      }`}
    >
      {openStatus ? "Open Now" : "Closed"}
    </p>
    <FavoriteButton locationId={locationId} locationName={name || "Unknown Location"} />
  </div>

  {/* Right Section */}
  <div className="flex flex-col justify-between">
    {/* Details */}
    {/* <div className="mt-4 space-y-2">
      {priceLevel && (
        <p className="text-gray-800">
          {Array(priceLevel)
            .fill("$")
            .join("")}
        </p>
      )}
      {noiseLevel && (
        <p className="text-gray-600">
          <strong>Noise Level:</strong> {noiseLevel}/5
        </p>
      )}
      {environment && (
        <p className="text-gray-600">
          <strong>Environment:</strong> {environment}
        </p>
      )}
      {outletsAvailable !== undefined && (
        <p className="text-gray-600">
          <strong>Outlets Available:</strong>{" "}
          {outletsAvailable ? "Yes" : "No"}
        </p>
      )}
      {wifiAvailable !== undefined && (
        <p className="text-gray-600">
          <strong>Wi-Fi Available:</strong> {wifiAvailable ? "Yes" : "No"}
        </p>
      )}
      {seating !== undefined && (
        <p className="text-gray-600">
          <strong>Seating:</strong> {seating ? "Yes" : "No"}
        </p>
      )}
    </div> */}

    {/* Address, Website, and Directions */}
    <div className="mt-4 space-y-2">
      <p className="text-gray-600">
        <strong>Address:</strong> {address || "No address available"}
      </p>
      {website && (
        <p className="text-gray-600">
          <strong>Website:</strong>{" "}
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {website}
          </a>
        </p>
      )}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block"
        >
          <button className="btn btn-success">Get Directions</button>
        </a>
      )}
    </div>
  </div>

  {/* Carousel Section */}
  <div className="lg:col-span-2 carousel carousel-center bg-neutral rounded-box space-x-4 p-4 mt-4">
    {photos && photos.length > 0 ? (
      photos.map((photo, index) => (
        <div key={index} className="carousel-item">
          <Image
            src={photo}
            alt={`Photo of ${name}`}
            height={200}
            width={300}
            className="rounded-md"
          />
        </div>
      ))
    ) : (
      <div className="flex items-center justify-center bg-gray-200 h-full w-full rounded-md">
        <p className="text-gray-500">No photos available</p>
      </div>
    )}
  </div>
</div>

  );
};

export default PlaceDetails;
