"use client"

import { useState } from "react";
import ReactMapGL from "/node_modules/react-mapbox-gl";
export default function Map() {
  const [viewport, setViewport] = useState({
  width: "100%",
  height: "100%",
  // The latitude and longitude of the center of London
  latitude: 51.5074,
  longitude: -0.1278,
  zoom: 10
});
return <ReactMapGL
  mapStyle="mapbox://styles/mapbox/streets-v11"
  mapboxApiAccessToken={process.env.MAPBOX_KEY}
  {...viewport}
  onViewportChange={(nextViewport) => setViewport(nextViewport)}
  >
</ReactMapGL>
}