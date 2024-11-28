"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
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
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const SearchPage = () => {
  const searchParams = useSearchParams(); // Extract query parameters

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

  useEffect(() => {
    // Preload form data from query parameters
    const preloadSearchQuery = searchParams.get("searchQuery") || searchParams.get("category") || DEFAULT_SEARCH_QUERY;
    const preloadCategory = searchParams.get("category") || DEFAULT_CATEGORY;

    setFormData((prev) => ({
      ...prev,
      searchQuery: preloadSearchQuery, // Map 'category' to 'searchQuery'
      category: preloadCategory,
    }));
  }, [searchParams]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryString = new URLSearchParams(formData).toString();
      const response = await fetch(`/api/locations/simplified/search?${queryString}`);
      const result = await response.json();
      setSearchResults(result.data || []);
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
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
            {loading && 
              <p>      
                <DotLottieReact
                  src="https://lottie.host/d7b40a97-71fd-440e-b8e0-27d70c412526/pyLG2GiGIs.lottie"
                  loop
                  autoplay
                />
              </p>}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            {!loading && <SearchResults results={searchResults} />}
          </div>
        </div>
        {/* Sidebar Drawer */}
        <div className="drawer-side">
      
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-4">

            <h2 className="text-xl font-bold mb-4">Filter</h2>
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
