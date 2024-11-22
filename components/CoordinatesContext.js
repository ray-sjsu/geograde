// CoordinatesContext.js
"use client"

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
  const [coordinates, setCoordinates] = useState(null);

  return (
    <CoordinatesContext.Provider value={{ coordinates, setCoordinates }}>
      {children}
    </CoordinatesContext.Provider>
  );
};