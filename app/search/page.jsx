"use client";
import SearchInputs from "@/components/search/SearchInputs";
import SearchResults from "@/components/search/SearchResults";
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
} from "@/lib/tripadvisor-api/constants";
import React, { useState } from "react";

const searchForLocationAPI = async (params) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `/api/locations/simplified/search?${queryString}`
    );
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
    latLong: DEFAULT_LAT_LONG, // Default latitude and longitude
    searchQuery: DEFAULT_SEARCH_QUERY,
    category: DEFAULT_CATEGORY,
    phone: "",
    address: "",
    radius: DEFAULT_RADIUS, // Default radius
    radiusUnit: DEFAULT_RADIUS_UNIT, // Default radius unit
    language: DEFAULT_LANGUAGE, // Default language
    limit: DEFAULT_PHOTO_LIMIT,
    offset: DEFAULT_PHOTO_OFFSET,
    searchLimit: DEFAULT_SEARCH_LIMIT,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = async () => {
    setLoading(true); // Set loading to true when the search starts
    setError(null); // Clear any previous error
    const result = await searchForLocationAPI(formData);
    if (result && result.data) {
      setSearchResults(result.data);
      setError(null);
    } else {
      setSearchResults([]);
      setError("No results found or an error occurred. Please try again.");
    }
    setLoading(false); // Set loading to false after search completes
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col p-4 text-black">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Location Search
        </h1>

        {/* Search Inputs */}
        <SearchInputs formData={formData} handleChange={handleChange} />

        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:ring focus:ring-blue-300"
        >
          Search
        </button>
      </div>

      {/* Display Loading Message */}
      {loading && (
        <p className="text-blue-500 text-center mt-4">Loading results...</p>
      )}

      {/* Display Error Message */}
      {error && !loading && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {/* Search Results */}
      {!loading && <SearchResults results={searchResults} />}
    </div>
  );
};

export default SearchPage;
