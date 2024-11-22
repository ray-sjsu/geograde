// Browse.jsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchInputs from "/components/search/SearchInputs"; // Filter component
import SearchResults from "/components/search/SearchResults"; // Result display component

const searchForLocationAPI = async (params) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`/api/locations/simplified/search?${queryString}`);
  if (!response.ok) throw new Error("Failed to fetch data from the API");
  return response.json();
};

const Browse = () => {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("searchQuery") || "";
  const initialCoordinates = searchParams.get("coordinates") || "";

  const [formData, setFormData] = useState({
    searchQuery: initialQuery,
    coordinates: initialCoordinates,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial Search on Page Load
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await searchForLocationAPI(formData);
        setSearchResults(result.data);
      } catch (error) {
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    if (initialQuery || initialCoordinates) fetchResults();
  }, [initialQuery, initialCoordinates]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center w-full">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open Filters
        </label>

        {/* Search Results */}
        <div className="w-full p-6">
          {loading && <p className="text-blue-500 text-center">Loading results...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <SearchResults results={searchResults} />
        </div>
      </div>

      {/* Filter Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-4">
          <h2 className="text-xl font-bold mb-4">Filter Study Spots</h2>
          <SearchInputs formData={formData} handleChange={handleChange} />
          <button
            onClick={() => handleSearch(formData)}
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md"
          >
            Apply Filters
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Browse;
