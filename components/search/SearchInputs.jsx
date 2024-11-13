import React from "react";

const SearchInputs = ({ formData, handleChange }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Required Parameters
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Note: Set <strong>TRIPADVISOR_API_KEY</strong> in your environment
          instead of passing it as a query parameter.
        </p>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-600">Latitude and Longitude</span>
            <span className="text-sm text-gray-500 block">
              Latitude/Longitude pair to narrow the search to a specific area.
              These coordinates are the middle of San Jose State University.
            </span>
            <input
              type="text"
              name="latLong"
              value={formData.latLong}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </label>
          <label className="block">
            <span className="text-gray-600">Search Query</span>
            <span className="text-sm text-gray-500 block">
              Text to search by location name (e.g., "Coffee," "Restaurant").
            </span>
            <input
              type="text"
              name="searchQuery"
              value={formData.searchQuery}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
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
              Filters results by type: "hotels," "attractions," "restaurants,"
              or "geos".
            </span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="">Select category (optional)</option>
              <option value="hotels">Hotels</option>
              <option value="attractions">Attractions</option>
              <option value="restaurants">Restaurants</option>
              <option value="geos">Geos</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-600">Phone</span>
            <span className="text-sm text-gray-500 block">
              Phone number to filter results (format can include spaces and
              dashes, without "+").
            </span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
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
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
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
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </label>

          <label className="block">
            <span className="text-gray-600">Radius Unit</span>
            <span className="text-sm text-gray-500 block">
              Unit for the radius (default is "mi"): "km," "mi," or "m".
            </span>
            <select
              name="radiusUnit"
              value={formData.radiusUnit}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="">Select unit</option>
              <option value="km">Kilometers</option>
              <option value="mi">Miles</option>
              <option value="m">Meters</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-600">Language</span>
            <span className="text-sm text-gray-500 block">
              Language for results (default is "en"): e.g., "en" for English,
              "es" for Spanish.
            </span>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            >
              <option value="">Select language</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
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
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </label>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Photos</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-600">Limit</span>
            <span className="text-sm text-gray-500 block">
              Number of images to return (default is 5, maximum is 5).
            </span>
            <input
              type="text"
              name="limit"
              value={formData.limit}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </label>

          <label className="block">
            <span className="text-gray-600">Offset</span>
            <span className="text-sm text-gray-500 block">
              Index of the first result for pagination.
            </span>
            <input
              type="text"
              name="offset"
              value={formData.offset}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchInputs;
