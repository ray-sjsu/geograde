"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useCoordinates } from "/components/CoordinatesContext";
import SearchInputs from "/components/search/SearchInputs";
import FirestoreSearchResults from "./PlaceResults";
import {
  DEFAULT_RADIUS,
  DEFAULT_SEARCH_QUERY,
  DEFAULT_CATEGORY,
} from "/lib/tripadvisor-api/constants";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const PlacesPageContent = () => {
  const searchParams = useSearchParams();
  const { coordinates } = useCoordinates(); // Get coordinates from the context

  const [formData, setFormData] = useState({
    searchQuery: DEFAULT_SEARCH_QUERY,
    category: DEFAULT_CATEGORY,
    radius: DEFAULT_RADIUS,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const preloadSearchQuery =
      searchParams.get("searchQuery") || DEFAULT_SEARCH_QUERY;
    const preloadCategory = searchParams.get("category") || DEFAULT_CATEGORY;

    setFormData((prev) => ({
      ...prev,
      searchQuery: preloadSearchQuery,
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

  const userCoordinates = coordinates || { latitude: 0, longitude: 0 }; // Default to (0, 0) if not set

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-base-100">
        {/* Filter Button for Mobile */}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden mx-4 my-2"
        >
          Open Filters
        </label>
        <div className="w-full">
          {/* Loading Animation */}
          {loading && (
            <div className="flex justify-center items-center h-96">
              <DotLottieReact
                src="https://lottie.host/d7b40a97-71fd-440e-b8e0-27d70c412526/pyLG2GiGIs.lottie"
                loop
                autoplay
              />
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {/* Search Results */}
          {!loading && (
            <div className="w-full max-w-7xl mx-auto p-4">
              <FirestoreSearchResults
                userCoordinates={userCoordinates}
                radius={parseFloat(formData.radius) || 10} // Default radius
                searchQuery={formData.searchQuery} // Pass the search query
                pageSize={10}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for Filters */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <aside
          className="bg-base-200 text-base-content h-full w-80 p-4 overflow-y-auto"
          style={{
            scrollBehavior: "smooth",
            marginTop: "var(--navbar-height)",
          }}
        >
          <h2 className="text-xl font-bold mb-4">Filter</h2>
          <SearchInputs formData={formData} handleChange={handleChange} />
        </aside>
      </div>
    </div>
  );
};

export default PlacesPageContent;
