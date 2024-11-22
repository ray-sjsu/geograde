"use client";

import React, { useState } from "react";
import Navbar from "/components/Navbar";
import Mapbox from "/components/Mapbox";

const Page = () => {
  const [mapCenter, setMapCenter] = useState([-121.8811, 37.3352]); // Default to San Jose, CA

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar setMapCenter={setMapCenter} />
      <div style={{ flex: 1 }}>
        <Mapbox mapCenter={mapCenter} />
      </div>
    </div>
  );
};

export default Page;
