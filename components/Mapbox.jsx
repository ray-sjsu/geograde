"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

let geocoder; // Initialize geocoder outside to share with other components

const MapboxPage = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    // Initialize Map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-121.8811, 37.3352], // San Jose coordinates
      zoom: 13,
    });

    // Initialize Geocoder
    geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search places...",
    });

    // Add Geocoder to map (hidden by CSS if controlled elsewhere)
    mapRef.current.addControl(geocoder);

    return () => {
      mapRef.current.remove();
    };
  }, []);

  return <div ref={mapContainerRef} style={{ height: "100vh", width: "100%" }} />;
};

export default MapboxPage;
