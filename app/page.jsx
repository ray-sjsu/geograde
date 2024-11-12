import React from "react";
import HighlightSpots from "/components/HeroSection"
import Listings from "/components/Listings"
import LibraryCarousel from "/components/LibraryCarousel"

export default function HomePage() {

  return (
    <div className="min-h-screen bg-base-100 text-gray-100 space-y-12">
      <HighlightSpots />
      <LibraryCarousel />
    </div>
      
  );
}
