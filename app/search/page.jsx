"use client";
import React, { useState, useCallback } from "react";
import SearchInputs from "/components/search/SearchInputs";
import SearchResults from "/components/search/SearchResults";
import {
  DEFAULT_LANGUAGE,
  DEFAULT_LAT_LONG,
  DEFAULT_PHOTO_LIMIT,
  DEFAULT_PHOTO_OFFSET,
  DEFAULT_RADIUS,
  DEFAULT_RADIUS_UNIT,
  DEFAULT_SEARCH_LIMIT,
  DEFAULT_SEARCH_QUERY,
  DEFAULT_CATEGORY,
} from "/lib/tripadvisor-api/constants";

// Fetch search results
const searchForLocationAPI = async (params) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`/api/locations/simplified/search?${queryString}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data from the API");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const SearchPage = () => {
  const [formData, setFormData] = useState({
    latLong: DEFAULT_LAT_LONG,
    searchQuery: DEFAULT_SEARCH_QUERY,
    category: DEFAULT_CATEGORY,
    phone: "",
    address: "",
    radius: DEFAULT_RADIUS,
    radiusUnit: DEFAULT_RADIUS_UNIT,
    language: DEFAULT_LANGUAGE,
    limit: DEFAULT_PHOTO_LIMIT,
    offset: DEFAULT_PHOTO_OFFSET,
    searchLimit: DEFAULT_SEARCH_LIMIT,
  });

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized handleChange to prevent unnecessary re-renders
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  // Search handler
  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await searchForLocationAPI(formData);
    if (result && result.data) {
      setSearchResults(result.data);
      setError(null);
    } else {
      setSearchResults([]);
      setError("No results found or an error occurred. Please try again.");
    }
    setLoading(false);
  }, [formData]);

  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer toggle for mobile */}
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col w-full">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden mx-4 my-2"
        >
          Open Filters
        </label>

        <div className="flex flex-col items-center w-full p-6">
          {/* Loading and Errors */}
          {loading && <p className="text-blue-500 text-center mt-4">Loading results...</p>}
          {error && !loading && <p className="text-red-500 text-center mt-4">{error}</p>}

          {/* Results */}
          {!loading && <SearchResults results={searchResults} />}
        </div>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-4">
          <h2 className="text-xl font-bold mb-4">Filter Study Spots</h2>
          <SearchInputs formData={formData} handleChange={handleChange} />
          <button
            onClick={handleSearch}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:ring focus:ring-blue-300"
          >
            Apply Filters
          </button>
        </ul>
      </div>
    </div>
  );
};

export default SearchPage;