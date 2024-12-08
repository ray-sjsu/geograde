"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SearchBox from "./SearchBox";
import ClientAuthMenu from "./ClientAuthMenu";
import { useCoordinates } from "/components/CoordinatesContext"; // Import context

const Navbar = () => {
  const router = useRouter();
  const { coordinates } = useCoordinates(); // Get shared state from context

  const [searchQuery, setSearchQuery] = useState("");

  // Load searchQuery from localStorage on initial render
  useEffect(() => {
    const savedQuery = localStorage.getItem("searchQuery");
    if (savedQuery) {
      setSearchQuery(savedQuery);
    }
  }, []);

  // Save searchQuery to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery || "");
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); 
    if (!searchQuery.trim()) return;

    router.push(
      `/search?searchQuery=${encodeURIComponent(searchQuery.trim())}${
        coordinates
          ? `&latitude=${encodeURIComponent(coordinates.latitude)}&longitude=${encodeURIComponent(coordinates.longitude)}`
          : ""
      }`
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchSubmit(e); 
    }
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
          className="flex items-center space-x-2 rounded px-2 py-1"
        >
          {/* Keyword Input */}
          <input
            type="text"
            placeholder="Place Type/Name (Philz Coffee, cafe...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyPress} // Trigger search on Enter
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
