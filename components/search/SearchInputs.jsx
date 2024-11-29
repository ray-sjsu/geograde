"use client";
import React, { useEffect } from "react";

const SearchInputs = ({ formData, handleChange }) => {
  return (
    <div className="max-h-screen overflow-y-auto p-4 space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Required Parameters</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-600">Search Query</span>
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
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Optional Parameters</h2>
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-600">Latitude,Longitude</span>
            <input
              type="text"
              name="latLong"
              value={formData.latLong}
              onChange={handleChange}
              className="text-base-content mt-1 block w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="e.g., 37.7749,-122.4194"
            />
          </label>
          <label className="block">
            <span className="text-gray-600">Radius (km)</span>
            <input
              type="text"
              name="radius"
              value={formData.radius}
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
