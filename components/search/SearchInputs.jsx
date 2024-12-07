"use client";

import React from "react";

const SearchInputs = ({ formData, handleChange }) => {
  return (
    <div className="max-h-screen overflow-y-auto p-4 space-y-6">
      {/* Optional Parameters */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Filters</h2>
        <div className="space-y-4">
          {/* Radius Filter */}
          <label className="block">
            <span className="text-gray-600">Radius (km)</span>
            <input
              type="number"
              name="radius"
              value={formData.radius}
              onChange={handleChange}
              className="text-base-content mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              min="1"
              placeholder="Enter radius in kilometers"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default SearchInputs;
