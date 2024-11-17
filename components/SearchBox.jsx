// SearchBox.jsx
"use client";
import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useCoordinates } from "/components/CoordinatesContext";

// Import Mapbox CSS
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const SearchBox = () => {
  const { setCoordinates } = useCoordinates();
  const geocoderContainerRef = useRef(null);
  const geocoderRef = useRef(null); // To track the geocoder instance

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    }

    if (!geocoderRef.current && geocoderContainerRef.current) {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: "country,region,place,postcode,locality,neighborhood",
        placeholder: "Location",
      });
      geocoderRef.current = geocoder;

      geocoder.addTo(geocoderContainerRef.current);

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
      // Cleanup geocoder on unmount
      if (geocoderRef.current) {
        geocoderRef.current.clear(); // Clear the geocoder instance
        geocoderContainerRef.current.innerHTML = ""; // Clear container
        geocoderRef.current = null; // Reset the ref
      }
    };
  }, [setCoordinates]);

  return <div ref={geocoderContainerRef} className="w-full"></div>;
};

export default SearchBox;
