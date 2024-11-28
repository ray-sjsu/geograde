"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import SearchInputs from "/components/search/SearchInputs";
import FirestoreSearchResults from "./PlaceResults";
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

const PlacesPageContent = () => {
  const searchParams = useSearchParams();

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const preloadSearchQuery =
      searchParams.get("searchQuery") || searchParams.get("category") || DEFAULT_SEARCH_QUERY;
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

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryString = new URLSearchParams(formData).toString();
      const response = await fetch(`/api/locations/simplified/search?${queryString}`);
      const result = await response.json();
      console.log(result); // For debugging purposes
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [formData]);

  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer Toggle */}
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Toggle button for mobile */}
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button lg:hidden mx-4 my-2"
        >
          Open Filters
        </label>
        <div className="w-full">
          {loading && (
            <div className="flex justify-center items-center h-96">
              <DotLottieReact
                src="https://lottie.host/d7b40a97-71fd-440e-b8e0-27d70c412526/pyLG2GiGIs.lottie"
                loop
                autoplay
              />
            </div>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {!loading && (
            <div className="w-full max-w-7xl mx-auto p-4">
              <FirestoreSearchResults pageSize={10} />
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Drawer with Independent Scrolling */}
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
          <button
            onClick={handleSearch}
            className="btn btn-block btn-primary mt-4"
          >
            Apply Filters
          </button>
        </aside>
      </div>
    </div>
  );
};

export default PlacesPageContent;
