"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CoordinatesContext = createContext();

export const useCoordinates = () => {
  const context = useContext(CoordinatesContext);
  if (!context) {
    throw new Error("useCoordinates must be used within a CoordinatesProvider");
  }
  return context;
};

export const CoordinatesProvider = ({ children }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedCoordinates =
      typeof window !== "undefined" && localStorage.getItem("coordinates");
    const savedSearchQuery =
      typeof window !== "undefined" && localStorage.getItem("searchQuery");

    if (savedCoordinates) {
      setCoordinates(JSON.parse(savedCoordinates));
    }
    if (savedSearchQuery) {
      setSearchQuery(savedSearchQuery);
    }
  }, []);

  useEffect(() => {
    if (coordinates) {
      localStorage.setItem("coordinates", JSON.stringify(coordinates));
    }
    if (searchQuery) {
      localStorage.setItem("searchQuery", searchQuery);
    }
  }, [coordinates, searchQuery]);

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
