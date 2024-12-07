"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchBox from "./SearchBox"; // Custom Mapbox Geocoder component
import ClientAuthMenu from "./ClientAuthMenu";
import { useCoordinates } from "/components/CoordinatesContext"; // Import context

const Navbar = () => {
  const router = useRouter();
  const { searchQuery, setSearchQuery, coordinates } = useCoordinates(); // Get shared state and setters from context

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(
      `/search?searchQuery=${encodeURIComponent(searchQuery)}${
        coordinates
          ? `&latitude=${encodeURIComponent(coordinates.latitude)}&longitude=${encodeURIComponent(coordinates.longitude)}`
          : ""
      }`
    );
  };

  return (
    <div className="navbar bg-base-200 shadow-2xl z-10">
      {/* Navbar Start - Logo */}
      <div className="navbar-start">
        <Link href="/">
          <div>
            <Image src="/geograde-logo-transparent.png" width={188} height={50} alt="Logo" />
          </div>
        </Link>
      </div>

      {/* Navbar Center - Search Bars */}
      <div className="navbar-center">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-2 rounded px-2 py-1">
          {/* Keyword Input */}
          <input
            type="text"
            placeholder="Keyword"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input shadow-lg focus:input-primary h-10 w-72 text-gray-700 placeholder-gray-400 rounded-lg"
          />
          {/* Mapbox Geocoder */}
          <div className="flex-grow shadow-lg">
            <SearchBox /> 
          </div>
          {/* Search Button */}
          <button type="submit" className="btn btn-primary btn-sm text-white">
            Search
          </button>
        </form>
      </div>

      {/* Navbar End - Auth Menu */}
      <div className="navbar-end">
        <ClientAuthMenu />
      </div>
    </div>
  );
};

export default Navbar;
