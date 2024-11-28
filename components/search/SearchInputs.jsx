"use client"

import React, {useEffect} from "react";
import { useCoordinates, CoordinatesContext } from "/components/CoordinatesContext";

const SearchInputs = ({ formData, handleChange }) => {
  const { coordinates } = useCoordinates(CoordinatesContext);

  // Format the coordinates into "latitude,longitude" string format
  const formattedLatLong = coordinates
    ? `${coordinates.latitude},${coordinates.longitude}`
    : "";

  // Update the latLong field in formData when coordinates change
  useEffect(() => {
    handleChange({ target: { name: "latLong", value: formattedLatLong } });
  }, [formattedLatLong, handleChange]);

  return (
    <div className="max-h-screen overflow-y-auto p-4 space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Required Parameters
        </h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-600">Search Query</span>
            <span className="text-sm text-gray-500 block">
              Text to search by location name (e.g., &quot;Coffee,&quot;
              &quot;Restaurant&quot;).
            </span>
            <input
              type="text"
              name="searchQuery"
              value={formData.searchQuery}
              onChange={handleChange}
              className="text-base-content mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Optional Parameters
        </h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-600">Category</span>
            <span className="text-sm text-gray-500 block">
              Filters results by type: &quot;hotels,&quot;
              &quot;attractions,&quot; &quot;restaurants,&quot; or
              &quot;geos&quot;.
            </span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="text-base-content mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="">Select category (optional)</option>
              <option value="hotels">Hotels</option>
              <option value="attractions">Attractions</option>
              <option value="restaurants">Restaurants</option>
              <option value="geos">Geos</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-600">Address</span>
            <span className="text-sm text-gray-500 block">
              Address to filter the search results.
            </span>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="text-base-content mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </label>

          <label className="block">
            <span className="text-gray-600">Radius</span>
            <span className="text-sm text-gray-500 block">
              Search radius from the latitude/longitude point.
            </span>
            <input
              type="text"
              name="radius"
              value={formData.radius}
              onChange={handleChange}
              className="text-base-content mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </label>

          <label className="block">
            <span className="text-gray-600">Search Limit</span>
            <span className="text-sm text-gray-500 block">
              Maximum results to return (default is 5, maximum is 10).
            </span>
            <input
              type="text"
              name="searchLimit"
              value={formData.searchLimit}
              onChange={handleChange}
              className="text-base-content mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchInputs;
