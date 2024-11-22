"use client";

import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

// Import required CSS
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const NavbarTest = () => {
  const geocoderContainerRef = useRef(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    // Set Mapbox access token from the environment variable
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    // Initialize the Geocoder without a map
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      types: "place",
      placeholder: "Search places",
    });

    // Add the Geocoder to the ref container in the navbar
    if (geocoderContainerRef.current) {
      geocoder.addTo(geocoderContainerRef.current);
    }

    // Listen for the result event to retrieve and display coordinates
    geocoder.on("result", (e) => {
      const center = e.result.geometry?.center;
      if (center) {
        const [longitude, latitude] = center;
        setCoordinates({ latitude, longitude });
      }
    });

    // Remove the geocoder on unmount by clearing the container
    return () => {
      if (geocoderContainerRef.current) {
        geocoderContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
      
      {/* Display the result below the navbar */}
      <div className="mt-10">
        <h1 className="text-2xl font-semibold mb-4">Geocoder Test Results</h1>
        {coordinates ? (
          <p className="text-lg">
            Latitude: {coordinates.latitude.toFixed(5)}, Longitude: {coordinates.longitude.toFixed(5)}
          </p>
        ) : (
          <p className="text-lg">No location selected.</p>
        )}
      </div>
    </div>
  );
};

export default NavbarTest;
