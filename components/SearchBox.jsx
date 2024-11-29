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
  const geocoderRef = useRef(null); // Track the geocoder instance

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    }

    if (!geocoderRef.current && geocoderContainerRef.current) {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: "country,region,place,postcode,locality,neighborhood",
        placeholder: "Search for a location...",
      });

      geocoderRef.current = geocoder;

      // Add Geocoder to the container
      geocoder.addTo(geocoderContainerRef.current);

      // Handle events
      geocoder.on("result", (e) => {
        const [longitude, latitude] = e.result.center;
        setCoordinates({ latitude, longitude });
        console.log("Coordinates set:", { latitude, longitude });
      });

      geocoder.on("clear", () => {
        setCoordinates(null);
        console.log("Geocoder input cleared");
      });
    }

    return () => {
      // Cleanup on component unmount
      if (geocoderRef.current) {
        geocoderRef.current.clear();
        if (geocoderContainerRef.current) {
          geocoderContainerRef.current.innerHTML = ""; // Clear container
        }
        geocoderRef.current = null;
      }
    };
  }, [setCoordinates]);

  return <div ref={geocoderContainerRef} className="custom-geocoder-container flex items-center"></div>;
};

export default SearchBox;
