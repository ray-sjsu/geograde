"use client";

import React, { createContext, useContext, useState } from "react";

const CoordinatesContext = createContext();

export const useCoordinates = () => {
  const context = useContext(CoordinatesContext);
  if (!context) {
    throw new Error("useCoordinates must be used within a CoordinatesProvider");
  }
  return context;
};

export const CoordinatesProvider = ({ children }) => {
  const [coordinates, setCoordinates] = useState(null); // Stores latitude and longitude
  const [searchQuery, setSearchQuery] = useState(""); // Stores the user's search input

  return (
    <CoordinatesContext.Provider
      value={{
        coordinates,
        setCoordinates,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </CoordinatesContext.Provider>
  );
};
