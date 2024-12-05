import Image from 'next/image';
import React from 'react';

const SearchResults = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="text-gray-500">No results found.</p>;
  }

  return (
    <div className="grid gap-6">
      {results.map((location) => (
        <div key={location.location_id} className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{location.name}</h2>
          <p className="text-gray-600 mb-4">
            {location.address_obj.address_string} — {location.distance} miles {location.bearing}
          </p>

          {location.photos && location.photos.length > 0 && (
            <div className="mb-4">
              <Image
                src={location.photos[0].images.medium.url}
                alt={location.photos[0].caption || location.name}
                className="rounded-md w-full object-cover h-40"
                height={200}
                width={200}
              />
            </div>
          )}

          <a
            href={`/search/${location.location_id}`}
            className="text-blue-500 underline hover:text-blue-600"
          >
            View Details
          </a>
        </div>
      ))}
    </div>
  );

  
};

export default SearchResults;