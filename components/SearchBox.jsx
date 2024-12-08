"use client";

import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useCoordinates } from "/components/CoordinatesContext";

// Import Mapbox CSS
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "/app/styles/geocoder-override.css";

const SearchBox = () => {
  const { setCoordinates } = useCoordinates(); // Access context for setting coordinates
  const geocoderContainerRef = useRef(null);
  const geocoderRef = useRef(null);

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    }

    if (!geocoderRef.current && geocoderContainerRef.current) {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: "country,region,place,postcode,locality,neighborhood,address",
        placeholder: "Search for a location",
        proximity: {
          longitude: -121.8907,
          latitude: 37.3362, // San Jose default coordinates
        },
        query: "San Jose, California, United States",
      });

      geocoderRef.current = geocoder;

      // Add Geocoder to the container
      geocoder.addTo(geocoderContainerRef.current);

      // Handle result selection
      geocoder.on("result", (e) => {
        const [longitude, latitude] = e.result.center;
        setCoordinates({ latitude, longitude });
        localStorage.setItem("mapboxLocation", e.result.place_name || "");
      });

      // Handle clearing the input
      geocoder.on("clear", () => {
        setCoordinates(null);
        localStorage.removeItem("mapboxLocation");
      });

      // Load saved location on mount
      const savedLocation = localStorage.getItem("mapboxLocation");
      if (savedLocation) {
        geocoder.setInput(savedLocation);
      }
    }

    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.clear();
        geocoderContainerRef.current.innerHTML = ""; // Clear container
        geocoderRef.current = null;
      }
    };
  }, [setCoordinates]);

  // Suppress Enter key behavior
  const suppressEnterKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div
      ref={geocoderContainerRef}
      className="custom-geocoder-container flex items-center"
      onKeyDown={suppressEnterKey} // Attach keydown event listener
    ></div>
  );
};

export default SearchBox;
